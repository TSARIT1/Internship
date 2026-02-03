package com.tsarit.backend.service;

import com.tsarit.backend.entity.Course;
import com.tsarit.backend.entity.Section;
import com.tsarit.backend.entity.Video;
import com.tsarit.backend.repository.CourseRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.ArrayList;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Optional<Course> getCourseByName(String name) {
        return courseRepository.findByName(name);
    }

    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public java.util.List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course updateCourse(String name, Course updatedData) {
        Course course = courseRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (updatedData.getTotalFee() != null)
            course.setTotalFee(updatedData.getTotalFee());
        if (updatedData.getDiscount() != null)
            course.setDiscount(updatedData.getDiscount());
        if (updatedData.getDescription() != null)
            course.setDescription(updatedData.getDescription());
        if (updatedData.getDuration() != null)
            course.setDuration(updatedData.getDuration());
        if (updatedData.getLevel() != null)
            course.setLevel(updatedData.getLevel());

        return courseRepository.save(course);
    }

    public boolean deleteSection(String courseName, Long sectionId) {
        Optional<Course> courseOpt = courseRepository.findByName(courseName);
        if (courseOpt.isPresent()) {
            Course course = courseOpt.get();
            boolean removed = course.getSections().removeIf(s -> s.getId().equals(sectionId));
            if (removed) {
                courseRepository.save(course);
                return true;
            }
        }
        return false;
    }

    @PostConstruct
    public void seedCourses() {
        if (courseRepository.count() == 0) {
            seedAllCourses();
        }
    }

    private void seedAllCourses() {
        createCourse("Data Science", "4 Months", "Intermediate",
                "Master data analysis, visualization, and machine learning with Python and R.", "Database",
                "text-blue-600", "bg-blue-600/10", "group-hover:border-blue-500/50", "from-blue-600 to-cyan-500",
                "group-hover:shadow-blue-500/20", 1.0, 0.0, "Data & AI");
        createCourse("Machine Learning", "5 Months", "Advanced",
                "Learn to build and deploy machine learning models with Python and TensorFlow.", "Brain",
                "text-purple-600", "bg-purple-600/10", "group-hover:border-purple-500/50",
                "from-purple-600 to-pink-500", "group-hover:shadow-purple-500/20", 1.0, 0.0, "Data & AI");
        createCourse("AI", "6 Months", "Advanced",
                "Dive deep into artificial intelligence, neural networks, and deep learning.", "Brain",
                "text-indigo-600", "bg-indigo-600/10", "group-hover:border-indigo-500/50",
                "from-indigo-600 to-violet-500", "group-hover:shadow-indigo-500/20", 10.0, 0.0, "Data & AI");
        createCourse("MERN Stack", "5 Months", "Intermediate",
                "Build full-stack applications with MongoDB, Express, React, and Node.js.", "Server", "text-orange-600",
                "bg-orange-600/10", "group-hover:border-orange-500/50", "from-orange-600 to-amber-500",
                "group-hover:shadow-orange-500/20", 1.0, 0.0, "Web Development");
        createCourse("DevOps", "4 Months", "Intermediate",
                "Learn CI/CD, Docker, Kubernetes, and infrastructure as code.", "Cloud", "text-sky-600",
                "bg-sky-600/10", "group-hover:border-sky-500/50", "from-sky-600 to-blue-500",
                "group-hover:shadow-sky-500/20", 1.0, 0.0, "Cloud & Ops");
        createCourse("Java Full Stack", "6 Months", "Advanced",
                "Build robust enterprise applications with Java, Spring Boot, Microservices, and React.", "Coffee",
                "text-red-600", "bg-red-600/10", "group-hover:border-red-500/50", "from-red-600 to-rose-500",
                "group-hover:shadow-red-500/20", 1.0, 0.0, "Web Development");
        createCourse("Python Programming", "3 Months", "Beginner",
                "Start your coding journey with Python, the most versatile programming language.", "Code",
                "text-yellow-600", "bg-yellow-600/10", "group-hover:border-yellow-500/50",
                "from-yellow-600 to-amber-500", "group-hover:shadow-yellow-500/20", 1.0, 0.0, "Programming");
        createCourse("AWS Cloud Computing", "5 Months", "Advanced",
                "Become a certified AWS solutions architect and master cloud infrastructure.", "Cloud", "text-teal-600",
                "bg-teal-600/10", "group-hover:border-teal-500/50", "from-teal-600 to-emerald-500",
                "group-hover:shadow-teal-500/20", 1.0, 0.0, "Cloud & Ops");
        createCourse("Cyber Security", "6 Months", "Advanced",
                "Protect organizations from cyber threats and become an ethical hacker.", "Shield", "text-rose-600",
                "bg-rose-600/10", "group-hover:border-rose-500/50", "from-rose-600 to-pink-500",
                "group-hover:shadow-rose-500/20", 1.0, 0.0, "Security");

        System.out.println("Seeded ALL Courses with rich metadata");
    }

    private void createCourse(String name, String duration, String level, String desc, String icon, String color,
            String bg, String border, String grad, String shadow, Double fee, Double discount, String domain) {
        Course c = new Course();
        c.setName(name);
        c.setDuration(duration);
        c.setLevel(level);
        c.setDescription(desc);
        c.setIconName(icon);
        c.setColor(color);
        c.setBgColor(bg);
        c.setBorderColor(border);
        c.setGradient(grad);
        c.setShadow(shadow);
        c.setTotalFee(fee);
        c.setDiscount(discount);
        c.setDomain(domain);

        // Add default sample content for "Data Science" only logic if needed,
        // or just let them be empty. Let's keep Data Science content for demo.
        if (name.equals("Data Science")) {
            addSampleContent(c);
        }

        courseRepository.save(c);
    }

    private void addSampleContent(Course ds) {
        Section s1 = new Section();
        s1.setTitle("Introduction to Data Science");
        Video v1 = new Video();
        v1.setTitle("What is Data Science?");
        v1.setUrl("https://www.youtube.com/embed/ua-CiDNNj30");
        v1.setDuration("10:30");
        v1.setType("youtube");
        s1.getVideos().add(v1);
        ds.getSections().add(s1);
    }

    // --- Content Management Methods ---

    public Course updateLiveLink(String courseName, String link) {
        Course course = courseRepository.findByName(courseName)
                .orElseGet(() -> {
                    Course newCourse = new Course();
                    newCourse.setName(courseName);
                    return newCourse;
                });
        course.setLiveLink(link);
        return courseRepository.save(course);
    }

    public Video addVideoToCourse(String courseName, String sectionTitle, Video video) {
        Course course = courseRepository.findByName(courseName)
                .orElseGet(() -> {
                    Course newCourse = new Course();
                    newCourse.setName(courseName);
                    return newCourse;
                });

        // Find or Create Section
        Section section = course.getSections().stream()
                .filter(s -> s.getTitle().equalsIgnoreCase(sectionTitle))
                .findFirst()
                .orElseGet(() -> {
                    Section newSection = new Section();
                    newSection.setTitle(sectionTitle);
                    course.getSections().add(newSection);
                    return newSection;
                });

        section.getVideos().add(video);
        courseRepository.save(course);
        return video;
    }

    public boolean deleteVideo(String courseName, Long sectionId, Long videoId) {
        Optional<Course> courseOpt = courseRepository.findByName(courseName);
        if (courseOpt.isPresent()) {
            Course course = courseOpt.get();
            Optional<Section> sectionOpt = course.getSections().stream()
                    .filter(s -> s.getId().equals(sectionId))
                    .findFirst();

            if (sectionOpt.isPresent()) {
                Section section = sectionOpt.get();
                boolean removed = section.getVideos().removeIf(v -> v.getId().equals(videoId));
                if (removed) {
                    courseRepository.save(course);
                    return true;
                }
            }
        }
        return false;
    }
}
