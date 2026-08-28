package com.tsarit.backend.service;

import com.tsarit.backend.entity.ContactQuery;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.enabled:true}")
    private boolean enabled;

    @Value("${app.mail.from:tsarit@tsaritservices.com}")
    private String fromAddress;

    @Value("${app.mail.from-name:TSAR IT Internship Portal}")
    private String fromName;

    @Value("${app.mail.notifications-to:tsaritservices@gmail.com,tsarit@tsaritservices.com,info@tsaritservices.com}")
    private String notificationsTo;

    @Value("${app.mail.send-user-confirmation:true}")
    private boolean sendUserConfirmation;

    @Async
    public void sendContactQueryEmail(ContactQuery query) {
        if (!enabled || mailSender == null) {
            log.info("Email service disabled or not configured. Skipping contact query notification.");
            return;
        }

        String subject = query.getSubject() != null && !query.getSubject().isBlank()
                ? query.getSubject()
                : "Internship Inquiry";
        String studentName = query.getName() != null && !query.getName().isBlank() ? query.getName() : "Student / Applicant";
        String studentEmail = query.getEmail();
        String studentPhone = query.getPhone() != null ? query.getPhone() : "N/A";
        String studentCourse = query.getCourse() != null ? query.getCourse() : "General Internship";
        String messageBody = query.getMessage() != null ? query.getMessage() : "No message provided.";
        String timeStr = query.getCreatedAt() != null ? query.getCreatedAt().toString() : LocalDateTime.now().format(DATE_FORMATTER);

        // 1. Team Notification Email
        String teamSubject = "[TSAR IT Internship Lead] " + subject + " - " + studentName;
        String teamHtml = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
                    <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: #ffffff; padding: 24px 30px;">
                        <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #38bdf8;">TSAR IT Internship Portal - New Lead Received</h2>
                    </div>
                    <div style="padding: 30px; color: #334155; line-height: 1.6;">
                        <p style="font-size: 15px; margin-top: 0;">A new student inquiry/lead has been submitted on the Internship portal:</p>
                        <table style="width: 100%%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; font-weight: 600; color: #64748b; width: 140px;">Student Name:</td><td style="padding: 10px 0; color: #0f172a; font-weight: 600;">%s</td></tr>
                            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; font-weight: 600; color: #64748b;">Email Address:</td><td style="padding: 10px 0; color: #0f172a;"><a href="mailto:%s" style="color: #2563eb; text-decoration: none;">%s</a></td></tr>
                            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; font-weight: 600; color: #64748b;">Phone:</td><td style="padding: 10px 0; color: #0f172a;">%s</td></tr>
                            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; font-weight: 600; color: #64748b;">Interested Course:</td><td style="padding: 10px 0; color: #0f172a; font-weight: 600;">%s</td></tr>
                            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; font-weight: 600; color: #64748b;">Subject:</td><td style="padding: 10px 0; color: #0f172a;">%s</td></tr>
                            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; font-weight: 600; color: #64748b;">Submitted At:</td><td style="padding: 10px 0; color: #0f172a;">%s</td></tr>
                        </table>
                        <div style="background-color: #f8fafc; border-left: 4px solid #38bdf8; padding: 16px; border-radius: 4px; margin-top: 15px;">
                            <strong style="color: #0f172a; display: block; margin-bottom: 6px;">Student Message:</strong>
                            <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #334155;">%s</p>
                        </div>
                    </div>
                    <div style="background-color: #f8fafc; padding: 16px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                        TSAR IT Internship Lead Notification System &bull; <a href="https://internship.tsaritservices.com" style="color: #2563eb;">internship.tsaritservices.com</a>
                    </div>
                </div>
                """.formatted(studentName, studentEmail, studentEmail, studentPhone, studentCourse, subject, timeStr, messageBody);

        String teamText = String.format("""
                [TSAR IT Internship - New Inquiry]
                Student Name: %s
                Email: %s
                Phone: %s
                Course: %s
                Subject: %s
                Date: %s
                
                Message:
                %s
                """, studentName, studentEmail, studentPhone, studentCourse, subject, timeStr, messageBody);

        for (String recipient : parseRecipients(notificationsTo)) {
            sendMail(recipient, teamSubject, teamHtml, teamText);
        }

        // 2. User Auto-Responder (24-Hour Promise from tsarit@tsaritservices.com)
        if (sendUserConfirmation && studentEmail != null && studentEmail.contains("@")) {
            String userSubject = "We have received your request - TSAR IT Internship Team";
            String userHtml = """
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
                        <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: #ffffff; padding: 26px 30px;">
                            <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #38bdf8;">TSAR IT Internship & Skill Development</h2>
                        </div>
                        <div style="padding: 30px; color: #334155; line-height: 1.6;">
                            <p style="font-size: 15px; margin-top: 0;">Dear <strong>%s</strong>,</p>
                            <p style="font-size: 15px;">Thank you for contacting <strong>TSAR IT Services Internship Program</strong>. We have received your request regarding <strong>%s</strong>.</p>
                            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; padding: 14px 18px; border-radius: 6px; margin: 20px 0;">
                                <p style="margin: 0; color: #166534; font-weight: 600; font-size: 14px;">
                                    &#10003; Our mentorship and admissions team will review your inquiry and get back to you within <strong>24 hours</strong>.
                                </p>
                            </div>
                            <h4 style="margin: 20px 0 10px; color: #0f172a; font-size: 14px;">Your Submission Summary:</h4>
                            <table style="width: 100%%; border-collapse: collapse; font-size: 13px; background-color: #f8fafc; border-radius: 6px; padding: 12px;">
                                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 12px; color: #64748b; font-weight: 600;">Course / Domain:</td><td style="padding: 8px 12px; color: #0f172a;">%s</td></tr>
                                <tr><td style="padding: 8px 12px; color: #64748b; font-weight: 600;">Subject:</td><td style="padding: 8px 12px; color: #0f172a;">%s</td></tr>
                            </table>
                            <p style="font-size: 14px; margin-top: 24px; color: #475569;">
                                If you need immediate assistance, feel free to reply directly to this email (<a href="mailto:tsarit@tsaritservices.com" style="color: #2563eb;">tsarit@tsaritservices.com</a>) or reach out to our team.
                            </p>
                            <p style="margin-bottom: 0; color: #0f172a; font-weight: 600;">
                                Best regards,<br>
                                <span style="color: #2563eb;">TSAR IT Internship & Admissions Team</span><br>
                                <a href="https://internship.tsaritservices.com" style="font-size: 13px; color: #64748b; text-decoration: none;">https://internship.tsaritservices.com</a>
                            </p>
                        </div>
                    </div>
                    """.formatted(studentName, subject, studentCourse, subject);

            String userText = String.format("""
                    Dear %s,

                    Thank you for contacting TSAR IT Services Internship Program.
                    We have received your request regarding '%s'.

                    Our mentorship and admissions team will review your inquiry and get back to you within 24 hours.

                    Summary of inquiry:
                    - Course/Domain: %s
                    - Subject: %s

                    Best regards,
                    TSAR IT Internship & Admissions Team
                    tsarit@tsaritservices.com
                    https://internship.tsaritservices.com
                    """, studentName, subject, studentCourse, subject);

            sendMail(studentEmail.trim(), userSubject, userHtml, userText);
        }
    }

    @Async
    public void sendEnrollmentEmail(String toEmail, String studentName, String courseName, Double amountPaid,
                                    String transactionId) {
        if (!enabled || mailSender == null || toEmail == null) {
            return;
        }
        try {
            String subject = "Enrollment Confirmed: " + courseName + " - TSAR IT";
            String html = """
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
                        <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: #ffffff; padding: 26px 30px;">
                            <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #38bdf8;">Enrollment Confirmed!</h2>
                        </div>
                        <div style="padding: 30px; color: #334155; line-height: 1.6;">
                            <p style="font-size: 15px; margin-top: 0;">Dear <strong>%s</strong>,</p>
                            <p style="font-size: 15px;">Congratulations! You have successfully enrolled in <strong>%s</strong>.</p>
                            <table style="width: 100%%; border-collapse: collapse; margin: 20px 0; font-size: 14px; background: #f8fafc; border-radius: 8px;">
                                <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Amount Paid:</td><td style="padding: 10px 14px; color: #16a34a; font-weight: 700;">₹%.2f</td></tr>
                                <tr><td style="padding: 10px 14px; color: #64748b; font-weight: 600;">Transaction ID:</td><td style="padding: 10px 14px; color: #0f172a; font-family: monospace;">%s</td></tr>
                            </table>
                            <p style="font-size: 14px; color: #475569;">Your learning journey starts now! Log in to your student dashboard to start the curriculum.</p>
                            <p style="margin-bottom: 0; color: #0f172a; font-weight: 600;">
                                Best regards,<br>
                                <span style="color: #2563eb;">TSAR IT Services Team</span>
                            </p>
                        </div>
                    </div>
                    """.formatted(studentName, courseName, amountPaid, transactionId);

            String text = String.format("""
                    Dear %s,

                    Congratulations! You have successfully enrolled in the course: %s.

                    Payment Details:
                    Amount Paid: ₹%.2f
                    Transaction ID: %s

                    Best Regards,
                    TSAR IT Services Team
                    """, studentName, courseName, amountPaid, transactionId);

            sendMail(toEmail, subject, html, text);

            // Also alert team
            for (String recipient : parseRecipients(notificationsTo)) {
                sendMail(recipient, "[TSAR IT Internship Enrollment] " + studentName + " enrolled in " + courseName, html, text);
            }
        } catch (Exception e) {
            log.error("Failed to send enrollment email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendGenericEmail(String toEmail, String subject, String bodyText) {
        if (!enabled || mailSender == null || toEmail == null || toEmail.isBlank()) {
            return;
        }
        try {
            String html = "<div style=\"font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #1e293b; line-height: 1.6;\">"
                    + "<h2 style=\"color: #2563eb; margin-bottom: 12px;\">TSAR IT Services & Helpdesk</h2>"
                    + "<div style=\"background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; white-space: pre-line;\">"
                    + bodyText
                    + "</div>"
                    + "<p style=\"font-size: 12px; color: #64748b; margin-top: 20px;\">Official Communication from TSAR IT Services Pvt Ltd | tsarit@tsaritservices.com</p>"
                    + "</div>";
            sendMail(toEmail, subject, html, bodyText);
        } catch (Exception e) {
            log.error("Failed to send generic email to {}: {}", toEmail, e.getMessage());
        }
    }

    private void sendMail(String to, String subject, String htmlContent, String plainTextContent) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromAddress, fromName);
            helper.setTo(to.trim());
            helper.setSubject(subject);
            helper.setText(plainTextContent, htmlContent);

            mailSender.send(mimeMessage);
            log.info("Successfully dispatched email to: {} [Subject: {}]", to, subject);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to dispatch email to {} [Subject: {}]: {}", to, subject, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error sending email to {}: {}", to, e.getMessage());
        }
    }

    private List<String> parseRecipients(String recipientsConfig) {
        if (recipientsConfig == null || recipientsConfig.isBlank()) {
            return List.of("tsaritservices@gmail.com", "tsarit@tsaritservices.com", "info@tsaritservices.com");
        }
        return Arrays.stream(recipientsConfig.split("[,;\\s]+"))
                .map(String::trim)
                .filter(s -> !s.isEmpty() && s.contains("@"))
                .distinct()
                .collect(Collectors.toList());
    }
}
