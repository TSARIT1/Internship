package com.tsarit.backend.controller;

import com.tsarit.backend.entity.ContactQuery;
import com.tsarit.backend.repository.ContactRepository;
import com.tsarit.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<?> submitQuery(@RequestBody ContactQuery query) {
        try {
            if (query.getEmail() == null && query.getPhone() == null) {
                return ResponseEntity.badRequest().body("Email or Phone number is required.");
            }

            if (query.getMessage() == null || query.getMessage().isEmpty()) {
                query.setMessage("Lead/Inquiry for " + (query.getCourse() != null ? query.getCourse() : "TSAR IT Internship Program"));
            }

            if (query.getSubject() == null || query.getSubject().isEmpty()) {
                query.setSubject("Inquiry: " + (query.getCourse() != null ? query.getCourse() : "General"));
            }

            ContactQuery savedQuery = contactRepository.save(query);

            try {
                emailService.sendContactQueryEmail(savedQuery);
            } catch (Exception mailEx) {
                System.out.println("Email notification skipped: " + mailEx.getMessage());
            }

            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "Message sent successfully!", "data", savedQuery));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Map.of("success", false, "message", "Failed to send message: " + e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllQueries() {
        return ResponseEntity.ok(contactRepository.findAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateQueryStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        return contactRepository.findById(id).map(q -> {
            if (body.containsKey("status")) {
                q.setStatus(body.get("status"));
            }
            ContactQuery updated = contactRepository.save(q);
            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "Status updated successfully", "data", updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuery(@PathVariable Long id) {
        if (contactRepository.existsById(id)) {
            contactRepository.deleteById(id);
            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "Query deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
