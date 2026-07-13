# Plan — Internet Black Box

This plan outlines the milestones, tasks, and verification steps for implementing the Internet Black Box application.

## Architecture & Code Layout
- **Backend**: Spring Boot, SDN, WebFlux, Neo4j. Located in `/backend`
- **Web Dashboard**: React + Vite + TypeScript. Located in `/web-dashboard`
- **Mobile Client**: Expo (React Native). Located in `/mobile-app`

## Milestones

### Milestone 1: Setup Validation & Verification Scripts
- **Goal**: Confirm current code build status, verify existing mock implementation, and establish the automated verification script (`test_backend.sh`).
- **Tasks**:
  1. Explore current backend configuration, models, controllers, and services using an Explorer.
  2. Verify backend compiles and builds.
  3. Create `test_backend.sh` script to trigger the mock webhook and retrieve the incident from `GET /api/incidents` returning valid JSON.
  4. Verify mobile app compiles/bundles successfully.
- **Verification**: Run maven build, run test script, run expo bundler check.

### Milestone 2: Database Ingestion & Neo4j Integration
- **Goal**: Complete the SDN Data Layer mapping, ensure Neo4j queries operate correctly, and toggle mock data with environment variables.
- **Tasks**:
  1. Complete Spring Data Neo4j mapping classes and repository queries (Task 1.1 - 1.5).
  2. Implement toggle `USE_MOCK_DATA` environment variable for external data source integrations (GitHub, Slack, Sentry).
  3. Formulate Cypher shortest-path query and blast radius queries.
  4. Verify data ingestion and query execution against local Neo4j Docker or AuraDB.
- **Verification**: Test script running successfully, verifying backend respects `USE_MOCK_DATA` toggle.

### Milestone 3: Mobile Application Development
- **Goal**: Implement the Expo mobile application according to `member_3_mobile_instructions.md`.
- **Tasks**:
  1. Configure Expo Router navigation and tab layout (Task 3.1).
  2. Build Incident Feed with color badges (Task 3.2).
  3. Implement scrollable timeline step-cards in Detail view (Task 3.3).
  4. Build voice querying audio interface using `expo-av` and POST endpoints (Task 3.4).
  5. Configure push notification listeners (Task 3.5).
  6. Integrate Zustand state and SecureStore for JWT token (Task 3.6 - 3.7).
- **Verification**: Mobile client bundles successfully with `npm run web` or `npx expo export:web`.

### Milestone 4: End-to-End Integration, Review, and Forensic Audit
- **Goal**: Connect Web, Mobile, and Backend, run tests, and run Forensic Audit.
- **Tasks**:
  1. Connect React web-dashboard to live backend endpoints.
  2. Run production builds for both web-dashboard and mobile-app.
  3. Conduct rigorous code reviews.
  4. Execute Forensic Auditor checks.
- **Verification**: All builds pass, E2E tests pass, and auditor verdict is clean.
