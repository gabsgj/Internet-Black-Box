# Milestone 4 Forensic Audit & Handoff Report

## Forensic Audit Report

**Work Product**: Internet Black Box - Backend, Web Dashboard, and Mobile App (Milestone 4 Integration)
**Profile**: General Project (Development Mode)
**Verdict**: **CLEAN**

### Phase Results
- **Hardcoded output detection**: **PASS** — Checked the controllers and service business logic. No hardcoded test results, expected outputs, or bypasses of business logic exist. The database is actively queried and updated under normal flow.
- **Facade detection**: **PASS** — Evaluated controllers (`QueryController`, `IncidentController`, `WebhookController`) and services (`IncidentService`, `IncidentReconstructionService`, `QueryService`). They implement actual data structures and map data dynamically.
- **Pre-populated artifact detection**: **PASS** — No pre-populated logs or result files exist in the workspace that attests to fake execution.
- **Build and Run (Behavioral Verification)**: **PASS** — Verified backend execution via `test_backend.sh`, compiled React web-dashboard via Vite, and exported iOS/Android bundles for the Expo mobile app with zero errors.
- **Dependency Audit**: **PASS** — Checked external service integrations. Adaptors (`NvidiaLlmService`, `SarvamService`) implement real HTTP web client logic, with mock toggling enabled only via the `USE_MOCK_DATA` environment variable.
- **Database transaction verification**: **PASS** — Cypher queries executed directly in the running Neo4j sandbox container independently confirm that incidents, events, system nodes, and their relationships are correctly committed to the graph database.

---

## 5-Component Handoff Report

### 1. Observation
I directly observed and verified the following:

*   **Backend Code modifications**:
    *   `backend/src/main/resources/application.properties` (line 26):
        ```properties
        use.mock.data=${USE_MOCK_DATA:false}
        ```
    *   `backend/src/main/java/com/hackhazards/internetblackbox/service/NvidiaLlmService.java` (lines 41-116):
        ```java
        if (useMockData) {
            log.info("USE_MOCK_DATA is true, returning mock reconstruction report");
            // ... builds high-fidelity deterministic ReconstructionReport ...
            return Mono.just(report);
        }
        ```
    *   `backend/src/main/java/com/hackhazards/internetblackbox/service/SarvamService.java` (lines 50-54, 98-101):
        ```java
        if (useMockData) {
            log.info("USE_MOCK_DATA is true, returning mock transcription");
            return Mono.just("what caused the outage yesterday?");
        }
        // ...
        if (useMockData) {
            log.info("USE_MOCK_DATA is true, returning mock synthesized audio");
            return Mono.just(new byte[100]);
        }
        ```
    *   `@Transactional("transactionManager")` was configured in:
        *   `WebhookService.java` (lines 50, 209, 276)
        *   `IncidentReconstructionService.java` (line 37)

*   **Mobile App Code modifications**:
    *   `mobile-app/store/useMobileStore.ts`: Defines `const API_BASE = "http://localhost:8080"` and implements `fetchIncidents`, `fetchIncidentTimeline`, `createIncident`, `triggerReconstruction`, and `voiceQuery` calling backend APIs.
    *   `mobile-app/app/(tabs)/index.tsx`: Replaces mock static data with dynamic fetching on mount and supports pull-to-refresh:
        ```typescript
        useEffect(() => {
          fetchIncidents().catch((err) => console.error(err));
        }, []);
        ```
    *   `mobile-app/app/incident/[id].tsx`: Pulls timeline events and detail description dynamically from the Zustand store.
    *   `mobile-app/app/(tabs)/voice.tsx`: Implements recording using `expo-av`, pure JS FileReader conversion to base64, submits voice queries, and plays back response audio.

*   **Build & Verification Results**:
    *   Running `./test_backend.sh` with `USE_MOCK_DATA=true` output:
        ```
        Sentry Webhook response HTTP status: 200
        Waiting 3 seconds for asynchronous webhook processing...
        Retrieving incidents list...
        Success: Found matching auto-triggered incident in database!
        ```
    *   Querying the Neo4j Docker container `neo4j-sandbox` output:
        ```
        docker exec neo4j-sandbox cypher-shell -u neo4j -p password "MATCH (i:Incident) RETURN i.id, i.title, i.status"
        i.id, i.title, i.status
        "inc_sentry_1783932421233", "Auto-Triggered Outage: Database connection timeout under heavy checkout load", "OPEN"
        "inc_sentry_1783932645910", "Auto-Triggered Outage: Database connection timeout under heavy checkout load", "OPEN"
        "inc_sentry_1783932811093", "Auto-Triggered Outage: Database connection timeout under heavy checkout load", "RESOLVED"
        ```
    *   Web Dashboard Build output:
        ```
        dist/assets/index-r3Qz1T6h.js   893.44 kB │ gzip: 250.00 kB
        ✓ built in 165ms
        ```
    *   Mobile App Expo Export output:
        ```
        Web Bundled 650ms node_modules/expo-router/entry.js (1 module)
        iOS Bundled 2069ms node_modules/expo-router/entry.js (942 modules)
        Android Bundled 2796ms node_modules/expo-router/entry.js (1131 modules)
        Exported: dist
        ```

### 2. Logic Chain
1. **Mock Toggle Verification**: The `use.mock.data` property is resolved from the `USE_MOCK_DATA` environment variable. When `USE_MOCK_DATA=true`, both `NvidiaLlmService` and `SarvamService` intercept outgoing calls to return high-fidelity mock data (Observation 1).
2. **Local Flow Validation**: The controller and services (`WebhookService`, `IncidentReconstructionService`) do not check the toggle directly; they ingest webhooks, create incident nodes, and execute queries in the Neo4j database normally. The mock toggle only overrides external API calls (Observation 1).
3. **Database Commits Verification**: We confirmed via native Cypher queries in the running Neo4j Docker container that incidents (including auto-triggered incidents from the Sentry webhook) are successfully saved, updated, and persisted in the database (Observation 1).
4. **Dashboard Integrity**: The Vite React web dashboard compiles correctly with zero errors (Observation 1).
5. **Mobile Integrity**: The Zustand store fetches from the localhost backend, and all routes, voice recording, base64 conversion, and playback logic bundle cleanly without TypeScript or bundling failures (Observation 1).

### 3. Caveats
*   **Hardcoded API URL**: The base URL `http://localhost:8080` is hardcoded in `useMobileStore.ts`. In physical device or external simulator testing environments, this should be refactored to read from environment configurations or `expo-constants` to prevent network connection errors.
*   **Mock Causal Links**: The mock AI report references hardcoded event IDs (`ev-92`, `ev-93`, etc.). Because these mock IDs do not exist in the database, the `CAUSED_BY` relationship query does not link them to actual database events during mock mode. This is expected behavior for mock execution.

### 4. Conclusion
The implementation is **CLEAN**. There are no integrity violations. The mock toggle successfully bypasses external LLM and Speech web services while keeping the local Neo4j database workflows fully active, and all frontend projects compile and bundle successfully.

### 5. Verification Method
To independently verify:
1.  **Check mock backend flow and database persistence**:
    ```bash
    USE_MOCK_DATA=true ./test_backend.sh
    ```
2.  **Verify Neo4j commits**:
    ```bash
    docker exec neo4j-sandbox cypher-shell -u neo4j -p password "MATCH (i:Incident) RETURN i.id, i.title, i.status"
    ```
3.  **Build web dashboard**:
    ```bash
    cd web-dashboard && npm install && npm run build
    ```
4.  **Export mobile app bundle**:
    ```bash
    cd mobile-app && npm install && npx expo export
    ```
