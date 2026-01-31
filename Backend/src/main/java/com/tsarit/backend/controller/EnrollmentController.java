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

            enrollmentRepository.save(enrollment);

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
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentRepository.findAll());
    }

    @PutMapping("/{id}/certificate")
    public ResponseEntity<?> updateCertificateStatus(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(id);
        if (enrollmentOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Enrollment not found");
        }
        Enrollment enrollment = enrollmentOpt.get();
        Boolean status = (Boolean) payload.get("status");
        enrollment.setCertificateIssued(status);
        if (status) {
            enrollment.setCertificateDate(LocalDate.now());
        } else {
            enrollment.setCertificateDate(null);
        }
        enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(enrollment);
    }
}
