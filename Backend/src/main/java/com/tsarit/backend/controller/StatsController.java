package com.tsarit.backend.controller;

import com.tsarit.backend.repository.CourseRepository;
import com.tsarit.backend.repository.EnrollmentRepository;
import com.tsarit.backend.repository.TestimonialRepository;
import com.tsarit.backend.repository.UserRepository;
import com.tsarit.backend.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class StatsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository; // Internships/Courses

    @Autowired
    private WebinarRepository webinarRepository;

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalStudents = userRepository.count();
        long totalCourses = courseRepository.count();
        long totalWebinars = webinarRepository.count();
        long totalTestimonials = testimonialRepository.count();
        Double totalRevenue = enrollmentRepository.getTotalRevenue();

        stats.put("totalStudents", totalStudents);
        stats.put("totalCourses", totalCourses); // Can track "Active Workshops" or similar if needed
        stats.put("totalWebinars", totalWebinars);
        stats.put("totalTestimonials", totalTestimonials);
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);

        return ResponseEntity.ok(stats);
    }
}
