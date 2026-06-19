package com.hackhazards.internetblackbox.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TextQueryRequest {
    private String query;
    private String languageCode; // e.g. "en-IN", "hi-IN"
}
