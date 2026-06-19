package com.hackhazards.internetblackbox.dto.sarvam;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SarvamSTTResponse {

    @JsonProperty("transcript")
    private String transcript;

    @JsonProperty("request_id")
    private String requestId;

    @JsonProperty("metrics")
    private Map<String, Object> metrics;
}
