package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.contact.ContactRequest;
import com.tanuj.krishanaposhak.dto.contact.ContactResponse;
import com.tanuj.krishanaposhak.dto.contact.ReplyRequest;
import com.tanuj.krishanaposhak.service.ContactMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Tag(name = "Contact", description = "Contact management API")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    // Submit a contact message (public endpoint)
    @Operation(summary = "Submit a contact message")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Message submitted successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ContactResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping
    public ResponseEntity<ContactResponse> submitContactMessage(@Valid @RequestBody ContactRequest request) {
        ContactResponse response = contactMessageService.submitContactMessage(request);
        return ResponseEntity.status(201).body(response);
    }

    // Get all messages (admin only)
    @Operation(summary = "Get all contact messages")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of contact messages",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ContactResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactResponse>> getAllMessages() {
        return ResponseEntity.ok(contactMessageService.getAllMessages());
    }

    // Get unresolved messages (admin only)
    @Operation(summary = "Get unresolved contact messages")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of unresolved contact messages",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ContactResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @GetMapping("/unresolved")
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactResponse>> getUnresolvedMessages() {
        return ResponseEntity.ok(contactMessageService.getUnresolvedMessages());
    }

    // Resolve a message (admin only)
    @Operation(summary = "Mark a contact message as resolved")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Message marked as resolved",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ContactResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid message ID"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Message not found")
    })
    @PutMapping("/{id}/resolve")
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContactResponse> resolveMessage(@Parameter(description = "Message ID", required = true) @PathVariable Long id) {
        ContactResponse response = contactMessageService.resolveMessage(id);
        return ResponseEntity.ok(response);
    }

    // Delete a message (admin only)
    @Operation(summary = "Delete a contact message")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",description="Message deleted"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Message not found")
    })
    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMessage(@Parameter(description = "Message ID", required = true) @PathVariable Long id) {
        contactMessageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Add a reply to a contact message (admin only)
     * Sends an email reply to the user who submitted the message
     */
    @Operation(summary = "Add a reply to a contact message")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reply added and email sent",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ContactResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Contact message not found")
    })
    @PostMapping("/{id}/reply")
    @SecurityRequirement(name = "bearerScheme")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContactResponse> addReply(
            @Parameter(description = "Message ID", required = true) @PathVariable Long id,
            @Valid @RequestBody ReplyRequest request) {
        ContactResponse response = contactMessageService.addReply(id, request.getReply());
        return ResponseEntity.ok(response);
    }
}