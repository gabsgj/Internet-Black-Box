# Handoff Report: Milestone 4 Review

## 1. Observation

During my review of the Milestone 4 deliverables, I examined the codebase and executed verification steps. The specific files and resources inspected include:
1. **WebClient Configurations**: `/Users/gabriel/Projects/Internet Black Box/backend/src/main/java/com/hackhazards/internetblackbox/config/WebClientConfig.java`
2. **AI & Speech Services**:
   - `/Users/gabriel/Projects/Internet Black Box/backend/src/main/java/com/hackhazards/internetblackbox/service/NvidiaLlmService.java`
   - `/Users/gabriel/Projects/Internet Black Box/backend/src/main/java/com/hackhazards/internetblackbox/service/SarvamService.java`
3. **Transaction Management & Async Workflows**:
   - `/Users/gabriel/Projects/Internet Black Box/backend/src/main/java/com/hackhazards/internetblackbox/service/IncidentReconstructionService.java` (specifically lines 36-38, 88-89)
   - `/Users/gabriel/Projects/Internet Black Box/backend/src/main/java/com/hackhazards/internetblackbox/service/WebhookService.java`
   - `/Users/gabriel/Projects/Internet Black Box/backend/src/main/java/com/hackhazards/internetblackbox/controller/WebhookController.java` (lines 27, 45, 55)
4. **Backend Verification Script**: `/Users/gabriel/Projects/Internet Black Box/test_backend.sh`
5. **Expo Mobile App Client**:
   - Zustand Store: `/Users/gabriel/Projects/Internet Black Box/mobile-app/store/useMobileStore.ts`
   - Feed Screen: `/Users/gabriel/Projects/Internet Black Box/mobile-app/app/(tabs)/index.tsx`
   - Detail Screen: `/Users/gabriel/Projects/Internet Black Box/mobile-app/app/incident/[id].tsx`
   - Voice Screen: `/Users/gabriel/Projects/Internet Black Box/mobile-app/app/(tabs)/voice.tsx` (using `expo-av` library)
6. **Project Specifications**: `/Users/gabriel/Projects/Internet Black Box/PROJECT.md`

I also executed the following commands in the workspace terminal:
- `mvn clean compile` inside `/backend` (succeeded).
- `lsof -i :7687` to confirm a local Neo4j database was running.
- `./test_backend.sh` from the root directory to verify E2E flow (succeeded and cleaned up on the happy path, but has structural weaknesses).

---

## 2. Logic Chain

My findings are based on the following step-by-step reasoning:
1. **WebClient Config & Robustness**:
   - In `WebClientConfig.java`, the builder is directly configured and built. No timeouts are defined.
   - *Reasoning*: Standard HTTP clients, especially those making remote AI inference calls (Nvidia NIM & Sarvam AI), must define connection, read, and write timeouts to prevent threads from hanging indefinitely during network failure.
2. **Transaction Management & External Network Calls**:
   - In `IncidentReconstructionService.java`, `triggerReconstruction` is annotated with `@Transactional("transactionManager")`.
   - Inside this method, `nvidiaLlmService.reconstructIncident(incidentDto, eventDtos).block()` is executed.
   - *Reasoning*: In Spring, annotations like `@Transactional` open a database transaction and hold onto a connection from the pool. Performing a blocking external REST call (`.block()`) while holding a database transaction is a major performance anti-pattern. If the LLM service is slow or times out, database connection pool starvation occurs, blocking the entire application.
3. **Manual Unmanaged Threading in Controllers**:
   - In `WebhookController.java`, incoming webhook payloads are handled by doing `new Thread(() -> webhookService.processGitHubWebhook(...)).start()`.
   - *Reasoning*: Starting manual, unmanaged OS threads inside a Spring application bypasses Spring's TaskExecutor pool. This limits thread reuse, increases overhead, makes monitoring impossible, and risks OutOfMemoryErrors (OOM) under a burst of webhooks. Since `@EnableAsync` is already declared in `InternetBlackBoxApplication.java`, Spring's `@Async` or a managed task executor should be used.
4. **Data Mapping Gaps**:
   - In `IncidentService.java`, the `IncidentDto` maps `description` to `incident.getAiSummary()`.
   - The Neo4j `Incident` entity does not contain a `description` field.
   - *Reasoning*: When a user creates an incident via `POST /api/incidents` with a custom description, the description is discarded and never saved. Furthermore, on retrieval, the field remains null until AI reconstruction generates an `aiSummary`.
