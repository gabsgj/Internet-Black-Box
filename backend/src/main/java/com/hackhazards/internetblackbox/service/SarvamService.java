package com.hackhazards.internetblackbox.service;

import com.hackhazards.internetblackbox.dto.sarvam.SarvamSTTResponse;
import com.hackhazards.internetblackbox.dto.sarvam.SarvamTTSRequest;
import com.hackhazards.internetblackbox.dto.sarvam.SarvamTTSResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Base64;

@Slf4j
@Service
public class SarvamService {

    private final WebClient webClient;

    @Value("${sarvam.model.stt:saarika:v2}")
    private String sttModel;

    @Value("${sarvam.model.tts:bulbul:v3}")
    private String ttsModel;

    @Value("${sarvam.speaker.tts:ritu}")
    private String defaultSpeaker;

    @Value("${use.mock.data:false}")
    private boolean useMockData;

    public SarvamService(@Qualifier("sarvamWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    /**
     * Sends binary audio bytes to Sarvam STT to transcribe.
     *
     * @param audioBytes   the raw audio bytes (typically WAV/AAC)
     * @param languageCode the BCP-47 language code (e.g. "en-IN", "hi-IN")
     * @return transcript text
     */
    public Mono<String> speechToText(byte[] audioBytes, String languageCode) {
        if (useMockData) {
            log.info("USE_MOCK_DATA is true, returning mock transcription");
            return Mono.just("what caused the outage yesterday?");
        }
        log.info("Sending speech-to-text request to Sarvam using model: {}, language: {}", sttModel, languageCode);

        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        
        // Wrap the byte array as a Resource with a filename so WebClient sets the content disposition
        ByteArrayResource audioResource = new ByteArrayResource(audioBytes) {
            @Override
            public String getFilename() {
                return "query.wav";
            }
        };

        builder.part("file", audioResource, MediaType.APPLICATION_OCTET_STREAM);
        builder.part("model", sttModel);
        if (languageCode != null && !languageCode.isBlank()) {
            builder.part("language_code", languageCode);
        }

        MultiValueMap<String, HttpEntity<?>> body = builder.build();

        return webClient.post()
                .uri("/speech-to-text")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(body))
                .retrieve()
                .bodyToMono(SarvamSTTResponse.class)
                .map(response -> {
                    if (response.getTranscript() == null) {
                        return "";
                    }
                    return response.getTranscript();
                })
                .doOnError(error -> log.error("Failed to transcribe audio via Sarvam STT: {}", error.getMessage(), error));
    }

    /**
     * Sends text to Sarvam TTS to synthesize spoken audio.
     *
     * @param text         the text to synthesize
     * @param languageCode the target language code (e.g. "en-IN", "hi-IN")
     * @return synthesized audio as a byte array
     */
    public Mono<byte[]> textToSpeech(String text, String languageCode) {
        if (useMockData) {
            log.info("USE_MOCK_DATA is true, returning mock synthesized audio");
            return Mono.just(new byte[100]);
        }
        log.info("Sending text-to-speech request to Sarvam using model: {}, speaker: {}, language: {}", 
                ttsModel, defaultSpeaker, languageCode);

        SarvamTTSRequest request = SarvamTTSRequest.builder()
                .text(text)
                .targetLanguageCode(languageCode != null ? languageCode : "en-IN")
                .speaker(defaultSpeaker)
                .model(ttsModel)
                .pace(1.0)
                .build();

        return webClient.post()
                .uri("/text-to-speech")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(SarvamTTSResponse.class)
                .flatMap(response -> {
                    if (response.getAudios() == null || response.getAudios().isEmpty()) {
                        return Mono.error(new IllegalStateException("Empty audio array returned from Sarvam TTS"));
                    }
                    try {
                        String base64Audio = response.getAudios().get(0);
                        byte[] decodedAudio = Base64.getDecoder().decode(base64Audio.trim());
                        return Mono.just(decodedAudio);
                    } catch (Exception e) {
                        return Mono.error(new IllegalArgumentException("Failed to decode Base64 audio from Sarvam TTS: " + e.getMessage(), e));
                    }
                })
                .doOnError(error -> log.error("Failed to synthesize speech via Sarvam TTS: {}", error.getMessage(), error));
    }
}
