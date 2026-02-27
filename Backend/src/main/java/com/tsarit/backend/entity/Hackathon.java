package com.tsarit.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "hackathons")
@Data
public class Hackathon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String date;
    private String time;
    private String prizePool;
    private String status;
    private String mode;
    private String entryFee;

    @ElementCollection
    private java.util.Set<Long> registeredUserIds = new java.util.HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getPrizePool() {
        return prizePool;
    }

    public void setPrizePool(String prizePool) {
        this.prizePool = prizePool;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public java.util.Set<Long> getRegisteredUserIds() {
        return registeredUserIds;
    }

    public void setRegisteredUserIds(java.util.Set<Long> registeredUserIds) {
        this.registeredUserIds = registeredUserIds;
    }

    public int getParticipantCount() {
        return registeredUserIds != null ? registeredUserIds.size() : 0;
    }
}
