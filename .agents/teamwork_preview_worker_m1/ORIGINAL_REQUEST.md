## 2026-07-13T08:44:08Z
You are a Milestone 1 & 2 Worker. Your working directory is /Users/gabriel/Projects/Internet Black Box/.agents/teamwork_preview_worker_m1.
Your tasks are:
1. Verify if Docker is running. Start a local Neo4j Docker container on port 7687 with username 'neo4j' and password 'password' (e.g., using docker run -d --name neo4j-sandbox -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j:5.20).
2. Test compiling and running the backend against the Neo4j database. Ensure the schema/nodes are initialized correctly.
3. Implement the verification script `test_backend.sh` in the project root (/Users/gabriel/Projects/Internet Black Box/test_backend.sh) that:
   - Starts the backend if not already running on port 8080.
   - Hits a mock Sentry webhook (POST `/api/webhooks/sentry` with level 'error' or 'fatal' to trigger a critical alert which triggers an incident reconstruction).
   - Retrieves the incidents list (GET `/api/incidents`) and validates that it returns a valid JSON containing the created incident.
   - Shuts down the backend gracefully.
4. Execute `test_backend.sh` and document the exact steps and stdout in your handoff.
5. Update tasks/progress in `.aimem/member_1_backend/`.
6. Write your findings to /Users/gabriel/Projects/Internet Black Box/.agents/teamwork_preview_worker_m1/handoff.md and report back to parent.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
