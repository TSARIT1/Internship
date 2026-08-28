package com.tsarit.backend.controller;

import com.tsarit.backend.entity.Ticket;
import com.tsarit.backend.entity.User;
import com.tsarit.backend.repository.TicketRepository;
import com.tsarit.backend.service.EmailService;
import com.tsarit.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/create")
    public ResponseEntity<?> createTicket(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = payload.containsKey("userId") && payload.get("userId") != null 
                    ? Long.valueOf(payload.get("userId").toString()) 
                    : null;
            String subject = (String) payload.get("subject");
            String category = (String) payload.get("category");
            String priority = payload.containsKey("priority") ? (String) payload.get("priority") : "MEDIUM";
            String description = (String) payload.get("description");

            if (subject == null || subject.trim().isEmpty() || description == null || description.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Subject and description are required."));
            }

            Ticket ticket = new Ticket();
            ticket.setSubject(subject.trim());
            ticket.setCategory(category != null ? category.trim() : "GENERAL");
            ticket.setPriority(priority);
            ticket.setDescription(description.trim());
            ticket.setStatus("OPEN");

            if (userId != null) {
                Optional<User> userOpt = userService.findById(userId);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    ticket.setUser(user);
                    ticket.setStudentName(user.getUsername());
                    ticket.setStudentEmail(user.getEmail());
                    ticket.setStudentPhone(user.getPhone());
                }
            } else {
                ticket.setStudentName((String) payload.get("studentName"));
                ticket.setStudentEmail((String) payload.get("studentEmail"));
                ticket.setStudentPhone((String) payload.get("studentPhone"));
            }

            // Generate official Ticket Number: e.g. TKT-2026-10452
            String ticketNumber = "TKT-2026-" + String.format("%05d", (int)(System.currentTimeMillis() % 90000 + 10000));
            ticket.setTicketNumber(ticketNumber);

            Ticket saved = ticketRepository.save(ticket);

            // Send Email confirmation to student
            if (saved.getStudentEmail() != null && !saved.getStudentEmail().isEmpty()) {
                try {
                    String emailSubject = "Support Ticket Created - " + ticketNumber + " | TSAR IT Helpdesk";
                    String emailBody = "Dear " + (saved.getStudentName() != null ? saved.getStudentName() : "Scholar") + ",\n\n"
                            + "Your support ticket has been received and registered with TSAR IT Administration.\n\n"
                            + "• Ticket Number: " + ticketNumber + "\n"
                            + "• Subject: " + saved.getSubject() + "\n"
                            + "• Category: " + saved.getCategory() + "\n"
                            + "• Priority: " + saved.getPriority() + "\n"
                            + "• Status: OPEN\n\n"
                            + "Our support team will review and reply within 24 hours. You can track and reply to this ticket directly from your Student Portal.\n\n"
                            + "Best regards,\nTSAR IT Helpdesk & Academic Support\nEmail: tsarit@tsaritservices.com\nWeb: https://internship.tsaritservices.com";
                    
                    emailService.sendGenericEmail(saved.getStudentEmail(), emailSubject, emailBody);
                } catch (Exception ex) {
                    System.err.println("Ticket creation email dispatch note: " + ex.getMessage());
                }
            }

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to create ticket: " + e.getMessage()));
        }
    }

    @GetMapping("/my-tickets/{userId}")
    public ResponseEntity<?> getMyTickets(@PathVariable Long userId) {
        Optional<User> userOpt = userService.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
        List<Ticket> tickets = ticketRepository.findByUserOrderByCreatedAtDesc(userOpt.get());
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAllByOrderByCreatedAtDesc();
        long openCount = ticketRepository.countByStatus("OPEN");
        long inProgressCount = ticketRepository.countByStatus("IN_PROGRESS");
        long resolvedCount = ticketRepository.countByStatus("RESOLVED");
        long closedCount = ticketRepository.countByStatus("CLOSED");

        Map<String, Object> response = new HashMap<>();
        response.put("tickets", tickets);
        response.put("stats", Map.of(
                "total", tickets.size(),
                "open", openCount,
                "inProgress", inProgressCount,
                "resolved", resolvedCount,
                "closed", closedCount
        ));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Ticket not found"));
        }
        return ResponseEntity.ok(ticketOpt.get());
    }

    @PutMapping("/{id}/reply")
    public ResponseEntity<?> replyToTicket(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Ticket not found"));
        }

        Ticket ticket = ticketOpt.get();
        String reply = (String) payload.get("reply");
        String status = payload.containsKey("status") && payload.get("status") != null 
                ? (String) payload.get("status") 
                : "RESOLVED";
        String adminName = payload.containsKey("adminName") ? (String) payload.get("adminName") : "Super Admin";

        if (reply == null || reply.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Reply content cannot be empty."));
        }

        ticket.setAdminReply(reply.trim());
        ticket.setAdminRepliedBy(adminName);
        ticket.setAdminRepliedAt(LocalDateTime.now());
        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);

        // Send Email Notification to Student
        if (saved.getStudentEmail() != null && !saved.getStudentEmail().isEmpty()) {
            try {
                String emailSubject = "Response to Your Support Ticket " + saved.getTicketNumber() + " | TSAR IT Helpdesk";
                String emailBody = "Dear " + (saved.getStudentName() != null ? saved.getStudentName() : "Scholar") + ",\n\n"
                        + "Super Administration has responded to your ticket " + saved.getTicketNumber() + ":\n\n"
                        + "• Ticket: " + saved.getTicketNumber() + " - " + saved.getSubject() + "\n"
                        + "• Status: " + saved.getStatus() + "\n\n"
                        + "--- Admin Response ---\n"
                        + reply.trim() + "\n\n"
                        + "----------------------\n\n"
                        + "You can view your full ticket history and reply back in your Student Portal.\n\n"
                        + "Best regards,\nTSAR IT Administration\nEmail: tsarit@tsaritservices.com\nWeb: https://internship.tsaritservices.com";
                
                emailService.sendGenericEmail(saved.getStudentEmail(), emailSubject, emailBody);
            } catch (Exception ex) {
                System.err.println("Ticket reply email notification note: " + ex.getMessage());
            }
        }

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Ticket not found"));
        }

        Ticket ticket = ticketOpt.get();
        String status = payload.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status is required."));
        }

        ticket.setStatus(status.toUpperCase());
        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);
        return ResponseEntity.ok(ticket);
    }
}
