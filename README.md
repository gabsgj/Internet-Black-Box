<img width="4320" height="1440" alt="hh26 main poster 2 with sponsors 3x1 (4320 x 1440 px) (2)" src="https://github.com/user-attachments/assets/c698b2cd-da84-4cb0-9276-125c6a7244aa" />


# 🚀 Internet Black Box

> The Aircraft Black Box for Software Teams — passively mapping git, communications, and telemetry into an always-on, AI-powered incident reconstructor.

---

## 📌 Problem & Domain

Every software team, every week, loses significant time to one question: **"What happened?"**

A production outage takes down a service for 4 hours. The post-mortem meeting has 8 engineers staring at logs with no clear root cause. Git blame shows *what* changed, Slack shows *who* was talking, Sentry shows *what* broke — but **no tool connects the dots between them**. Engineers become forensic archaeologists, manually cross-referencing timestamps across a dozen isolated tools.

Internet Black Box eliminates this by building a **unified causal property graph** that links every commit, message, deployment, and alert together — so when something breaks, you traverse the graph instead of digging through rubble.

**Themes Selected:**
- [x] Developer Tools & Software Infrastructure  
- [x] Trust, Identity & Security  
- [x] Work, Finance & Digital Economy  

---

## 🎯 Objective

- **Target Users**: On-call engineers, Site Reliability Engineers (SREs), Tech Leads, and Incident Responders.
- **The Pain Point**: High Mean Time to Resolution (MTTR) caused by fragmented, siloed information during outages. Average incident resolution takes **4.2 hours**, with post-mortem reconstruction taking **2–5 days**.
- **Value Provided**: Internet Black Box automatically captures webhook telemetry from GitHub, Slack, and Sentry, compiles causal relationships into a Neo4j graph, and uses AI to generate instant timeline summaries with root cause identification — cutting diagnostic latency from **hours to seconds**.

---

## 🧠 Team & Approach

### Team Name:  
`Team Arete`

