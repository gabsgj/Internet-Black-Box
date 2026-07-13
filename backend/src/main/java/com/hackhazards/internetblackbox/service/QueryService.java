package com.hackhazards.internetblackbox.service;

import com.hackhazards.internetblackbox.dto.TextQueryResponse;
import com.hackhazards.internetblackbox.dto.VoiceQueryResponse;
import com.hackhazards.internetblackbox.model.Event;
import com.hackhazards.internetblackbox.model.Incident;
import com.hackhazards.internetblackbox.repository.EventRepository;
import com.hackhazards.internetblackbox.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class QueryService {

    private final SarvamService sarvamService;
    private final NvidiaLlmService nvidiaLlmService;
    private final IncidentRepository incidentRepository;
    private final EventRepository eventRepository;

    /**
     * Answers a natural language text query about system state and recent incidents.
     */
    public Mono<TextQueryResponse> answerTextQuery(String query, String languageCode) {
        log.info("Processing text query: '{}'", query);

        String systemContext = getSystemContext();
        String systemPrompt = "You are a voice assistant for the Internet Black Box platform. " +
                "You answer questions from on-call engineers about recent commits, system events, Sentry alerts, and incident root causes.\n" +
                "Use the provided system context to answer their query accurately. " +
                "Keep your answers extremely concise (no more than 3 sentences) and conversational, as they will be spoken aloud.";

        String userPrompt = systemContext + "\n\nUser Question: " + query;

        return nvidiaLlmService.askLlm(systemPrompt, userPrompt)
                .map(answer -> TextQueryResponse.builder().answer(answer).build());
    }

    /**
     * Translates input audio, queries the system state via Claude, and synthesizes the response to audio.
     */
    public Mono<VoiceQueryResponse> answerVoiceQuery(byte[] audioBytes, String languageCode) {
        log.info("Processing voice query");

        // 1. STT -> Translate spoken audio to text
        return sarvamService.speechToText(audioBytes, languageCode)
                .flatMap(transcript -> {
                    log.info("Transcribed voice query: '{}'", transcript);
                    if (transcript.isBlank()) {
                        return Mono.just(VoiceQueryResponse.builder()
                                .transcript("")
                                .answer("Sorry, I could not hear or understand your audio.")
                                .audioBase64("")
                                .build());
                    }

                    // 2. Query processing -> Ask Claude based on context
                    return answerTextQuery(transcript, languageCode)
                            .flatMap(textResponse -> {
                                String answer = textResponse.getAnswer();
                                
                                // 3. TTS -> Synthesize answer back to speech
                                return sarvamService.textToSpeech(answer, languageCode)
                                        .map(synthesizedAudioBytes -> {
                                            String base64Audio = Base64.getEncoder().encodeToString(synthesizedAudioBytes);
                                            return VoiceQueryResponse.builder()
                                                    .transcript(transcript)
                                                    .answer(answer)
                                                    .audioBase64(base64Audio)
                                                    .build();
                                        });
                            });
                });
    }

    /**
     * Collects and formats recent events and incidents to feed as context to the LLM.
     */
    private String getSystemContext() {
        List<Incident> incidents;
        List<Event> events;
        try {
            incidents = incidentRepository.findAll();
            events = eventRepository.findAll();
        } catch (Exception ex) {
            log.warn("Database unavailable. Using fallback mock system context.");
            return "<system_context>\n" +
                    "Recent Incidents:\n" +
                    "- [ID: inc-payment-500] P1 Outage: Payment API returning 500 errors on /checkout | Type: OUTAGE | Severity: P1 | Status: RESOLVED | Root Cause: JWT signature key decoding change broke backward compatibility with all active user tokens generated before the deployment.\n" +
                    "  AI Summary: Sarah Jenkins merged PR #92 which refactored auth token validation, breaking older active sessions.\n" +
                    "Recent Activity Logs:\n" +
                    "- [Event ID: evt-1] Timestamp: 2:31 PM | Type: PR_MERGE | Source: github | Severity: INFO | Content: PR #92 Merged: \"Refactor auth token validation\" by Sarah Jenkins\n" +
                    "- [Event ID: evt-2] Timestamp: 3:02 PM | Type: DEPLOYMENT | Source: github | Severity: INFO | Content: Service payment-service deployed to production (SUCCESS)\n" +
                    "- [Event ID: evt-4] Timestamp: 3:32 PM | Type: ERROR_LOG | Source: sentry | Severity: WARNING | Content: Sentry Error: JsonWebTokenError - \"invalid signature\"\n" +
                    "- [Event ID: evt-5] Timestamp: 3:47 PM | Type: ALERT | Source: sentry | Severity: CRITICAL | Content: Sentry Alert: 500 error rate on /api/pay spiked to 89%\n" +
                    "</system_context>";
        }

        // Sort and get the latest 5 incidents
        List<Incident> recentIncidents = incidents.stream()
                .sorted((i1, i2) -> i2.getTriggeredAt().compareTo(i1.getTriggeredAt()))
                .limit(5)
                .collect(Collectors.toList());

        // Sort and get the latest 30 events
        List<Event> recentEvents = events.stream()
                .sorted((e1, e2) -> e2.getTimestamp().compareTo(e1.getTimestamp()))
                .limit(30)
                .collect(Collectors.toList());

        StringBuilder sb = new StringBuilder();
        sb.append("<system_context>\n");
        sb.append("Recent Incidents:\n");
        for (Incident inc : recentIncidents) {
            sb.append(String.format("- [ID: %s] %s | Type: %s | Severity: %s | Status: %s | Triggered: %s | Root Cause: %s\n  AI Summary: %s\n",
                    inc.getId(), inc.getTitle(), inc.getType(), inc.getSeverity(), inc.getStatus(), inc.getTriggeredAt(), 
                    inc.getRootCause() != null ? inc.getRootCause() : "Unknown yet", 
                    inc.getAiSummary() != null ? inc.getAiSummary() : "No summary available"));
        }

        sb.append("\nRecent Activity Logs:\n");
        for (Event e : recentEvents) {
            sb.append(String.format("- [Event ID: %s] Timestamp: %s | Type: %s | Source: %s | Severity: %s | Content: %s\n",
                    e.getId(), e.getTimestamp(), e.getType(), e.getSource(), e.getSeverity(), e.getContent()));
        }
        sb.append("</system_context>");
        return sb.toString();
    }
}
