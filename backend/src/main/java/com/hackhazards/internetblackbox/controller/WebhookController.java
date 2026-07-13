package com.hackhazards.internetblackbox.controller;

import com.hackhazards.internetblackbox.service.WebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookService webhookService;

    @PostMapping("/github")
    public ResponseEntity<Void> handleGitHubWebhook(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "X-GitHub-Event", required = false) String githubEventHeader) {
        log.info("Received GitHub Webhook request, event: {}", githubEventHeader);
        
        // Asynchronously process the webhook to return a fast 200 OK response
        webhookService.processGitHubWebhook(payload, githubEventHeader);
        
        return ResponseEntity.ok().build();
    }

    @PostMapping("/slack")
    public ResponseEntity<Map<String, String>> handleSlackWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Received Slack Webhook request");

        // Handle Slack URL Verification Challenge if present
        if (payload.containsKey("challenge")) {
            log.info("Responding to Slack URL verification challenge");
            Map<String, String> response = new HashMap<>();
            response.put("challenge", (String) payload.get("challenge"));
            return ResponseEntity.ok(response);
        }

        // Asynchronously process the message
        webhookService.processSlackWebhook(payload);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/sentry")
    public ResponseEntity<Void> handleSentryWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Received Sentry Webhook request");
        
        // Asynchronously process the webhook
        webhookService.processSentryWebhook(payload);

        return ResponseEntity.ok().build();
    }
}
