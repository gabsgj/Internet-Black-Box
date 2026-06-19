package com.hackhazards.internetblackbox.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.ArrayList;
import java.util.List;

@Node("System")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemNode {

    @Id
    private String id; // Unique system identifier, e.g., "service:payment-api"

    private String name;
    private SystemType type;
    private Environment environment;

    @Relationship(type = "EXPERIENCED", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private List<Incident> experiencedIncidents = new ArrayList<>();
}
