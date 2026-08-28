package com.tsarit.backend.repository;

import com.tsarit.backend.entity.Enrollment;
import com.tsarit.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUser(User user);

    Optional<Enrollment> findByUserAndCourseName(User user, String courseName);

    Optional<Enrollment> findByCertificateId(String certificateId);

    List<Enrollment> findByCertificateIssued(boolean certificateIssued);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(e.amountPaid) FROM Enrollment e")
    Double getTotalRevenue();
}
