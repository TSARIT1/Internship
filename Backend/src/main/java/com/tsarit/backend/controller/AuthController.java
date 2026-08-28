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
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.tsarit.backend.security.JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@jakarta.validation.Valid @RequestBody User user) {
        if (user.getUsername() != null) user.setUsername(user.getUsername().trim());
        if (user.getEmail() != null) user.setEmail(user.getEmail().trim().toLowerCase());
        if (user.getPhone() != null) user.setPhone(user.getPhone().trim());

        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("STUDENT");
        }
        userService.registerUser(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully", "username", user.getUsername(), "email", user.getEmail()));
    }

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String identifier = loginRequest.getUsername() != null ? loginRequest.getUsername() : loginRequest.getEmail();
            logger.info("Login attempt for identifier: {}", identifier);

            Optional<User> userOptional = userService.findByUsername(identifier);

            if (userOptional.isEmpty()) {
                logger.info("User not found by username. Trying email...");
                userOptional = userService.findByEmail(identifier);
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
                    if (Boolean.TRUE.equals(user.getIsFrozen())) {
                        logger.warn("Frozen user attempted login: {}", user.getUsername());
                        return ResponseEntity.status(403).body(Map.of(
                                "message", "Your account has been temporarily frozen by administration. Please contact tsarit@tsaritservices.com to resolve.",
                                "isFrozen", true
                        ));
                    }

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
            User existingUser = userService.updateUser(id, user);
            return ResponseEntity.ok(existingUser); // Return updated user
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/users/{id}/toggle-freeze")
    public ResponseEntity<?> toggleFreeze(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> payload) {
        try {
            Boolean freeze = payload != null && payload.containsKey("freeze") ? (Boolean) payload.get("freeze") : null;
            String reason = payload != null && payload.containsKey("reason") ? (String) payload.get("reason") : null;
            User updated = userService.toggleFreezeUser(id, freeze, reason);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", (Boolean.TRUE.equals(updated.getIsFrozen()) ? "Account has been frozen" : "Account has been reactivated"),
                    "user", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("message", "Failed to update freeze status: " + e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to delete user: " + e.getMessage()));
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
        try {
            String email = payload.get("email");
            if (email == null || email.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            boolean sent = passwordResetService.initiateReset(email);
            if (!sent) {
                return ResponseEntity.badRequest().body(Map.of("message", "This mail id is not registered"));
            }
            return ResponseEntity.ok(Map.of("message", "OTP sent to your registered email"));
        } catch (Exception e) {
            logger.error("Error in forgot-password: ", e);
            return ResponseEntity.status(500).body(Map.of("message", "Failed to process request. Please try again."));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and OTP are required"));
        }

        String resetToken = passwordResetService.verifyOtp(email, otp);
        if (resetToken == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP"));
        }
        return ResponseEntity.ok(Map.of("message", "OTP verified successfully", "resetToken", resetToken));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token and new password are required"));
        }

        boolean success = passwordResetService.resetPassword(token, newPassword);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Password reset successfully. You can now login."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired token."));
        }
    }

    static class LoginRequest {
        private String username;
        private String email;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
