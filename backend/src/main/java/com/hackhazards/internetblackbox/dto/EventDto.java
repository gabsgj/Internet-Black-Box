package com.hackhazards.internetblackbox.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
    private String id;
    private String type; // e.g., COMMIT, SLACK_MESSAGE, SENTRY_ALERT
    private String source; // e.g., github, slack, sentry
    private LocalDateTime timestamp;
    private String content;
    private String severity; // INFO, WARNING, CRITICAL
    private String actorName;
    private String actorEmail;
    private String metadata; // JSON string of source-specific data
}
