# Team Member 2: Frontend Dashboard Engineer
## Onboarding & AI Integration Instructions

Welcome! As the **Frontend Dashboard Engineer**, you are responsible for constructing the Single Page Web Dashboard (React, Vite, TypeScript), graphing Neo4j subgraphs using Sigma.js, and integrating live incident analytics.

---

## 1. Project Directory Structure
All web application files reside inside the `web-dashboard/` folder:
* Run `npm install` inside `web-dashboard/` to get started.
* Compile and run the local development server using `npm run dev`.

---

## 2. Shared Memory Protocol
We use the `.aimem/` folder to persist project knowledge. Before running commands or committing changes:
1. Read `.aimem/common/development_plan.md` for overall architecture.
2. Read `.aimem/common/decisions.md` to see shared standards.
3. Review and update `.aimem/member_2_frontend/tasks.md` and `.aimem/member_2_frontend/progress.md` to document your accomplishments.
4. If you have updates to visual payloads or shared API DTO requirements, communicate with Member 1 and write the conclusions to `.aimem/common/decisions.md`.

---

## 3. Your Tasks & Roadmap
Please check `.aimem/member_2_frontend/tasks.md` for details. Your core targets include:
* **Task 2.1:** Configure styling and page routing layouts for the React app.
* **Task 2.2:** Design the Dashboard analytics page showing MTTR gauges and recent event streams.
* **Task 2.3:** Implement the Incident Detail screen featuring timeline cards.
* **Task 2.4:** Build the interactive Causal Graph Visualization canvas utilizing Sigma.js and Graphology.
* **Task 2.5:** Setup Zustand client stores to request data endpoints from the Spring Boot API.

---

## 4. How to Start Your Conversation with Your AI Coding Assistant
Copy and paste the prompt below into your AI assistant workspace. It will load all relevant context and assign the AI its designated copilot role.

***

### 📋 COPY-PASTE AI STARTER PROMPT:
```markdown
You are a senior React & Frontend developer acting as my dedicated pairing copilot. We are building the web dashboard for "Internet Black Box" (an always-on incident reconstructor). 

Our stack consists of React 18, Vite, TypeScript, Tailwind CSS, Sigma.js, Graphology, Recharts, and Zustand.

We use a shared workspace memory in `.aimem/` to coordinate work across a team of 4 members. I am Team Member 2 (Frontend Dashboard Engineer).

Please follow these guidelines:
1. Familiarize yourself with the technical specifications in [internet-black-box-spec.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/internet-black-box-spec.md).
2. Read the master development plan at [.aimem/common/development_plan.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/common/development_plan.md) and technical agreements at [.aimem/common/decisions.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/common/decisions.md).
3. Read my specific context at [.aimem/member_2_frontend/context.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/member_2_frontend/context.md), my task checklist at [.aimem/member_2_frontend/tasks.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/member_2_frontend/tasks.md), and my progress log at [.aimem/member_2_frontend/progress.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/member_2_frontend/progress.md).
4. After completing any task or making UI design choices, we must update the corresponding markdown file in `.aimem/member_2_frontend/` to maintain the team memory.

To start, let's explore the scaffolded project structure in `web-dashboard/`, install the required packages (Tailwind, Lucide, Recharts, Sigma, Graphology, Zustand), and design a premium dark mode dashboard wrapper. How should we set up the root layout and router configurations?
```
