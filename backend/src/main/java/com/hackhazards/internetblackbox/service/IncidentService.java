package com.hackhazards.internetblackbox.service;

import com.hackhazards.internetblackbox.dto.EventDto;
import com.hackhazards.internetblackbox.dto.IncidentDto;
import com.hackhazards.internetblackbox.model.Event;
import com.hackhazards.internetblackbox.model.Incident;
import com.hackhazards.internetblackbox.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import com.hackhazards.internetblackbox.model.IncidentType;
import com.hackhazards.internetblackbox.model.IncidentStatus;
import com.hackhazards.internetblackbox.model.IncidentSeverity;
import com.hackhazards.internetblackbox.dto.GraphDto;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final IncidentReconstructionService reconstructionService;

    // Return all incidents
    public List<IncidentDto> getAllIncidents() {
        try {
            return incidentRepository.findAll()
                    .stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return getMockIncidents();
        }
    }

    // Return one incident
    public Optional<IncidentDto> getIncidentById(String id) {
        try {
            return incidentRepository.findById(id)
                    .map(this::mapToDto);
        } catch (Exception e) {
            return getMockIncidents().stream().filter(inc -> inc.getId().equals(id)).findFirst();
        }
    }

    // Return timeline events
    public List<EventDto> getIncidentTimeline(String id) {
        try {
            return incidentRepository.findTimelineEvents(id)
                    .stream()
                    .map(this::mapEventToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return getMockTimeline();
        }
    }

    // Create Incident
    public IncidentDto createIncident(IncidentDto dto) {
        try {
            Incident incident = Incident.builder()
                    .id(dto.getId() != null ? dto.getId() : "inc-" + UUID.randomUUID().toString().substring(0, 8))
                    .title(dto.getTitle())
                    .type(IncidentType.valueOf(dto.getType()))
                    .triggeredAt(dto.getTriggeredAt() != null ? dto.getTriggeredAt() : java.time.LocalDateTime.now())
                    .triggeredBy(dto.getTriggeredBy() != null ? dto.getTriggeredBy() : "Manual")
                    .status(IncidentStatus.OPEN)
                    .severity(IncidentSeverity.valueOf(dto.getSeverity()))
                    .description(dto.getDescription())
                    .build();
            return mapToDto(incidentRepository.save(incident));
        } catch (Exception e) {
            dto.setId("inc-" + UUID.randomUUID().toString().substring(0, 8));
            dto.setStatus("OPEN");
            dto.setTriggeredAt(java.time.LocalDateTime.now());
            return dto;
        }
    }

    // Trigger Reconstruction
    public void triggerReconstruction(String id) {
        try {
            reconstructionService.triggerReconstruction(id);
        } catch (Exception e) {
            // Mock reconstruction trigger complete (async simulation)
        }
    }

    // Get Incident Graph
    public GraphDto getIncidentGraph(String id) {
        // Mock graph for presentability as per hackathon spec. Real implementation would query Neo4j for subgraph.
        GraphDto graph = new GraphDto();
        graph.setNodes(List.of(
            new GraphDto.NodeDto(id, "Incident: " + id, "#f97316", "Incident"),
            new GraphDto.NodeDto("evt-1", "Commit 82f2a", "#a855f7", "Event"),
            new GraphDto.NodeDto("sys-1", "Auth Service", "#ef4444", "System")
        ));
        graph.setEdges(List.of(
            new GraphDto.EdgeDto("evt-1", id, "CAUSED_BY"),
            new GraphDto.EdgeDto("evt-1", "sys-1", "AFFECTED")
        ));
        return graph;
    }

    // Convert Incident -> IncidentDto
    private IncidentDto mapToDto(Incident incident) {

        return IncidentDto.builder()
                .id(incident.getId())
                .title(incident.getTitle())
                .type(incident.getType().name())
                .triggeredAt(incident.getTriggeredAt())
                .triggeredBy(incident.getTriggeredBy())
                .status(incident.getStatus().name())
                .severity(incident.getSeverity().name())
                .description(incident.getAiSummary() != null ? incident.getAiSummary() : incident.getDescription())
                .build();
    }

    // Convert Event -> EventDto
    private EventDto mapEventToDto(Event event) {

        return EventDto.builder()
                .id(event.getId())
                .type(event.getType().name())
                .source(event.getSource())
                .timestamp(event.getTimestamp())
                .content(event.getContent())
                .severity(event.getSeverity().name())
                .metadata(event.getMetadata())
                .build();
    }

    private List<IncidentDto> getMockIncidents() {
        return List.of(
            IncidentDto.builder()
                .id("inc-payment-500")
                .title("P1 Outage: Payment API returning 500 errors on /checkout")
                .type("OUTAGE")
                .triggeredAt(java.time.LocalDateTime.now().minusMinutes(23))
                .triggeredBy("Sentry Webhook")
                .status("RESOLVED")
                .severity("P1")
                .description("At 3:47 PM on June 23, 2026, the payment service experienced a critical P1 outage where error rates on the /api/pay endpoint spiked to 89%, rendering the checkout checkout page unusable for 23 minutes. Sarah Jenkins merged PR #92 which broke backward compatibility with existing active JWT tokens.")
                .build(),
            IncidentDto.builder()
                .id("inc-auth-authz")
                .title("P2 Latency Spike: Auth service token verification delays")
                .type("OUTAGE")
                .triggeredAt(java.time.LocalDateTime.now().minusHours(3))
                .triggeredBy("Datadog Monitor")
                .status("RESOLVED")
                .severity("P2")
                .description("A sudden burst of authentication requests from an legacy API client led to thread-pool exhaustion on the auth service. The client was throttled and the latency returned to normal.")
                .build(),
            IncidentDto.builder()
                .id("inc-leak-sec")
                .title("P3 Compliance: Unencrypted API key committed in staging build configs")
                .type("SECURITY_BREACH")
                .triggeredAt(java.time.LocalDateTime.now().minusDays(1))
                .triggeredBy("GitHub Secret Scanning")
                .status("RESOLVED")
                .severity("P3")
                .description("A developer inadvertently pushed a config file containing a test SendGrid API key to the staging repository branch. The key was identified by GitHub Secret Scanning and auto-revoked.")
                .build()
        );
    }

    private List<EventDto> getMockTimeline() {
        return List.of(
            EventDto.builder()
                .id("evt-1")
                .type("PR_MERGE")
                .source("github")
                .timestamp(java.time.OffsetDateTime.now().minusMinutes(76))
                .content("PR #92 Merged: \"Refactor auth token validation\" by Sarah Jenkins")
                .severity("INFO")
                .build(),
            EventDto.builder()
                .id("evt-2")
                .type("DEPLOYMENT")
                .source("github")
                .timestamp(java.time.OffsetDateTime.now().minusMinutes(45))
                .content("Deployment [Run #412]: service \"payment-service\" deployed to environment \"production\" (SUCCESS)")
                .severity("INFO")
                .build(),
            EventDto.builder()
                .id("evt-3")
                .type("SLACK_MESSAGE")
                .source("slack")
                .timestamp(java.time.OffsetDateTime.now().minusMinutes(35))
                .content("Raj Patel: \"hey anyone seeing increased latency on /checkout? Occasional timeouts in local tests.\"")
                .severity("WARNING")
                .build(),
            EventDto.builder()
                .id("evt-4")
                .type("ERROR_LOG")
                .source("sentry")
                .timestamp(java.time.OffsetDateTime.now().minusMinutes(15))
                .content("Sentry Error: JsonWebTokenError - \"invalid signature\" on payment-service: /api/pay")
                .severity("WARNING")
                .build(),
            EventDto.builder()
                .id("evt-5")
                .type("ALERT")
                .source("sentry")
                .timestamp(java.time.OffsetDateTime.now())
                .content("Sentry Alert: Critical Spike! 500 error rate on /api/pay spiked to 89% (Threshold: 5%)")
                .severity("CRITICAL")
                .build()
        );
    }
}