package com.tsarit.backend.repository;

import com.tsarit.backend.entity.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    java.util.List<Testimonial> findByVideoUrlIsNotNull();

    java.util.List<Testimonial> findByVideoUrlIsNull();
}
