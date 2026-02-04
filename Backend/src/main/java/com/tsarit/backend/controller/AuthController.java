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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for: " + loginRequest.getUsername());

            Optional<User> userOptional = userService.findByUsername(loginRequest.getUsername());

            if (userOptional.isEmpty()) {
                userOptional = userService.findByEmail(loginRequest.getUsername());
            }

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                String rawPassword = loginRequest.getPassword();
                String storedPassword = user.getPassword();

                if (rawPassword == null) {
                    return ResponseEntity.badRequest().body("Password is required");
                }

                // 1. Check if password matches using the Encoder (Normal Case)
                // specific check to avoid NPEs if stored password is null
                if (storedPassword != null && passwordEncoder.matches(rawPassword, storedPassword)) {
                    System.out.println("Login successful for user: " + user.getUsername());
                    String token = jwtUtils.generateJwtToken(user);

                    Map<String, Object> response = new HashMap<>(); // Change return type to Map or specific DTO
                    response.put("token", token);
                    response.put("user", user);

                    return ResponseEntity.ok(response);
                }
                // 2. Fallback: Check if it matches as Plain Text (Legacy/Migration Case)
                else if (storedPassword != null && storedPassword.equals(rawPassword)) {
                    System.out.println("Legacy plain text password detected for user: " + user.getUsername()
                            + ". Migrating to BCrypt.");

                    // Encode and Update
                    String encodedPassword = passwordEncoder.encode(rawPassword);
                    userService.updatePasswordDirectly(user.getId(), encodedPassword);

                    // Update the local user object
                    user.setPassword(encodedPassword);

                    // GENERATE TOKEN
                    String token = jwtUtils.generateJwtToken(user);
                    Map<String, Object> response = new HashMap<>(); // Standard Map
                    response.put("token", token);
                    response.put("user", user);

                    return ResponseEntity.ok(response);
                } else {
                    System.out.println("Password mismatch for user: " + user.getUsername());
                }
            } else {
                System.out.println("User not found for identifier: " + loginRequest.getUsername());
            }
            return ResponseEntity.status(401).body("Invalid username or password");
        } catch (Exception e) {
            e.printStackTrace();
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
            userService.updateUser(id, user);
            return ResponseEntity.ok("User updated successfully");
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
