package com.tsarit.backend.config;

import com.tsarit.backend.entity.Course;
import com.tsarit.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private com.tsarit.backend.service.UserService userService;

        @Override
        public void run(String... args) throws Exception {
                List<Course> defaultCourses = Arrays.asList(
                                createDataObject("Data Science", "/data-science",
                                                "Master the art of data analysis, visualization, and predictive modeling.",
                                                "6 Months", "Beginner to Advanced", "Database",
                                                "from-blue-600 to-cyan-500", "group-hover:border-blue-500/50",
                                                "group-hover:shadow-blue-500/20", "bg-blue-100", "text-blue-600"),
                                createDataObject("Machine Learning", "/machine-learning",
                                                "Build intelligent systems using advanced algorithms and neural networks.",
                                                "6 Months", "Intermediate", "Brain", "from-purple-600 to-pink-500",
                                                "group-hover:border-purple-500/50", "group-hover:shadow-purple-500/20",
                                                "bg-purple-100", "text-purple-600"),
                                createDataObject("AI", "/ai",
                                                "Explore the frontiers of Artificial Intelligence and Generative AI.",
                                                "6 Months", "Advanced", "Code", "from-amber-500 to-orange-500",
                                                "group-hover:border-amber-500/50", "group-hover:shadow-amber-500/20",
                                                "bg-amber-100", "text-amber-600"),
                                createDataObject("MERN Stack", "/mern-stack",
                                                "Become a full-stack developer with MongoDB, Express, React, and Node.js.",
                                                "6 Months", "Intermediate", "Layout", "from-green-500 to-emerald-500",
                                                "group-hover:border-green-500/50", "group-hover:shadow-green-500/20",
                                                "bg-green-100", "text-green-600"),
                                createDataObject("DevOps", "/devops",
                                                "Master CI/CD, Docker, Kubernetes, and Cloud Infrastructure.",
                                                "6 Months", "Advanced", "Server", "from-red-500 to-rose-500",
                                                "group-hover:border-red-500/50", "group-hover:shadow-red-500/20",
                                                "bg-red-100", "text-red-600"),
                                createDataObject("Java Full Stack", "/java-full-stack",
                                                "Build robust enterprise applications using Java, Spring Boot, and React.",
                                                "6 Months", "Beginner", "Coffee", "from-blue-700 to-indigo-600",
                                                "group-hover:border-indigo-500/50", "group-hover:shadow-indigo-500/20",
                                                "bg-indigo-100", "text-indigo-600"),
                                createDataObject("Python Programming", "/python-programming",
                                                "Learn Python from scratch and apply it to real-world projects.",
                                                "4 Months", "Beginner", "Code", "from-yellow-500 to-amber-500",
                                                "group-hover:border-yellow-500/50", "group-hover:shadow-yellow-500/20",
                                                "bg-yellow-100", "text-yellow-600"),
                                createDataObject("AWS Cloud Computing", "/aws-cloud-computing",
                                                "Become a certified AWS solutions architect and cloud engineer.",
                                                "5 Months", "Intermediate", "Cloud", "from-orange-500 to-red-500",
                                                "group-hover:border-orange-500/50", "group-hover:shadow-orange-500/20",
                                                "bg-orange-100", "text-orange-600"),
                                createDataObject("Cyber Security", "/cyber-security",
                                                "Protect systems and networks from digital attacks and threats.",
                                                "6 Months", "Advanced", "Shield", "from-teal-500 to-green-500",
                                                "group-hover:border-teal-500/50", "group-hover:shadow-teal-500/20",
                                                "bg-teal-100", "text-teal-600"));

                for (Course courseData : defaultCourses) {
                        Optional<Course> existingCourseOpt = courseRepository.findByName(courseData.getName());
                        if (existingCourseOpt.isPresent()) {
                                Course existingCourse = existingCourseOpt.get();
                                // Update missing fields
                                if (existingCourse.getSlug() == null || existingCourse.getSlug().isEmpty()) {
                                        existingCourse.setSlug(courseData.getSlug());
                                }
                                // Update other fields to match latest default if needed
                                existingCourse.setDescription(courseData.getDescription());
                                existingCourse.setDuration(courseData.getDuration());
                                existingCourse.setLevel(courseData.getLevel());
                                existingCourse.setIconName(courseData.getIconName());
                                existingCourse.setGradient(courseData.getGradient());
                                existingCourse.setBorderColor(courseData.getBorderColor());
                                existingCourse.setShadow(courseData.getShadow());
                                existingCourse.setBgColor(courseData.getBgColor());
                                existingCourse.setColor(courseData.getColor());

                                courseRepository.save(existingCourse);
                        } else {
                                courseRepository.save(courseData);
                        }
                }
                System.out.println("Course data initialized/updated.");

                // Initialize Admin User — only create if doesn't exist. NEVER override existing password.
                if (userService.findByEmail("admin@tsarit.com").isEmpty()) {
                        com.tsarit.backend.entity.User admin = new com.tsarit.backend.entity.User();
                        admin.setUsername("Admin");
                        admin.setEmail("admin@tsarit.com");
                        admin.setPassword("Admin@123"); // Will be BCrypt-encoded by registerUser
                        admin.setRole("ADMIN");
                        userService.registerUser(admin);
                        System.out.println("Admin user created with default password.");
                } else {
                        System.out.println("Admin user already exists — password unchanged.");
                }
        }

        @Autowired
        private com.tsarit.backend.repository.EnrollmentRepository enrollmentRepository;

        // Rename to createDataObject to avoid confusion, these objects are just data
        // holders until saved
        private Course createDataObject(String name, String slug, String description, String duration, String level,
                        String iconName, String gradient, String borderColor, String shadow, String bgColor,
                        String color) {
                Course course = new Course();
                course.setName(name);
                course.setSlug(slug);
                course.setDescription(description);
                course.setDuration(duration);
                course.setLevel(level);
                course.setIconName(iconName);
                course.setGradient(gradient);
                course.setBorderColor(borderColor);
                course.setShadow(shadow);
                course.setBgColor(bgColor);
                course.setColor(color);
                course.setTotalFee(19999.0);
                course.setDiscount(9999.0);
                return course;
        }
}
