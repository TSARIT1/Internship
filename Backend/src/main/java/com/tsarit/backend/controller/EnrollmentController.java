package com.tsarit.backend.controller;

import com.tsarit.backend.entity.Enrollment;
import com.tsarit.backend.entity.User;
import com.tsarit.backend.repository.EnrollmentRepository;
import com.tsarit.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:5173")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private com.tsarit.backend.service.RazorpayService razorpayService;

    @Autowired
    private com.tsarit.backend.service.EmailService emailService;

    @PostMapping("/enroll")
    public ResponseEntity<?> enrollUser(@RequestBody Map<String, Object> payload) {
        try {
            // Validate inputs
            Long userId = Long.valueOf(payload.get("userId").toString());
            String courseName = (String) payload.get("courseName");
            Double fee = Double.valueOf(payload.get("fee").toString());
            Double discount = Double.valueOf(payload.get("discount").toString());
            String transactionId = (String) payload.get("transactionId");
            // If amountPaid not sent, simple calculation
            Double amountPaid = payload.containsKey("amountPaid")
                    ? Double.valueOf(payload.get("amountPaid").toString())
                    : (fee - discount);

            // Fetch user
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            User user = userOpt.get();

            // Check duplicate
            if (enrollmentRepository.findByUserAndCourseName(user, courseName).isPresent()) {
                return ResponseEntity.badRequest().body("User already enrolled in this course");
            }

            // --- Payment Verification & Capture ---
            try {
                if (!"OFFLINE_OR_TEST".equals(transactionId)) {
                    razorpayService.verifyAndCapturePayment(transactionId, amountPaid);
                }
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Payment verification failed: " + e.getMessage());
            }
            // --------------------------------------

            // Create Enrollment
            Enrollment enrollment = new Enrollment();
            enrollment.setUser(user);
            enrollment.setCourseName(courseName);
            enrollment.setEnrollmentDate(LocalDate.now());
            enrollment.setStatus("ACTIVE");
            enrollment.setFee(fee);
            enrollment.setDiscount(discount);
            enrollment.setTransactionId(transactionId);
            enrollment.setAmountPaid(amountPaid);
            enrollment.setStudentName(user.getUsername()); // Or user.getName() if available, using username for now as
                                                           // per entity
            enrollment.setPaymentTime(java.time.LocalDateTime.now());
            enrollment.setProgress(0); // Initialize progress to 0%

            enrollmentRepository.save(enrollment);

            // Send Email (Async or Sync - Sync for now is fine since traffic is low)
            if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                emailService.sendEnrollmentEmail(
                        user.getEmail(),
                        user.getUsername(),
                        courseName,
                        amountPaid,
                        transactionId);
            }

            // Also update the legacy 'course' field on User for backward compatibility if
            // needed,
            // but primarily we depend on Enrollment entity now.
            // user.setCourse(courseName);
            // userService.updateUser(user.getId(), user);

            return ResponseEntity.ok(enrollment);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Enrollment failed: " + e.getMessage());
        }
    }

    @GetMapping("/my-enrollments/{userId}")
    public ResponseEntity<?> getMyEnrollments(@PathVariable Long userId) {
        Optional<User> userOpt = userService.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<Enrollment> enrollments = enrollmentRepository.findByUser(userOpt.get());
        System.out.println("DEBUG: Found " + enrollments.size() + " enrollments for user " + userId);
        enrollments.forEach(e -> System.out.println(" - Course: " + e.getCourseName() + ", Status: " + e.getStatus()));
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentRepository.findAll());
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkEnrollment(@RequestParam Long userId, @RequestParam String courseName) {
        Optional<User> userOpt = userService.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }
        boolean isEnrolled = enrollmentRepository.findByUserAndCourseName(userOpt.get(), courseName).isPresent();
        return ResponseEntity.ok(java.util.Collections.singletonMap("enrolled", isEnrolled));
    }

    @PutMapping("/{id}/certificate")
    public ResponseEntity<?> updateCertificateStatus(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        if (id == null)
            return ResponseEntity.badRequest().body("ID cannot be null");
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(id);
        if (enrollmentOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Enrollment not found");
        }
        Enrollment enrollment = enrollmentOpt.get();
        Boolean status = (Boolean) payload.get("status");
        enrollment.setCertificateIssued(Boolean.TRUE.equals(status));
        if (Boolean.TRUE.equals(status)) {
            enrollment.setCertificateDate(LocalDate.now());
        } else {
            enrollment.setCertificateDate(null);
        }
        enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(enrollment);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateEnrollmentStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        if (id == null)
            return ResponseEntity.badRequest().body("ID cannot be null");
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(id);
        if (enrollmentOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Enrollment not found");
        }
        Enrollment enrollment = enrollmentOpt.get();
        String newStatus = payload.get("status");

        // Simple validation
        if (newStatus == null
                || (!newStatus.equals("REFUNDED") && !newStatus.equals("CANCELLED") && !newStatus.equals("ACTIVE"))) {
            return ResponseEntity.badRequest().body("Invalid status");
        }

        enrollment.setStatus(newStatus);
        enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(enrollment);
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<?> updateEnrollmentProgress(@PathVariable Long id,
            @RequestBody Map<String, Integer> payload) {
        if (id == null)
            return ResponseEntity.badRequest().body("ID cannot be null");
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(id);
        if (enrollmentOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Enrollment not found");
        }
        Enrollment enrollment = enrollmentOpt.get();
        Integer progress = payload.get("progress");

        if (progress == null || progress < 0 || progress > 100) {
            return ResponseEntity.badRequest().body("Invalid progress value (must be 0-100)");
        }

        enrollment.setProgress(progress);

        // Check for completion and generate certificate
        if (progress == 100 && enrollment.getCertificateId() == null) {
            String certId = "CERT-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            enrollment.setCertificateId(certId);
            enrollment.setCertificateIssued(true);
            enrollment.setCertificateDate(LocalDate.now());
        }

        enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(enrollment);
    }
}
