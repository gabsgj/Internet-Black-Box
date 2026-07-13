package com.hackhazards.internetblackbox.controller;

import com.hackhazards.internetblackbox.dto.EventDto;
import com.hackhazards.internetblackbox.dto.IncidentDto;
import com.hackhazards.internetblackbox.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    // GET /api/incidents
    @GetMapping
    public ResponseEntity<List<IncidentDto>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    // GET /api/incidents/{id}
    @GetMapping("/{id}")
    public ResponseEntity<IncidentDto> getIncidentById(@PathVariable String id) {

        return incidentService.getIncidentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/incidents/{id}/timeline
    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<EventDto>> getIncidentTimeline(@PathVariable String id) {

        return ResponseEntity.ok(incidentService.getIncidentTimeline(id));
    }

    // POST /api/incidents
    @PostMapping
    public ResponseEntity<IncidentDto> createIncident(@RequestBody IncidentDto incidentDto) {
        return ResponseEntity.ok(incidentService.createIncident(incidentDto));
    }

    // POST /api/incidents/{id}/reconstruct
    @PostMapping("/{id}/reconstruct")
    public ResponseEntity<Void> triggerReconstruction(@PathVariable String id) {
        incidentService.triggerReconstruction(id);
        return ResponseEntity.ok().build();
    }

    // GET /api/incidents/{id}/graph
    @GetMapping("/{id}/graph")
    public ResponseEntity<com.hackhazards.internetblackbox.dto.GraphDto> getIncidentGraph(@PathVariable String id) {
        return ResponseEntity.ok(incidentService.getIncidentGraph(id));
    }
}