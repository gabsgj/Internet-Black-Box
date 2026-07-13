# Original User Request

## Initial Request — 2026-07-13T08:39:36Z

Implement the full "Internet Black Box" application, which consists of a Spring Boot backend, a React web dashboard, and an Expo mobile app, strictly following the `internet-black-box-spec.md` and the team member instructions in the `.aimem` folder.

Working directory: /Users/gabriel/Projects/Internet Black Box
Integrity mode: development

## Requirements

### R1. Backend Ingestion & Neo4j Data Layer
Implement the Spring Boot application (mapping Neo4j properties for nodes, relationships, and Cypher queries) as outlined in `member_1_backend_instructions.md`. External data source integrations (GitHub, Slack, Sentry) MUST be toggleable between live integration and mock data using an environment variable (e.g., `USE_MOCK_DATA=true`).

### R2. Web Dashboard
Implement the React + Vite dashboard in the `web-dashboard` directory according to `member_2_frontend_instructions.md`. It must properly display the AI-generated timeline and render the Neo4j causal subgraph.

### R3. Mobile App
Implement the Expo mobile application in the `mobile-app` directory per `member_3_mobile_instructions.md`, including the incident feed and Sarvam voice query endpoints.

## Acceptance Criteria

### Backend Verification
- [ ] A test script (`test_backend.sh`) can successfully trigger a mock webhook and retrieve the incident from `GET /api/incidents` returning valid JSON.
- [ ] Backend data integration correctly respects the environment variable toggle between mock data and real APIs.

### Frontend & Mobile Verification
- [ ] The `web-dashboard` successfully builds (`npm run build`) and serves without failing.
- [ ] The `mobile-app` bundles successfully (`npx expo export:web` or `npm run web`) without errors.
