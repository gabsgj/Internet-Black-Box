# Internet Black Box — Complete Technical Specification
### HACKHAZARDS '26 · Namespace Community · May–July 2026

---

## Table of Contents

1. [Vision & Elevator Pitch](#1-vision--elevator-pitch)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [Sponsor Track Alignment & Prize Strategy](#4-sponsor-track-alignment--prize-strategy)
5. [System Architecture](#5-system-architecture)
6. [Neo4j Graph Data Model](#6-neo4j-graph-data-model-core-of-the-product)
7. [Render Workflows Design](#7-render-workflows-design)
8. [Data Sources & Ingestion Layer](#8-data-sources--ingestion-layer)
9. [AI Reconstruction Engine](#9-ai-reconstruction-engine)
10. [Expo Mobile App](#10-expo-mobile-app)
11. [Sarvam Voice Integration](#11-sarvam-voice-integration)
12. [Web Dashboard Specification](#12-web-dashboard-specification)
13. [API Specification](#13-api-specification)
14. [Full Technology Stack](#14-full-technology-stack)
15. [MVP Scope for Hackathon](#15-mvp-scope-for-hackathon)
16. [Hackathon Execution Timeline](#16-hackathon-execution-timeline)
17. [Demo Strategy](#17-demo-strategy)
18. [Prize Maximization Breakdown](#18-prize-maximization-breakdown)

---

## 1. Vision & Elevator Pitch

> **"When something goes wrong on your team, the question is always the same: what the hell actually happened? Right now, you spend 3 days piecing it together from 11 different tools. Internet Black Box reconstructs the entire chain of events in minutes — automatically, from the digital evidence your team already leaves behind."**

An aircraft black box survives every crash and tells investigators exactly what happened and why. Software teams don't have one. They have Git, Slack, email, Jira, meetings, Notion — all in separate silos — and when something breaks, they're forensic archaeologists digging through rubble.

**Internet Black Box** is an always-on digital evidence collector and AI-powered incident reconstructor. It passively ingests every significant digital action your team takes, stores it as a causal graph in Neo4j, and when an incident occurs — security breach, production outage, project failure, compliance audit — it traverses that graph and delivers a precise, human-readable timeline explaining exactly how it happened.

**Themes covered:** Developer Tools & Software Infrastructure (Primary) · Trust, Identity & Security · Work, Finance & Digital Economy

---

## 2. Problem Statement

### The Real Pain

Every software team, every week, loses significant time to one question: **"What happened?"**

- A security breach is detected at 3 AM. Nobody knows which commit introduced the vulnerability, who had access when, or what the attack chain looked like.
- A production outage took down the service for 4 hours. The post-mortem meeting has 8 engineers staring at logs with no clear root cause.
- A project failed. The client wants to know why. The team manager needs to reconstruct 3 months of decisions from memory.
- A compliance audit demands proof of who changed what system and when.

### Why Current Tools Fail

| Existing Tool | What It Misses |
|---|---|
| Git blame / log | Only sees code changes, not the human context around them |
| Slack history | Only sees conversations, not what decisions they caused |
| Jira / Linear | Only sees tickets, not the actual code or communications |
| Datadog / Sentry | Only sees system metrics, not the human actions that triggered them |
| Post-mortems | Written after the fact from memory — biased, incomplete, slow |

**The core problem is fragmentation.** Every tool captures one data silo. No tool captures the *causal relationships between silos*. Nobody asks: "What email caused what Slack message that caused what code change that caused what deployment that caused what outage?"

That causal chain is what Internet Black Box captures.

### Scale of the Problem

- Average time to resolve a software incident: **4.2 hours**
- Average cost of a production outage: **$300,000 per hour** for large companies (significant for startups too)
- Time spent on post-mortem reconstruction: **2–5 days per major incident**
- Compliance audit preparation time: **weeks**

---

## 3. Solution Overview

### How It Works

```
PASSIVE COLLECTION
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  GitHub commits · Slack messages · Gmail · Google Meet     │
│  transcripts · Notion edits · Jira updates · CI/CD logs   │
│  Sentry/Datadog alerts · Calendar events                   │
└─────────────────────────┬───────────────────────────────────┘
                          │ Render Workflow: Ingest & Normalize
                          ▼
┌─────────────────────────────────────────────────────────────┐
│           Neo4j AuraDB — The Causal Event Graph            │
│                                                             │
│  (Person)──AUTHORED──▶(Commit)──DEPLOYED──▶(Service)      │
│      │                    │                     │           │
│  SENT_EMAIL           MODIFIED               CAUSED        │
│      │                    │                     │           │
│      ▼                    ▼                     ▼           │
│  (Email)──LED_TO──▶(SlackMsg)──FOLLOWED──▶(Incident)      │
└─────────────────────────┬───────────────────────────────────┘
                          │ Incident Triggered
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         AI Reconstruction Engine (Claude / Anthropic)      │
│  · Graph traversal to extract relevant event subgraph      │
│  · Timeline construction with causal annotations           │
│  · Root cause hypothesis with confidence scores            │
│  · Natural language incident report generation             │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────────┐
          ▼               ▼                   ▼
    Web Dashboard    Expo Mobile         Sarvam Voice
    (Timeline UI)    (Alerts +        (Query in your
                     Quick View)       language)
```

### Core Features

1. **Always-On Evidence Collection** — Passively ingests events from connected sources without any manual input from the team
2. **Causal Graph Construction** — Neo4j stores not just events but the relationships between them: what caused what
3. **Incident Reconstruction** — When triggered (manually or automatically), AI traverses the graph to build the full causal chain
4. **Natural Language Timeline** — Human-readable incident report: "At 2:14 PM, Sarah merged a PR that modified the auth middleware. At 2:31 PM, the deployment completed. At 2:47 PM, error rates on /api/login spiked 400%. At 3:12 PM, Rahul noticed in Slack…"
5. **Root Cause Identification** — AI identifies the most likely root cause with confidence scores and supporting evidence
6. **Voice Querying** — "What caused the outage yesterday at 3 PM?" via Sarvam in any language
7. **Mobile Alerting** — On-call engineers get real-time incident alerts with an AI-generated initial timeline on their phone

---

## 4. Sponsor Track Alignment & Prize Strategy

### Track 1: Neo4j AuraDB — The Heart of the Product ✅ CASH PRIZE

**Why Neo4j is not optional — it IS the product:**

The entire value proposition of Internet Black Box is *causal relationships between events*. This is the textbook definition of what graph databases excel at. No relational database can answer "show me the chain of events leading to this incident, traversing through people, code, messages, and systems" with a single elegant query.

Every core feature requires graph traversal:
- Root cause analysis = shortest path from `(Incident)` to `(EventChain)`
- Impact analysis = "what else did this commit affect?"
- People involved = "who authored events within 2 hours before this incident?"
- Timeline = ordered traversal of the causal subgraph

**Judging criteria fulfilled:**
- AuraDB is the **primary database** — all event data is stored and queried exclusively through Neo4j
- All core data interactions (ingestion, reconstruction, querying) go through AuraDB
- Graph data modeling is **central** to the backend architecture
- Real Cypher queries are executed on AuraDB for every reconstruction

**Track 1 Prize: $250 cash**

---

### Track 2: Render Workflows — The Engine Room ✅ CREDITS PRIZE

**Why Render Workflows is architecturally essential:**

Internet Black Box requires continuous, reliable background processing that is the exact use case Render Workflows was designed for:

| Workflow | Type | Description |
|---|---|---|
| `ingest-github` | Scheduled (every 5 min) | Pull new commits, PRs, deployments from GitHub API |
| `ingest-slack` | Event-driven | Process Slack webhook on new messages in monitored channels |
| `ingest-email` | Scheduled (every 10 min) | Fetch relevant emails from Gmail/Outlook |
| `ingest-meetings` | Triggered | Process Google Meet transcript after meeting ends |
| `normalize-events` | Downstream | Convert raw events to standardized schema |
| `graph-write` | Downstream | Write normalized events to Neo4j and create relationships |
| `anomaly-detect` | Scheduled (every 15 min) | Run proactive anomaly detection across recent events |
| `reconstruct-incident` | On-demand | Full reconstruction pipeline when incident is triggered |

Every workflow consists of **multiple connected stages** with retry logic, parallel execution, and observable logs — exactly what qualifies for the Render Workflows track.

**Track 2 Prize: $500 in Render credits**

---

### Track 3: Sarvam — Voice-Powered Incident Intelligence ✅ CREDITS PRIZE

**Why Sarvam is meaningfully integrated:**

Incident response is often global. On-call engineers are often tired and want to talk, not type. Sarvam enables:

1. **Voice incident triggering**: "Record a new incident — production API is down, started 10 minutes ago"
2. **Natural language queries**: "What happened to the payment service last Tuesday?"
3. **Audio incident briefings**: Sarvam reads the AI-generated timeline aloud — critical when driving or in a meeting
4. **Multilingual support**: Distributed teams where engineers prefer Hindi, Tamil, or other Indian languages
5. **Post-incident voice summaries**: Manager gets a voice briefing on what happened without reading a report

Sarvam AI is the **interface layer** for voice-first incident management — genuinely useful, not decorative.

**Track 3 Prize: $500 in Sarvam credits**

---

### Track 4: Expo — Mobile-First On-Call Experience ✅ CASH PRIZE

**Why the mobile app is not an afterthought:**

On-call engineers are rarely at their desks when incidents occur. The Expo app is:

1. **Alert HQ**: Push notification with AI-summarized incident context the moment an incident is detected
2. **Quick Timeline**: Scroll through the reconstructed causal chain from your phone
3. **Voice Query**: Tap mic → ask Sarvam → hear the answer (Expo + Sarvam integration)
4. **Incident Trigger**: Create a new incident from the field with voice or text
5. **Team Pulse**: See who else is responding and what actions they've taken

Core experience is **designed for mobile**, not adapted from the web. The on-call workflow is inherently mobile-first.

**Track 4 Prize: $250 cash**

---

### Prize Summary

| Source | Type | Amount |
|---|---|---|
| General Prize (1st place) | Cash | $1,000 |
| Neo4j Track (1st place) | Cash | $250 |
| Expo Track (1st place) | Cash | $250 |
| Sarvam Track (1st place) | Credits | $500 |
| Render Track (1st place) | Credits | $500 |
| **Total Maximum** | | **$2,500** |

---

## 5. System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                                  │
│  GitHub  │  Slack   │  Gmail  │  Google Meet  │  Jira  │  Sentry   │
└────┬─────┴────┬──────┴────┬────┴───────┬───────┴───┬────┴─────┬─────┘
     │          │           │            │           │          │
     └──────────┴───────────┴──────┬─────┴───────────┴──────────┘
                                   │ Webhooks + Polling
                                   ▼
                    ┌──────────────────────────────┐
                    │     INGESTION SERVICE         │
                    │      (Spring Boot API)       │
                    │   Hosted on Render            │
                    └──────────┬───────────────────┘
                               │ Triggers
                               ▼
                    ┌──────────────────────────────┐
                    │    RENDER WORKFLOWS           │
                    │  · ingest-* (per source)      │
                    │  · normalize-events           │
                    │  · graph-write                │
                    │  · anomaly-detect             │
                    │  · reconstruct-incident       │
                    └──────────┬───────────────────┘
                               │ Read/Write
                               ▼
                    ┌──────────────────────────────┐
                    │      NEO4J AURADB            │
                    │   Causal Event Graph          │
                    │   (All event data lives here) │
                    └──────────┬───────────────────┘
                               │ Graph Query Results
                               ▼
                    ┌──────────────────────────────┐
                    │   AI RECONSTRUCTION ENGINE   │
                    │   Claude API (Anthropic)      │
                    │   · Timeline generation       │
                    │   · Root cause analysis       │
                    │   · Natural language report   │
                    └──────────┬───────────────────┘
                               │
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
  ┌─────────────────┐  ┌──────────────┐  ┌───────────────────┐
  │  WEB DASHBOARD  │  │  EXPO APP    │  │  SARVAM VOICE     │
  │  React + Vite   │  │  React Native│  │  API Integration  │
  │  Timeline UI    │  │  On-call UX  │  │  Voice Queries    │
  └─────────────────┘  └──────────────┘  └───────────────────┘
```

---

## 6. Neo4j Graph Data Model (Core of the Product)

### Node Types

```
(:Person)
  - id: string (unique)
  - name: string
  - email: string
  - role: string
  - teams: [string]

(:Event)
  - id: string (unique)
  - type: enum [COMMIT, PR_MERGE, DEPLOYMENT, SLACK_MESSAGE, EMAIL,
                MEETING, TICKET_UPDATE, ERROR_LOG, ALERT, FILE_EDIT]
  - timestamp: datetime
  - source: string (github | slack | gmail | jira | sentry | etc.)
  - content: string (summary of the event)
  - metadata: map (raw source-specific data)
  - severity: enum [INFO, WARNING, CRITICAL] (auto-assigned)

(:System)
  - id: string
  - name: string (service name, repo name, database name)
  - type: enum [SERVICE, REPOSITORY, DATABASE, API, PIPELINE]
  - environment: enum [production, staging, dev]

(:File)
  - id: string
  - path: string
  - repository: string
  - language: string

(:Incident)
  - id: string (unique)
  - title: string
  - type: enum [OUTAGE, SECURITY_BREACH, PROJECT_FAILURE, COMPLIANCE, UNKNOWN]
  - triggered_at: datetime
  - triggered_by: string (manual | auto-anomaly)
  - status: enum [OPEN, RECONSTRUCTING, RESOLVED]
  - severity: enum [P1, P2, P3]
  - ai_summary: string (generated after reconstruction)
  - root_cause: string (AI-identified)
```

### Relationship Types

```cypher
// Authorship
(Person)-[:AUTHORED {at: datetime}]->(Event)

// Causal chain (THE core relationship)
(Event)-[:TRIGGERED {confidence: float, lag_seconds: int}]->(Event)
(Event)-[:PRECEDED {seconds_delta: int}]->(Event)

// System impact
(Event)-[:AFFECTED {severity: string}]->(System)
(Event)-[:DEPLOYED_TO {environment: string}]->(System)
(Event)-[:MODIFIED]->(File)
(File)-[:PART_OF]->(System)

// Communication
(Person)-[:COMMUNICATED_WITH {channel: string, at: datetime}]->(Person)
(Event)-[:RESPONDED_TO]->(Event)
(Event)-[:REFERENCED]->(Event)

// Incident linkage
(Incident)-[:CAUSED_BY {rank: int, confidence: float}]->(Event)
(Person)-[:RESPONDED_TO]->(Incident)
(System)-[:EXPERIENCED]->(Incident)

// Temporal
(Event)-[:NEXT]->(Event)  // linked list for fast timeline traversal
```

### Core Cypher Queries

**1. Reconstruct the incident timeline (full causal chain)**
```cypher
MATCH (i:Incident {id: $incidentId})
MATCH path = (i)<-[:CAUSED_BY*1..20]-(e:Event)
WITH e, path
ORDER BY e.timestamp ASC
MATCH (e)<-[:AUTHORED]-(p:Person)
RETURN e.timestamp, e.type, e.content, p.name, e.source
```

**2. Find all people involved in the 2 hours before an incident**
```cypher
MATCH (i:Incident {id: $incidentId})
MATCH (e:Event)<-[:AUTHORED]-(p:Person)
WHERE e.timestamp > i.triggered_at - duration('PT2H')
  AND e.timestamp <= i.triggered_at
RETURN p.name, p.email, count(e) as eventCount, collect(e.type) as actions
ORDER BY eventCount DESC
```

**3. Root cause path — shortest causal chain from first anomaly to incident**
```cypher
MATCH (i:Incident {id: $incidentId})
MATCH (firstEvent:Event {type: 'COMMIT'})
WHERE firstEvent.timestamp < i.triggered_at
MATCH path = shortestPath((firstEvent)-[:TRIGGERED|PRECEDED*]->(i))
RETURN path
```

**4. Impact blast radius — what else did a specific commit affect?**
```cypher
MATCH (e:Event {id: $commitId})-[:TRIGGERED*1..10]->(affected:Event)
MATCH (affected)-[:AFFECTED]->(s:System)
RETURN DISTINCT s.name, s.environment, count(affected) as eventCount
ORDER BY eventCount DESC
```

**5. Anomaly detection — abnormal event clustering in short time windows**
```cypher
MATCH (e:Event)
WHERE e.timestamp > datetime() - duration('PT1H')
WITH e.source as source, count(e) as recentCount
MATCH (baseline:Event)
WHERE baseline.timestamp > datetime() - duration('P7D')
  AND baseline.timestamp < datetime() - duration('PT1H')
WITH source, recentCount,
     count(baseline) / 7 / 24 as hourlyBaseline
WHERE recentCount > hourlyBaseline * 3
RETURN source, recentCount, hourlyBaseline,
       (recentCount / hourlyBaseline) as anomalyScore
ORDER BY anomalyScore DESC
```

**6. Security investigation — who accessed what, when**
```cypher
MATCH (p:Person)-[:AUTHORED]->(e:Event)-[:AFFECTED]->(s:System)
WHERE s.name = $systemName
  AND e.timestamp BETWEEN $startTime AND $endTime
RETURN p.name, e.type, e.content, e.timestamp, s.name
ORDER BY e.timestamp ASC
```

---

## 7. Render Workflows Design

### Workflow 1: `ingest-github`
**Type:** Scheduled (every 5 minutes)
**Stages:**
1. `fetch-since-last-run` — GitHub API: fetch commits, PRs, deployments, releases since last cursor
2. `filter-significant` — Drop trivial events (whitespace commits, draft PRs)
3. `enrich-context` — Fetch full commit diff, PR description, deployment status
4. `normalize` — Convert to standard Event schema
5. `write-to-neo4j` — Batch MERGE into AuraDB
6. `update-cursor` — Store latest processed event ID

### Workflow 2: `ingest-slack`
**Type:** Event-driven (Slack webhook on message creation)
**Stages:**
1. `receive-webhook` — Validate Slack webhook signature
2. `filter-channels` — Only process monitored channels
3. `extract-intent` — AI classifies message intent (alert? decision? FYI?)
4. `link-to-events` — Detect references to commits, tickets, services in message
5. `write-to-neo4j` — Create Event node, create `:REFERENCED` edges to linked events
6. `create-comms-edge` — Create `:COMMUNICATED_WITH` between sender and @mentioned users

### Workflow 3: `ingest-meetings`
**Type:** Triggered (Google Calendar webhook on meeting end)
**Stages:**
1. `wait-for-transcript` — Poll Google Meet API until transcript is ready (up to 10 min)
2. `fetch-transcript` — Download full meeting transcript
3. `ai-extract-decisions` — Claude API extracts: decisions made, action items, systems mentioned
4. `create-event-nodes` — One Event node per decision/action item
5. `link-attendees` — Create `:COMMUNICATED_WITH` edges between all attendees
6. `write-to-neo4j` — Batch write all nodes and edges

### Workflow 4: `reconstruct-incident` (THE KEY WORKFLOW)
**Type:** On-demand (triggered by incident creation)
**Stages:**
1. `validate-incident` — Confirm incident exists, set status to RECONSTRUCTING
2. `fetch-time-window` — Query Neo4j for all events in the 4 hours before incident
3. `build-event-subgraph` — Extract the relevant subgraph as structured JSON
4. `rank-causal-candidates` — Run path-finding queries to rank most likely causal chains
5. `ai-reconstruct` — Send subgraph to Claude API with reconstruction prompt
6. `parse-ai-output` — Extract timeline, root cause, recommendations
7. `write-back` — Update Incident node with ai_summary, root_cause, create :CAUSED_BY edges
8. `notify-team` — Push to Expo app via push notifications + Sarvam voice summary
9. `generate-report` — Create shareable HTML incident report

### Workflow 5: `anomaly-detect`
**Type:** Scheduled (every 15 minutes)
**Stages:**
1. `run-anomaly-queries` — Execute all anomaly Cypher queries against AuraDB
2. `score-anomalies` — Rank anomalies by confidence and severity
3. `check-thresholds` — Compare against configurable alert thresholds
4. `auto-trigger-incident` — If P1 anomaly, auto-create Incident and trigger `reconstruct-incident`
5. `send-early-warning` — For P2/P3, send soft alert to Expo app without full reconstruction

---

## 8. Data Sources & Ingestion Layer

### MVP Data Sources (Build These First)

| Source | Method | Auth | Events Captured |
|---|---|---|---|
| **GitHub** | REST API + Webhooks | OAuth App | Commits, PRs, deployments, releases, branch creates |
| **Slack** | Events API + Webhooks | Slack App (Bot Token) | Messages in monitored channels, @mentions, reactions |
| **Sentry** | Webhooks | API Key | Error events, issue creation, alert triggers |

### Phase 2 Data Sources (Extend After MVP)

| Source | Method | Auth | Events Captured |
|---|---|---|---|
| Gmail | Gmail API | OAuth 2.0 | Sent/received emails with team members |
| Google Meet | Google Calendar + Meet API | OAuth 2.0 | Meeting transcripts, attendees, decisions |
| Jira/Linear | REST API + Webhooks | API Key | Ticket status changes, assignments, comments |
| Notion | Notion API | Integration Token | Page edits, database updates, comments |
| Datadog | Webhooks | API Key | System metrics, alert triggers, monitor state changes |
| CI/CD (GitHub Actions) | Webhook | Built into GitHub | Pipeline runs, failures, deployment events |

### Event Normalization Schema

All sources normalize to this standard schema before writing to Neo4j:

```typescript
interface NormalizedEvent {
  id: string;               // source_type:source_id (e.g., "github:commit:abc123")
  type: EventType;          // From the enum in the data model
  source: string;           // "github" | "slack" | "sentry" | etc.
  timestamp: Date;
  actor: {                  // Who did this
    id: string;
    name: string;
    email: string;
  };
  content: string;          // Human-readable summary (max 500 chars)
  severity: Severity;       // AUTO-ASSIGNED based on content analysis
  references: string[];     // IDs of other events this references
  affectedSystems: string[]; // Service/repo names mentioned
  metadata: Record<string, unknown>; // Raw source data
}
```

---

## 9. AI Reconstruction Engine

### Reconstruction Prompt Architecture

The reconstruction uses a structured prompt sent to the Claude API:

```
SYSTEM PROMPT:
You are an expert incident investigator for software teams. You analyze
sequences of digital events and reconstruct what happened during a
software incident. You reason like a forensic analyst — following the
evidence, identifying causal relationships, and explaining events in
clear, chronological narrative.

USER PROMPT:
An incident occurred at [TIMESTAMP]: "[INCIDENT_TITLE]"

Below is a graph of all digital events that occurred in the 4 hours
before and 30 minutes after this incident, extracted from GitHub,
Slack, email, and system monitoring tools.

EVENT GRAPH:
[STRUCTURED JSON SUBGRAPH FROM NEO4J]

Your task:
1. Build a precise chronological timeline of events leading to this incident
2. Identify the single most likely root cause with supporting evidence
3. Identify all people involved and their role in the chain
4. Identify 3 specific preventive measures that would have stopped this

Format your response as:

TIMELINE:
[timestamped events in order, with causal annotations]

ROOT CAUSE:
[most likely cause with confidence % and evidence cited]

PEOPLE INVOLVED:
[person name, their actions, their role in the chain]

PREVENTION:
[3 specific, actionable preventive measures]
```

### Confidence Scoring

The AI assigns confidence scores to causal connections based on:

- **Temporal proximity**: Events closer in time score higher
- **Explicit references**: Slack message mentioning the commit scores much higher
- **System overlap**: Same file modified and same service that crashed scores higher
- **Person overlap**: Same person involved in multiple events in the chain

### Output Types

1. **Full Report** — Complete markdown incident report (for post-mortems)
2. **Executive Summary** — 3-sentence TL;DR (for management)
3. **Voice Briefing Script** — Short spoken summary sent to Sarvam for audio delivery
4. **Mobile Push Content** — 140-char incident alert with most critical finding

---

## 10. Expo Mobile App

### Screens

**1. Home — Incident Feed**
- List of all incidents (open + recent)
- Color-coded by severity (P1 red, P2 orange, P3 yellow)
- AI-generated one-line summary under each
- Real-time updates via WebSocket

**2. Incident Detail**
- Full AI-generated timeline as a scrollable card feed
- Each card = one event in the chain
- Tap card for full event detail (message content, commit diff, etc.)
- "People Involved" section with action count per person
- "Root Cause" highlighted card with confidence score

**3. Voice Query**
- Large mic button (always accessible via bottom tab)
- Tap → Sarvam STT → processes query → Sarvam TTS reads answer aloud
- Query examples displayed on screen
- Recent query history

**4. Create Incident**
- Quick incident creation form (title, severity, affected system)
- OR voice: "Hey, create a P1 incident — payment API is down"
- Auto-triggers `reconstruct-incident` Render Workflow

**5. Team Pulse**
- Who is currently responding to open incidents
- Responder timeline: "John acknowledged at 3:14 AM, started investigation at 3:18 AM"

### Push Notification Payload

```json
{
  "title": "🚨 P1 Incident: Payment API Down",
  "body": "AI found 3 events in the last hour. Likely cause: auth middleware change by @sarah at 2:47 PM",
  "data": {
    "incidentId": "inc_xyz123",
    "screen": "IncidentDetail"
  }
}
```

### Technology

- **Framework**: Expo (React Native)
- **Navigation**: Expo Router (file-based)
- **State Management**: Zustand
- **API**: REST + WebSocket (Socket.io)
- **Notifications**: Expo Notifications
- **Voice**: Sarvam SDK (React Native compatible)
- **Charts**: Victory Native (timeline visualization)
- **Auth**: Expo SecureStore + JWT

---

## 11. Sarvam Voice Integration

### Integration Points

**1. Voice Incident Queries**
```
User speaks → Sarvam STT (converts to text) → Intent Parser →
Neo4j Query → AI Summarization → Sarvam TTS (spoken answer)

Example: "What caused yesterday's outage?"
→ Parse: incident query, time=yesterday
→ Neo4j: fetch most recent incident before today 00:00
→ AI: summarize root cause in 2 sentences
→ Sarvam TTS: reads summary aloud
```

**2. Incident Creation via Voice**
```
"Create a new P1 incident — our login page is broken"
→ Sarvam STT → Intent: CREATE_INCIDENT
→ Extract: severity=P1, system="login", description="broken"
→ Create Incident node in Neo4j
→ Trigger reconstruct-incident workflow
→ Sarvam TTS: "P1 incident created. Reconstruction started. I'll notify you in 2-3 minutes."
```

**3. Audio Incident Briefings**
```
After reconstruction completes:
→ Generate voice briefing script (max 60 seconds when spoken)
→ Send to Sarvam TTS API
→ Audio file pushed to Expo app
→ Auto-plays on user's device with incident alert
```

**4. Multilingual Support**
- Team members set their preferred language in profile
- All Sarvam TTS responses delivered in preferred language
- Supports: Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, English

### Sarvam API Usage

```java
// Text-to-speech for incident briefing using Spring WebClient
Mono<byte[]> briefingMono = webClient.post()
    .uri("https://api.sarvam.ai/text-to-speech")
    .header("API-Subscription-Key", sarvamApiKey)
    .bodyValue(new TTSRequest(
        incidentSummary,
        user.getPreferredLanguage(),
        "meera", // Professional, clear voice
        "bulbul:v1"
    ))
    .retrieve()
    .bodyToMono(byte[].class);

// Speech-to-text for voice queries
Mono<STTResponse> queryMono = webClient.post()
    .uri("https://api.sarvam.ai/speech-to-text")
    .header("API-Subscription-Key", sarvamApiKey)
    .bodyValue(new STTRequest(
        audioBase64,
        user.getPreferredLanguage(),
        "saarika:v2"
    ))
    .retrieve()
    .bodyToMono(STTResponse.class);
```

---

## 12. Web Dashboard Specification

### Stack
- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts (timeline visualization)
- **Graph Visualization**: Sigma.js (render Neo4j subgraph visually)
- **Real-time**: Socket.io client
- **Deployment**: Render Static Site

### Key Pages

**Dashboard (`/`)**
- Incident health overview (open incidents, MTTR, incident frequency graph)
- Recent events feed (last 50 events across all sources)
- Anomaly alerts (from anomaly-detect workflow)
- Quick incident creation button

**Incident List (`/incidents`)**
- Sortable, filterable incident table
- Status badges (Open, Reconstructing, Resolved)
- Click-through to detail

**Incident Detail (`/incidents/:id`)**
- **Hero Section**: Incident title, severity, triggered time, status
- **AI Summary Card**: Executive summary from AI reconstruction
- **Timeline View**: Horizontal scrollable timeline with event cards
- **Causal Graph View**: Interactive Neo4j subgraph rendered with Sigma.js
  - Nodes: People (blue), Events (yellow), Systems (red), Incident (orange)
  - Edges: labeled with relationship type
  - Click node for full event detail
- **Root Cause Box**: AI-identified root cause with confidence bar
- **People Involved**: Avatar list with action count
- **Prevention Recommendations**: AI-generated action items

**Settings (`/settings`)**
- Connected data sources (GitHub, Slack, Sentry, etc.)
- OAuth connection status
- Monitored channels, repos, services configuration
- Alert thresholds for anomaly detection
- Team members management

---

## 13. API Specification

### Base URL
`https://api.internet-black-box.app/v1`

### Authentication
JWT Bearer Token + per-workspace API keys for data source connections

### Core Endpoints

```
POST   /incidents                    Create new incident
GET    /incidents                    List incidents (paginated)
GET    /incidents/:id                Get incident with AI summary
POST   /incidents/:id/reconstruct    Trigger manual reconstruction
GET    /incidents/:id/timeline       Get ordered event timeline
GET    /incidents/:id/graph          Get Neo4j subgraph as JSON
GET    /incidents/:id/report         Get full markdown incident report

GET    /events                       Query events (filter by time, type, source)
GET    /events/:id                   Get single event with context

GET    /people/:id/activity          Get person's recent event history
GET    /people/:id/incidents         Get incidents person was involved in

POST   /query/voice                  Process voice query (audio → answer)
POST   /query/text                   Process text query (natural language → answer)

GET    /health                       System health + ingestion status
GET    /anomalies                    Current anomaly alerts
POST   /webhooks/github              GitHub webhook receiver
POST   /webhooks/slack               Slack Events API receiver
POST   /webhooks/sentry              Sentry webhook receiver
```

---

## 14. Full Technology Stack

| Layer | Technology | Reason |
|---|---|---|
| **Core Database** | Neo4j AuraDB | Causal graph storage and traversal |
| **Workflow Engine** | Render Workflows | Reliable background processing |
| **AI / LLM** | Claude API (claude-sonnet-4-6) | Timeline reconstruction, root cause analysis |
| **Voice** | Sarvam STT + TTS APIs | Multilingual voice queries and briefings |
| **Mobile** | Expo (React Native) | Cross-platform on-call app |
| **Web Frontend** | React + Vite + TypeScript | Dashboard UI |
| **Styling** | Tailwind CSS | Consistent, fast styling |
| **Backend** | Spring Boot (Java) | REST API + WebSocket server (WebFlux) |
| **Graph Visualization** | Sigma.js | Interactive Neo4j subgraph rendering |
| **Real-time** | Socket.io | Live incident updates |
| **Push Notifications** | Expo Notifications | On-call mobile alerts |
| **Hosting** | Render (Web Service) | Backend + static frontend |
| **Auth** | JWT + OAuth 2.0 | Multi-source authentication |
| **Neo4j Driver** | Spring Data Neo4j (Maven/Gradle) | AuraDB connection |
| **State (mobile)** | Zustand | Lightweight state management |
| **Charts** | Recharts + Victory Native | Web and mobile data visualization |

---

## 15. MVP Scope for Hackathon

### What to Build (Must-Have)

The full vision is large. Win the hackathon with this focused MVP:

**Data Sources (MVP):**
- ✅ GitHub (commits, PRs, deployments)
- ✅ Slack (messages in a monitored channel)
- ✅ Sentry (error events and alerts)
- ❌ Skip email, meetings, Jira for the demo (mock this data if needed)

**Neo4j (MVP):**
- ✅ Full graph schema with Person, Event, System, Incident nodes
- ✅ All critical relationship types
- ✅ 4 core Cypher queries (timeline, people, root cause path, anomaly)
- ✅ Live data from GitHub + Slack flowing into AuraDB

**Render Workflows (MVP):**
- ✅ `ingest-github` workflow (scheduled)
- ✅ `ingest-slack` workflow (event-driven)
- ✅ `reconstruct-incident` workflow (on-demand, multi-stage)
- ❌ Skip anomaly-detect for MVP (demo manually)

**AI Reconstruction (MVP):**
- ✅ Full reconstruction pipeline using Claude API
- ✅ Timeline generation
- ✅ Root cause identification
- ✅ Prevention recommendations

**Expo App (MVP):**
- ✅ Incident feed screen
- ✅ Incident detail with timeline
- ✅ Push notifications on new incident
- ✅ Create incident button
- ❌ Voice query (Phase 2 for MVP, but demo it separately)

**Sarvam (MVP):**
- ✅ Voice query endpoint (text → Neo4j → Claude → Sarvam TTS)
- ✅ Post-reconstruction voice briefing
- ❌ Full multilingual support for all languages (demo in English + Hindi)

**Web Dashboard (MVP):**
- ✅ Incident detail page with timeline
- ✅ Interactive causal graph visualization (Sigma.js)
- ✅ Root cause section
- ❌ Full settings/configuration UI (hardcode for demo)

### Demo Dataset Strategy

Prepare a **realistic synthetic incident scenario** that tells a compelling story:

> **The Demo Incident**: At 3:47 PM on a Tuesday, the payment service went down for 23 minutes.
> 
> The Black Box reconstructs: At 2:31 PM, Sarah merged a PR that refactored the auth token validation. At 3:02 PM, the deployment to production completed. At 3:12 PM, Raj sent a Slack message saying "hey anyone seeing increased latency on /checkout?" At 3:47 PM, Sentry fired a critical alert: 500 error rate on /api/pay spiked to 89%. 
> 
> Root cause: The auth token validation change broke backward compatibility with tokens issued before the deployment, causing all existing sessions to fail.

Pre-populate Neo4j with this data for the demo. Have real GitHub + Slack connections as well to show live ingestion working.

---

## 16. Hackathon Execution Timeline

### Week 1–2: Foundation
- [ ] Set up Neo4j AuraDB instance, define schema, create indexes
- [ ] Build basic Spring Boot backend with Spring Data Neo4j
- [ ] Set up Render hosting (Web Service for API)
- [ ] Create Expo project with basic navigation
- [ ] Get GitHub OAuth working and first webhook receiving commits
- [ ] Write first Cypher queries, verify data flowing into AuraDB

### Week 3–4: Core Workflows
- [ ] Build `ingest-github` Render Workflow (all stages)
- [ ] Build `ingest-slack` Render Workflow (all stages)
- [ ] Implement event normalization layer
- [ ] Build the AI reconstruction prompt + Claude API integration
- [ ] Build `reconstruct-incident` workflow end-to-end
- [ ] Create the demo dataset in Neo4j

### Week 5–6: Mobile + Voice
- [ ] Build Expo incident feed and detail screens
- [ ] Implement push notifications (Expo Notifications)
- [ ] Integrate Sarvam STT for voice queries
- [ ] Integrate Sarvam TTS for audio briefings
- [ ] Build voice query backend endpoint

### Week 7: Dashboard + Polish
- [ ] Build React web dashboard
- [ ] Implement Sigma.js causal graph visualization
- [ ] Build the incident timeline UI
- [ ] Connect all parts end-to-end
- [ ] Run full demo scenario from scratch
- [ ] Polish mobile UI
- [ ] Test Render Workflows reliability

### Week 8: Demo Prep + Submission
- [ ] Record demo video (5-7 min)
- [ ] Write submission document
- [ ] Prepare live demo script
- [ ] Test all sponsor track integrations
- [ ] Final bug fixes

---

## 17. Demo Strategy

### The Perfect Demo Flow (7 minutes)

**Minute 1 — Hook**
Start by asking: "Has anyone here ever spent 3 hours in a war room asking 'what the hell happened?' while a production service was down?" Pause. "This is the tool that answers that question — in 2 minutes, automatically."

**Minutes 2–3 — Live Ingestion**
Show the web dashboard. Show events flowing in from GitHub and Slack in real time. Click on an event to show the Neo4j data behind it. "Every digital action your team takes is becoming a node in a graph right now."

**Minutes 3–5 — The Reconstruction**
Trigger the demo incident. "I'm going to tell the system that our payment service is down." Click "Create P1 Incident." Show the Render Workflow execution log in real time (Render's dashboard shows this). Show the Neo4j subgraph being queried. Show the AI output appearing. Show the causal graph rendered in Sigma.js — the visual "aha" moment.

**Minute 5 — Mobile Moment**
Pick up the phone. "Meanwhile, the on-call engineer just got this on their phone." Show the Expo push notification. Open the app. Show the timeline view. Show the root cause card.

**Minute 6 — Voice Query**
Hold up the phone, tap mic. Say in Hindi: "कल रात को पेमेंट सर्विस में क्या हुआ था?" (What happened to the payment service last night?) Sarvam responds in Hindi. "Any engineer, in any language, can query their incident history by voice."

**Minute 7 — Close**
Show the Neo4j AuraDB browser with the actual graph. "This is not a prototype. This is a working causal knowledge graph of your team's digital history. The aircraft black box has existed for 60 years. Software teams have never had one — until now."

### The Visual that Wins

The Sigma.js causal graph visualization is your knockout visual. When you show a graph where nodes are People (blue circles), Events (yellow squares), Systems (red diamonds), and the Incident (orange star) — and edges between them are labeled `TRIGGERED`, `MODIFIED`, `DEPLOYED_TO`, `CAUSED_BY` — judges will immediately understand both the problem and the solution. This one screen conveys:
- The technical sophistication (graph database, not a table)
- The product value (you can see why the incident happened)
- The Neo4j track eligibility (this is a live AuraDB graph)

---

## 18. Prize Maximization Breakdown

### General Prize Winning Factors

| Judging Criterion | Internet Black Box Score | Reason |
|---|---|---|
| Technical complexity | ⭐⭐⭐⭐⭐ | Multi-source ingestion, graph DB, AI, mobile, voice |
| Originality | ⭐⭐⭐⭐⭐ | No existing tool does this. Judges will not have seen it. |
| Real-world impact | ⭐⭐⭐⭐⭐ | Every software team experiences this pain |
| Working demo | ⭐⭐⭐⭐ | Achievable MVP with compelling live demo |
| Business potential | ⭐⭐⭐⭐⭐ | Clear B2B SaaS product with obvious pricing |

### Why This Idea Specifically Wins Against Other Teams

1. **It is not "AI for X"** — The AI is the analysis layer, not the product. The product is the causal graph. This immediately separates it from 80% of hackathon submissions.

2. **Graph database justification is airtight** — The relationship between events IS the product. You cannot build this with PostgreSQL. Neo4j judges will see immediately that this is the correct and necessary use of their technology.

3. **Render Workflows are genuinely multi-stage** — The `reconstruct-incident` workflow has 9 stages with real parallel execution and retry logic. This is not a wrapper around an API call — it is a workflow-native product.

4. **The demo writes itself** — Unlike most hackathon projects where you have to explain the value, this one demonstrates value in 30 seconds. Trigger incident → see timeline → hear voice briefing. The causal graph visualization is immediately understood by anyone.

5. **It is difficult** — Most teams will look at this scope and not attempt it. The teams that do will likely build only part of it. Build a tight MVP with all sponsor integrations working and you have a significant advantage.

### The Winning Submission Headline

> **Internet Black Box: The Aircraft Black Box for Software Teams**
> 
> An always-on causal event graph (Neo4j AuraDB) powered by automated ingestion workflows (Render Workflows) that reconstructs the exact chain of events behind any software incident — delivered as an AI-generated timeline on your mobile (Expo) or spoken aloud in your language (Sarvam).
>
> When something goes wrong, you don't piece together 11 tools. You ask the Black Box.

---

*Document version 1.0 — HACKHAZARDS '26 Submission Preparation*
*Generated for internal team use — not for public distribution*
