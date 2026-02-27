package com.tsarit.backend.repository;

import com.tsarit.backend.entity.AntiCheatLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AntiCheatLogRepository extends JpaRepository<AntiCheatLog, Long> {

    Optional<AntiCheatLog> findByUserIdAndHackathonId(Long userId, Long hackathonId);

    List<AntiCheatLog> findByHackathonIdOrderByTabSwitchCountDesc(Long hackathonId);
}
