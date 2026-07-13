package com.hackhazards.internetblackbox.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackhazards.internetblackbox.dto.EventDto;
import com.hackhazards.internetblackbox.dto.IncidentDto;
import com.hackhazards.internetblackbox.dto.anthropic.ReconstructionReport;
import com.hackhazards.internetblackbox.dto.nvidia.NvidiaChatRequest;
import com.hackhazards.internetblackbox.dto.nvidia.NvidiaChatResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Service
public class NvidiaLlmService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${nvidia.model:meta/llama-3.1-70b-instruct}")
    private String nvidiaModel;

    @Value("${use.mock.data:false}")
    private boolean useMockData;

    public NvidiaLlmService(@Qualifier("nvidiaWebClient") WebClient webClient, ObjectMapper objectMapper) {
        this.webClient = webClient;
        this.objectMapper = objectMapper;
    }

    /**
     * Reconstructs an incident based on its context and the events surrounding it.
     *
     * @param incident the incident metadata
     * @param events   the list of events (subgraph) around the incident time window
     * @return a Mono containing the parsed ReconstructionReport
     */
    public Mono<ReconstructionReport> reconstructIncident(IncidentDto incident, List<EventDto> events) {
        if (useMockData) {
            log.info("USE_MOCK_DATA is true, returning mock reconstruction report");
            ReconstructionReport.TimelineEntry e1 = ReconstructionReport.TimelineEntry.builder()
                    .timestamp("2026-07-12T14:00:00Z")
                    .eventId("ev-92")
                    .eventType("PullRequest")
                    .content("PR #92: Update Auth Middleware")
                    .actorName("Sarah Jenkins")
                    .source("github")
                    .causalAnnotation("Sarah Jenkins merged PR #92 which modified the auth middleware, breaking backward compatibility of JWT tokens.")
                    .build();

            ReconstructionReport.TimelineEntry e2 = ReconstructionReport.TimelineEntry.builder()
                    .timestamp("2026-07-12T14:15:00Z")
                    .eventId("ev-93")
                    .eventType("Deployment")
                    .content("Deployment to production")
                    .actorName("Raj Patel")
                    .source("github")
                    .causalAnnotation("Deployment of the changes in PR #92 to production environment.")
                    .build();

            ReconstructionReport.TimelineEntry e3 = ReconstructionReport.TimelineEntry.builder()
                    .timestamp("2026-07-12T14:20:00Z")
                    .eventId("ev-94")
                    .eventType("Message")
                    .content("Slack Alert: Outage reported in #ops channel")
                    .actorName("Raj Patel")
                    .source("slack")
                    .causalAnnotation("Team noticed the API was returning 500 errors after deployment.")
                    .build();

            ReconstructionReport.TimelineEntry e4 = ReconstructionReport.TimelineEntry.builder()
                    .timestamp("2026-07-12T14:25:00Z")
                    .eventId("ev-95")
                    .eventType("Alert")
                    .content("Sentry error: InvalidTokenException in auth middleware")
                    .actorName("Sentry Bot")
                    .source("sentry")
                    .causalAnnotation("Sentry captured a sudden spike in JWT verification errors.")
                    .build();

            ReconstructionReport.RootCauseInfo rootCause = ReconstructionReport.RootCauseInfo.builder()
                    .description("PR #92 merged by Sarah Jenkins modified the auth middleware and broke backward compatibility of JWT tokens, causing all subsequent API requests with existing tokens to fail.")
                    .confidenceScore(0.92)
                    .evidence(List.of("ev-92", "ev-95"))
                    .build();

            ReconstructionReport.PersonActivity p1 = ReconstructionReport.PersonActivity.builder()
                    .name("Sarah Jenkins")
                    .actions(List.of("Merged PR #92 modifying auth middleware"))
                    .roleInChain("Introduced the breaking auth change")
                    .build();

            ReconstructionReport.PersonActivity p2 = ReconstructionReport.PersonActivity.builder()
                    .name("Raj Patel")
                    .actions(List.of("Triggered production deployment", "Reported outage in #ops channel"))
                    .roleInChain("Deployed the breaking release and monitored system status")
                    .build();

            ReconstructionReport report = ReconstructionReport.builder()
                    .timeline(List.of(e1, e2, e3, e4))
                    .rootCause(rootCause)
                    .peopleInvolved(List.of(p1, p2))
                    .prevention(List.of(
                            "Add unit tests for auth middleware token backward compatibility.",
                            "Verify JWT verification against older token versions in staging.",
                            "Implement canary deployments for critical security middleware updates."
                    ))
                    .build();

            return Mono.just(report);
        }

        String systemPrompt = buildSystemPrompt();
        String userPrompt = buildUserPrompt(incident, events);

        NvidiaChatRequest.Message systemMsg = NvidiaChatRequest.Message.builder()
                .role("system")
                .content(systemPrompt)
                .build();

        NvidiaChatRequest.Message userMsg = NvidiaChatRequest.Message.builder()
                .role("user")
                .content(userPrompt)
                .build();

        NvidiaChatRequest request = NvidiaChatRequest.builder()
                .model(nvidiaModel)
                .messages(List.of(systemMsg, userMsg))
                .temperature(0.2)
                .maxTokens(4000)
                .build();

        log.info("Sending incident reconstruction request to Nvidia NIM AI ({}) for incident: {}", nvidiaModel, incident.getId());

        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(NvidiaChatResponse.class)
                .flatMap(response -> {
                    if (response.getChoices() == null || response.getChoices().isEmpty()) {
                        return Mono.error(new IllegalStateException("Empty response choices from Nvidia NIM LLM"));
                    }
                    String textResponse = response.getChoices().get(0).getMessage().getContent();
                    return parseReport(textResponse);
                })
                .doOnError(error -> log.error("Failed to reconstruct incident via Nvidia NIM LLM: {}", error.getMessage(), error));
    }

    /**
     * Sends a general-purpose prompt to the LLM and returns the raw text response.
     */
    public Mono<String> askLlm(String systemPrompt, String userPrompt) {
        if (useMockData) {
            log.info("USE_MOCK_DATA is true, returning mock LLM response");
            return Mono.just("Mock LLM Response: Based on system context, PR #92 merged by Sarah Jenkins modified the auth middleware and broke backward compatibility of JWT tokens.");
        }
        NvidiaChatRequest.Message systemMsg = NvidiaChatRequest.Message.builder()
                .role("system")
                .content(systemPrompt)
                .build();

        NvidiaChatRequest.Message userMsg = NvidiaChatRequest.Message.builder()
                .role("user")
                .content(userPrompt)
                .build();

        NvidiaChatRequest request = NvidiaChatRequest.builder()
                .model(nvidiaModel)
                .messages(List.of(systemMsg, userMsg))
                .temperature(0.5)
                .maxTokens(1000)
                .build();

        log.info("Sending general query to Nvidia NIM AI ({})", nvidiaModel);

        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(NvidiaChatResponse.class)
                .map(response -> {
                    if (response.getChoices() == null || response.getChoices().isEmpty()) {
                        throw new IllegalStateException("Empty response choices from Nvidia NIM LLM");
                    }
                    return response.getChoices().get(0).getMessage().getContent();
                })
                .doOnError(error -> log.error("Failed to query Nvidia NIM LLM: {}", error.getMessage(), error));
    }

    private String buildSystemPrompt() {
        return "You are an expert incident investigator for software teams. You analyze sequences of digital events " +
                "and reconstruct what happened during a software incident.\n" +
                "You reason like a forensic analyst — following the evidence, identifying causal relationships, " +
                "and explaining events in a clear, chronological narrative.\n\n" +
                "CRITICAL GUIDELINES:\n" +
                "1. You must respond strictly in JSON format. Do not write any conversational intro, outro, or explanation outside the JSON.\n" +
                "2. Your JSON output must match this exact schema:\n" +
                "{\n" +
                "  \"timeline\": [\n" +
                "    {\n" +
                "      \"timestamp\": \"ISO-8601 string\",\n" +
                "      \"event_id\": \"id of the event\",\n" +
                "      \"event_type\": \"type of event\",\n" +
                "      \"content\": \"brief summary of event\",\n" +
                "      \"actor_name\": \"name of actor\",\n" +
                "      \"source\": \"github/slack/sentry\",\n" +
                "      \"causal_annotation\": \"explanation of how this event relates to the incident causal chain\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"root_cause\": {\n" +
                "    \"description\": \"Detailed explanation of the root cause\",\n" +
                "    \"confidence_score\": 0.85,\n" +
                "    \"evidence\": [\"id of event representing commit\", \"id of event representing Sentry alert\"]\n" +
                "  },\n" +
                "  \"people_involved\": [\n" +
                "    {\n" +
                "      \"name\": \"Sarah Jenkins\",\n" +
                "      \"actions\": [\"Merged PR #412 modifying auth middleware\"],\n" +
                "      \"role_in_chain\": \"Introduced the regression that caused the outage\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"prevention\": [\n" +
                "    \"Measure 1: Add unit tests for middleware routes.\",\n" +
                "    \"Measure 2: Setup integration tests in staging.\",\n" +
                "    \"Measure 3: Configure alert thresholds in Sentry.\"\n" +
                "  ]\n" +
                "}\n" +
                "3. Analyze temporal proximity, explicit mentions (e.g. in Slack), affected systems, and files modified to form hypotheses.";
    }

    private String buildUserPrompt(IncidentDto incident, List<EventDto> events) {
        StringBuilder sb = new StringBuilder();
        sb.append("<guidelines>\n")
          .append("Analyze the following incident and events to reconstruct the causal chain.\n")
          .append("Establish links between commits, deployments, communications, and alerts. Output ONLY the JSON matching the system schema.\n")
          .append("</guidelines>\n\n");

        sb.append("<incident_context>\n")
          .append("ID: ").append(incident.getId()).append("\n")
          .append("Title: ").append(incident.getTitle()).append("\n")
          .append("Type: ").append(incident.getType()).append("\n")
          .append("Triggered At: ").append(incident.getTriggeredAt()).append("\n")
          .append("Triggered By: ").append(incident.getTriggeredBy()).append("\n")
          .append("Severity: ").append(incident.getSeverity()).append("\n")
          .append("Description: ").append(incident.getDescription()).append("\n")
          .append("</incident_context>\n\n");

        sb.append("<events>\n");
        for (EventDto event : events) {
            sb.append(String.format("- [ID: %s] %s | Type: %s | Source: %s | Actor: %s (%s) | Severity: %s | Content: %s | Metadata: %s\n",
                    event.getId(),
                    event.getTimestamp(),
                    event.getType(),
                    event.getSource(),
                    event.getActorName(),
                    event.getActorEmail(),
                    event.getSeverity(),
                    event.getContent(),
                    event.getMetadata()
            ));
        }
        sb.append("</events>");

        return sb.toString();
    }

    private Mono<ReconstructionReport> parseReport(String rawContent) {
        return Mono.defer(() -> {
            try {
                String cleanJson = rawContent.trim();
                // If the LLM wrapped the output in markdown code blocks, strip them
                if (cleanJson.startsWith("```")) {
                    int startIdx = cleanJson.indexOf("{");
                    int endIdx = cleanJson.lastIndexOf("}");
                    if (startIdx != -1 && endIdx != -1) {
                        cleanJson = cleanJson.substring(startIdx, endIdx + 1);
                    }
                }
                ReconstructionReport report = objectMapper.readValue(cleanJson, ReconstructionReport.class);
                return Mono.just(report);
            } catch (Exception e) {
                log.error("Failed to parse ReconstructionReport from LLM content: {}. Raw content was: {}", e.getMessage(), rawContent);
                return Mono.error(new IllegalArgumentException("Failed to parse LLM response to JSON: " + e.getMessage(), e));
            }
        });
    }
}
