package com.tsarit.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class CodeExecutionService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

    public ExecutionResult executeCode(String code, String language, String input) {
        try {
            // Map our language names to Piston's language names/versions
            String pistonLang = mapLanguage(language);
            String version = mapVersion(language);

            Map<String, Object> requestBody = Map.of(
                    "language", pistonLang,
                    "version", version,
                    "files", List.of(Map.of("content", code)),
                    "stdin", input != null ? input : "");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(PISTON_API_URL, request, Map.class);
            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && responseBody.containsKey("run")) {
                Map<String, Object> run = (Map<String, Object>) responseBody.get("run");
                String stdout = (String) run.get("stdout");
                String stderr = (String) run.get("stderr");
                // String output = (String) run.get("output"); // Combined stdout/stderr

                int codeExit = 0;
                if (run.containsKey("code") && run.get("code") != null) {
                    if (run.get("code") instanceof Integer) {
                        codeExit = (Integer) run.get("code");
                    }
                }

                return new ExecutionResult(stdout, stderr, codeExit);
            }

            return new ExecutionResult("", "Unknown execution error", -1);

        } catch (Exception e) {
            e.printStackTrace();
            return new ExecutionResult("", "Execution failed: " + e.getMessage(), -1);
        }
    }

    private String mapLanguage(String language) {
        if (language == null)
            return "python";
        switch (language.toLowerCase()) {
            case "java":
                return "java";
            case "cpp":
                return "c++";
            case "c":
                return "c";
            case "javascript":
                return "javascript";
            default:
                return "python";
        }
    }

    private String mapVersion(String language) {
        // Piston versions can change, using "*" often picks latest, or specific known
        // versions
        if (language == null)
            return "3.10.0";
        switch (language.toLowerCase()) {
            case "java":
                return "15.0.2";
            case "cpp":
                return "10.2.0";
            case "c":
                return "10.2.0";
            case "javascript":
                return "18.15.0";
            default:
                return "3.10.0";
        }
    }

    public static class ExecutionResult {
        private String stdout;
        private String stderr;
        private int exitCode;

        public ExecutionResult(String stdout, String stderr, int exitCode) {
            this.stdout = stdout;
            this.stderr = stderr;
            this.exitCode = exitCode;
        }

        public String getStdout() {
            return stdout;
        }

        public String getStderr() {
            return stderr;
        }

        public int getExitCode() {
            return exitCode;
        }
    }
}
