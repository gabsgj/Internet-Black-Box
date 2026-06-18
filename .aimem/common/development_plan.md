# Internet Black Box — Master Development Plan
### Shared Technical & Execution Roadmap

This document serves as the single source of truth for the end-to-end development of the **Internet Black Box** project. It outlines the architecture, database schema, inter-service contracts, development milestones, and team orchestration.

---

## 1. Project Vision & Goals
Internet Black Box is an always-on digital evidence collector and AI-powered incident reconstructor. 
* **Target Database:** Neo4j AuraDB (representing causal relationship graphs).
* **Ingestion Backend:** Spring Boot (Java 17+) REST/WebFlux API.
* **Frontend Web Dashboard:** React + Vite + TypeScript.
* **Mobile Client:** Expo React Native (TypeScript).
* **AI Engine:** Anthropic Claude (reconstruction & causal timeline extraction).
* **Voice Interface:** Sarvam AI (STT & TTS multilingual voice queries).

---

## 2. Global System Architecture

```
                    +-----------------------------+
                    |        Data Sources         |
                    | GitHub, Slack, Sentry, etc. |
                    +--------------+--------------+
                                   | Webhooks & REST polling
                                   v
                    +-----------------------------+
                    |    Spring Boot Ingest API   |  <--- JWT Authenticated
                    |      (Port 8080 Backend)    |
                    +------+----------------+-----+
                           |                |
             Async Writes  |                | AI Requests / Voice Calls
                           v                v
                    +------+------+  +------+-------------------+
                    | Neo4j Aura  |  | Claude LLM & Sarvam APIs  |
                    |  (Graph DB) |  | (Reconstruction Engine)   |
                    +------+------+  +--------------------------+
                           |
                           +------------------------+
                           | Real-Time Subgraphs    |
                           v                        v
                    +------+------+          +------+------+
                    | React Web   |          | Expo Mobile |
                    |  Dashboard  |          |     App     |
                    +-------------+          +-------------+
```

---

## 3. Database Graph Schema (Neo4j Core)
To ensure data consistency across the backend, frontend, and mobile apps, all teams must adhere to this standardized schema:

### Nodes
* **`Person`**: `{ id: ID, name: String, email: String, role: String, teams: [String] }`
* **`Event`**: `{ id: ID, type: Enum[COMMIT, PR_MERGE, DEPLOYMENT, SLACK_MESSAGE, EMAIL, MEETING, TICKET_UPDATE, ERROR_LOG, ALERT, FILE_EDIT], timestamp: DateTime, source: String, content: String, severity: Enum[INFO, WARNING, CRITICAL], metadata: JSON_String }`
* **`System`**: `{ id: ID, name: String, type: Enum[SERVICE, REPOSITORY, DATABASE, API, PIPELINE], environment: Enum[production, staging, dev] }`
* **`File`**: `{ id: ID, path: String, repository: String, language: String }`
* **`Incident`**: `{ id: ID, title: String, type: Enum[OUTAGE, SECURITY_BREACH, PROJECT_FAILURE, COMPLIANCE], triggeredAt: DateTime, triggeredBy: String, status: Enum[OPEN, RECONSTRUCTING, RESOLVED], severity: Enum[P1, P2, P3], aiSummary: String, rootCause: String }`

### Relationships
* `(Person)-[:AUTHORED {at: DateTime}]->(Event)`
* `(Event)-[:TRIGGERED {confidence: Float, lagSeconds: Integer}]->(Event)`
* `(Event)-[:PRECEDED {secondsDelta: Integer}]->(Event)`
* `(Event)-[:AFFECTED {severity: String}]->(System)`
* `(Event)-[:DEPLOYED_TO {environment: String}]->(System)`
* `(Event)-[:MODIFIED]->(File)`
* `(File)-[:PART_OF]->(System)`
* `(Event)-[:RESPONDED_TO]->(Event)`
* `(Incident)-[:CAUSED_BY {rank: Integer, confidence: Float}]->(Event)`
* `(System)-[:EXPERIENCED]->(Incident)`

---

## 4. API Endpoints Contract (REST/WebSocket)

All requests and responses use standard JSON formatting.

| Verb | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login to retrieve JWT | No |
| `POST` | `/api/incidents` | Create a new incident manually | Yes |
| `GET` | `/api/incidents` | List incidents (paginated) | Yes |
| `GET` | `/api/incidents/{id}` | Get incident detailed analysis | Yes |
| `POST` | `/api/incidents/{id}/reconstruct` | Manually run reconstruction pipeline | Yes |
| `GET` | `/api/incidents/{id}/timeline` | Retrieve chronological timeline events | Yes |
| `GET` | `/api/incidents/{id}/graph` | Retrieve JSON representation of Neo4j subgraph | Yes |
| `POST` | `/api/query/voice` | Input: audio payload (Base64) -> Output: spoken response | Yes |
| `POST` | `/api/query/text` | Input: text question -> Output: summary answer | Yes |
| `POST` | `/api/webhooks/github` | Receive GitHub events | No (uses secret hash) |
| `POST` | `/api/webhooks/slack` | Receive Slack Events API webhook | No (uses signing key) |
| `POST` | `/api/webhooks/sentry` | Receive Sentry alert webhooks | No |

---

## 5. Shared Development Timeline & Milestones

### Milestone 1: Setup & Foundations (Weeks 1-2)
* **Backend:** Setup Spring Boot app, configure Spring Data Neo4j entities, launch local Docker Neo4j.
* **Frontend:** Configure React Vite dashboard, design responsive layout, setup mock charts.
* **Mobile:** Setup Expo template, configure router/navigation, create Mock Incident feeds.
* **Integration:** Initialize `.env` file, formulate API structures, register Sentry/GitHub hooks.

### Milestone 2: Core Data Pipeline & Ingestion (Weeks 3-4)
* **Backend:** Write ingestion REST controllers for GitHub, Slack, and Sentry. Setup Graph DB connection.
* **Frontend:** Implement api service client, integrate Recharts and Sigma.js visual graphs with mock data.
* **Mobile:** Integrate Zustand for local state management, implement push notifications logic.
* **Integration:** Build Claude API connector, formulate the system prompt structure, test Webhooks.

### Milestone 3: AI Engine & Real-Time Sync (Weeks 5-6)
* **Backend:** Implement reconstruction runner. Execute Cypher shortest-path queries.
* **Frontend:** Connect Sigma.js to live Spring Boot `/api/incidents/{id}/graph` endpoint.
* **Mobile:** Connect to backend websocket/REST server. Add Voice querying tab using microphone input.
* **Integration:** Integrate Sarvam AI SDK. Build the STT/TTS routing. Test voice-to-text queries.

### Milestone 4: Polish, Testing & Deployment (Weeks 7-8)
* **Backend:** Write unit tests, package Maven build, host Spring Boot on Render.
* **Frontend:** Deploy static build. Polish UI transition animations.
* **Mobile:** Compile binaries, verify Expo Go loading.
* **Integration:** Execute end-to-end demo incident simulation. Finalize video script.

---

## 6. Communication Protocols & Git Workflows
1. **API Changes:** Any changes to the API payload schema must be coordinated in `.aimem/common/decisions.md` before implementation.
2. **Branching Strategy:** 
   * Main branch: `main` (only stable integration code).
   * Feature branches: `feature/backend-...`, `feature/frontend-...`, `feature/mobile-...`, `feature/integration-...`.
3. **Weekly Sync:** Verify that the integration endpoints meet the client specs during local milestones checks.
