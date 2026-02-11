package com.tsarit.backend.service;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Collections;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=%s";

    public String getAnswer(String question) {
        try {
            String url = String.format(API_URL_TEMPLATE, apiKey);
            RestTemplate restTemplate = new RestTemplate();

            // Setup headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct payload
            Map<String, String> part = new HashMap<>();
            part.put("text", question);

            Map<String, Object> partsWrapper = new HashMap<>();
            partsWrapper.put("parts", List.of(part));

            Map<String, Object> payload = new HashMap<>();
            payload.put("contents", List.of(partsWrapper));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            // Send request with type safety
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    });

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return extractTextFromResponse(response.getBody());
            } else {
                return "Error: Unable to get response from Gemini. Status: " + response.getStatusCode();
            }

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            return "Error: " + e.getResponseBodyAsString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    private String extractTextFromResponse(Map<String, Object> responseBody) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            return "Error: Failed to parse Gemini response.";
        }
        return "No response text found.";
    }
}
