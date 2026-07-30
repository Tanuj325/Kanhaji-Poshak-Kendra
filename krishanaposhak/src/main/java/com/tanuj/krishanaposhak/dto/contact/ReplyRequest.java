package com.tanuj.krishanaposhak.dto.contact;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request object for adding a reply to a contact message.
 */
public class ReplyRequest {

    @NotBlank(message = "Reply is required")
    @Size(max = 2000, message = "Reply must not exceed 2000 characters")
    private String reply;

    // Getters and Setters
    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }
}