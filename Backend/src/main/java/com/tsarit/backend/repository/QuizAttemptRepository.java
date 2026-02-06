package com.tsarit.backend.repository;

import com.tsarit.backend.entity.Quiz;
import com.tsarit.backend.entity.QuizAttempt;
import com.tsarit.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUser(User user);

    Optional<QuizAttempt> findByUserAndQuiz(User user, Quiz quiz);
}
