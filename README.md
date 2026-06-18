# Internet Black Box
### The Aircraft Black Box for Software Teams

An always-on digital evidence collector and AI-powered incident reconstructor. Internet Black Box passively ingests events from Slack, GitHub, and Sentry, models them as a causal graph in Neo4j, and uses Claude AI to trace the chain of causality during outages or breaches.

---

## 🚀 Quick Start & Environment Configuration

1. **Clone the Repository** and navigate to the root directory.
2. **Setup Secrets:** Duplicate the env template and customize your connection keys:
   ```bash
   cp .env.example .env
   ```
   Open [`.env`](file:///.env) and populate it with your local/cloud Neo4j AuraDB credentials, Anthropic API key, and Sarvam AI voice tokens.

---

## 📂 Project Structure

This workspace is divided into three execution contexts and a shared team memory configuration:

* [**`backend/`**](file:///Users/gabriel/Projects/Internet%20Black%20Box/backend): Java 17 + Spring Boot 3.3.x Maven application. Hosts ingestion controllers, Neo4j entities/repositories, WebClient integrations, and the asynchronous reconstruction engine.
* [**`web-dashboard/`**](file:///Users/gabriel/Projects/Internet%20Black%20Box/web-dashboard): React + Vite + TypeScript single-page application. Features interactive graph canvas rendering using Sigma.js and timeline trackers.
* [**`mobile-app/`**](file:///Users/gabriel/Projects/Internet%20Black%20Box/mobile-app): Expo React Native application with TypeScript navigation. Hosts the mobile incident feeds and the `expo-av` microphone query tab.
* [**`.aimem/`**](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem): Team Memory and Roadmap system. Keeps shared contexts, developer decisions, and task lists updated across all members.

---

## 👥 Developer Onboarding Guide

Development tasks are split between 4 team members to allow simultaneous work without collisions. Select your role below and open your onboarding instructions:

1. **Core Backend & Database Engineer (Member 1)**
   * Focus: Spring Data Neo4j mappings, REST APIs, and Cypher path-finding.
   * Instructions: See [member_1_backend_instructions.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/member_1_backend_instructions.md)
2. **Frontend Dashboard Engineer (Member 2)**
   * Focus: Dashboard analytics, Recharts, and Sigma.js/Graphology canvas.
   * Instructions: See [member_2_frontend_instructions.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/member_2_frontend_instructions.md)
3. **Mobile App Engineer (Member 3)**
   * Focus: On-call views, push alerts, and device microphone integrations.
   * Instructions: See [member_3_mobile_instructions.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/member_3_mobile_instructions.md)
4. **AI, Voice & Integration Engineer (Member 4)**
   * Focus: Claude prompt engineering, Sarvam TTS/STT, and webhook parsers.
   * Instructions: See [member_4_integration_instructions.md](file:///Users/gabriel/Projects/Internet%20Black%20Box/member_4_integration_instructions.md)

---

## 🧪 Shared Testing Sandbox
To test interfaces offline or mock components during early sprints, reference the causal database graph payload stored in [`.aimem/common/mock_incident_data.json`](file:///Users/gabriel/Projects/Internet%20Black%20Box/.aimem/common/mock_incident_data.json). This outlines the target demo checkout latency scenario (PR validation bug merged by Sarah -> deployed to main -> Sentry 500 alert spike).

---

## 🏗️ Building & Launching

### Ingestion Backend (Spring Boot)
Requires JDK 17+ and Maven:
```bash
cd backend
mvn spring-boot:run
```

### Web Dashboard (React)
```bash
cd web-dashboard
npm install
npm run dev
```

### On-Call App (Expo Mobile)
```bash
cd mobile-app
npm install
npm run web  # Or 'npm run ios' / 'npm run android'
```
