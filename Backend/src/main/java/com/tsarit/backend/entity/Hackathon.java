package com.tsarit.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Hackathon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String date;
    private String time;
    private String prizePool;
    private String status;
    private String mode;
}
