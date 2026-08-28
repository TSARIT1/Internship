package com.tsarit.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_queries")
@Data
public class ContactQuery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String course;
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String status = "NEW";

    private LocalDateTime createdAt = LocalDateTime.now();
}
