package com.tsarit.backend.controller;

import com.tsarit.backend.entity.AntiCheatLog;
import com.tsarit.backend.repository.AntiCheatLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/anticheat")
@CrossOrigin(origins = "http://localhost:5173")
public class AntiCheatController {

    @Autowired
    private AntiCheatLogRepository antiCheatLogRepository;

    /**
     * Called by frontend every time a tab switch is detected.
     * Creates a new log or increments the existing count.
     * Body: { userId, hackathonId, tabSwitchCount }
     */
    @PostMapping("/log")
    public ResponseEntity<?> logTabSwitch(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.parseLong(payload.get("userId").toString());
            Long hackathonId = Long.parseLong(payload.get("hackathonId").toString());
            int count = Integer.parseInt(payload.get("tabSwitchCount").toString());

            AntiCheatLog log = antiCheatLogRepository
                    .findByUserIdAndHackathonId(userId, hackathonId)
                    .orElse(new AntiCheatLog());

            log.setUserId(userId);
            log.setHackathonId(hackathonId);
            log.setTabSwitchCount(count);
            log.setLastUpdated(LocalDateTime.now());

            antiCheatLogRepository.save(log);
            return ResponseEntity.ok(Map.of("success", true, "tabSwitchCount", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Admin endpoint — get all violation logs for a hackathon,
     * ordered by worst offenders first.
     */
    @GetMapping("/hackathon/{hackathonId}")
    public ResponseEntity<List<AntiCheatLog>> getViolationsByHackathon(@PathVariable Long hackathonId) {
        List<AntiCheatLog> logs = antiCheatLogRepository
                .findByHackathonIdOrderByTabSwitchCountDesc(hackathonId);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get a specific student's violation log for a hackathon.
     */
    @GetMapping("/student/{userId}/hackathon/{hackathonId}")
    public ResponseEntity<?> getStudentViolation(@PathVariable Long userId, @PathVariable Long hackathonId) {
        return antiCheatLogRepository.findByUserIdAndHackathonId(userId, hackathonId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(null));
    }
}
