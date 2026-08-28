package com.tsarit.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableAsync;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;

@EnableAsync
@SpringBootApplication
public class BackendApplication {

	private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner updateSchema(JdbcTemplate jdbcTemplate, com.tsarit.backend.service.UserService userService) {
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

				// Seed default super admin (tsaritservices@gmail.com / Tsarit@12345)
				Optional<com.tsarit.backend.entity.User> superAdminOpt = userService.findByEmail("tsaritservices@gmail.com");
				if (superAdminOpt.isEmpty()) {
					com.tsarit.backend.entity.User superAdmin = new com.tsarit.backend.entity.User();
					superAdmin.setUsername("Super Admin");
					superAdmin.setEmail("tsaritservices@gmail.com");
					superAdmin.setPassword("Tsarit@12345");
					superAdmin.setRole("ADMIN");
					userService.registerUser(superAdmin);
					log.info("Seeded default super admin: tsaritservices@gmail.com / Tsarit@12345");
				} else {
					com.tsarit.backend.entity.User superAdmin = superAdminOpt.get();
					superAdmin.setRole("ADMIN");
					userService.updatePasswordDirectly(superAdmin.getId(), userService.getPasswordEncoder().encode("Tsarit@12345"));
					log.info("Ensured super admin credentials for tsaritservices@gmail.com -> Tsarit@12345");
				}

				// Also ensure admin@tsarit.com is sync'd
				Optional<com.tsarit.backend.entity.User> adminOpt = userService.findByEmail("admin@tsarit.com");
				if (adminOpt.isPresent()) {
					com.tsarit.backend.entity.User existingAdmin = adminOpt.get();
					existingAdmin.setRole("ADMIN");
					userService.updatePasswordDirectly(existingAdmin.getId(), userService.getPasswordEncoder().encode("Tsarit@12345"));
				}
			} catch (Exception e) {
				log.error("Schema update failed or warning: {}", e.getMessage());
			}
		};
	}

}
