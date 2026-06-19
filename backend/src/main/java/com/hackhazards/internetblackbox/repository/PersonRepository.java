package com.hackhazards.internetblackbox.repository;

import com.hackhazards.internetblackbox.model.Person;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonRepository extends Neo4jRepository<Person, String> {
    Optional<Person> findByEmail(String email);
}
