# Shared Architectural & Technical Decisions

This document logs all team-wide decisions. Any modifications must be discussed and agreed upon by the affected team members.

---

## 1. Language & Runtime Standard
* **Backend:** Java 17 + Spring Boot 3.3.x.
* **Frontend:** TypeScript + React 18+ (Vite builder).
* **Mobile:** TypeScript + Expo (React Native).
* **Workflows/Integration:** Java-based Spring Boot Task Execution / Schedulers and external APIs.

---

## 2. Database Standard
* **Technology:** Neo4j (Graph Database).
* **Cloud Instance:** Neo4j AuraDB (Free Tier).
* **Local Developer Sandbox:** Docker container (`neo4j:5.20` or latest) running on `localhost:7687`.
* **Object-Graph Mapper (OGM):** Spring Data Neo4j (SDN 7.x).

---

## 3. Communication Protocols
* **Dashboard to Backend:** REST API for CRUD + WebSockets (Spring WebSocket session handlers) for real-time push updates.
* **Mobile to Backend:** REST API + WebSockets.
* **Ingestion Webhooks:** Standard HTTPS endpoints exposing `/api/webhooks/*` to receive GitHub, Slack, and Sentry triggers.

---

## 4. LLM & AI Strategy
* **LLM Engine:** Anthropic Claude (`claude-3-5-sonnet-20241022` or latest) via REST WebClient requests.
* **Reasoning Flow:** Under-incident subgraph extraction -> prompt construction -> JSON parser -> DB write-back of causality links.

---

## 5. Voice Intelligence
* **Engine:** Sarvam AI APIs.
* **Service endpoints:**
  - Speech-To-Text (STT): `saarika:v2` (for voice commands).
  - Text-To-Speech (TTS): `bulbul:v1` (for generating incident briefing mp3s).
* **Audio handling:** Mobile app records in standard AAC/WAV format, encodes as Base64, and POSTs to Spring Boot API.

---

## 6. Hosting & Environment
* **Platform:** Render.
* **Deployment Matrix:**
  - Ingest API: Web Service (Spring Boot jar execution).
  - Frontend: Static Site (React production build).
  - Neo4j DB: AuraDB.
  - Mobile App: Compiled through EAS (Expo Application Services) or run locally via Expo Go.
