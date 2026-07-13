<img width="4320" height="1440" alt="hh26 main poster 2 with sponsors 3x1 (4320 x 1440 px) (2)" src="https://github.com/user-attachments/assets/c698b2cd-da84-4cb0-9276-125c6a7244aa" />


# 🚀 Internet Black Box

> The Causal Aircraft Black Box for Software Teams - Passively mapping git, communications, and telemetry into an always-on incident reconstructor.

---

## 📌 Problem & Domain

When critical production systems crash at 3 AM, engineering teams face a forensic challenge. Logs detail *what* broke, but they fail to answer *why* or *who* was involved without hours of manual reconstruction. Engineers must align git history, Sentry errors, Slack discussions, and deployment logs across isolated silos.

Internet Black Box solves this by creating a unified property graph that maps all digital footprints, enabling instant AI-driven root-cause inference.

**Themes Selected (at least one):**
- [x] Developer Tools & Software Infrastructure  
- [x] Trust, Identity & Security  
- [x] Work, Finance & Digital Economy  

---

## 🎯 Objective

What problem does your project solve, and who does it serve?  
- **Target Users**: On-call engineers, Site Reliability Engineers (SREs), Tech Leads, and Incident Responders.
- **The Pain Point**: High Mean Time to Resolution (MTTR) caused by fragmented, siloed information during outages.
- **Value Provided**: Internet Black Box automatically captures webhook telemetry, compiles relationships into a Neo4j causal graph, and generates instant timeline summaries. It cuts diagnostic latency from hours to seconds.

---

## 🧠 Team & Approach

### Team Name:  
`Team Arete`

