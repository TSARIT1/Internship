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
    private CourseRepository courseRepository;

    @Autowired
    private WebinarRepository webinarRepository;

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private com.tsarit.backend.repository.TicketRepository ticketRepository;

    @Autowired
    private com.tsarit.backend.repository.ContactRepository contactRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalStudents = userRepository.count();
        long totalCourses = courseRepository.count();
        long totalWebinars = webinarRepository.count();
        long totalTestimonials = testimonialRepository.count();
        Double totalRevenue = enrollmentRepository.getTotalRevenue();
        long totalEnrollments = enrollmentRepository.count();
        long certificatesIssued = enrollmentRepository.findByCertificateIssued(true).size();
        long openTickets = ticketRepository.countByStatus("OPEN");
        long totalLeads = contactRepository.count();

        stats.put("totalStudents", totalStudents);
        stats.put("totalEnrollments", totalEnrollments);
        stats.put("totalCourses", totalCourses);
        stats.put("totalWebinars", totalWebinars);
        stats.put("totalTestimonials", totalTestimonials);
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        stats.put("certificatesIssued", certificatesIssued);
        stats.put("pendingCertificates", Math.max(0, totalEnrollments - certificatesIssued));
        stats.put("openTickets", openTickets);
        stats.put("totalLeads", totalLeads);

        return ResponseEntity.ok(stats);
    }
}
