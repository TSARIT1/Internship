package com.tsarit.backend.controller;

import com.tsarit.backend.entity.Quiz;
// import com.tsarit.backend.entity.QuizAttempt; // Removed unused import
import com.tsarit.backend.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/create")
    public ResponseEntity<?> createQuiz(@RequestParam String courseName, @RequestParam Long sectionId,
            @RequestBody Quiz quiz) {
        try {
            return ResponseEntity.ok(quizService.createQuiz(courseName, sectionId, quiz));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<?> submitQuiz(@PathVariable Long quizId, @RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            List<Integer> answers = new ArrayList<>();
            Object answersObj = payload.get("answers");
            if (answersObj instanceof List<?>) {
                for (Object obj : (List<?>) answersObj) {
                    if (obj instanceof Integer) {
                        answers.add((Integer) obj);
                    } else if (obj instanceof Number) {
                        answers.add(((Number) obj).intValue());
                    }
                }
            }
            return ResponseEntity.ok(quizService.submitQuiz(userId, quizId, answers));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error submitting quiz: " + e.getMessage());
        }
    }

    @GetMapping("/attempts/{userId}")
    public ResponseEntity<?> getAttempts(@PathVariable Long userId) {
        return ResponseEntity.ok(quizService.getStudentAttempts(userId));
    }
}
