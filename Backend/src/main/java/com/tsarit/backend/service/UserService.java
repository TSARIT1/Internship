package com.tsarit.backend.service;

import com.tsarit.backend.entity.User;
import com.tsarit.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findFirstByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findFirstByEmail(email);
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedUser.getUsername() != null)
            existingUser.setUsername(updatedUser.getUsername());
        if (updatedUser.getPhone() != null)
            existingUser.setPhone(updatedUser.getPhone());

        // Enrollment Updates
        if (updatedUser.getCourse() != null)
            existingUser.setCourse(updatedUser.getCourse());
        if (updatedUser.getTotalFee() != null)
            existingUser.setTotalFee(updatedUser.getTotalFee());
        if (updatedUser.getDiscount() != null)
            existingUser.setDiscount(updatedUser.getDiscount());

        // Certificate Updates
        if (updatedUser.isCertificateIssued()) {
            existingUser.setCertificateIssued(true);
            existingUser.setCertificateDate(updatedUser.getCertificateDate());
        }

        // Profile Picture Update
        if (updatedUser.getProfilePicture() != null) {
            existingUser.setProfilePicture(updatedUser.getProfilePicture());
        }

        return userRepository.save(existingUser);
    }

    public boolean changePassword(Long id, String currentPassword, String newPassword) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    public void updatePasswordDirectly(Long id, String encryptedPassword) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(encryptedPassword);
        userRepository.save(user);
    }

    public User toggleFreezeUser(Long id, Boolean freeze, String reason) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsFrozen(freeze != null ? freeze : !user.getIsFrozen());
        if (reason != null) {
            user.setFreezeReason(reason);
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public PasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }
}
