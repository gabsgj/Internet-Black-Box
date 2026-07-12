package com.hackhazards.internetblackbox.repository;

import com.hackhazards.internetblackbox.model.Event;
import com.hackhazards.internetblackbox.model.Incident;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends Neo4jRepository<Incident, String> {

    @Query("""
        MATCH (i:Incident {id: $id})-[:CAUSED_BY]->(e:Event)
        RETURN e
    """)
    List<Event> findTimelineEvents(String id);
}