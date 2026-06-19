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

@Node("Person")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Person {

    @Id
    private String id; // Typically the email or primary identifier

    private String name;
    private String email;
    private String role;
    private List<String> teams = new ArrayList<>();

    @Relationship(type = "AUTHORED", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private List<Event> authoredEvents = new ArrayList<>();
}
