package com.tsarit.backend.repository;

import com.tsarit.backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByHackathonId(Long hackathonId);

    Optional<Submission> findByHackathonIdAndUserId(Long hackathonId, Long userId);
}