5. **Mobile Client Recording & Resource Cleanup**:
   - In `voice.tsx`, `Audio.requestPermissionsAsync()` is called but its returned `granted` boolean is never checked.
   - Recording is started using `Audio.Recording.createAsync(...)`.
   - The sound playback is loaded via `Audio.Sound.createAsync(...)` and correctly cleaned up on unmount.
   - However, the `recording` object has no `useEffect` cleanup handler.
   - *Reasoning*: If a user navigates away from the Voice tab while the microphone is recording, the recording is never stopped or unloaded. This leaves the microphone active in the background, violating user privacy and locking the audio subsystem.
6. **API Interface Contract Deviations**:
   - In `useMobileStore.ts` and `QueryController.java`, the voice query endpoint sends/receives payload keys like `audioBase64` and `languageCode`.
   - `PROJECT.md` defines the payload keys as `audio`, `language`, and `text`.
   - *Reasoning*: Implementations deviate from the documented contract, which can break client-server integration if other teams build integrations relying strictly on `PROJECT.md`.
7. **Verification Script Robustness**:
   - In `test_backend.sh`, `mvn spring-boot:run` is started in the background. The script utilizes `set -e`.
   - *Reasoning*: If any validation check or curl command fails in the middle of the script, `set -e` triggers an immediate exit, but the background maven process is never terminated, leaving port 8080 bound and subsequent test runs blocked. A `trap` statement is needed to cleanup background processes.

---

## 3. Caveats

- **No Real Hardware Audio Testing**: The `expo-av` audio recording and playback was evaluated through static code analysis and standard API usage checks. I did not test this on physical iOS/Android hardware or emulators (due to CLI execution limits).
- **Mock LLM Uptime**: The E2E test was run using local configurations. Although a Neo4j database was running and connection was verified, Nvidia and Sarvam services were not tested for actual API response performance limits or latency behavior under real loads.

---

## 4. Conclusion & Quality Review

### Verdict
`REQUEST_CHANGES`

---

### Findings

#### [Major] Finding 1: Database Transaction Held During External AI Call
- **What**: The method `triggerReconstruction` holds a database transaction open during a blocking external network call.
- **Where**: `IncidentReconstructionService.java` (lines 37-38 & 88-89).
- **Why**: Keeping a transaction open during `.block()` to `nvidiaLlmService` blocks the database connection. A slow AI request can starve the database connection pool, taking down the entire backend application.
- **Suggestion**: Separate the LLM call from the database transaction. Run the LLM call non-transactedly, and only open transactions to read context initially and write back the reconstructed report afterwards.

#### [Major] Finding 2: Unmanaged Thread Creation in Controllers
- **What**: Webhook endpoints spin up unmanaged threads using `new Thread(...).start()`.
- **Where**: `WebhookController.java` (lines 27, 45, and 55).
- **Why**: Bypasses Spring's thread pool management, leading to thread leaks, inability to configure pool sizes, lack of thread reuse, and risk of OOM under webhook bursts.
- **Suggestion**: Annotate the `WebhookService` processing methods with `@Async` or inject a managed `TaskExecutor` to submit tasks.

#### [Major] Finding 3: Missing Recording Resource Cleanup on Voice Screen
- **What**: The active `recording` instance is not cleaned up on component unmount.
- **Where**: `voice.tsx` (lines 33-113).
- **Why**: Navigating away from the voice tab while recording keeps the microphone active indefinitely in the background. This leads to resource/battery drain, locks the device audio hardware, and violates user privacy.
- **Suggestion**: Add a cleanup function to the `useEffect` hook in `voice.tsx` to stop and unload any active `recording` if the component unmounts.

#### [Major] Finding 4: API Contract Mismatch with PROJECT.md
- **What**: JSON payload keys for voice queries deviate from the spec.
- **Where**: `useMobileStore.ts` (lines 80-91), `QueryController.java` (lines 32-47), and `PROJECT.md` (lines 24-29).
- **Why**: The code uses `audioBase64` and `languageCode` (Request) and `transcript`/`answer`/`audioBase64` (Response). `PROJECT.md` specifies `audio`/`language` (Request) and `text`/`answer`/`audio` (Response).
- **Suggestion**: Update `PROJECT.md` to match the implementation, or adjust DTOs and frontend stores to strictly conform to the spec.

#### [Major] Finding 5: Discarded Incident Description
- **What**: The `description` field submitted during incident creation is discarded.
- **Where**: `IncidentService.java` (lines 62-80), `Incident.java` (domain model).
- **Why**: `Incident` entity does not have a `description` field, so it is never saved to the Neo4j database. It maps `description` in DTO to `aiSummary`, which overwrites the field.
- **Suggestion**: Add a `description` field to the `Incident` Neo4j node entity to persist user-supplied descriptions separately from `aiSummary`.

