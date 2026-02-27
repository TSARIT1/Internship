package com.tsarit.backend.repository;

import com.tsarit.backend.entity.Hackathon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HackathonRepository extends JpaRepository<Hackathon, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT h FROM Hackathon h JOIN h.registeredUserIds u WHERE u = :userId")
    java.util.List<Hackathon> findByRegisteredUserIdsContaining(
            @org.springframework.web.bind.annotation.PathVariable("userId") Long userId);
}
