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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;

    // Return all incidents
    public List<IncidentDto> getAllIncidents() {
        return incidentRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Return one incident
    public Optional<IncidentDto> getIncidentById(String id) {
        return incidentRepository.findById(id)
                .map(this::mapToDto);
    }

    // Return timeline events
    public List<EventDto> getIncidentTimeline(String id) {

        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        return incident.getCausedByEvents()
                .stream()
                .map(this::mapEventToDto)
                .collect(Collectors.toList());
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
                .description(incident.getAiSummary())
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
}