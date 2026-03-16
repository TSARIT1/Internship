package com.tsarit.backend.service;

import com.tsarit.backend.entity.PasswordResetToken;
import com.tsarit.backend.entity.User;
import com.tsarit.backend.repository.PasswordResetTokenRepository;
import com.tsarit.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Initiate password reset by sending a 6-digit OTP to the user's email.
     * Returns true if the email was found and OTP was sent, false otherwise.
     */
    @Transactional
    public boolean initiateReset(String email) {
        logger.info("Forgot password request for email: {}", email);
        Optional<User> userOpt = userRepository.findFirstByEmail(email);
        if (userOpt.isEmpty()) {
            logger.warn("Email not found in database: {}", email);
            return false; // Email not registered
        }
        User user = userOpt.get();
        logger.info("User found: ID={}, Username={}", user.getId(), user.getUsername());

        // Clean any existing token/OTP for this user
        tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        logger.info("Generated OTP for user {}: {}", user.getEmail(), otp);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(otp);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(10)); // 10 minute expiry

        tokenRepository.save(resetToken);

        try {
            sendOtpEmail(user.getEmail(), otp);
            logger.info("OTP email sent successfully to {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}: {}", user.getEmail(), e.getMessage());
            // Still return true - user exists, OTP is saved. They can check logs or resend.
        }
        return true;
    }

    /**
     * Verify the OTP entered by the user.
     * Returns a temporary reset token (UUID) on success, or null on failure.
     */
    @Transactional
    public String verifyOtp(String email, String otp) {
        Optional<User> userOpt = userRepository.findFirstByEmail(email);
        if (userOpt.isEmpty()) {
            return null;
        }
        User user = userOpt.get();

        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(otp);
        if (tokenOpt.isEmpty()) {
            return null;
        }

        PasswordResetToken resetToken = tokenOpt.get();

        // Verify OTP belongs to the correct user
        if (!resetToken.getUser().getId().equals(user.getId())) {
            return null;
        }

        if (resetToken.isExpired()) {
            return null;
        }

        // OTP verified — replace it with a temporary reset token
        String tempToken = UUID.randomUUID().toString();
        resetToken.setToken(tempToken);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15)); // 15 min to reset
        tokenRepository.save(resetToken);

        return tempToken;
    }

    /**
     * Reset the password using the temporary reset token from OTP verification.
     */
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

    private void sendOtpEmail(String to, String otp) {
        String subject = "Password Reset OTP - TSARIT";
        String content = "Hello,\n\n" +
                "Your OTP for password reset is:\n\n" +
                "    " + otp + "\n\n" +
                "This OTP is valid for 10 minutes.\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best Regards,\nTSAR IT Services Team";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        message.setFrom(fromEmail);

        mailSender.send(message);
    }
}
