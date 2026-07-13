# Internet Black Box: Render Workflows Architecture

This document serves as the official technical specification and judge's guide for the **Render Workflows Track** implementation in the Internet Black Box project.

## 🏗 System Architecture on Render

Internet Black Box is deployed as a fully integrated ecosystem on Render, utilizing Web Services, Static Sites, Cron Jobs, and Background Workers to handle high-throughput telemetry ingestion and heavy AI causal graphing.

### Infrastructure Components (`render.yaml`)

| Component | Render Service Type | Responsibility |
| :--- | :--- | :--- |
| **API Gateway** | `web` (Web Service) | Spring Boot REST API. Exposes endpoints for the mobile app and dashboard. Connects directly to AuraDB. |
| **Web Dashboard** | `web` (Static Site) | Vite + React SPA. Deploys the interactive dashboard and Sigma.js graph visualizer. |
| **Github Ingestor** | `cron` (Cron Job) | Scheduled workflow running every 5 minutes to poll GitHub APIs and sync commits/PRs into Neo4j. |
| **Reconstruction Engine**| `worker` (Background) | Dedicated workflow worker that listens for P1 incidents and executes the heavy 9-stage AI reconstruction pipeline. |

---

## ⚙️ The 9-Stage `reconstruct-incident` Workflow

This is the crown jewel of our Render integration. When a critical outage is triggered, this background worker executes a deeply connected, 9-stage pipeline. Render's robust background worker environment ensures that if the Anthropic API drops or the graph query times out, the workflow can retry specific stages without failing the whole pipeline.

### Stage 1: `validate-incident`
- **Action**: Confirms the incident payload exists and sets the global status to `RECONSTRUCTING`.
- **Failure State**: Halts execution if incident ID is invalid.

### Stage 2: `fetch-time-window`
- **Action**: Queries Neo4j AuraDB for all events in the 4-hour window preceding the outage. 
- **Data**: Retrieves commits, Slack messages, Sentry alerts, and PagerDuty shifts.

### Stage 3: `build-event-subgraph`
- **Action**: Executes a Shortest-Path Cypher query to extract the most relevant interconnected subgraph.
- **Output**: Structured JSON representation of the causal graph.

### Stage 4: `rank-causal-candidates`
- **Action**: Algorithmic scoring of paths based on depth, event severity, and proximity to the outage.

### Stage 5: `ai-reconstruct` (Heavy Compute)
- **Action**: Sends the heavily optimized graph JSON to the Claude API with a strict forensic prompt.
- **Render Benefit**: This stage takes 10-30 seconds. Running it as a Render Worker prevents HTTP timeout limits that would plague standard serverless functions.

### Stage 6: `parse-ai-output`
- **Action**: Extracts the timeline, root cause, and remediation steps from the AI response.

### Stage 7: `write-back`
- **Action**: Updates the Incident node in Neo4j with the `ai_summary` and establishes `:CAUSED_BY` edges to the root events.

### Stage 8: `notify-team`
- **Action**: Pushes updates to the Expo mobile app and triggers the Sarvam AI multilingual voice synthesis.

### Stage 9: `generate-report`
- **Action**: Compiles a static HTML forensic report and archives it for WORM (Write-Once-Read-Many) compliance.

---

## 🔄 Scheduled Ingestion Workflows

To maintain an accurate causal graph, we rely on Render Cron Jobs to continuously feed the beast.

### `ingest-github` (Runs `*/5 * * * *`)
1. `fetch-since-last-run`: Uses cursor pagination to fetch new commits.
2. `filter-significant`: Drops trivial events (e.g., whitespace commits).
3. `enrich-context`: Fetches full diffs.
4. `write-to-neo4j`: Batch MERGE operations into AuraDB.

### `anomaly-detect` (Runs `*/15 * * * *`)
1. `run-anomaly-queries`: Scans AuraDB for orphaned PRs, high-latency DB queries, or unusual commit volumes.
2. `score-anomalies`: Ranks findings by severity.
3. `auto-trigger-incident`: If a P1 anomaly is found, it automatically pushes the event to the `reconstruct-incident` worker.

---

## 🔒 Environment & Secrets Management

Render securely injects the following environment variables across the ecosystem:

- `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`: (AuraDB Connection)
- `ANTHROPIC_API_KEY`: (Claude 3.5 Sonnet Integration)
- `SARVAM_API_KEY`: (Voice AI Integration)
- `GITHUB_TOKEN`: (High-limit ingestion)
- `USE_MOCK_DATA`: Feature flag for local development vs live presentation.

## 🚀 Deployment Strategy
All services are mapped via `render.yaml`. Pushing to the `main` branch automatically triggers zero-downtime builds for the Static Site and Web Service, while updating the Cron schedules seamlessly.
