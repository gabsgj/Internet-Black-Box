# 🎬 Internet Black Box — Demo Video Script
### HackHazards '26 Submission · Team Arete
**Target Duration:** 2 min 45 sec – 3 min 15 sec  
**Tone:** Calm, confident, technical — think Stripe / Linear product videos.  
**Voiceover style:** Single narrator. Clear diction. No filler words.

---

## PRE-PRODUCTION NOTES

| Element | Recommendation |
|---|---|
| Screen recorder | Loom / OBS @ 1920×1080 60fps |
| Voiceover mic | Any condenser or quality headset, quiet room |
| BGM | Soft lo-fi or ambient electronic (no drums) — 20% volume |
| Editing | CapCut / DaVinci Resolve — cut on breath pauses |
| Captions | Auto-subtitle (recommended for silent viewers) |

---

## SCENE 1 — THE HOOK  *(0:00 – 0:22)*

**[ON SCREEN]** Black screen. Slow fade in to a terminal window showing a cascade of red error logs scrolling at 2 AM. Clock in the corner reads 02:17 AM.

**[VOICEOVER]**
> "It's 2 AM. Your production system just went down.  
> You have alerts firing in Sentry, panic in the Slack war room, and a dozen commits from today that could be the culprit.  
> Where do you even start?"

**[ON SCREEN]** Cut to: a frantic engineer opening tab after tab — GitHub, Datadog, Slack, Sentry — all disconnected.

**[VOICEOVER]**
> "This is the problem every on-call engineer faces. And it costs teams an average of **4.2 hours** — and $300,000 — every single time."

---

## SCENE 2 — PRODUCT INTRO  *(0:22 – 0:40)*

**[ON SCREEN]** Smooth cut to the Internet Black Box web dashboard landing — dark, clean, minimal. Logo fades in.

**[VOICEOVER]**
> "Meet **Internet Black Box.**  
> The aircraft black box — for software teams."

**[ON SCREEN]** The tagline animates in: *"Causal incident reconstruction — hands-free, instant, autonomous."*

**[VOICEOVER]**
> "We passively map your Git commits, Slack threads, and production alerts into a live causal event graph — powered by Neo4j.  
> When something breaks, we already know why."

---

## SCENE 3 — LIVE INCIDENT DASHBOARD  *(0:40 – 1:05)*

**[ON SCREEN]** Navigate to the **Incidents** page. A list of recent incidents is visible. Click into one titled *"Payment Service Outage — 02:14 AM"*.

**[VOICEOVER]**
> "Let's say a payment service outage just triggered.  
> The moment an incident is created, our background reconstruction engine fires."

**[ON SCREEN]** The incident detail page is shown — status shows `RECONSTRUCTING` with a live progress indicator cycling through stages.

**[VOICEOVER]**
> "It queries a 4-hour temporal window in Neo4j — pulling commits, pull request merges, Slack messages, and Sentry alerts — and builds a causal subgraph in real time."

**[ON SCREEN]** Status flips to `COMPLETE`. The AI-generated incident timeline appears — a structured, readable narrative linking a specific commit to the crash.

**[VOICEOVER]**
> "In under 30 seconds — we have the full causal story."

---

## SCENE 4 — CAUSAL GRAPH VISUALISATION  *(1:05 – 1:28)*

**[ON SCREEN]** Click the **"View Causal Graph"** button. The Sigma.js interactive graph animates in — nodes in distinct colors: blue for People, yellow for Events, red for Systems, orange for the Incident.

**[VOICEOVER]**
> "Here's the causal event graph — rendered directly from Neo4j AuraDB.  
> Each node is an entity. Each edge is a causal relationship."

**[ON SCREEN]** Hover over the orange incident node. The connected path highlights — tracing through a deployment node, a pull request node, and landing on a blue developer node.

**[VOICEOVER]**
> "This PR — merged at 11:47 PM — touched the payment gateway config.  
> The deployment at 12:02 AM pushed it to production.  
> By 2:14 AM, the payment service was down.  
> The Black Box traced this in **under 50 milliseconds**."

---

## SCENE 5 — VOICE QUERY ON MOBILE  *(1:28 – 1:55)*

