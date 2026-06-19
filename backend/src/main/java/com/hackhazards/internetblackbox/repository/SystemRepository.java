package com.hackhazards.internetblackbox.repository;

import com.hackhazards.internetblackbox.model.SystemNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemRepository extends Neo4jRepository<SystemNode, String> {
    Optional<SystemNode> findByName(String name);
}