### Team Members:  
- [Nayana Shaji Mekkunnel](https://www.linkedin.com/in/nayana-shaji-394124320)  
- [Gabriel James](https://www.linkedin.com/in/gabrieljamesamara)  
- [Jany Sabarinath](https://www.linkedin.com/in/jany-sabarinath-b38192317)  
- [Vrindha P](https://www.linkedin.com/in/vrindha-p)  

### Your Approach:
- **Why this problem**: We wanted to address the mental strain and operational cost of developer on-call shifts. Standard tools store data in flat temporal silos, leaving human operators to stitch references together manually.
- **Key Challenges**: Linking unstructured chat text (Slack messages) to structured entities (Git commit SHAs) and parsing high-throughput webhooks under 100ms latency.
- **Breakthroughs**: Modeling causality as a directed graph in Neo4j. By utilizing index-free adjacency path-finding, we run constant-time Cypher queries that trace outages directly back to PR authors — entirely bypassing expensive SQL JOIN performance bottlenecks.

---

## 🛠️ Tech Stack

### Core Technologies Used:
- **Frontend**: React 19, Tailwind CSS v4, Zustand, Recharts, Sigma.js (graph visualization), Lucide Icons
- **Backend**: Spring Boot 3.3.0 (Java 17), Spring WebFlux (Reactive WebClient)
- **Database**: Neo4j AuraDB (Property Graph Database), Spring Data Neo4j
- **APIs**: NVIDIA NIM (LLaMA 3.1 70B — AI reconstruction), Sarvam AI (Multilingual TTS & STT)
- **Hosting**: Render (Web Service + Static Site + Cron Jobs + Background Workers)

### Additional Technologies Used:
- [x] **AI / ML** — Large Language Model context matching, causal timeline reconstruction, root cause analysis with confidence scoring
- [x] **Cyber Security** — PII sanitization engine that scrubs API keys, passwords, and sensitive values before graph injection

---

## 🏆 Sponsored Track

- [x] **Expo Track** – Built using Expo  
- [x] **Neo4j Track** – Uses AuraDB as primary database  
- [x] **Render Track** – Background data ingestion workflows  
- [x] **Sarvam Track** – Voice-powered incident intelligence  

### How we used each partner technology:

> **Neo4j AuraDB** — Our core datastore. Developers, commits, diffs, Sentry exceptions, and incidents are modeled as graph nodes. Causal relationships (`:AUTHORED`, `:TRIGGERED`, `:AFFECTED`, `:CAUSED_BY`) are edges. This enables single-query `shortestPath` traversals from a Sentry alert spike directly to the originating Git PR — something fundamentally impossible with relational databases.

> **Expo** — We built a mobile companion app for on-call engineers using Expo Router with file-based navigation. It provides real-time incident feeds, push-notification alerts, visual timeline paths, and a Sarvam voice query interface — letting developers review incident context hands-free.

> **Render Workflows** — We use Render for the full deployment ecosystem: a Web Service for the Spring Boot API, a Static Site for the React dashboard, a Cron Job for scheduled GitHub ingestion (every 5 min), and a Background Worker for the heavy 9-stage AI reconstruction pipeline — which takes 10–30 seconds and would timeout on serverless.

> **Sarvam AI** — Voice-first incident management. On-call engineers can trigger incidents via voice, query past incidents in natural language ("What happened to the payment service last night?"), and receive audio incident briefings in English and Hindi. Sarvam STT converts speech to query text, and Sarvam TTS reads the AI-generated timeline aloud.

---

## ✨ Key Features

- ⚙️ **Passive Telemetry Webhooks** — Webhook processors capture GitHub merges, Slack channel discussions, and Sentry alerts in real-time, without any manual input from the team.
- ⚡ **Neo4j Cypher Path-Finding** — Traces root causes in constant time using `shortestPath` graph traversals across the causal event graph.
- 🤖 **AI Incident Reconstruction** — 9-stage pipeline extracts a subgraph, ranks causal chains, and sends context to an LLM that generates a chronological timeline with root cause and prevention recommendations.
- 🎙️ **Sarvam Multilingual Voice Briefings** — Synthesizes speech summaries of incidents in multiple languages, supporting natural language audio queries for hands-free investigation.
- 📱 **Expo Mobile Client** — Clean, reactive mobile app for live incident monitoring, timeline viewing, voice queries, and incident creation from the field.
- 🔒 **PII Redaction Pipeline** — Security-first sanitization engine that scrubs keys, passwords, and sensitive values before database serialization.
- 📊 **Interactive Causal Graph** — Sigma.js-rendered visualization of the Neo4j subgraph: People (blue), Events (yellow), Systems (red), Incident (orange) — with labeled relationship edges.

---

## 📽️ Demo & Deliverables

- **Demo Video Link (Mandatory):** [Paste link here]  
- **Deployment Link (Recommended):** [http://localhost:5173](http://localhost:5173)  
- **Pitch Deck / PPT (Highly Recommended):** [Interactive HTML Slide Deck](http://localhost:5173/pitch-deck.html) (Download PowerPoint: [presentation.pptx](./presentation.pptx))  

---

## ✅ Tasks & Bonus Checklist

- [x] All team members completed the mandatory social task  

---

## 🧪 How to Run the Project

### Requirements:
- Java 17 (JDK)
- Node.js 18+ & npm
- Maven 3.8+
- Neo4j AuraDB account (or local Neo4j via Docker)
- API Keys: NVIDIA NIM key, Sarvam AI voice token

### Local Setup:

```bash
# 1. Clone the repository
git clone <repo-url>
cd "Internet Black Box"

# 2. Configure environment
cp .env.example .env
# Edit .env with your Neo4j, NVIDIA, and Sarvam credentials

# 3. Quick start (all services)
chmod +x start.sh
./start.sh
# → Opens http://localhost:5173 (Web Dashboard)
```

**Or run services individually:**

```bash
# Backend (Spring Boot) → http://localhost:8080
cd backend && mvn clean spring-boot:run

# Web Dashboard (React + Vite) → http://localhost:5173
cd web-dashboard && npm install && npm run dev

# Mobile App (Expo) → http://localhost:8081
cd mobile-app && npm install && npx expo start --web
```

> 📖 For full technical documentation with architecture diagrams, data models, and API reference, see **[DOCS.md](./DOCS.md)**.

---

## 🧬 Future Scope

- 📈 **More Integrations** — Adapters for Datadog metrics, AWS CloudTrail audits, GCP audit logs, and Kubernetes cluster events.
- 🛡️ **Security Enhancements** — WORM (Write-Once-Read-Many) storage on Neo4j for tamper-proof compliance tracking.
- 🌐 **Expanded Voice Support** — Localizing the Sarvam NLP matching engine for more Indian regional languages (Tamil, Telugu, Kannada, Bengali).
- 🔄 **Automated Anomaly Detection** — Proactive scheduled scans that auto-trigger incident reconstruction when event patterns deviate from baseline.

---

## 📎 Resources / Credits

- **Neo4j Graph Database** — [Neo4j AuraDB](https://neo4j.com/cloud/platform/auradb/)
- **Sarvam AI Voice API** — [Sarvam AI](https://sarvam.ai)
- **NVIDIA NIM** — [NVIDIA AI](https://build.nvidia.com)
- **Render Hosting** — [Render](https://render.com)
- **Expo Framework** — [Expo](https://expo.dev)
- **UI Icons** — [Lucide React](https://lucide.dev)

---

## 🏁 Final Words

Building a multi-dimensional causal database and speech-based forensic assistant under hackathon constraints was an incredible experience. The moment we watched a single `shortestPath` Cypher query trace an outage back through a Slack conversation, a Git commit, and a deployment — in under 50ms — we knew we'd built something meaningful. Bridging the gap between reactive backends, property graph databases, and voice synthesis showed us the future of site reliability diagnostics.

**When something goes wrong, you don't piece together 11 tools. You ask the Black Box.**

---
