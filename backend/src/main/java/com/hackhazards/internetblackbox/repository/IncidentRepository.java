package com.hackhazards.internetblackbox.repository;

import com.hackhazards.internetblackbox.model.Incident;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidentRepository extends Neo4jRepository<Incident, String> {
}