### Team Members:  
- Nayana Shaji Mekkunnel (https://www.linkedin.com/in/nayana-shaji-394124320)
- Gabriel James (https://www.linkedin.com/in/gabrieljamesamara)
- Jany Sabarinath (https://www.linkedin.com/in/jany-sabarinath-b38192317)
- Vrindha P (https://www.linkedin.com/in/vrindha-p)

### Your Approach:
- **Why this problem**: We wanted to address the mental strain and operational cost of developer on-call shifts. Standard tools store data in flat temporal silos, leaving human operators to stitch references together.
- **Key Challenges**: Linking unstructured chat text (Slack) to structured entities (Git commits) and parsing high-throughput webhooks under 100ms.
- **Breakthroughs**: Modeling causality as a directed graph in Neo4j. By utilizing index-free adjacency path-finding, we can run constant-time Cypher queries that trace outages directly back to PR authors, entirely bypassing expensive SQL JOIN performance hits.

---

## 🛠️ Tech Stack

### Core Technologies Used:
- **Frontend**: React 19, Tailwind CSS v4, Zustand, Recharts, Lucide Icons
- **Backend**: Spring Boot 3.3.0, Spring WebFlux (Reactive WebClient)
- **Database**: Neo4j AuraDB (Property Graph Database), Spring Data Neo4j
- **APIs**: Sarvam AI API (Multilingual TTS & STT), Anthropic Claude API (AI reconstruction logic)
- **Hosting**: Local execution with Cloud-backed Database (AuraDB)

### Additional Technologies Used (Optional):
- [x] AI / ML (Large Language Model context matching and summaries)
- [x] Cyber Security (Sanitization engines for scrubbing PII before graph injection)

---

## 🏆 Sponsored Track (Optional)

Select if your project participates in any track:

- [x] **Expo Track** – Built using Expo  
- [x] **Neo4j Track** – Uses AuraDB as primary database  
- [x] **Render Track** – Background data ingestion workflows  
- [x] **Sarvam Track** – Voice-powered incident intelligence  

Provide a short note on how you used the partner technology:

> **Neo4j AuraDB**: Our core datastore. We model developers, git commits, code diffs, Sentry exceptions, and incidents as graph nodes. We establish causal relationships using `:AUTHORED`, `:TRIGGERED`, and `:AFFECTED` edges. This enables us to query the exact shortest path between a Sentry exception spike and the originating Git PR.
>
> **Expo**: We built a mobile companion app for on-call engineers. It provides push-notification alerts of active outages, visual timeline paths, and implements Sarvam voice query search, letting developers review incident context hands-free while away from their desks.
>
> **Render Workflows**: We use Render Workflows for continuous, reliable background processing. Different workflows handle GitHub, Slack, and Google Meet ingestion, event normalization, and the core incident reconstruction logic via Anthropic Claude.
>
> **Sarvam AI**: We integrated Sarvam to provide voice-first incident management. This allows on-call engineers to trigger incidents via voice, query past incidents in natural language, and receive audio incident briefings in multiple languages.

---

## ✨ Key Features

- ⚙ **Passive Telemetry webhooks**: Webhook processors capture GitHub merges, Slack channel discussions, and Sentry alerts in real-time.
- ⚡ **Neo4j Cypher Path-Finding**: Traces root causes in constant time using `shortestPath` graph traversals.
- 🎙 **Sarvam Multilingual Voice Briefings**: Synthesizes custom speech summaries of incidents in English, Hindi, and Tamil, supporting natural language audio queries.
- 📱 **Expo Mobile Client**: Clean, reactive mobile viewport for live incident monitoring and rollback triggers.
- 🔒 **PII Redaction Pipeline**: Security-first sanitization engine that scrubs keys, passwords, and sensitive values before database serialization.

---

## 📽 "Demo & Deliverables"

- **Demo Video Link (Mandatory):** [Paste link here]  
- **Deployment Link (Recommended):** [Vite Web Dashboard Port 5173](http://localhost:5173)  
- **Pitch Deck / PPT (Optional):** [Paste link here]  

---

## ✅ Tasks & Bonus Checklist

- [x] All team members completed the mandatory social task  

---

## 🧪 How to Run the Project

### Requirements:
- Java 17 (JDK)
- Node.js 18+ & npm
- Maven 3.8+
- Neo4j AuraDB account (or local Neo4j instance)
- API Keys: Anthropic Claude key, Sarvam AI voice token

### Local Setup:

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd "Internet Black Box"
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   NEO4J_URI=neo4j+s://<your-auradb-id>.databases.neo4j.io
   NEO4J_USERNAME=neo4j
   NEO4J_PASSWORD=<your-auradb-password>
   ANTHROPIC_API_KEY=<your-claude-api-key>
   SARVAM_API_KEY=<your-sarvam-voice-key>
   ```

3. **Run Ingestion Backend (Spring Boot)**:
   ```bash
   cd backend
   mvn clean spring-boot:run
   ```
   *The backend will boot up on port `8080` and connect to your Neo4j database (with local mock fallbacks if offline).*

4. **Run Web Dashboard (React)**:
   ```bash
   cd ../web-dashboard
   npm install
   npm run dev
   ```
   *The frontend dashboard will launch at `http://localhost:5173/`.*

5. **Run Mobile App (Expo)**:
   ```bash
   cd ../mobile-app
   npm install
   npx expo start --web
   ```

---

## 🧬 Future Scope

- 📈 **More Integrations**: Adapters for Datadog metrics, AWS CloudTrail audits, GCP audit logs, and Kubernetes cluster events.
- 🛡 **Security Enhancements**: Supporting WORM (Write-Once-Read-Many) storage on Neo4j for tamper-proof compliance tracking.
- 🌐 **Expanded Voice Support**: Localizing the Sarvam NLP matching engine for more Indian regional dialects.

---

## 📎 Resources / Credits

- **Neo4j Graph Database**: [Neo4j AuraDB](https://neo4j.com/cloud/platform/auradb/)
- **Sarvam AI Voice API**: [Sarvam AI](https://sarvam.ai)
- **Anthropic Claude Engine**: [Anthropic Claude](https://anthropic.com)
- **UI Icons**: [Lucide React](https://lucide.dev)

---

## 🏁 Final Words

Building a multi-dimensional causal database and speech-based forensic assistant under hackathon constraints was an incredible experience. Bridging the gap between reactive backends, property graph databases, and voice synthesis showed us the future of site reliability diagnostics!

---
