package com.hackhazards.internetblackbox.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoiceQueryResponse {
    private String transcript;
    private String answer;
    private String audioBase64;
}
