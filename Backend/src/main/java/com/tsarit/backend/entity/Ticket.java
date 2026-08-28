package com.tsarit.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String ticketNumber; // e.g. TKT-2026-00101

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    private String studentName;
    private String studentEmail;
    private String studentPhone;

    private String category; // COURSE_ACCESS, FEE_PAYMENT, CERTIFICATE, TECHNICAL, GENERAL
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT
    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    @Column(columnDefinition = "TEXT")
    private String adminReply;

    private String adminRepliedBy;
    private LocalDateTime adminRepliedAt;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
