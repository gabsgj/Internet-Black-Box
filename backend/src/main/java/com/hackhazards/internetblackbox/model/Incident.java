package com.hackhazards.internetblackbox.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Node("Incident")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Incident {

    @Id
    private String id; // Unique incident identifier (e.g. "inc_123")

    private String title;
    private IncidentType type;
    private LocalDateTime triggeredAt;
    private String triggeredBy; // manual | auto-anomaly
    private IncidentStatus status;
    private IncidentSeverity severity;
    
    private String aiSummary;
    private String rootCause;
    private String description;

    @Relationship(type = "CAUSED_BY", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private List<Event> causedByEvents = new ArrayList<>();
}
