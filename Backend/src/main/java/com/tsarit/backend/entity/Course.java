package com.tsarit.backend.entity;

import jakarta.persistence.*;
// import lombok.Data; // Removed unused import
import java.util.List;
import java.util.ArrayList;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Size; // Removed unused import

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    @NotBlank(message = "Course name is required")
    private String name;

    private String slug;

    private String liveLink;

    @Min(value = 0, message = "Fee cannot be negative")
    private Double totalFee;

    @Min(value = 0, message = "Discount cannot be negative")
    private Double discount;

    @NotBlank(message = "Duration is required")
    private String duration;

    @NotBlank(message = "Level is required")
    private String level;

    @NotBlank(message = "Domain is required")
    private String domain;

    @Column(length = 2000)
    private String description;

    // Styling Fields
    private String iconName;
    private String color;
    private String bgColor;
    private String borderColor;
    private String gradient;
    private String shadow;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY) // Changed to LAZY to avoid MultipleBagFetchException
    @JoinColumn(name = "course_id")
    private List<Section> sections = new ArrayList<>();

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    // --- Getters and Setters for New Fields ---
    public Double getTotalFee() {
        return totalFee;
    }

    public void setTotalFee(Double totalFee) {
        this.totalFee = totalFee;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getBgColor() {
        return bgColor;
    }

    public void setBgColor(String bgColor) {
        this.bgColor = bgColor;
    }

    public String getBorderColor() {
        return borderColor;
    }

    public void setBorderColor(String borderColor) {
        this.borderColor = borderColor;
    }

    public String getGradient() {
        return gradient;
    }

    public void setGradient(String gradient) {
        this.gradient = gradient;
    }

    public String getShadow() {
        return shadow;
    }

    public void setShadow(String shadow) {
        this.shadow = shadow;
    }

    public String getLiveLink() {
        return liveLink;
    }

    public void setLiveLink(String liveLink) {
        this.liveLink = liveLink;
    }

    public List<Section> getSections() {
        return sections;
    }

    public void setSections(List<Section> sections) {
        this.sections = sections;
    }
}
