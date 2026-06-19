package com.hackhazards.internetblackbox.service;

import com.hackhazards.internetblackbox.dto.EventDto;
import com.hackhazards.internetblackbox.dto.IncidentDto;
import com.hackhazards.internetblackbox.dto.anthropic.ReconstructionReport;
import com.hackhazards.internetblackbox.model.Event;
import com.hackhazards.internetblackbox.model.Incident;
import com.hackhazards.internetblackbox.model.IncidentStatus;
import com.hackhazards.internetblackbox.repository.EventRepository;
import com.hackhazards.internetblackbox.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class IncidentReconstructionService {

    private final IncidentRepository incidentRepository;
    private final EventRepository eventRepository;
    private final AnthropicService anthropicService;

    /**
     * Triggers the incident reconstruction workflow asynchronously.
     *
     * @param incidentId the ID of the incident to reconstruct
     */
    @Async
    @Transactional
    public void triggerReconstruction(String incidentId) {
        log.info("Starting async incident reconstruction for incident ID: {}", incidentId);

        // 1. Fetch Incident
        Incident incident = incidentRepository.findById(incidentId).orElse(null);
        if (incident == null) {
            log.error("Incident not found for ID: {}", incidentId);
            return;
        }

        // 2. Update status to RECONSTRUCTING
        incident.setStatus(IncidentStatus.RECONSTRUCTING);
        incidentRepository.save(incident);

        try {
            // 3. Define Time Window: 4 hours before to 30 minutes after triggeredAt
            LocalDateTime triggeredAt = incident.getTriggeredAt();
            LocalDateTime start = triggeredAt.minusHours(4);
            LocalDateTime end = triggeredAt.plusMinutes(30);

            // 4. Fetch Events in Time Window
            List<Event> dbEvents = eventRepository.findEventsInTimeWindow(start, end);
            log.info("Fetched {} events in time window [{} to {}] for reconstruction", dbEvents.size(), start, end);

            // 5. Map to DTOs
            IncidentDto incidentDto = IncidentDto.builder()
                    .id(incident.getId())
                    .title(incident.getTitle())
                    .type(incident.getType().name())
                    .triggeredAt(incident.getTriggeredAt())
                    .triggeredBy(incident.getTriggeredBy())
                    .status(incident.getStatus().name())
                    .severity(incident.getSeverity().name())
                    .description("Incident triggered at " + incident.getTriggeredAt() + " by " + incident.getTriggeredBy())
                    .build();

            List<EventDto> eventDtos = dbEvents.stream()
                    .map(e -> EventDto.builder()
                            .id(e.getId())
                            .type(e.getType().name())
                            .source(e.getSource())
                            .timestamp(e.getTimestamp())
                            .content(e.getContent())
                            .severity(e.getSeverity().name())
                            .metadata(e.getMetadata())
                            .actorName("System User") // Simplified mapping for prompt
                            .actorEmail("system@internetblackbox.app")
                            .build())
                    .collect(Collectors.toList());

            // 6. Call Claude to reconstruct
            ReconstructionReport report = anthropicService.reconstructIncident(incidentDto, eventDtos).block();

            if (report != null) {
                // 7. Map results back to database Incident Node
                incident.setRootCause(report.getRootCause().getDescription());
                
                // Formulate a markdown summary of the report
                String summaryMarkdown = buildSummaryMarkdown(report);
                incident.setAiSummary(summaryMarkdown);

                // Add causal relationships: CAUSED_BY edges to Event nodes
                List<Event> causalEvents = new ArrayList<>();
                if (report.getRootCause().getEvidence() != null) {
                    for (String evidenceId : report.getRootCause().getEvidence()) {
                        eventRepository.findById(evidenceId).ifPresent(causalEvents::add);
                    }
                }
                
                // Add timeline events to causal links
                for (ReconstructionReport.TimelineEntry entry : report.getTimeline()) {
                    if (entry.getEventId() != null) {
                        eventRepository.findById(entry.getEventId()).ifPresent(e -> {
                            if (!causalEvents.contains(e)) {
                                causalEvents.add(e);
                            }
                        });
                    }
                }

                incident.setCausedByEvents(causalEvents);
                incident.setStatus(IncidentStatus.RESOLVED);
                incidentRepository.save(incident);

                log.info("Incident reconstruction completed successfully for ID: {}. Root cause: {}", 
                        incidentId, incident.getRootCause());
            } else {
                throw new IllegalStateException("Reconstruction report from Anthropic service was null");
            }

        } catch (Exception e) {
            log.error("Failed to reconstruct incident ID: {}. Error: {}", incidentId, e.getMessage(), e);
            incident.setStatus(IncidentStatus.OPEN); // Revert status so it can be re-run
            incidentRepository.save(incident);
        }
    }

    private String buildSummaryMarkdown(ReconstructionReport report) {
        StringBuilder sb = new StringBuilder();
        sb.append("### AI Incident Reconstruction Report\n\n");
        
        sb.append("#### 🔍 Root Cause Details\n");
        sb.append("* **Description:** ").append(report.getRootCause().getDescription()).append("\n");
        sb.append("* **Confidence Score:** ").append(String.format("%.0f%%", report.getRootCause().getConfidenceScore() * 100)).append("\n\n");

        sb.append("#### ⏳ Chronological Timeline\n");
        for (ReconstructionReport.TimelineEntry entry : report.getTimeline()) {
            sb.append(String.format("* **%s** (%s - %s): %s *[%s]*\n", 
                    entry.getTimestamp(), entry.getSource(), entry.getActorName(), entry.getContent(), entry.getCausalAnnotation()));
        }
        sb.append("\n");

        sb.append("#### 👥 People Involved\n");
        for (ReconstructionReport.PersonActivity person : report.getPeopleInvolved()) {
            sb.append(String.format("* **%s** (Role: %s)\n", person.getName(), person.getRoleInChain()));
            for (String action : person.getActions()) {
                sb.append("  - ").append(action).append("\n");
            }
        }
        sb.append("\n");

        sb.append("#### 🛡️ Prevention Recommendations\n");
        for (String measure : report.getPrevention()) {
            sb.append("* ").append(measure).append("\n");
        }

        return sb.toString();
    }
}
