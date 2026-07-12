package com.hackhazards.internetblackbox.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Node("Event")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    private String id; // Unique event identifier (e.g. "github:commit:abc123")

    private EventType type;
    private OffsetDateTime timestamp;
    private String source; // github | slack | sentry | etc.
    private String content;
    private Severity severity;
    private String metadata; // Stringified raw source JSON metadata

    @Relationship(type = "TRIGGERED", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private List<Event> triggeredEvents = new ArrayList<>();

    @Relationship(type = "PRECEDED", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private List<Event> precededEvents = new ArrayList<>();

    @Relationship(type = "AFFECTED", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private List<SystemNode> affectedSystems = new ArrayList<>();

    @Relationship(type = "DEPLOYED_TO", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private List<SystemNode> deployedToSystems = new ArrayList<>();

    @Relationship(type = "MODIFIED", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private List<FileNode> modifiedFiles = new ArrayList<>();

    @Relationship(type = "RESPONDED_TO", direction = Relationship.Direction.OUTGOING)
    private Event respondedToEvent;
}
