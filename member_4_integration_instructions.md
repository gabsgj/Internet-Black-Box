# Team Member 4: AI, Voice & Integration Engineer
## Onboarding & AI Integration Instructions

Welcome! As the **AI, Voice & Integration Engineer**, you are responsible for prompt engineering the Claude AI reconstruction engine, connecting Sarvam voice interfaces (STT/TTS REST calls), implementing async workflows/schedulers in Spring Boot, and constructing event webhook parsers (GitHub, Slack, Sentry).

---

## 1. Project Directory Structure
All integration logic resides inside the shared `backend/` project, since we are using Spring Boot schedulers and WebClient. Your primary focus folders:
* `backend/src/main/java/com/hackhazards/internetblackbox/service/` — Integration & AI Services.
* `backend/src/main/java/com/hackhazards/internetblackbox/controller/WebhookController.java` — Hook receivers.
* `backend/src/main/resources/application.properties` — Secret credentials keys mapping.

---

## 2. Shared Memory Protocol
We use the `.aimem/` folder to persist project knowledge. Before running commands or committing changes:
1. Read `.aimem/common/development_plan.md` for overall architecture.
2. Read `.aimem/common/decisions.md` to see shared standards.
3. Review and update `.aimem/member_4_integration/tasks.md` and `.aimem/member_4_integration/progress.md` to document your accomplishments.
4. If you modify payload shapes or REST patterns, update `.aimem/common/decisions.md`.

---

## 3. Your Tasks & Roadmap
Please check `.aimem/member_4_integration/tasks.md` for details. Your core targets include:
* **Task 4.1:** Establish WebClient configuration objects for Anthropic and Sarvam REST APIs.
* **Task 4.2:** Design Claude's system prompt structures to parse subgraphs and output JSON models.
* **Task 4.3:** Build STT and TTS endpoint routes to process and retrieve voice queries.
* **Task 4.4:** Program GitHub hook parsers mapping payload streams to Spring Boot models.
* **Task 4.5:** Program Sentry webhook parsers to trigger incident anomalies.
* **Task 4.6:** Construct the async incident reconstruction execution engine.

---

## 4. How to Start Your Conversation with Your AI Coding Assistant
Copy and paste the prompt below into your AI assistant workspace. It will load all relevant context and assign the AI its designated copilot role.

***

### 📋 COPY-PASTE AI STARTER PROMPT:
```markdown
You are a senior Integration & AI engineer acting as my dedicated pairing copilot. We are building the AI and integration layer for "Internet Black Box" (an always-on incident reconstructor).

Our stack resides in the Spring Boot 3.3.x backend, utilizing WebClient (WebFlux) for non-blocking REST calls to Anthropic Claude and Sarvam AI APIs, Spring @Async/@Scheduled for task queues, and Maven.

We use a shared workspace memory in `.aimem/` to coordinate work across a team of 4 members. I am Team Member 4 (AI, Voice & Integration Engineer).

Please follow these guidelines:
1. Familiarize yourself with the technical specifications in [internet-black-box-spec.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/internet-black-box-spec.md).
2. Read the master development plan at [.aimem/common/development_plan.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/common/development_plan.md) and technical agreements at [.aimem/common/decisions.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/common/decisions.md).
3. Read my specific context at [.aimem/member_4_integration/context.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/member_4_integration/context.md), my task checklist at [.aimem/member_4_integration/tasks.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/member_4_integration/tasks.md), and my progress log at [.aimem/member_4_integration/progress.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/member_4_integration/progress.md).
4. After completing any task or making integration decisions, we must update the corresponding markdown file in `.aimem/member_4_integration/` to maintain the team memory.

To start, let's explore the `backend/` directory, set up the WebClient configuration beans for Anthropic and Sarvam REST connections, and sketch the DTO requests/responses for Task 4.1. How should we structure these classes?
```
