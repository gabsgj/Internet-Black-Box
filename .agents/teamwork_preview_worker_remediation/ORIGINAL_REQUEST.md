## 2026-07-13T08:57:06Z

You are a Quality Remediation Worker. Your working directory is /Users/gabriel/Projects/Internet Black Box/.agents/teamwork_preview_worker_remediation.
Your tasks are:

1. Transaction Locking:
   In `IncidentReconstructionService.java`:
   - Remove `@Transactional` from `triggerReconstruction(String incidentId)`.
   - Implement `@Transactional("transactionManager")` helper methods to read and write database state:
     - `public Incident startReconstruction(String incidentId)`: sets status to RECONSTRUCTING, saves, and returns the incident.
     - `public void saveReconstructionReport(String incidentId, ReconstructionReport report)`: updates incident's rootCause, aiSummary, causalEvents list, status to RESOLVED, and saves.
   - In `triggerReconstruction`, call these helper methods so that the database connection is released during the blocking `nvidiaLlmService.reconstructIncident(...).block()` call.

2. Unmanaged Threading:
   In `WebhookController.java`:
   - Remove `new Thread(...)` creation blocks from /api/webhooks/github, /api/webhooks/slack, and /api/webhooks/sentry endpoints.
   - Annotate `processGitHubWebhook`, `processSlackWebhook`, and `processSentryWebhook` in `WebhookService.java` with `@Async` so Spring automatically manages async execution.

3. WebClient Timeout and Header Isolation:
   In `WebClientConfig.java`:
   - Use `builder.clone()` for both `nvidiaWebClient` and `sarvamWebClient` to isolate builder configurations.
   - Configure Netty HttpClient connection, read, and write timeouts (10 seconds) on both WebClients.

4. Discarded Incident Description:
   - Add `private String description;` property to `Incident` node entity (`Incident.java`).
   - In `IncidentService.java`:
     - In `createIncident`, save the `description` on the `Incident` node from the DTO.
     - In `mapToDto`, set `dto.description` to `incident.getAiSummary() != null ? incident.getAiSummary() : incident.getDescription()`.

5. Mobile Screen Memory Leak and Permission Checks:
   In `mobile-app/app/(tabs)/voice.tsx`:
   - Add a useEffect cleanup hook that stops and unloads any active `recording` if the component unmounts.
   - Check the `status` from `Audio.requestPermissionsAsync()` and show an alert if permission is denied.

6. E2E test_backend.sh Trap Cleanups:
   - Add a `trap` statement in `test_backend.sh` that automatically kills any process listening on port 8080 (the backend process) on script exit, failure, or interrupt (e.g. trap 'FINAL_PID=$(lsof -t -i:$PORT || true); if [ -n "$FINAL_PID" ]; then kill -15 "$FINAL_PID" 2>/dev/null || true; fi' EXIT INT TERM).

7. PROJECT.md Contract Alignment:
   - Update `PROJECT.md` voice query contract request and response keys to match the actual implementation (`audioBase64`, `languageCode`, `transcript`, `answer`, `audioBase64`).

8. Verification:
   - Run `mvn clean compile` to ensure backend builds.
   - Run `USE_MOCK_DATA=true ./test_backend.sh` to ensure test script passes and cleans up.
   - Run `npx expo export` in `mobile-app` to verify bundling succeeds.
   - Write your handoff findings to /Users/gabriel/Projects/Internet Black Box/.agents/teamwork_preview_worker_remediation/handoff.md and report back.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
