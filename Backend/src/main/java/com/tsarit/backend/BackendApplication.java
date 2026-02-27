package com.tsarit.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class BackendApplication {

	private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner updateSchema(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				// Force update columns to support longer URLs via TEXT type (65,535 chars)
				log.info("Attempting to update database schema for Testimonials...");
				jdbcTemplate.execute("ALTER TABLE testimonials MODIFY video_url TEXT");
				jdbcTemplate.execute("ALTER TABLE testimonials MODIFY thumbnail TEXT");
				jdbcTemplate.execute("ALTER TABLE testimonials MODIFY image TEXT");
				jdbcTemplate.execute("ALTER TABLE testimonials MODIFY message TEXT");
				log.info("Schema updated successfully: Testimonial columns resized to TEXT.");

				// Force update columns for Webinars table
				log.info("Attempting to update database schema for Webinars...");
				jdbcTemplate.execute("ALTER TABLE webinars MODIFY description TEXT");
				jdbcTemplate.execute("ALTER TABLE webinars MODIFY meeting_link TEXT");
				jdbcTemplate.execute("ALTER TABLE webinars MODIFY image TEXT");
				log.info("Schema updated successfully: Webinar columns resized to TEXT.");

				// Force update columns for Hackathons table
				log.info("Attempting to update database schema for Hackathons...");
				jdbcTemplate.execute("ALTER TABLE hackathons MODIFY description TEXT");
				log.info("Schema updated successfully: Hackathon columns resized to TEXT.");
			} catch (Exception e) {
				log.error("Schema update failed or warning: {}", e.getMessage());
			}
		};
	}

}
