package com.tsarit.backend.controller;

import com.tsarit.backend.entity.Course;
import com.tsarit.backend.entity.Video;
import com.tsarit.backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/{name}")
    public ResponseEntity<?> getCourseByName(@PathVariable String name) {
        Optional<Course> course = courseService.getCourseByName(name);
        if (course.isPresent()) {
            return ResponseEntity.ok(course.get());
        } else {
            // Return 404 if not found, OR return empty structure/default if preferred for
            // behavior consistency
            return ResponseEntity.status(404).body("Course not found");
        }
    }

    @PutMapping("/{name}/live-link")
    public ResponseEntity<?> updateLiveLink(@PathVariable String name, @RequestBody Map<String, String> payload) {
        String link = payload.get("link");
        courseService.updateLiveLink(name, link);
        return ResponseEntity.ok("Live link updated successfully");
    }

    @PostMapping("/{courseName}/videos")
    public ResponseEntity<?> addVideo(@PathVariable String courseName, @RequestBody AddVideoRequest request) {
        Video video = new Video();
        video.setTitle(request.getTitle());
        video.setUrl(request.getUrl());
        video.setDuration(request.getDuration());
        video.setType(request.getType());

        courseService.addVideoToCourse(courseName, request.getSection(), video);
        return ResponseEntity.ok("Video added successfully");
    }

    @DeleteMapping("/{courseName}/sections/{sectionId}/videos/{videoId}")
    public ResponseEntity<?> deleteVideo(@PathVariable String courseName, @PathVariable Long sectionId,
            @PathVariable Long videoId) {
        boolean removed = courseService.deleteVideo(courseName, sectionId, videoId);
        if (removed) {
            return ResponseEntity.ok("Video deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Video or Course not found");
        }
    }

    // DTO
    static class AddVideoRequest {
        private String title;
        private String url;
        private String duration;
        private String type;
        private String section;

        // Getters and Setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getSection() {
            return section;
        }

        public void setSection(String section) {
            this.section = section;
        }
    }
}
