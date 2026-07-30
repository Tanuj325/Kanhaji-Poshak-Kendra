package com.tanuj.krishanaposhak.service;

import java.util.Map;

/**
 * Service for sending emails.
 */
public interface EmailService {

    /**
     * Sends a simple email.
     *
     * @param to      recipient email address
     * @param subject email subject
     * @param text    email body text
     */
    void sendSimpleEmail(String to, String subject, String text);

    /**
     * Sends an HTML email.
     *
     * @param to          recipient email address
     * @param subject     email subject
     * @param htmlContent email body in HTML format
     */
    void sendHtmlEmail(String to, String subject, String htmlContent);

    /**
     * Sends an email using a Thymeleaf template.
     *
     * @param to           recipient email address
     * @param subject      email subject
     * @param templateName name of the template (without extension) located in 'templates/email/'
     * @param model        map of attributes to be used in the template
     */
    void sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> model);
}