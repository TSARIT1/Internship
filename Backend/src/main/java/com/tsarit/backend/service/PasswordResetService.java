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
import java.security.SecureRandom;
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

    @org.springframework.beans.factory.annotation.Value("${app.mail.from:tsarit@tsaritservices.com}")
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
        String otp = String.format("%06d", new SecureRandom().nextInt(1000000));
        logger.debug("Generated OTP for user {}", user.getEmail());

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
        String subject = "Password Reset OTP - TSAR IT Internship";
        String htmlContent = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 540px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
                    <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: #ffffff; padding: 24px 28px;">
                        <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #38bdf8;">Password Reset Request</h2>
                    </div>
                    <div style="padding: 28px; color: #334155; line-height: 1.6;">
                        <p style="font-size: 15px; margin-top: 0;">We received a request to reset your password for your TSAR IT Internship account.</p>
                        <div style="text-align: center; margin: 24px 0; background: #f8fafc; padding: 18px; border-radius: 8px; border: 1px dashed #cbd5e1;">
                            <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">Your One-Time Password (OTP)</span>
                            <strong style="font-size: 32px; letter-spacing: 6px; color: #0284c7; font-family: monospace;">%s</strong>
                        </div>
                        <p style="font-size: 13px; color: #64748b;">This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
                        <p style="font-size: 13px; color: #94a3b8; margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 12px;">If you did not request a password reset, you can safely ignore this email.</p>
                    </div>
                    <div style="background-color: #f8fafc; padding: 14px 28px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                        TSAR IT Internship Team &bull; <a href="https://internship.tsaritservices.com" style="color: #2563eb;">internship.tsaritservices.com</a>
                    </div>
                </div>
                """.formatted(otp);

        String textContent = String.format("""
                Dear User,

                We received a request to reset your password for your TSAR IT Internship account.

                Your One-Time Password (OTP) is: %s

                This OTP is valid for 10 minutes. Please do not share this code with anyone.

                Best Regards,
                TSAR IT Services Team
                https://internship.tsaritservices.com/
                """, otp);

        try {
            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromEmail != null ? fromEmail : "tsarit@tsaritservices.com", "TSAR IT Internship");
            helper.setTo(to.trim());
            helper.setSubject(subject);
            helper.setText(textContent, htmlContent);
            mailSender.send(mimeMessage);
            logger.info("Password reset OTP sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send OTP to {}: {}", to, e.getMessage());
        }
    }
}
