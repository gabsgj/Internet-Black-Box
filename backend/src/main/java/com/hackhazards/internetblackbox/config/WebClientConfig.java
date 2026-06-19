package com.hackhazards.internetblackbox.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${anthropic.api.key:}")
    private String anthropicApiKey;

    @Value("${sarvam.api.key:}")
    private String sarvamApiKey;

    @Bean
    public WebClient anthropicWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl("https://api.anthropic.com")
                .defaultHeader("x-api-key", anthropicApiKey)
                .defaultHeader("anthropic-version", "2023-06-01")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Bean
    public WebClient sarvamWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl("https://api.sarvam.ai")
                .defaultHeader("api-subscription-key", sarvamApiKey)
                .build();
    }
}
