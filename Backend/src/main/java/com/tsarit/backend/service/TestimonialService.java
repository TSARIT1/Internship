package com.tsarit.backend.service;

import com.tsarit.backend.entity.Testimonial;
import com.tsarit.backend.repository.TestimonialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestimonialService {

    @Autowired
    private TestimonialRepository testimonialRepository;

    public List<Testimonial> getAllTestimonials(String type) {
        if ("VIDEO".equalsIgnoreCase(type)) {
            return testimonialRepository.findByVideoUrlIsNotNull();
        } else if ("TEXT".equalsIgnoreCase(type)) {
            return testimonialRepository.findByVideoUrlIsNull();
        }
        return testimonialRepository.findAll();
    }

    public Testimonial addTestimonial(Testimonial testimonial) {
        return testimonialRepository.save(testimonial);
    }

    public void deleteTestimonial(Long id) {
        testimonialRepository.deleteById(id);
    }
}
