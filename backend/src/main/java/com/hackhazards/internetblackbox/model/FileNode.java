package com.hackhazards.internetblackbox.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

@Node("File")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileNode {

    @Id
    private String id; // Typically "repository:path"

    private String path;
    private String repository;
    private String language;

    @Relationship(type = "PART_OF", direction = Relationship.Direction.OUTGOING)
    private SystemNode system;
}
