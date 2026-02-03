package com.tsarit.backend.controller;

import com.tsarit.backend.entity.Webinar;
import com.tsarit.backend.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/webinars")
@CrossOrigin(origins = "http://localhost:5173")
public class WebinarController {

    @Autowired
    private WebinarRepository webinarRepository;

    @GetMapping
    public List<Webinar> getAllWebinars() {
        return webinarRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createWebinar(@RequestBody Webinar webinar) {
        System.out.println("Received webinar creation request: " + webinar.getTitle());
        try {
            Webinar savedWebinar = webinarRepository.save(webinar);
            return ResponseEntity.ok(savedWebinar);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error saving webinar: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Webinar> updateWebinar(@PathVariable Long id, @RequestBody Webinar webinarDetails) {
        return webinarRepository.findById(id)
                .map(webinar -> {
                    webinar.setTitle(webinarDetails.getTitle());
                    webinar.setSpeaker(webinarDetails.getSpeaker());
                    webinar.setDate(webinarDetails.getDate());
                    webinar.setTime(webinarDetails.getTime());
                    webinar.setDescription(webinarDetails.getDescription());
                    webinar.setMeetingLink(webinarDetails.getMeetingLink());
                    webinar.setImage(webinarDetails.getImage());
                    return ResponseEntity.ok(webinarRepository.save(webinar));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWebinar(@PathVariable Long id) {
        return webinarRepository.findById(id)
                .map(webinar -> {
                    webinarRepository.delete(webinar);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Placeholder for registration
    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerForWebinar(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        // Implementation logic for registration will go here
        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }
}
