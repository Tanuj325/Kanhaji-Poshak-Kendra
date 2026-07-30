package com.tanuj.krishanaposhak.service.impl;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

/**
 * Implementation of EmailService.
 */
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements com.tanuj.krishanaposhak.service.EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private static final String FROMEMAIL = "tanujiimt1@gmail.com";

    @Override
    @Async
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setFrom(FROMEMAIL);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Sent simple email to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            // In a real application, you might want to throw a custom exception or handle it as per your error handling strategy.
            // For now, we log the error and continue as the method is async, and we don't want to block the caller.
        }
    }

    @Override
    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setFrom(FROMEMAIL);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Sent HTML email to {}", to);
        } catch (Exception e) {
            log.error("Failed to send HTML email to {}: {}", to, e.getMessage());
        }
    }

    @Override
    @Async
    public void sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> model) {
        try {
            // Create a Thymeleaf context
            Context context = new Context();
            context.setVariables(model);

            // Process the template
            String html = templateEngine.process("email/" + templateName, context);

            // Send the email
            jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setFrom(FROMEMAIL);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Sent template email '{}' to {}", templateName, to);
        } catch (Exception e) {
            log.error("Failed to send template email '{}' to {}: {}", templateName, to, e.getMessage());
        }
    }
}