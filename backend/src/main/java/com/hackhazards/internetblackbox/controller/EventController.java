package com.hackhazards.internetblackbox.controller;

import com.hackhazards.internetblackbox.model.Event;
import com.hackhazards.internetblackbox.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventRepository eventRepository;

    @GetMapping
    public List<Event> getAllEvents() {
        try {
            return eventRepository.findAll();
        } catch (Exception e) {
            // Return empty list on DB error
            return List.of();
        }
    }
}