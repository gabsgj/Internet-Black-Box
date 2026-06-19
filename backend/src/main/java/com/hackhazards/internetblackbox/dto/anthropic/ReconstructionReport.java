package com.hackhazards.internetblackbox.dto.anthropic;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReconstructionReport {

    @JsonProperty("timeline")
    private List<TimelineEntry> timeline;

    @JsonProperty("root_cause")
    private RootCauseInfo rootCause;

    @JsonProperty("people_involved")
    private List<PersonActivity> peopleInvolved;

    @JsonProperty("prevention")
    private List<String> prevention; // 3 specific, actionable preventive measures

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimelineEntry {
        @JsonProperty("timestamp")
        private String timestamp;

        @JsonProperty("event_id")
        private String eventId;

        @JsonProperty("event_type")
        private String eventType;

        @JsonProperty("content")
        private String content;

        @JsonProperty("actor_name")
        private String actorName;

        @JsonProperty("source")
        private String source;

        @JsonProperty("causal_annotation")
        private String causalAnnotation; // Explain how it fits into the chain
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RootCauseInfo {
        @JsonProperty("description")
        private String description;

        @JsonProperty("confidence_score")
        private Double confidenceScore; // e.g., 0.0 to 1.0 (or 0% to 100%)

        @JsonProperty("evidence")
        private List<String> evidence; // Event IDs or specific points of proof
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PersonActivity {
        @JsonProperty("name")
        private String name;

        @JsonProperty("actions")
        private List<String> actions;

        @JsonProperty("role_in_chain")
        private String roleInChain; // e.g., "Introduced vulnerability", "Detected spike", etc.
    }
}
