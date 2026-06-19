package com.hackhazards.internetblackbox.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoiceQueryRequest {
    private String audioBase64;
    private String languageCode; // e.g. "en-IN", "hi-IN"
}
