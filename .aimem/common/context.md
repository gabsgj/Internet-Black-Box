# Project Context & Hackathon Alignment

This document outlines the core problem domain and hackathon rules.

---

## 1. Problem Statement
Software teams lose days tracking down the root causes of incidents (outages, security breaches, deployment failures) because evidence is trapped in independent silos:
* **Git commits** (code only)
* **Slack threads** (conversations without triggers)
* **Sentry logs** (errors without human actions)

**Internet Black Box** acts as a causal graph database that correlates these silos into a single timeline.

---

## 2. Sponsor Track Strategy

### A. Neo4j AuraDB (Core Database Track)
* **Goal:** Use Neo4j AuraDB as the primary persistence layer.
* **Architecture:** Ingest scripts map commits, messages, and Sentry alerts to Neo4j nodes. Cypher queries trace shortest paths between incidents and events to determine root cause.
* **Why it wins:** Causal graphs are naturally represented as nodes and edges. Relational databases are poorly suited for high-depth path traversals.

### B. Render Workflows (Automation Track)
* **Goal:** Automate scheduled ingestion jobs (GitHub, Sentry) and trigger asynchronous reconstruction.
* **Implementation:** Configured in the Spring Boot backend using Spring Task Schedulers and reactive workflows, running on Render containers.

### C. Sarvam AI (Voice Track)
* **Goal:** Allow voice command querying of recent incidents and play voice incident briefings.
* **Implementation:** Integrates Sarvam AI Bulbul and Saarika APIs.

### D. Expo (Mobile App Track)
* **Goal:** On-call alerts and timeline scrolling on mobile.
* **Implementation:** Expo React Native client using Router and Zustand.

---

## 3. Demo Target Scenario (For Presentation)
To showcase the product during the demo, the team will pre-load or simulate the following scenario:
1. **Change:** Sarah merges a pull request updating the auth validation logic (2:31 PM).
2. **Deploy:** The GitHub Action pipeline deploys this update to production (3:02 PM).
3. **Discussion:** Raj posts in Slack: "Getting higher response times on payment routes" (3:12 PM).
4. **Outage:** Sentry fires a critical alarm: `/api/pay` 500 error rate exceeded 89% (3:47 PM).
5. **Reconstruction:** Clicking "Reconstruct" on the dashboard creates an incident node, runs the shortest-path query between the Sentry error event and previous events, extracts the PR commit, feeds the subgraph to Claude, and produces:
   - "Auth validation update at 2:31 PM by Sarah caused backward token validation failure on checkout."
6. **Voice Query:** The user asks: "What caused the payment outage?" and hears the answer in English/Hindi via Sarvam.
