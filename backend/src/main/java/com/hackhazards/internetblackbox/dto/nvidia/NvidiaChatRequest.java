package com.hackhazards.internetblackbox.dto.nvidia;

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
public class NvidiaChatRequest {

    @JsonProperty("model")
    private String model;

    @JsonProperty("messages")
    private List<Message> messages;

    @JsonProperty("temperature")
    private Double temperature;

    @JsonProperty("max_tokens")
    private Integer maxTokens;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        @JsonProperty("role")
        private String role; // "system", "user", or "assistant"

        @JsonProperty("content")
        private String content;
    }
}
