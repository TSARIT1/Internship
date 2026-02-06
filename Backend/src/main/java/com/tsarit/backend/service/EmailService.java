package com.tsarit.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEnrollmentEmail(String toEmail, String studentName, String courseName, Double amountPaid,
            String transactionId) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@tsarit.com"); // Will be overridden by SMTP auth user usually
            message.setTo(toEmail);
            message.setSubject("Enrollment Confirmed: " + courseName);

            String text = String.format("""
                    Dear %s,

                    Congratulations! You have successfully enrolled in the course: %s.

                    Payment Details:
                    Amount Paid: ₹%.2f
                    Transaction ID: %s

                    Your learning journey starts now! Log in to your dashboard to access the course content.

                    Best Regards,
                    TSAR IT Services Team
                    """, studentName, courseName, amountPaid, transactionId);

            message.setText(text);

            mailSender.send(message);
            System.out.println("Email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
            // We do NOT throw exception here to avoid dealing with rollback of enrollment
            // just because email failed. It's a non-critical side effect.
        }
    }

    public void sendContactQueryEmail(com.tsarit.backend.entity.ContactQuery query) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@tsarit.com");
            message.setTo("nnikhiln2002@gmail.com"); // Admin email
            message.setSubject("New Contact Query: " + query.getSubject());

            String text = String.format("""
                    New Contact Query Received!

                    Name: %s
                    Email: %s
                    Subject: %s

                    Message:
                    %s

                    Date: %s
                    """, query.getName(), query.getEmail(), query.getSubject(), query.getMessage(),
                    query.getCreatedAt());

            message.setText(text);

            mailSender.send(message);
            System.out.println("Contact email sent to admin.");
        } catch (Exception e) {
            System.err.println("Failed to send contact email: " + e.getMessage());
        }
    }
}
