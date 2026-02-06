package com.tsarit.backend.service;

import com.tsarit.backend.entity.PasswordResetToken;
import com.tsarit.backend.entity.User;
import com.tsarit.backend.repository.PasswordResetTokenRepository;
import com.tsarit.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void initiateReset(String email) {
        Optional<User> userOpt = userRepository.findFirstByEmail(email);
        if (userOpt.isEmpty()) {
            // For security, checking silently or throwing general error logic could be
            // used.
            // But we'll throw here to let controller decide response or silence it.
            return;
        }
        User user = userOpt.get();

        // Check if token exists, delete/invalidate if desired?
        // We'll just create a new one. @OneToOne might require cleaning up old one
        // depending on constraints.
        // Repository has deleteByUser logic if needed.
        // For simplicity, we just save a new token entry. If one-to-one is strict on
        // DB, we handle it.
        // The Entity is mapped properly.

        // Clean any existing token
        tokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(token);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(24)); // 24 hour expiry

        tokenRepository.save(resetToken);

        sendEmail(user.getEmail(), token);
    }

    private void sendEmail(String to, String token) {
        String resetUrl = "http://localhost:5173/reset-password?token=" + token;
        String subject = "Reset Your Password - TSARIT";
        String content = "Hello,\n\n" +
                "You requested to reset your password.\n" +
                "Click the link below to change your password:\n\n" +
                resetUrl + "\n\n" +
                "This link will expire in 24 hours.\n" +
                "If you did not request this, please ignore this email.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        message.setFrom("support@tsarit.com"); // Replaced by spring.mail.username usually

        mailSender.send(message);
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return false;
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.isExpired()) {
            return false;
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete token after use
        tokenRepository.delete(resetToken);

        return true;
    }
}
