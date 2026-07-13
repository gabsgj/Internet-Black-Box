# Handoff Report — Quality Remediation

## 1. Observation
We observed several quality issues across the codebase:
- **Transaction Locking**: In `IncidentReconstructionService.java`, `@Transactional("transactionManager")` was annotated on the `@Async` method `triggerReconstruction` which invokes a blocking WebClient call: `nvidiaLlmService.reconstructIncident(...).block()`.
- **Unmanaged Threading**: In `WebhookController.java`, unmanaged threads were created directly:
  ```java
  new Thread(() -> webhookService.processGitHubWebhook(payload, githubEventHeader)).start();
  ```
- **WebClient Configurations**: In `WebClientConfig.java`, `WebClient.Builder` was reused directly without cloning, and connection/read/write timeouts were not configured.
- **Incident Description**: In `Incident.java` (lines 30-39), the `description` field was missing, causing description mapping in `IncidentService.java` to fall back purely to `aiSummary`.
- **Mobile Recording Leak**: In `mobile-app/app/(tabs)/voice.tsx`, the `recording` reference was not cleaned up on component unmount, and permission denial from `Audio.requestPermissionsAsync()` was not checked or alerted.
- **E2E Cleanups**: In `test_backend.sh`, the backend process started in the background could become an orphan process if any part of the script failed or was interrupted prior to reaching the manual shutdown section.
- **PROJECT.md Out-of-Sync**: `PROJECT.md` listed request keys as `audio`, `language` and response keys as `text`, `answer`, `audio` instead of `audioBase64`, `languageCode`, `transcript`, `answer`, `audioBase64`.

## 2. Logic Chain
- By removing `@Transactional` from `triggerReconstruction` and self-injecting the service using `@Autowired @Lazy` to invoke proxy-wrapped `@Transactional("transactionManager")` helper methods (`startReconstruction`, `saveReconstructionReport`, `revertStatusToOpen`), the database connection is returned to the pool prior to the blocking LLM call and a new connection is retrieved afterward.
- Replacing the controller-level `new Thread(...)` instantiations with direct service calls and annotating the service methods in `WebhookService.java` with `@Async` lets Spring manage the async task execution using its default thread pool, preventing thread leakage.
- Using `builder.clone()` in `WebClientConfig` isolates headers and configurations. Applying Netty `HttpClient` option `CONNECT_TIMEOUT_MILLIS` and adding `ReadTimeoutHandler` and `WriteTimeoutHandler` ensures requests do not hang indefinitely.
- Adding `private String description;` to the `Incident` node entity, saving it from the DTO, and using it as a fallback in `mapToDto` when `aiSummary` is null resolves the discarded description bug.
- Implementing a `useEffect` cleanup hook that calls `recording.stopAndUnloadAsync()` prevents native audio session leaks when the user navigates away from the voice tab. Validating that `status === "granted"` protects the app from unhandled exceptions.
- Registering a bash `trap` command on `EXIT INT TERM` ensures the process listening on port 8080 is killed on any termination path.
- Aligning `PROJECT.md` keys with actual DTO fields matches the actual JSON contracts.

## 3. Caveats
- Direct device testing of the Expo recording functionality could not be performed, but Metro Bundler static export (`npx expo export`) was verified.

## 4. Conclusion
All quality remediation tasks have been completed following the minimal change principle. The system is structurally sound, conforms to requirements, compiles, and successfully passes E2E verification.

## 5. Verification Method
Verify the fixes by executing:
1. **Backend Compilation**:
   ```bash
   cd backend
   mvn clean compile
   ```
2. **E2E verification & process cleanup**:
   ```bash
   ./test_backend.sh
   ```
3. **Mobile bundling**:
   ```bash
   cd mobile-app
   npx expo export
   ```
