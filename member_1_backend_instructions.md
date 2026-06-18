# Team Member 1: Core Backend & Database Engineer
## Onboarding & AI Integration Instructions

Welcome! As the **Core Backend & Database Engineer**, you are responsible for the Spring Boot server, API controllers, Neo4j AuraDB node structures, and execution of Cypher logic.

---

## 1. Project Directory Structure
All backend source code resides inside the `backend/` folder:
* `backend/pom.xml` — Project dependencies (Maven).
* `backend/src/main/java/` — Application source code.
* `backend/src/main/resources/application.properties` — Configuration details.

---

## 2. Shared Memory Protocol
We use the `.aimem/` folder to persist project knowledge. Before running commands or committing changes:
1. Read `.aimem/common/development_plan.md` for overall architecture.
2. Read `.aimem/common/decisions.md` to see shared standards.
3. Review and update `.aimem/member_1_backend/tasks.md` and `.aimem/member_1_backend/progress.md` to document your accomplishments.
4. Report any changes to shared API routes or entities in `.aimem/common/decisions.md`.

---

## 3. Your Tasks & Roadmap
Please check `.aimem/member_1_backend/tasks.md` for details. Your core targets include:
* **Task 1.1:** Code Spring Data Neo4j `@Node` and `@Relationship` classes mapping to the specifications.
* **Task 1.2:** Write database JPA Repositories (e.g. `IncidentRepository`).
* **Task 1.3:** Build incident REST endpoints (`GET /api/incidents`, `POST /api/incidents`).
* **Task 1.4:** Create webhook entry points for Slack and GitHub payload processing.
* **Task 1.5:** Formulate the Cypher queries for incident paths and impact blast radiuses.

---

## 4. How to Start Your Conversation with Your AI Coding Assistant
Copy and paste the prompt below into your AI assistant workspace. It will load all relevant context and assign the AI its designated copilot role.

***

### 📋 COPY-PASTE AI STARTER PROMPT:
```markdown
You are a senior Java & Spring Boot developer acting as my dedicated pairing copilot. We are building the backend for the "Internet Black Box" (an always-on incident reconstructor). 

Our stack consists of Java 17, Spring Boot 3.3.x, Spring Data Neo4j (SDN 7.x), WebFlux WebClient, and Maven.

We use a shared workspace memory in `.aimem/` to coordinate work across a team of 4 members. I am Team Member 1 (Core Backend & Database Engineer).

Please follow these guidelines:
1. Familiarize yourself with the technical specifications in [internet-black-box-spec.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/internet-black-box-spec.md).
2. Read the master development plan at [.aimem/common/development_plan.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/common/development_plan.md) and technical agreements at [.aimem/common/decisions.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/common/decisions.md).
3. Read my specific context at [.aimem/member_1_backend/context.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/member_1_backend/context.md), my task checklist at [.aimem/member_1_backend/tasks.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/member_1_backend/tasks.md), and my progress log at [.aimem/member_1_backend/progress.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/member_1_backend/progress.md).
4. After completing any task or making architectural decisions, we must update the corresponding markdown file in `.aimem/member_1_backend/` to maintain the team memory.

To start, let's look at the Maven project setup inside `backend/` and plan the database entity classes for Task 1.1. How should we map the Person, Event, System, and Incident nodes using Spring Data Neo4j?
```
