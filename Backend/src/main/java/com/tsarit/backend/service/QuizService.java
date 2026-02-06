package com.tsarit.backend.service;

import com.tsarit.backend.entity.Course;
import com.tsarit.backend.entity.Quiz;
import com.tsarit.backend.entity.QuizAttempt;
import com.tsarit.backend.entity.Section;
import com.tsarit.backend.entity.User;
import com.tsarit.backend.entity.Question;
import com.tsarit.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    public Quiz createQuiz(String courseName, Long sectionId, Quiz quiz) {
        Course course = courseRepository.findByName(courseName)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Section section = course.getSections().stream()
                .filter(s -> s.getId().equals(sectionId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Section not found"));

        section.getQuizzes().add(quiz);
        courseRepository.save(course); // Cascades save to quiz
        return quiz;
    }

    public QuizAttempt submitQuiz(Long userId, Long quizId, List<Integer> selectedAnswers) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        int score = 0;
        List<Question> questions = quiz.getQuestions();

        // Basic grading logic
        // Assumes selectedAnswers size matches questions size and is in order
        for (int i = 0; i < questions.size(); i++) {
            if (i < selectedAnswers.size()) {
                Integer selected = selectedAnswers.get(i);
                if (selected != null && selected.equals(questions.get(i).getCorrectOptionIndex())) {
                    score++;
                }
            }
        }

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setQuiz(quiz);
        attempt.setScore(score);
        attempt.setTotalQuestions(questions.size());
        attempt.setAttemptTime(LocalDateTime.now());

        return quizAttemptRepository.save(attempt);
    }

    public List<QuizAttempt> getStudentAttempts(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return quizAttemptRepository.findByUser(user);
    }
}
