package com.hackhazards.internetblackbox.dto.sarvam;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SarvamTTSRequest {

    @JsonProperty("text")
    private String text;

    @JsonProperty("target_language_code")
    private String targetLanguageCode; // e.g., "en-IN", "hi-IN"

    @JsonProperty("speaker")
    private String speaker; // e.g., "shubh", "ritu"

    @JsonProperty("model")
    private String model; // e.g., "bulbul:v3"

    @JsonProperty("pace")
    private Double pace; // Speed control, e.g., 1.0
}
