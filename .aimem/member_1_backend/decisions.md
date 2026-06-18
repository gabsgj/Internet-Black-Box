# Backend & Database Specific Decisions

* **Neo4j Entities Mapping:** Annotate domain models with Spring Data Neo4j annotations (`@Node`, `@Id`, `@GeneratedValue`, `@Relationship`).
* **Relationship Directions:**
  - `AUTHORED`: `Person` -> `Event` (Direction: OUTGOING)
  - `CAUSED_BY`: `Incident` -> `Event` (Direction: OUTGOING)
  - `AFFECTED`: `Event` -> `System` (Direction: OUTGOING)
  - `DEPLOYED_TO`: `Event` -> `System` (Direction: OUTGOING)
  - `MODIFIED`: `Event` -> `File` (Direction: OUTGOING)
  - `TRIGGERED` / `PRECEDED`: `Event` -> `Event` (Direction: OUTGOING)
* **WebSocket Integration:** Use native Spring WebSocket message brokers to push new events to the frontend dashboard.
* **ORM Strategy:** Prefer custom Cypher queries mapped to DTO projections for complex traversals like incident subgraphs, instead of heavy OGM object maps.
