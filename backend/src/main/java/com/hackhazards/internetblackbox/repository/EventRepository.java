package com.hackhazards.internetblackbox.repository;

import com.hackhazards.internetblackbox.model.Event;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends Neo4jRepository<Event, String> {

    List<Event> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    @Query("MATCH (e:Event) WHERE e.timestamp >= $start AND e.timestamp <= $end RETURN e")
    List<Event> findEventsInTimeWindow(LocalDateTime start, LocalDateTime end);
}
