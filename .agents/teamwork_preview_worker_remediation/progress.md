# Progress Log

Last visited: 2026-07-13T14:29:00+05:30

## Completed Tasks
- **Transaction Locking (IncidentReconstructionService.java)**: Removed `@Transactional` from `triggerReconstruction`, added self-injection, and created transactional helper methods (`startReconstruction`, `saveReconstructionReport`, `revertStatusToOpen`) to release connections during the blocking LLM call.
- **Unmanaged Threading (WebhookController.java, WebhookService.java)**: Removed `new Thread(...)` wrappers from controller endpoints and annotated service processor methods with `@Async` to enable Spring-managed thread execution.
- **WebClient Timeout & Header Isolation (WebClientConfig.java)**: Implemented WebClient builder cloning to isolate configurations and configured 10s connection, read, and write timeouts using Netty HttpClient.
- **Discarded Incident Description (Incident.java, IncidentService.java)**: Added `description` property to the `Incident` node entity and mapped/saved it correctly in `createIncident` and `mapToDto`.
- **Mobile Screen Memory Leak & Permissions (voice.tsx)**: Added a `useEffect` cleanup hook to stop/unload any active recording on unmount, and checked permission request status to show an alert on denial.
- **E2E Trap Cleanup (test_backend.sh)**: Injected `trap` cleanup command to SIGINT/SIGTERM/EXIT signals for backend port 8080 process termination.
- **PROJECT.md Contract Alignment**: Realigned the request and response JSON keys to match backend's real implementation fields.
- **Verification**: Verified Maven build passes, E2E `test_backend.sh` verification script executes and shuts down clean, and Expo bundling works perfectly.
