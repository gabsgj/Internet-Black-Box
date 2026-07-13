"""
Internet Black Box — Render Workflow
=====================================
9-stage incident reconstruction pipeline.

Triggered by the Spring Boot API whenever a new incident is created.
Stages run as connected Render Workflow tasks with built-in retries,
observability, and durable execution.

Stage Flow:
  1. fetch-incident        → Load incident details from the API
  2. fetch-causal-graph    → Query Neo4j 4-hour temporal subgraph
  3. fetch-github-commits  → Pull related commits from GitHub API
  4. fetch-slack-messages  → Fetch Slack discussion context
  5. compile-evidence      → Structure all evidence into context
  6. build-prompt          → Build the NVIDIA NIM LLM prompt
  7. call-nvidia-nim       → AI root-cause synthesis (LLaMA 3.1 70B)
  8. store-result          → Persist timeline back via API → Neo4j
  9. notify-team           → Push notification to on-call engineers
"""

import os
import json
import httpx
from datetime import datetime
from render_sdk import Workflows, Retry

app = Workflows()

# ─── Environment ─────────────────────────────────────────────────────────────
API_URL         = os.environ.get("API_SERVER_URL", "http://localhost:8080")
GITHUB_TOKEN    = os.environ.get("GITHUB_PERSONAL_ACCESS_TOKEN", "")
NVIDIA_API_KEY  = os.environ.get("NVIDIA_API_KEY", "")
SARVAM_API_KEY  = os.environ.get("SARVAM_API_KEY", "")


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — Fetch Incident
# ─────────────────────────────────────────────────────────────────────────────
@app.task(
    name="stage-1-fetch-incident",
    retry=Retry(max_retries=3, wait_duration_ms=1000, backoff_scaling=1.5),
    timeout_seconds=30,
    plan="free",
)
def fetch_incident(incident_id: str) -> dict:
    """Load the incident record from the Black Box API."""
    with httpx.Client(timeout=20) as client:
        resp = client.get(f"{API_URL}/api/incidents/{incident_id}")
        resp.raise_for_status()
        incident = resp.json()
    print(f"[Stage 1] Loaded incident: {incident.get('title', incident_id)}")
    return {"incident": incident, "incident_id": incident_id}


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — Fetch Causal Graph from Neo4j
# ─────────────────────────────────────────────────────────────────────────────
@app.task(
    name="stage-2-fetch-causal-graph",
    retry=Retry(max_retries=3, wait_duration_ms=2000, backoff_scaling=2.0),
    timeout_seconds=60,
    plan="free",
)
def fetch_causal_graph(data: dict) -> dict:
    """Query the 4-hour temporal causal subgraph from Neo4j via the API."""
    incident_id = data["incident_id"]
    with httpx.Client(timeout=45) as client:
        resp = client.get(f"{API_URL}/api/incidents/{incident_id}/graph")
        graph = resp.json() if resp.status_code == 200 else {"nodes": [], "relationships": []}
    node_count = len(graph.get("nodes", []))
    edge_count = len(graph.get("relationships", []))
    print(f"[Stage 2] Causal graph: {node_count} nodes, {edge_count} edges")
    return {**data, "graph": graph}


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 3 — Fetch GitHub Commits
# ─────────────────────────────────────────────────────────────────────────────
@app.task(
    name="stage-3-fetch-github-commits",
    retry=Retry(max_retries=3, wait_duration_ms=1000, backoff_scaling=1.5),
    timeout_seconds=60,
    plan="free",
)
def fetch_github_commits(data: dict) -> dict:
    """Fetch recent commits from GitHub for systems referenced in the causal graph."""
    graph = data.get("graph", {})

    # Extract repo slugs from graph nodes
    repos = set()
    for node in graph.get("nodes", []):
        props = node.get("properties", {})
        if props.get("repoOwner") and props.get("repoName"):
            repos.add(f"{props['repoOwner']}/{props['repoName']}")
        elif props.get("repo"):
            repos.add(props["repo"])

    commits = []
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    }

    with httpx.Client(timeout=30) as client:
        for repo in list(repos)[:3]:
            try:
                resp = client.get(
                    f"https://api.github.com/repos/{repo}/commits",
                    headers=headers,
                    params={"per_page": 15},
                )
                if resp.status_code == 200:
                    commits.extend(resp.json()[:10])
            except Exception as e:
                print(f"[Stage 3] GitHub fetch failed for {repo}: {e}")

    print(f"[Stage 3] Fetched {len(commits)} commits from {len(repos)} repos")
    return {**data, "github_commits": commits[:20]}


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — Fetch Slack Messages
# ─────────────────────────────────────────────────────────────────────────────
@app.task(
    name="stage-4-fetch-slack-messages",
    retry=Retry(max_retries=2, wait_duration_ms=1000),
    timeout_seconds=30,
    plan="free",
)
def fetch_slack_messages(data: dict) -> dict:
    """Fetch Slack discussion events linked to this incident from the API."""
    incident_id = data["incident_id"]
    with httpx.Client(timeout=20) as client:
        try:
            resp = client.get(
                f"{API_URL}/api/events",
                params={"incidentId": incident_id, "type": "SLACK_MESSAGE", "limit": 20},
            )
            slack_events = resp.json() if resp.status_code == 200 else []
        except Exception:
            slack_events = []
    print(f"[Stage 4] Fetched {len(slack_events)} Slack messages")
    return {**data, "slack_messages": slack_events}


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 5 — Compile Evidence
# ─────────────────────────────────────────────────────────────────────────────
@app.task(
    name="stage-5-compile-evidence",
    retry=Retry(max_retries=2, wait_duration_ms=500),
    timeout_seconds=30,
    plan="free",
)
def compile_evidence(data: dict) -> dict:
    """Structure all collected evidence into a coherent context object."""
    incident = data.get("incident", {})
    graph    = data.get("graph", {})
    commits  = data.get("github_commits", [])
    slack    = data.get("slack_messages", [])

    evidence = {
        "incident_summary": {
            "id":              incident.get("id"),
            "title":           incident.get("title", "Unknown Incident"),
            "severity":        incident.get("severity", "UNKNOWN"),
            "created_at":      incident.get("createdAt"),
            "affected_systems": [
                n["properties"].get("name", "?")
                for n in graph.get("nodes", [])
                if n.get("type") == "SYSTEM"
            ][:6],
        },
        "causal_chain": [
            {
                "source":   rel.get("startNode"),
                "relation": rel.get("type"),
                "target":   rel.get("endNode"),
            }
            for rel in graph.get("relationships", [])
        ][:15],
        "recent_commits": [
            {
                "sha":     c.get("sha", "")[:8],
                "author":  c.get("commit", {}).get("author", {}).get("name"),
                "message": c.get("commit", {}).get("message", "")[:120],
                "date":    c.get("commit", {}).get("author", {}).get("date"),
            }
            for c in commits[:10]
        ],
        "slack_context": [
            {
                "author":    e.get("source"),
                "message":   e.get("description", "")[:200],
                "timestamp": e.get("timestamp"),
            }
            for e in slack[:10]
        ],
    }

    print(f"[Stage 5] Evidence compiled — {len(evidence['recent_commits'])} commits, "
          f"{len(evidence['slack_context'])} Slack messages, "
          f"{len(evidence['causal_chain'])} causal edges")
    return {**data, "evidence": evidence}


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 6 — Build LLM Prompt
# ─────────────────────────────────────────────────────────────────────────────
@app.task(
    name="stage-6-build-prompt",
    retry=Retry(max_retries=2, wait_duration_ms=500),
    timeout_seconds=20,
    plan="free",
)
def build_prompt(data: dict) -> dict:
    """Construct the structured prompt for NVIDIA NIM from compiled evidence."""
    ev = data.get("evidence", {})
    summary = ev.get("incident_summary", {})

    prompt = f"""You are an expert Site Reliability Engineer performing root-cause analysis.

INCIDENT:
- Title: {summary.get('title')}
- Severity: {summary.get('severity')}
- Time: {summary.get('created_at')}
- Affected Systems: {', '.join(summary.get('affected_systems', []))}

CAUSAL GRAPH (Neo4j — index-free adjacency traversal):
{json.dumps(ev.get('causal_chain', []), indent=2)[:1500]}

RECENT CODE CHANGES (GitHub):
{json.dumps(ev.get('recent_commits', []), indent=2)[:1500]}

TEAM DISCUSSION (Slack):
{json.dumps(ev.get('slack_context', []), indent=2)[:800]}

Based on this causal event graph and supporting evidence, provide a structured analysis:

1. ROOT CAUSE — The specific commit, deployment, or change that caused this incident (reference exact SHA/author if visible)
2. CAUSAL CHAIN — Step-by-step sequence of events leading to the failure
3. AFFECTED SCOPE — Systems and users impacted
4. IMMEDIATE ACTION — Single most important remediation step right now
5. PREVENTION — One concrete change to prevent recurrence

Be specific. Reference commits, authors, and systems by name. Keep each section to 2-3 sentences."""

    print(f"[Stage 6] Prompt built — {len(prompt)} chars")
    return {**data, "prompt": prompt}


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 7 — Call NVIDIA NIM (LLaMA 3.1 70B)
# ─────────────────────────────────────────────────────────────────────────────
@app.task(
    name="stage-7-call-nvidia-nim",
    retry=Retry(max_retries=3, wait_duration_ms=5000, backoff_scaling=2.0),
    timeout_seconds=120,
    plan="free",
)
def call_nvidia_nim(data: dict) -> dict:
    """Send prompt to NVIDIA NIM LLaMA 3.1 70B and receive the causal timeline."""
    prompt = data.get("prompt", "")

    with httpx.Client(timeout=90) as client:
        resp = client.post(
            "https://integrate.api.nvidia.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "meta/llama-3.1-70b-instruct",
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are an expert SRE performing incident root-cause analysis. "
                            "Be precise, technical, and actionable."
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                "max_tokens": 1024,
                "temperature": 0.2,
            },
        )
        resp.raise_for_status()
        result   = resp.json()
        timeline = result["choices"][0]["message"]["content"]

    print(f"[Stage 7] NVIDIA NIM responded — {len(timeline)} chars timeline")
    return {**data, "ai_timeline": timeline}


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 8 — Store Result
# ─────────────────────────────────────────────────────────────────────────────
@app.task(
    name="stage-8-store-result",
    retry=Retry(max_retries=3, wait_duration_ms=2000, backoff_scaling=1.5),
    timeout_seconds=30,
    plan="free",
)
def store_result(data: dict) -> dict:
    """Persist the AI-generated timeline back to Neo4j via the Black Box API."""
    incident_id = data["incident_id"]
    ai_timeline = data.get("ai_timeline", "")

    with httpx.Client(timeout=20) as client:
        resp = client.patch(
            f"{API_URL}/api/incidents/{incident_id}",
            json={"status": "RECONSTRUCTED", "timeline": ai_timeline},
        )
        success = resp.status_code in (200, 204)

    print(f"[Stage 8] Stored reconstruction — success={success}")
    return {**data, "stored": success}


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 9 — Notify On-Call Team
# ─────────────────────────────────────────────────────────────────────────────
@app.task(
    name="stage-9-notify-team",
    retry=Retry(max_retries=2, wait_duration_ms=1000),
    timeout_seconds=20,
    plan="free",
)
def notify_team(data: dict) -> dict:
    """Trigger push notification to on-call engineers via Expo (non-blocking)."""
    incident_id = data["incident_id"]
    title       = data.get("incident", {}).get("title", incident_id)

    with httpx.Client(timeout=15) as client:
        try:
            client.post(
                f"{API_URL}/api/incidents/{incident_id}/notify",
                json={"message": f"Root-cause timeline ready for: {title}"},
            )
        except Exception as e:
            print(f"[Stage 9] Notification failed (non-blocking): {e}")

    result = {
        "incident_id":      incident_id,
        "status":           "COMPLETE",
        "stages_completed": 9,
        "stored":           data.get("stored", False),
        "completed_at":     datetime.utcnow().isoformat(),
    }
    print(f"[Stage 9] Pipeline complete — {result}")
    return result


# ─────────────────────────────────────────────────────────────────────────────
# ORCHESTRATOR — chains all 9 stages
# Entry point called by the Spring Boot API on incident creation
# ─────────────────────────────────────────────────────────────────────────────
@app.task(
    name="reconstruct-incident",
    retry=Retry(max_retries=1, wait_duration_ms=5000),
    timeout_seconds=600,
    plan="free",
)
def reconstruct_incident(incident_id: str) -> dict:
    """
    Master orchestrator for the 9-stage incident reconstruction pipeline.
    Each stage is a durable Render Workflow task with independent retries.
    """
    print(f"[Orchestrator] Starting reconstruction for incident: {incident_id}")
    data = fetch_incident(incident_id)
    data = fetch_causal_graph(data)
    data = fetch_github_commits(data)
    data = fetch_slack_messages(data)
    data = compile_evidence(data)
    data = build_prompt(data)
    data = call_nvidia_nim(data)
    data = store_result(data)
    return notify_team(data)


if __name__ == "__main__":
    app.start()