**[ON SCREEN]** Switch to phone screen recording. Open the **Internet Black Box mobile app** (Expo).  
The Incidents tab shows the same outage with a push notification banner at the top.

**[VOICEOVER]**
> "But what if you're not at your laptop?  
> Our Expo mobile app received the push alert the moment the incident was created."

**[ON SCREEN]** Tap the **Voice Query** microphone button. Speak:  
*"What broke on the payment service last night?"*

**[VOICEOVER]**
> "Using **Sarvam AI's speech-to-text**, the query is parsed and fired against the Neo4j graph."

**[ON SCREEN]** A response appears as text — and then audio plays back automatically.

**[VOICEOVER]**
> "Sarvam's text-to-speech then reads the causal summary back — in English or Hindi — hands-free.  
> No laptop. No dashboards. Just answers."

---

## SCENE 6 — INTEGRATIONS & DATA INGESTION  *(1:55 – 2:18)*

**[ON SCREEN]** Navigate to **Settings → Integrations** in the web dashboard. GitHub and Slack toggle cards are shown.

**[VOICEOVER]**
> "Setup is a one-time connection. Link your GitHub organisation and your Slack workspace —  
> and Internet Black Box quietly begins mapping your engineering activity in the background."

**[ON SCREEN]** Show the Integrations page — GitHub connected, Slack connected. A small "Last synced 2 min ago" label is visible.

**[VOICEOVER]**
> "Our Render-hosted cron workers sync GitHub every 5 minutes.  
> Slack messages stream in via webhooks — with automatic PII scrubbing before anything is stored."

---

## SCENE 7 — THE ARCHITECTURE SLIDE  *(2:18 – 2:38)*

**[ON SCREEN]** Brief cut to a clean architecture diagram (or the PPT slide 3 — Neo4j graph slide).

**[VOICEOVER]**
> "Under the hood:  
> A **Spring Boot** reactive API on Render.  
> **Neo4j AuraDB** as the causal event graph — with index-free adjacency for constant-time traversals.  
> **NVIDIA NIM** running LLaMA 3.1 70B to synthesise the incident narrative.  
> And **Sarvam AI** powering the multilingual voice interface."

---

## SCENE 8 — CLOSING  *(2:38 – 2:58)*

**[ON SCREEN]** Return to the web dashboard home. The logo and tagline are centred.

**[VOICEOVER]**
> "Every major outage leaves a trail.  
> Git commits, Slack messages, deployment logs, error spikes —  
> all the evidence was always there.  
> **Internet Black Box simply connects the dots — before you even have to ask.**"

**[ON SCREEN]** Fade to the cover slide: *"INTERNET BLACK BOX — Team Arete — HackHazards '26"*

**[VOICEOVER]**
> "You don't piece together 11 tools at 2 AM.  
> You ask the Black Box."

**[ON SCREEN]** Final card with GitHub repo link and team names. Soft fade to black.

---

## TIMING BREAKDOWN

| Scene | Duration | Cumulative |
|---|---|---|
| 1 — The Hook | 22 sec | 0:22 |
| 2 — Product Intro | 18 sec | 0:40 |
| 3 — Live Incident Dashboard | 25 sec | 1:05 |
| 4 — Causal Graph Visualisation | 23 sec | 1:28 |
| 5 — Voice Query on Mobile | 27 sec | 1:55 |
| 6 — Integrations | 23 sec | 2:18 |
| 7 — Architecture | 20 sec | 2:38 |
| 8 — Closing | 20 sec | 2:58 |

---

## RECORDING TIPS

> [!TIP]
> Record the voiceover **separately** from the screen recording. Mix in post so you can re-record either without redoing both.

> [!TIP]
> Slow your mouse movements down — viewer's eyes need time to follow. Aim for 1 sec of deliberate hover before each click.

> [!IMPORTANT]
> The **causal graph animation** (Scene 4) is your money shot — record it multiple times and use the cleanest take.

> [!NOTE]
> If you can't show the mobile screen recording cleanly, use a phone mockup frame overlay in CapCut or Canva for the Expo scenes.

---

*Script by Team Arete · HackHazards '26*
