package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.address.AddressRequest;
import com.tanuj.krishanaposhak.dto.address.AddressResponse;
import com.tanuj.krishanaposhak.service.AddressService;
import com.tanuj.krishanaposhak.security.jwt.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@Tag(name = "Addresses", description = "Address management API")
@SecurityRequirement(name = "bearerScheme")
public class AddressController {

    private final AddressService addressService;
    private final JwtService jwtService;

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) {
            return null;
        }
        return jwtService.extractUserId(token);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // Get all addresses for the authenticated user
    @Operation(summary = "Get all addresses for the authenticated user",
        description = "Retrieves a list of all addresses belonging to the currently authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Addresses retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AddressResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized - User is not authenticated")
    })
    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAddresses(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        List<AddressResponse> addresses = addressService.getAddressesByUser(userId);
        return ResponseEntity.ok(addresses);
    }

    // Get a specific address by ID for the authenticated user
    @Operation(summary = "Get address by ID",
        description = "Retrieves a specific address by its ID for the currently authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Address retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AddressResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized - User is not authenticated"),
            @ApiResponse(responseCode = "404", description = "Address not found with the given ID")
    })
    @GetMapping("/{addressId}")
    public ResponseEntity<AddressResponse> getAddressById(
            @Parameter(description = "ID of the address to retrieve", required = true) @PathVariable Long addressId,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        AddressResponse address = addressService.getAddressById(userId, addressId);
        return ResponseEntity.ok(address);
    }

    // Add a new address for the authenticated user
    @Operation(summary = "Add a new address",
        description = "Creates a new address for the currently authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Address created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AddressResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input - Address validation failed"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - User is not authenticated")
    })
    @PostMapping
    public ResponseEntity<AddressResponse> addAddress(
            @Valid @RequestBody AddressRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        AddressResponse address = addressService.addAddress(userId, request);
        return ResponseEntity.status(201).body(address);
    }

    // Update an address for the authenticated user
    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        AddressResponse address = addressService.updateAddress(userId, addressId, request);
        return ResponseEntity.ok(address);
    }

    // Delete an address for the authenticated user
    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long addressId,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        addressService.deleteAddress(userId, addressId);
        return ResponseEntity.noContent().build();
    }

    // Set an address as default for the authenticated user
    @PutMapping("/{addressId}/set-default")
    public ResponseEntity<AddressResponse> setDefaultAddress(
            @PathVariable Long addressId,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        AddressResponse address = addressService.setDefaultAddress(userId, addressId);
        return ResponseEntity.ok(address);
    }
}