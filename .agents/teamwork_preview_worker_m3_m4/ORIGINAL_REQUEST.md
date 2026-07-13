## 2026-07-13T14:18:31+05:30
You are a Milestone 3 & 4 Worker. Your working directory is /Users/gabriel/Projects/Internet Black Box/.agents/teamwork_preview_worker_m3_m4.
Your tasks are:

1. Implement the USE_MOCK_DATA environment toggle in the Spring Boot backend:
   - Expose the value in application.properties as `use.mock.data=${USE_MOCK_DATA:false}`.
   - In `NvidiaLlmService.java`, if `useMockData` is true:
     - `reconstructIncident` should return a Mono containing a mock `ReconstructionReport` containing the chronological timeline (including events like PR #92, Deployment, Slack message, Sentry errors), root cause info (with confidence 0.92 and evidence event IDs), people involved (Sarah Jenkins, Raj Patel), and prevention steps.
     - `askLlm` should return a Mono of the mock response: "Mock LLM Response: Based on system context, PR #92 merged by Sarah Jenkins modified the auth middleware and broke backward compatibility of JWT tokens."
   - In `SarvamService.java`, if `useMockData` is true:
     - `speechToText` should return `Mono.just("what caused the outage yesterday?")`.
     - `textToSpeech` should return a Mono of a dummy byte array (e.g. 100 bytes of zeros) representing synthesized audio.

2. Verify that the React web-dashboard builds successfully:
   - Run `npm install` and `npm run build` in web-dashboard/ to verify it compiles with zero errors.

3. Complete the Expo mobile-app implementation per spec:
   - Refactor `store/useMobileStore.ts` to call the backend APIs:
     - Add backend state calls for:
       - `fetchIncidents()` calling GET http://localhost:8080/api/incidents
       - `fetchIncidentTimeline(id)` calling GET http://localhost:8080/api/incidents/{id}/timeline
       - `createIncident(title, type, severity)` calling POST http://localhost:8080/api/incidents
       - `triggerReconstruction(id)` calling POST http://localhost:8080/api/incidents/{id}/reconstruct
       - `voiceQuery(audioBase64, languageCode)` calling POST http://localhost:8080/api/query/voice
   - Refactor `app/(tabs)/index.tsx` to load incidents from backend state on mount and update with pull-to-refresh.
   - Refactor `app/incident/[id].tsx` to retrieve the incident timeline and details from the backend APIs.
   - Refactor `app/(tabs)/voice.tsx` to:
     - Record audio from microphone using expo-av.
     - Read the recorded audio file, convert it to Base64.
     - Post it to `/api/query/voice` via Zustand store.
     - Display the returned transcription text and response answer on the UI.
     - Decode the returned `audioBase64` string and play it back using `expo-av` Sound API.
   - Verify that the mobile-app bundles/exports successfully using `npx expo export`.

4. Run `./test_backend.sh` with `USE_MOCK_DATA=true` set, and ensure it passes successfully.
5. Update all checklists and progress logs in `.aimem/member_3_mobile/`, `.aimem/member_1_backend/` and `.aimem/common/todos.md`.
6. Write your handoff findings to /Users/gabriel/Projects/Internet Black Box/.agents/teamwork_preview_worker_m3_m4/handoff.md and report back to parent.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
