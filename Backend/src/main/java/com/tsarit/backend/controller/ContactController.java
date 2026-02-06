package com.tsarit.backend.controller;

import com.tsarit.backend.entity.ContactQuery;
import com.tsarit.backend.repository.ContactRepository;
import com.tsarit.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<?> submitQuery(@RequestBody ContactQuery query) {
        try {
            if (query.getEmail() == null || query.getMessage() == null) {
                return ResponseEntity.badRequest().body("Email and Message are required.");
            }

            ContactQuery savedQuery = contactRepository.save(query);

            // Send notification asynchronously if possible, but here synchronous is fine
            // for MVP
            emailService.sendContactQueryEmail(savedQuery);

            return ResponseEntity.ok("Message sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to send message: " + e.getMessage());
        }
    }
}
