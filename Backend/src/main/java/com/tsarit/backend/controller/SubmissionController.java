package com.tsarit.backend.controller;

import com.tsarit.backend.entity.Submission;
import com.tsarit.backend.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @PostMapping("/submit")
    public org.springframework.http.ResponseEntity<?> submitProject(@RequestBody Submission submission) {
        try {
            // Check if submission already exists for this user & hackathon (Update instead
            // of Create)
            var existing = submissionRepository.findByHackathonIdAndUserId(submission.getHackathonId(),
                    submission.getUserId());

            if (existing.isPresent()) {
                Submission update = existing.get();
                update.setProjectTitle(submission.getProjectTitle());
                update.setRepoLink(submission.getRepoLink());
                update.setVideoLink(submission.getVideoLink());
                update.setDescription(submission.getDescription());
                update.setSubmittedAt(java.time.LocalDateTime.now());
                submissionRepository.save(update);
                return org.springframework.http.ResponseEntity.ok(update);
            } else {
                Submission saved = submissionRepository.save(submission);
                return org.springframework.http.ResponseEntity.ok(saved);
            }
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500)
                    .body("Error submitting project: " + e.getMessage());
        }
    }

    @GetMapping("/hackathon/{hackathonId}/my-submission/{userId}")
    public org.springframework.http.ResponseEntity<?> getMySubmission(@PathVariable Long hackathonId,
            @PathVariable Long userId) {
        var submission = submissionRepository.findByHackathonIdAndUserId(hackathonId, userId);
        if (submission.isPresent()) {
            return org.springframework.http.ResponseEntity.ok(submission.get());
        } else {
            return org.springframework.http.ResponseEntity.ok(null); // Or 404, but null is easier for frontend check
        }
    }

    @Autowired
    private com.tsarit.backend.repository.UserRepository userRepository;

    @PutMapping("/{id}/grade")
    public org.springframework.http.ResponseEntity<?> gradeSubmission(@PathVariable Long id,
            @RequestBody java.util.Map<String, Object> payload) {
        try {
            Submission submission = submissionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Submission not found"));

            if (payload.containsKey("score")) {
                submission.setScore(Double.parseDouble(payload.get("score").toString()));
            }
            if (payload.containsKey("feedback")) {
                submission.setFeedback((String) payload.get("feedback"));
            }

            submissionRepository.save(submission);
            return org.springframework.http.ResponseEntity.ok("Submission graded successfully");
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.badRequest()
                    .body("Error grading submission: " + e.getMessage());
        }
    }

    @GetMapping("/hackathon/{hackathonId}/all")
    public List<java.util.Map<String, Object>> getAllSubmissions(@PathVariable Long hackathonId) {
        List<Submission> submissions = submissionRepository.findByHackathonId(hackathonId);

        return submissions.stream().map(submission -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("submission", submission);

            userRepository.findById(submission.getUserId()).ifPresent(user -> {
                map.put("username", user.getUsername());
                map.put("email", user.getEmail());
            });

            return map;
        }).collect(java.util.stream.Collectors.toList());
    }

    @PutMapping("/{id}/mark-winner")
    public org.springframework.http.ResponseEntity<?> markWinner(@PathVariable Long id) {
        try {
            Submission submission = submissionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Submission not found"));

            // Clear winner flag from all submissions in the same hackathon first
            if (submission.getHackathonId() != null) {
                List<Submission> allInHackathon = submissionRepository.findByHackathonId(submission.getHackathonId());
                for (Submission s : allInHackathon) {
                    if (s.isWinner()) {
                        s.setWinner(false);
                        submissionRepository.save(s);
                    }
                }
            }

            // Mark this submission as winner
            submission.setWinner(true);
            submissionRepository.save(submission);
            return org.springframework.http.ResponseEntity.ok("Winner marked successfully");
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.badRequest()
                    .body("Error marking winner: " + e.getMessage());
        }
    }

    @Autowired
    private com.tsarit.backend.service.CodeExecutionService codeExecutionService;

    @Autowired
    private com.tsarit.backend.repository.ProblemRepository problemRepository;

    // Run CodeEndpoint - Just runs against sample cases, doesn't save submission
    @PostMapping("/run")
    public org.springframework.http.ResponseEntity<?> runCode(@RequestBody java.util.Map<String, Object> payload) {
        try {
            String code = (String) payload.get("code");
            String language = (String) payload.get("language");
            Long problemId = Long.parseLong(payload.get("problemId").toString());

            com.tsarit.backend.entity.Problem problem = problemRepository.findById(problemId)
                    .orElseThrow(() -> new RuntimeException("Problem not found"));

            // Run against the FIRST test case (usually the example)
            // Or run against all non-hidden test cases
            List<java.util.Map<String, Object>> results = new java.util.ArrayList<>();
            boolean allPassed = true;

            for (com.tsarit.backend.entity.TestCase tc : problem.getTestCases()) {
                if (!tc.isHidden()) {
                    var execResult = codeExecutionService.executeCode(code, language, tc.getInput());

                    boolean passed = execResult.getStdout().trim().equals(tc.getExpectedOutput().trim());
                    if (!passed)
                        allPassed = false;

                    java.util.Map<String, Object> caseResult = new java.util.HashMap<>();
                    caseResult.put("input", tc.getInput());
                    caseResult.put("expectedOutput", tc.getExpectedOutput());
                    caseResult.put("actualOutput", execResult.getStdout());
                    caseResult.put("stderr", execResult.getStderr());
                    caseResult.put("passed", passed);
                    results.add(caseResult);
                }
            }

            return org.springframework.http.ResponseEntity.ok(java.util.Map.of(
                    "success", true,
                    "allPassed", allPassed,
                    "results", results));

        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500)
                    .body(java.util.Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Submit Code Endpoint - Runs against ALL cases and saves
    @PostMapping("/submit-code")
    public org.springframework.http.ResponseEntity<?> submitCode(@RequestBody java.util.Map<String, Object> payload) {
        try {
            String code = (String) payload.get("code");
            String language = (String) payload.get("language");
            Long problemId = Long.parseLong(payload.get("problemId").toString());
            Long userId = Long.parseLong(payload.get("userId").toString());
            Long hackathonId = null;
            if (payload.get("hackathonId") != null) {
                hackathonId = Long.parseLong(payload.get("hackathonId").toString());
            }

            com.tsarit.backend.entity.Problem problem = problemRepository.findById(problemId)
                    .orElseThrow(() -> new RuntimeException("Problem not found"));

            int passedCount = 0;
            int totalCount = problem.getTestCases().size();
            String finalStatus = "ACCEPTED";
            StringBuilder errorOutputBuilder = new StringBuilder();

            // Execute against ALL cases
            for (com.tsarit.backend.entity.TestCase tc : problem.getTestCases()) {
                var execResult = codeExecutionService.executeCode(code, language, tc.getInput());

                // Simple string trim comparison.
                // For production, you might need more robust comparison (ignore trailing
                // newlines, etc)
                boolean passed = execResult.getStdout().trim().equals(tc.getExpectedOutput().trim());

                if (passed) {
                    passedCount++;
                } else {
                    finalStatus = "WRONG_ANSWER"; // Or RUNTIME_ERROR if stderr is present?
                    if (execResult.getExitCode() != 0) {
                        finalStatus = "RUNTIME_ERROR";
                    }
                    // Capture stderr for terminal display
                    if (execResult.getStderr() != null && !execResult.getStderr().trim().isEmpty()) {
                        errorOutputBuilder.append(execResult.getStderr()).append("\n");
                    }
                }
            }

            if (passedCount == totalCount) {
                finalStatus = "ACCEPTED";
            } else if (finalStatus.equals("ACCEPTED")) {
                // Logic fallback: if loop finished but count mismatch (shouldn't happen)
                finalStatus = "WRONG_ANSWER";
            }

            // Save Submission
            Submission submission = new Submission();
            // Check if existing submission for this problem/user? Maybe keep history?
            // For now, let's just save new one every time like LeetCode

            submission.setUserId(userId);
            submission.setCode(code);
            submission.setLanguage(language);
            submission.setStatus(finalStatus);
            submission.setPassedTestCases(passedCount);
            submission.setTotalTestCases(totalCount);
            submission.setHackathonId(hackathonId);
            // If linked to hackathon, updates leaderboard.
            // Note: Use a separate "score" logic? E.g. 10 points per case.
            submission.setScore((double) (passedCount * 10));

            submissionRepository.save(submission);

            return org.springframework.http.ResponseEntity.ok(java.util.Map.of(
                    "success", true,
                    "status", finalStatus,
                    "passed", passedCount,
                    "total", totalCount,
                    "submissionId", submission.getId(),
                    "errorOutput", errorOutputBuilder.toString()));

        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity.status(500)
                    .body(java.util.Map.of("success", false, "message", e.getMessage()));
        }
    }
}
