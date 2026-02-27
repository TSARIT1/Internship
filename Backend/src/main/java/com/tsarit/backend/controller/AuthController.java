package com.tsarit.backend.controller;

import com.tsarit.backend.entity.User;
import com.tsarit.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Adjust for frontend URL
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.tsarit.backend.security.JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@jakarta.validation.Valid @RequestBody User user) {
        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Login attempt for identifier: {}", loginRequest.getUsername());

            Optional<User> userOptional = userService.findByUsername(loginRequest.getUsername());

            if (userOptional.isEmpty()) {
                logger.info("User not found by username. Trying email...");
                userOptional = userService.findByEmail(loginRequest.getUsername());
            }

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                logger.info("User found: ID={}, Username={}, Email={}, Role={}", user.getId(), user.getUsername(),
                        user.getEmail(), user.getRole());

                String rawPassword = loginRequest.getPassword();
                String storedPassword = user.getPassword();

                if (rawPassword == null) {
                    return ResponseEntity.badRequest().body("Password is required");
                }

                // Log hashes (TEMPORARY DEBUGGING)
                logger.info("Stored Password Hash: {}", storedPassword);
                // logger.info("Raw Password: {}", rawPassword); // refrain from logging raw
                // password if possible, or do it only if seemingly impossible to debug
                // otherwise

                // 1. Check if password matches using the Encoder (Normal Case)
                boolean matchesEncoded = storedPassword != null && passwordEncoder.matches(rawPassword, storedPassword);
                logger.info("PasswordEncoder Match Result: {}", matchesEncoded);

                if (matchesEncoded) {
                    logger.info("Login successful for user: {}", user.getUsername());
                    String token = jwtUtils.generateJwtToken(user);

                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("user", user);

                    return ResponseEntity.ok(response);
                }
                // 2. Fallback: Check if it matches as Plain Text (Legacy/Migration Case)
                else if (storedPassword != null && storedPassword.equals(rawPassword)) {
                    logger.warn("Legacy plain text password detected for user: {}. Migrating to BCrypt.",
                            user.getUsername());

                    // Encode and Update
                    String encodedPassword = passwordEncoder.encode(rawPassword);
                    userService.updatePasswordDirectly(user.getId(), encodedPassword);

                    // Update the local user object
                    user.setPassword(encodedPassword);

                    // GENERATE TOKEN
                    String token = jwtUtils.generateJwtToken(user);
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("user", user);

                    return ResponseEntity.ok(response);
                } else {
                    logger.error("Password mismatch for user: {}", user.getUsername());
                }
            } else {
                logger.error("User not found for identifier: {}", loginRequest.getUsername());
            }
            return ResponseEntity.status(401).body("Invalid username or password");
        } catch (Exception e) {
            logger.error("Internal error during login", e);
            return ResponseEntity.status(500).body("Internal error during login: " + e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/update-user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            // We can add specific logic here if we want to ensure only certain fields are
            // updated
            // For now, using the service method which likely saves the whole entity
            User existingUser = userService.updateUser(id, user);
            return ResponseEntity.ok(existingUser); // Return updated user
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest request) {
        try {
            boolean success = userService.changePassword(id, request.getCurrentPassword(), request.getNewPassword());
            if (success) {
                return ResponseEntity.ok("Password changed successfully");
            } else {
                return ResponseEntity.badRequest().body("Incorrect current password");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // DTO for password change
    static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;

        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

    @Autowired
    private com.tsarit.backend.service.PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        passwordResetService.initiateReset(email);
        return ResponseEntity.ok("If an account exists with this email, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Token and new password are required");
        }

        boolean success = passwordResetService.resetPassword(token, newPassword);
        if (success) {
            return ResponseEntity.ok("Password reset successfully. You can now login.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired token.");
        }
    }

    static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
