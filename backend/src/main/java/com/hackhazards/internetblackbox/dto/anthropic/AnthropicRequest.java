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
public class AnthropicRequest {

    @JsonProperty("model")
    private String model;

    @JsonProperty("max_tokens")
    private Integer maxTokens;

    @JsonProperty("system")
    private String system;

    @JsonProperty("messages")
    private List<Message> messages;

    @JsonProperty("temperature")
    private Double temperature;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        @JsonProperty("role")
        private String role; // "user" or "assistant"

        @JsonProperty("content")
        private String content;
    }
}