#### [Minor] Finding 6: Missing Timeout Configurations on WebClients
- **What**: `nvidiaWebClient` and `sarvamWebClient` lack connection and read timeouts.
- **Where**: `WebClientConfig.java` (lines 19-35).
- **Why**: Prevents HTTP calls from timing out during network degradation, which can hang thread execution indefinitely.
- **Suggestion**: Configure timeouts on the Netty `HttpClient` used by the `WebClient.Builder`.

#### [Minor] Finding 7: Missing Cleanups in test_backend.sh on Failure
- **What**: The verification script does not clean up background maven processes on error exits.
- **Where**: `test_backend.sh` (lines 1-112).
- **Why**: If a command fails mid-execution under `set -e`, the script terminates, leaving the backend process running in the background and port 8080 blocked.
- **Suggestion**: Implement a `trap` function to kill the backend PID on exit (e.g. `trap 'kill $BACKEND_PID 2>/dev/null || true' EXIT`).

#### [Minor] Finding 8: Unhandled Permission Denials on Microphone Access
- **What**: Return value of `Audio.requestPermissionsAsync()` is ignored.
- **Where**: `voice.tsx` (line 37).
- **Why**: If the user denies permission, the app fails to record silently or crashes, without notifying the user why the MIC button does not respond.
- **Suggestion**: Verify `granted` property from the return value, and show an alert if permission is denied.

#### [Minor] Finding 9: Hardcoded Localhost API Base in Zustand Store
- **What**: Zustand store hardcodes `http://localhost:8080`.
- **Where**: `useMobileStore.ts` (line 4).
- **Why**: Will fail to resolve on physical devices or Android emulators (which require the host IP or `10.0.2.2`).
- **Suggestion**: Use an environment variable or Expo's `Constants` to configure `API_BASE` dynamically.

---

### Verified Claims

- **Backend Compiles**: Verified by running `mvn clean compile` -> `BUILD SUCCESS` (Pass).
- **Webhook Ingestion**: Verified by running `./test_backend.sh` -> Webhook returned `200` status (Pass).
- **Database Persistence**: Verified by running `./test_backend.sh` -> Sentry webhook auto-created an incident node, which was successfully retrieved from Neo4j (Pass).
- **Incident Reconstruction E2E**: Verified by running `./test_backend.sh` -> Neo4j database entry was updated with reconstructed timelines and root causes (Pass).

---

### Coverage Gaps

- **iOS/Android Audio Playback Performance**: Direct base64 URI data playback (`data:audio/x-wav;base64,...`) has not been stress-tested on low-end Android/iOS devices where memory bounds could lead to playback issues. (Risk level: Low).
- **Neo4j Transactions Concurrent Load**: The behavior under a high volume of concurrent webhooks creating raw threads has not been simulated. (Risk level: High, due to unmanaged threads and transaction locking).

---

### Unverified Items

- **Physical Device Recording Permissions**: We cannot verify permissions prompt behavior on physical iOS/Android operating systems.

---

## Adversarial Challenge Report

### Assumptions Challenged

1. **Assumption: Thread Safety of WebClient Builder Injection**
   - *Scenario*: The same `WebClient.Builder` instance is injected into multiple `@Bean` methods.
   - *Attack*: If Spring does not inject a unique prototype builder to each bean method, modifications in `nvidiaWebClient` can bleed into `sarvamWebClient` (e.g. header pollution).
   - *Mitigation*: Ensure `builder.clone()` is used inside configuration classes.

2. **Assumption: Continuous Uptime of Nvidia NIM / Sarvam AI**
   - *Scenario*: The external AI service becomes unresponsive or drops connections.
   - *Attack*: If the LLM takes 30 seconds to reply, a backend thread block occurs under `@Transactional`. With a small connection pool, 10 simultaneous reconstructions will lock the entire application database access.
   - *Mitigation*: Separate AI calls from database transaction scope and set a 10s timeout on WebClient.

3. **Assumption: Webhook Security & Trust**
   - *Scenario*: Malicious entities guess the Sentry webhook URL and flood it.
   - *Attack*: Flooding `/api/webhooks/sentry` will spawn thousands of raw OS threads, leading to an immediate OOM (Out Of Memory) crash.
   - *Mitigation*: Restrict webhook endpoints with IP filters, secret headers validation, and run them using standard rate-limiting filters.

---

## 5. Verification Method

To verify these findings and reproduce the E2E verification results, run:
1. **Clean compile the backend**:
   ```bash
   cd backend
   mvn clean compile
   ```
2. **Execute the verification script**:
   ```bash
   ./test_backend.sh
   ```
3. **Verify unmounted recording memory leak**:
   Open `mobile-app/app/(tabs)/voice.tsx` and inspect that there is no cleanup effect hook managing the lifecycle of the `Audio.Recording` instance.
4. **Verify transactional block patterns**:
   Inspect `IncidentReconstructionService.java` at line 37 for `@Transactional` and line 89 for `.block()`.
