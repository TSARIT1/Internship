package com.tsarit.backend.controller;

import com.tsarit.backend.entity.Problem;
import com.tsarit.backend.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "http://localhost:5173")
public class ProblemController {

    @Autowired
    private ProblemRepository problemRepository;

    @GetMapping
    public org.springframework.http.ResponseEntity<?> getAllProblems(@RequestParam(required = false) Long hackathonId) {
        try {
            List<Problem> problems;
            if (hackathonId != null) {
                problems = problemRepository.findByHackathonId(hackathonId);
            } else {
                problems = problemRepository.findAll();
            }
            return org.springframework.http.ResponseEntity.ok(problems);
        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity.status(500).body("Error fetching problems: " + e.toString());
        }
    }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> getProblem(@PathVariable Long id) {
        return problemRepository.findById(id)
                .map(problem -> {
                    // Start of security filter: Mask hidden test cases for students
                    // In a real app, you might want to return a DTO instead
                    // For now, we just clear hidden test cases from the response if the user is a
                    // student?
                    // Actually, let's just assume the frontend needs to know inputs for public
                    // cases
                    problem.getTestCases().forEach(tc -> {
                        if (tc.isHidden()) {
                            tc.setExpectedOutput(""); // Don't show output for hidden cases?
                            // Or better, don't send hidden test cases at all to frontend usually.
                            // But for "Run" button we might need them? No, "Run" happens on backend.
                            // So we should strictly filter them out or hide critical data.
                            tc.setInput("HIDDEN");
                            tc.setExpectedOutput("HIDDEN");
                        }
                    });
                    return org.springframework.http.ResponseEntity.ok(problem);
                })
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @PostMapping
    public Problem createProblem(@RequestBody Problem problem) {
        return problemRepository.save(problem);
    }

    @PutMapping("/{id}")
    public Problem updateProblem(@PathVariable Long id, @RequestBody Problem problemDetails) {
        return problemRepository.findById(id).map(problem -> {
            problem.setTitle(problemDetails.getTitle());
            problem.setDescription(problemDetails.getDescription());
            problem.setDifficulty(problemDetails.getDifficulty());
            problem.setTimeLimit(problemDetails.getTimeLimit());
            problem.setMemoryLimit(problemDetails.getMemoryLimit());
            problem.setInputFormat(problemDetails.getInputFormat());
            problem.setOutputFormat(problemDetails.getOutputFormat());

            // Simpler replacement for now (orphanRemoval handles delete)
            problem.getTestCases().clear();
            if (problemDetails.getTestCases() != null) {
                problem.getTestCases().addAll(problemDetails.getTestCases());
            }

            return problemRepository.save(problem);
        }).orElseThrow(() -> new RuntimeException("Problem not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteProblem(@PathVariable Long id) {
        problemRepository.deleteById(id);
    }
}
