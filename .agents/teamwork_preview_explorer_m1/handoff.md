# Milestone 1 Exploration Report

The Spring Boot backend and Expo mobile application have been fully analyzed and verified for buildability and compilation. The codebase is currently structured to run on mock data, as the local Neo4j database is offline and the mobile application loads local mock feeds directly without backend network requests.

---

## 1. Observation

### Backend Compilation Check
- **File Checked**: `backend/pom.xml`
- **Command executed**: `mvn clean compile` in `/Users/gabriel/Projects/Internet Black Box/backend`
- **Result**:
  ```
  [INFO] --- compiler:3.13.0:compile (default-compile) @ internet-black-box ---
  [INFO] Recompiling the module because of changed source code.
  [INFO] Compiling 43 source files with javac [debug parameters release 17] to target/classes
  ...
  [INFO] ------------------------------------------------------------------------
  [INFO] BUILD SUCCESS
  [INFO] ------------------------------------------------------------------------
  [INFO] Total time:  1.425 s
  ```

### Mobile App Bundling/Export Check
- **File Checked**: `mobile-app/package.json`
- **Command executed**: `npm install --prefer-offline` followed by `npx expo export` in `/Users/gabriel/Projects/Internet Black Box/mobile-app`
- **Result**:
  ```
  › web bundles (1):
  _expo/static/js/web/entry-5c8ebe650e9a23a3f05700c3f8fdf0fe.js (1.22 MB)
  
  › android bundles (1):
  _expo/static/js/android/entry-0bf9ba257a7f4f6ba62d26df4b8bf9be.hbc (2.77 MB)
  
  › ios bundles (1):
  _expo/static/js/ios/entry-4889774aa625678b5d1e2481f173a217.hbc (2.77 MB)
  
  Exported: dist
  ```
  - Packages are up-to-date and bundling completed successfully for all 3 targets.

### Architecture and REST Layer Identification
- **REST Controllers** (Found in `/Users/gabriel/Projects/Internet Black Box/backend/src/main/java/com/hackhazards/internetblackbox/controller`):
  | Controller | Mapped Path | Purpose |
  |---|---|---|
  | `EventController` | `/api/events` | Managing ingestion logs and events |
  | `IncidentController` | `/api/incidents` | Retrieving, creating, and reconstructing incidents and their graphs |
  | `QueryController` | `/api/query` | Handlers for text/voice queries |
  | `WebhookController` | `/api/webhooks` | Webhook ingestion endpoint |

- **Models** (Found in `/Users/gabriel/Projects/Internet Black Box/backend/src/main/java/com/hackhazards/internetblackbox/model`):
  - `@Node` mapped entities: `Event`, `FileNode`, `Incident`, `Person`, `SystemNode`
  - Relationship structures (e.g. `CAUSED_BY`, `TRIGGERED`, `PRECEDED`, `AFFECTED`, `DEPLOYED_TO`, `MODIFIED`) are annotated via `@Relationship` (e.g., `Incident.java:35`, `Event.java:32-52`).

- **Repositories** (Found in `/Users/gabriel/Projects/Internet Black Box/backend/src/main/java/com/hackhazards/internetblackbox/repository`):
  - `EventRepository`, `FileRepository`, `IncidentRepository`, `PersonRepository`, `SystemRepository`
  - Extending `Neo4jRepository`. Specifically, `IncidentRepository.java:14-17` maps:
    ```java
    @Query("""
        MATCH (i:Incident {id: $id})-[:CAUSED_BY]->(e:Event)
        RETURN e
    """)
    List<Event> findTimelineEvents(String id);
    ```

### Mock Data & Database Status
- **Backend Mock Setup**:
  - `IncidentService.java:34-36` catches DB query exceptions and returns mock lists:
    ```java
    } catch (Exception e) {
        return getMockIncidents();
    }
    ```
  - `IncidentService.java:93` hardcodes the subgraph nodes/edges:
    ```java
    // Mock graph for presentability as per hackathon spec. Real implementation would query Neo4j for subgraph.
    ```
  - `QueryService.java:93` logs a database unavailable warning and returns a mock context string.
- **Mobile Client Mock Setup**:
  - `FeedScreen` (`mobile-app/app/(tabs)/index.tsx:29-31`) loads mock list directly:
    ```tsx
    useEffect(() => {
      setIncidents(mockIncidents);
    }, []);
    ```
  - The voice screen (`mobile-app/app/(tabs)/voice.tsx`) records audio via `expo-av` but displays an alert without sending API calls to the server.
- **Neo4j Port Check**:
  - Command: `nc -zv localhost 7687`
  - Output: `nc: connectx to localhost port 7687 (tcp) failed: Connection refused`
  - Environment variables: `SPRING_NEO4J_URI=bolt://localhost:7687` defined in `.env` and `application.properties`.

---

## 2. Logic Chain

1. **Observation 1**: Running `mvn clean compile` succeeds and outputs `BUILD SUCCESS` with 43 compiled source files.
2. **Observation 2**: Running `npx expo export` successfully outputs bundles for web, android, and ios to the `dist` directory.
3. **Observation 3**: Inspecting `.env` and `application.properties` shows that the configured Neo4j URI is `bolt://localhost:7687`.
4. **Observation 4**: Executing `nc -zv localhost 7687` outputs `Connection refused`, indicating no database service is listening on port 7687.
5. **Observation 5**: Inspecting `IncidentService.java` and `QueryService.java` shows that all Neo4j query methods are inside `try-catch` blocks that catch database connection/query errors and return hardcoded mock fallbacks (`getMockIncidents()`, `getMockTimeline()`, etc.).
6. **Observation 6**: Inspecting the mobile client's screen files (`index.tsx` and `[id].tsx`) shows they import mock constants from `mobile-app/mock/` and load them directly into component state instead of dispatching HTTP requests to the backend server.
7. **Conclusion (supported by Steps 1-6)**:
   - The Spring Boot backend compiles successfully.
   - The Expo mobile application bundles successfully.
   - Database integration is syntactically configured in Java but is functionally offline, triggering the backend's try-catch exceptions to return fallback mocks.
   - The mobile application's UI relies on locally-stored mock data rather than server APIs.

---

## 3. Caveats

- Database integration cannot be tested for functionality (e.g. node saving, edge relationships, custom Cypher query execution correctness) because there is no running Neo4j instance.
- External API calls (Claude/Nnim, Sarvam AI STT/TTS) were not run in isolation, though environment keys are present in `.env`.
- Web Dashboard bundle checks were not performed, as they were excluded from the scope of this explorer dispatch.

---

## 4. Conclusion

The codebase is in a stable, buildable state. Both backend and mobile-app compilation checks pass without error. Currently, the application operates purely on mock datasets due to:
1. No active local Neo4j database instance on port 7687.
2. Hardcoded fallback blocks inside the backend services.
3. Hardcoded data loading in the mobile client.
The next milestones must implement/verify the active Spring Data Neo4j (SDN) database connections and wire the Expo application's screens to call backend REST endpoints.

---

## 5. Verification Method

To verify these results independently, perform the following commands:

1. **Verify Backend Compile**:
   ```bash
   cd backend
   mvn clean compile
   ```
   Check for `BUILD SUCCESS` output.

2. **Verify Mobile Bundling**:
   ```bash
   cd mobile-app
   npm install --prefer-offline
   npx expo export
   ```
   Verify that `dist` folder is created and contains bundle assets for `web`, `android`, and `ios`.

3. **Verify Database Port Offline**:
   ```bash
   nc -zv localhost 7687
   ```
   Confirm that the connection is refused.
