package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.contact.ContactRequest;
import com.tanuj.krishanaposhak.dto.contact.ContactResponse;
import com.tanuj.krishanaposhak.dto.contact.ContactResponse;

import java.util.List;

/**
 * Service for managing contact messages.
 */
public interface ContactMessageService {

    ContactResponse submitContactMessage(ContactRequest request);

    List<ContactResponse> getAllMessages();

    List<ContactResponse> getUnresolvedMessages();

    ContactResponse resolveMessage(Long id);

    void deleteMessage(Long id);

    /**
     * Adds a reply to a contact message and sends an email reply to the user.
     *
     * @param id    the ID of the contact message
     * @param reply the reply text from the support agent
     * @return the updated contact message response
     */
    ContactResponse addReply(Long id, String reply);
}