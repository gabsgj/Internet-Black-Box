# AI, Voice & Integration Context
* **Role:** AI, Voice & Integration Engineer
* **Scope:** Claude prompt engineering, Sarvam STT/TTS calls, background workflows/scheduling, API connectors, and webhook logic.
* **Tech Stack:** Spring WebClient, Anthropic Claude SDK/REST, Sarvam REST endpoints, Sentry webhook schema, Slack Events SDK, GitHub API.

## Context Details
* You own the "intelligence" of the system. You write the prompts that go to Claude Sonnet to convert a graph of events into a coherent incident story.
* You integrate the Sarvam AI endpoints. When the mobile app sends audio bytes, you call Sarvam STT to translate it to text, send the query to the DB/LLM, and compile the text response back to speech using Sarvam TTS.
* You handle the webhook ingest parsing. When a webhook arrives at `/api/webhooks/*`, you parse the specific JSON schema (GitHub, Slack, Sentry) and call the backend services to persist the events and update graph relationships.
