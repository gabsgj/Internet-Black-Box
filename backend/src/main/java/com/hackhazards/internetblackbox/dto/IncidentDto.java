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
public class IncidentDto {
    private String id;
    private String title;
    private String type; // e.g., OUTAGE, SECURITY_BREACH, PROJECT_FAILURE, COMPLIANCE
    private LocalDateTime triggeredAt;
    private String triggeredBy; // e.g., manual, auto-anomaly
    private String status; // OPEN, RECONSTRUCTING, RESOLVED
    private String severity; // P1, P2, P3
    private String description; // Additional text detailing what is known initially
}
