package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.contact.ContactRequest;
import com.tanuj.krishanaposhak.dto.contact.ContactResponse;
import com.tanuj.krishanaposhak.entity.ContactMessage;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.ContactMessageMapper;
import com.tanuj.krishanaposhak.repository.ContactMessageRepository;
import com.tanuj.krishanaposhak.service.ContactMessageService;
import com.tanuj.krishanaposhak.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;
    private final ContactMessageMapper contactMessageMapper;
    private final EmailService emailService;

    @Override
    public ContactResponse submitContactMessage(ContactRequest request) {
        ContactMessage message = contactMessageMapper.toEntity(request);
        message = contactMessageRepository.save(message);
        return contactMessageMapper.toResponse(message);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponse> getAllMessages() {
        return contactMessageRepository.findAll().stream()
                .map(contactMessageMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponse> getUnresolvedMessages() {
        return contactMessageRepository.findByResolvedFalseOrderByCreatedAtDesc().stream()
                .map(contactMessageMapper::toResponse)
                .toList();
    }

    @Override
    public ContactResponse resolveMessage(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with id: " + id));
        message.setResolved(true);
        message = contactMessageRepository.save(message);
        return contactMessageMapper.toResponse(message);
    }

    @Override
    public void deleteMessage(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with id: " + id));
        contactMessageRepository.delete(message);
    }

    /**
     * Adds a reply to a contact message and sends an email reply to the user.
     *
     * @param id    the ID of the contact message
     * @param reply the reply text from the support agent
     * @return the updated contact message response
     */
    public ContactResponse addReply(Long id, String reply) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with id: " + id));
        message.setReply(reply);
        message.setReplied(true);
        message = contactMessageRepository.save(message);
        // Send email asynchronously
        try {
            sendReplyEmail(message);
        } catch (Exception e) {
            // Log the error with stack trace but don't fail the client request
            log.error("Failed to send reply email for contact message {}: {}", id, e.getMessage(), e);
        }
        return contactMessageMapper.toResponse(message);
    }

    /**
     * Sends a reply email to the user who submitted the contact message.
     *
     * @param message the contact message that was replied to
     */
    private void sendReplyEmail(ContactMessage message) {
        // Prepare the model for the email template
        java.util.Map<String, Object> model = new java.util.HashMap<>();
        model.put("userName", message.getName());
        model.put("ourResponse", message.getReply());
        // Send the email
        emailService.sendTemplateEmail(
                message.getEmail(),
                "Response to your inquiry: " + message.getSubject(),
                "contact-reply",
                model);
    }
}