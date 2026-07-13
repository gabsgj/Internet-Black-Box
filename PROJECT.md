# Project: Internet Black Box

## Architecture
Internet Black Box is an always-on digital evidence collector and AI-powered incident reconstructor.
- **Backend (Spring Boot)**: Ingests webhooks, interacts with Neo4j AuraDB, and runs incident reconstruction.
- **Web Dashboard (React)**: Renders incident timelines and interactive subgraphs.
- **Mobile Client (Expo)**: Receives alerts and queries incidents using voice/text.

## Code Layout
- `/backend`: Spring Boot Java application
- `/web-dashboard`: React Vite frontend
- `/mobile-app`: Expo mobile application
- `.agents`: Coordination and metadata files

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | Setup & Verification Scripts | Explore backend/mobile, compile, create `test_backend.sh` | None | PLANNED |
| 2 | Ingestion & Neo4j Integration | SDN mapping, Cypher queries, toggle logic | M1 | PLANNED |
| 3 | Mobile Application | Expo Router navigation, Incident Feed, detail timeline, audio recording, Zustand | M1 | PLANNED |
| 4 | E2E Integration & Audit | E2E validation, production builds, forensic audit | M2, M3 | PLANNED |

## Interface Contracts
### Voice Queries
- Endpoint: `POST /api/query/voice`
- Content-Type: `application/json`
- Request: `{ "audio": "base64String", "language": "en" }`
- Response: `{ "text": "transcription", "answer": "reconstructed incident summary", "audio": "base64StringTts" }`
