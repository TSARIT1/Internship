package com.tsarit.backend.controller;

import com.tsarit.backend.entity.Testimonial;
import com.tsarit.backend.service.TestimonialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
public class TestimonialController {

    @Autowired
    private TestimonialService testimonialService;

    @GetMapping
    public ResponseEntity<List<Testimonial>> getAllTestimonials(@RequestParam(required = false) String type) {
        return ResponseEntity.ok(testimonialService.getAllTestimonials(type));
    }

    @PostMapping
    public ResponseEntity<Testimonial> addTestimonial(@RequestBody Testimonial testimonial) {
        return ResponseEntity.ok(testimonialService.addTestimonial(testimonial));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTestimonial(@PathVariable Long id) {
        testimonialService.deleteTestimonial(id);
        return ResponseEntity.ok("Testimonial deleted successfully");
    }
}
