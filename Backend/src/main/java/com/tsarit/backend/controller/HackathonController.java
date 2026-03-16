package com.tsarit.backend.controller;

import com.tsarit.backend.entity.Hackathon;
import com.tsarit.backend.repository.HackathonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hackathons")
public class HackathonController {

    @Autowired
    private HackathonRepository hackathonRepository;

    @GetMapping
    public List<Hackathon> getAllHackathons() {
        return hackathonRepository.findAll();
    }

    @PostMapping
    public org.springframework.http.ResponseEntity<?> createHackathon(@RequestBody Hackathon hackathon) {
        try {
            Hackathon savedHackathon = hackathonRepository.save(hackathon);
            return org.springframework.http.ResponseEntity.ok(savedHackathon);
        } catch (Exception e) {
            e.printStackTrace(); // Log to console
            return org.springframework.http.ResponseEntity
                    .status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating hackathon: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Hackathon updateHackathon(@PathVariable long id, @RequestBody Hackathon hackathonDetails) {
        Hackathon hackathon = hackathonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hackathon not found with id: " + id));

        hackathon.setTitle(hackathonDetails.getTitle());
        hackathon.setDescription(hackathonDetails.getDescription());
        hackathon.setDate(hackathonDetails.getDate());
        hackathon.setTime(hackathonDetails.getTime());
        hackathon.setPrizePool(hackathonDetails.getPrizePool());
        hackathon.setStatus(hackathonDetails.getStatus());
        hackathon.setMode(hackathonDetails.getMode());
        hackathon.setEntryFee(hackathonDetails.getEntryFee());

        return hackathonRepository.save(hackathon);
    }

    @DeleteMapping("/{id}")
    public void deleteHackathon(@PathVariable long id) {
        hackathonRepository.deleteById(id);
    }

    @PostMapping("/{id}/register")
    public org.springframework.http.ResponseEntity<?> registerUser(@PathVariable long id,
            @RequestBody java.util.Map<String, Long> payload) {
        try {
            Long userId = payload.get("userId");
            if (userId == null) {
                return org.springframework.http.ResponseEntity.badRequest().body("User ID is required");
            }

            Hackathon hackathon = hackathonRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Hackathon not found with id: " + id));

            if (hackathon.getRegisteredUserIds().contains(userId)) {
                return org.springframework.http.ResponseEntity.badRequest().body("User already registered");
            }

            hackathon.getRegisteredUserIds().add(userId);
            hackathonRepository.save(hackathon);

            return org.springframework.http.ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity
                    .status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registering user: " + e.getMessage());
        }
    }

    @GetMapping("/my-registrations/{userId}")
    public List<Hackathon> getMyRegistrations(@PathVariable Long userId) {
        return hackathonRepository.findByRegisteredUserIdsContaining(userId);
    }
}
