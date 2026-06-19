package com.hackhazards.internetblackbox.dto.sarvam;

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
public class SarvamTTSResponse {

    @JsonProperty("request_id")
    private String requestId;

    @JsonProperty("audios")
    private List<String> audios; // base64-encoded audio strings
}
