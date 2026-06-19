package com.hackhazards.internetblackbox.controller;

import com.hackhazards.internetblackbox.dto.TextQueryRequest;
import com.hackhazards.internetblackbox.dto.TextQueryResponse;
import com.hackhazards.internetblackbox.dto.VoiceQueryRequest;
import com.hackhazards.internetblackbox.dto.VoiceQueryResponse;
import com.hackhazards.internetblackbox.service.QueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Base64;

@Slf4j
@RestController
@RequestMapping("/api/query")
@RequiredArgsConstructor
public class QueryController {

    private final QueryService queryService;

    @PostMapping("/text")
    public Mono<ResponseEntity<TextQueryResponse>> handleTextQuery(@RequestBody TextQueryRequest request) {
        log.info("Received HTTP Text Query: '{}'", request.getQuery());
        return queryService.answerTextQuery(request.getQuery(), request.getLanguageCode())
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.noContent().build());
    }

    @PostMapping("/voice")
    public Mono<ResponseEntity<VoiceQueryResponse>> handleVoiceQuery(@RequestBody VoiceQueryRequest request) {
        log.info("Received HTTP Voice Query");
        try {
            if (request.getAudioBase64() == null || request.getAudioBase64().isBlank()) {
                return Mono.just(ResponseEntity.badRequest().build());
            }
            byte[] decodedAudio = Base64.getDecoder().decode(request.getAudioBase64().trim());
            return queryService.answerVoiceQuery(decodedAudio, request.getLanguageCode())
                    .map(ResponseEntity::ok)
                    .defaultIfEmpty(ResponseEntity.noContent().build());
        } catch (Exception e) {
            log.error("Failed to parse base64 audio query: {}", e.getMessage());
            return Mono.just(ResponseEntity.badRequest().build());
        }
    }
}
