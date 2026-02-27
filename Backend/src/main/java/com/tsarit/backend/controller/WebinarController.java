package com.tsarit.backend.controller;

import com.tsarit.backend.entity.User;
import com.tsarit.backend.entity.Webinar;
import com.tsarit.backend.entity.WebinarRegistration;
import com.tsarit.backend.repository.WebinarRepository;
import com.tsarit.backend.repository.WebinarRegistrationRepository;
import com.tsarit.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/webinars")
@CrossOrigin(origins = "http://localhost:5173")
public class WebinarController {

    @Autowired
    private WebinarRepository webinarRepository;

    @Autowired
    private WebinarRegistrationRepository registrationRepository;

    @Autowired
    private UserService userService;

    // ---------- WEBINAR CRUD ----------

    @GetMapping
    public ResponseEntity<?> getAllWebinars(@RequestParam(required = false) Long userId) {
        List<Webinar> webinars = webinarRepository.findAll();

        // Build response with registration count for each webinar
        List<Map<String, Object>> result = webinars.stream().map(w -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", w.getId());
            map.put("title", w.getTitle());
            map.put("speaker", w.getSpeaker());
            map.put("date", w.getDate());
            map.put("time", w.getTime());
            map.put("description", w.getDescription());
            map.put("image", w.getImage());
            map.put("isPaid", w.isPaid());
            map.put("price", w.getPrice());
            map.put("registrationCount", registrationRepository.countByWebinar(w));

            // Only include meetingLink if userId is provided and user is registered
            if (userId != null) {
                Optional<User> userOpt = userService.findById(userId);
                if (userOpt.isPresent() && registrationRepository.existsByUserAndWebinar(userOpt.get(), w)) {
                    map.put("meetingLink", w.getMeetingLink());
                }
            }
            // Admin can always see via the direct webinar object if needed
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/admin")
    public List<Webinar> getAllWebinarsAdmin() {
        // Admin gets full webinar objects including meetingLink
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
                    webinar.setPaid(webinarDetails.isPaid());
                    webinar.setPrice(webinarDetails.getPrice());
                    return ResponseEntity.ok(webinarRepository.save(webinar));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWebinar(@PathVariable Long id) {
        return webinarRepository.findById(id)
                .map(webinar -> {
                    // Delete all registrations for this webinar first
                    List<WebinarRegistration> regs = registrationRepository.findByWebinar(webinar);
                    registrationRepository.deleteAll(regs);
                    webinarRepository.delete(webinar);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------- REGISTRATION ----------

    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerForWebinar(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());

            // Validate webinar
            Optional<Webinar> webinarOpt = webinarRepository.findById(id);
            if (webinarOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Webinar not found"));
            }
            Webinar webinar = webinarOpt.get();

            // Validate user
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            User user = userOpt.get();

            // Check duplicate registration
            if (registrationRepository.existsByUserAndWebinar(user, webinar)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Already registered for this webinar"));
            }

            // Create registration
            WebinarRegistration registration = new WebinarRegistration();
            registration.setUser(user);
            registration.setWebinar(webinar);
            registration.setRegisteredAt(LocalDateTime.now());
            registration.setStudentName(user.getUsername());
            registration.setStudentEmail(user.getEmail());

            registrationRepository.save(registration);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Successfully registered for " + webinar.getTitle(),
                    "registrationId", registration.getId()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/check-registration")
    public ResponseEntity<?> checkRegistration(@PathVariable Long id, @RequestParam Long userId) {
        Optional<Webinar> webinarOpt = webinarRepository.findById(id);
        if (webinarOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Webinar not found"));
        }
        Optional<User> userOpt = userService.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        boolean registered = registrationRepository.existsByUserAndWebinar(userOpt.get(), webinarOpt.get());
        return ResponseEntity.ok(Map.of("registered", registered));
    }

    @GetMapping("/my-registrations/{userId}")
    public ResponseEntity<?> getMyRegistrations(@PathVariable Long userId) {
        Optional<User> userOpt = userService.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        List<WebinarRegistration> registrations = registrationRepository.findByUser(userOpt.get());
        // Return webinar IDs the user is registered for
        List<Long> webinarIds = registrations.stream()
                .map(r -> r.getWebinar().getId())
                .collect(Collectors.toList());
        return ResponseEntity.ok(webinarIds);
    }

    @GetMapping("/{id}/registrations")
    public ResponseEntity<?> getWebinarRegistrations(@PathVariable Long id) {
        Optional<Webinar> webinarOpt = webinarRepository.findById(id);
        if (webinarOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Webinar not found"));
        }
        List<WebinarRegistration> registrations = registrationRepository.findByWebinar(webinarOpt.get());

        // Return a clean list without circular references
        List<Map<String, Object>> result = registrations.stream().map(r -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", r.getId());
            map.put("studentName", r.getStudentName());
            map.put("studentEmail", r.getStudentEmail());
            map.put("registeredAt", r.getRegisteredAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
