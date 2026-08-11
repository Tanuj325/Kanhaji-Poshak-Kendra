package com.tanuj.krishanaposhak.security.ratelimit;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tanuj.krishanaposhak.config.RateLimitProperties;
import com.tanuj.krishanaposhak.exception.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimiterService rateLimiterService;
    private final RateLimitProperties rateLimitProperties;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        if (!rateLimitProperties.isEnabled()) {
            filterChain.doFilter(request, response);
            return;
        }

        // Allow CORS preflight requests without rate limiting
        if (HttpMethod.OPTIONS.name().equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        String method = request.getMethod();
        String clientIp = rateLimiterService.getClientIp(request);

        // 1. Handle Authentication Endpoints (/api/auth/**)
        if (path.startsWith("/api/auth/")) {
            handleAuthEndpoints(request, response, filterChain, path, clientIp);
            return;
        }

        // 2. Handle Public Contact Endpoint (POST /api/contact/**)
        if (path.startsWith("/api/contact") && HttpMethod.POST.name().equalsIgnoreCase(method)) {
            String key = "RATE:PUB:SENSITIVE:CONTACT:" + clientIp;
            RateLimiterService.RateLimitResult result = rateLimiterService.tryConsume(
                    key, rateLimitProperties.getSensitive().getContact());

            if (!result.isAllowed()) {
                write429Response(response, path, result.getRetryAfterSeconds());
                return;
            }
            filterChain.doFilter(request, response);
            return;
        }

        // Check current Spring Security authentication context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);

        // 3. Handle Admin Users
        if (isAuthenticated && hasRole(authentication, "ROLE_ADMIN")) {
            String userIdentifier = authentication.getName();
            String key = "RATE:ADMIN:" + userIdentifier;
            RateLimiterService.RateLimitResult result = rateLimiterService.tryConsume(
                    key, rateLimitProperties.getAdmin().getDefaultLimit());

            if (!result.isAllowed()) {
                write429Response(response, path, result.getRetryAfterSeconds());
                return;
            }
            filterChain.doFilter(request, response);
            return;
        }

        // 4. Handle Authenticated Customer Users
        if (isAuthenticated) {
            String userIdentifier = authentication.getName();
            RateLimitProperties.LimitConfig limitConfig = getAuthenticatedUserLimitConfig(path, method);
            String actionSubkey = getActionSubkey(path, method);
            String key = actionSubkey != null ? "RATE:USER:" + userIdentifier + ":" + actionSubkey : "RATE:USER:" + userIdentifier;

            RateLimiterService.RateLimitResult result = rateLimiterService.tryConsume(key, limitConfig);
            if (!result.isAllowed()) {
                write429Response(response, path, result.getRetryAfterSeconds());
                return;
            }
            filterChain.doFilter(request, response);
            return;
        }

        // 5. Handle Unauthenticated Public Endpoints
        String key = "RATE:PUB:" + clientIp;
        RateLimiterService.RateLimitResult result = rateLimiterService.tryConsume(
                key, rateLimitProperties.getPublicCategory().getDefaultLimit());

        if (!result.isAllowed()) {
            write429Response(response, path, result.getRetryAfterSeconds());
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void handleAuthEndpoints(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain,
                                     String path,
                                     String clientIp) throws ServletException, IOException {

        if (path.equals("/api/auth/login")) {
            // Check IP limit
            RateLimiterService.RateLimitResult ipResult = rateLimiterService.tryConsume(
                    "RATE:AUTH:LOGIN:IP:" + clientIp, rateLimitProperties.getAuth().getLoginIp());
            if (!ipResult.isAllowed()) {
                write429Response(response, path, ipResult.getRetryAfterSeconds());
                return;
            }

            // Wrap request to inspect email
            CachedBodyHttpServletRequest cachedRequest = new CachedBodyHttpServletRequest(request);
            String email = extractEmailFromJsonBody(cachedRequest.getCachedBody());

            if (email != null && !email.isBlank()) {
                // Check Account Backoff
                long backoffSec = rateLimiterService.getRemainingAccountBackoffSeconds(email);
                if (backoffSec > 0) {
                    write429Response(response, path, backoffSec);
                    return;
                }

                // Check Account Bucket limit
                RateLimiterService.RateLimitResult acctResult = rateLimiterService.tryConsume(
                        "RATE:AUTH:LOGIN:ACCT:" + email, rateLimitProperties.getAuth().getLoginAccount());
                if (!acctResult.isAllowed()) {
                    write429Response(response, path, acctResult.getRetryAfterSeconds());
                    return;
                }
            }

            filterChain.doFilter(cachedRequest, response);

            // Record result for backoff tracking
            if (email != null && !email.isBlank()) {
                if (response.getStatus() == HttpStatus.OK.value()) {
                    rateLimiterService.recordLoginSuccess(email);
                } else if (response.getStatus() == HttpStatus.UNAUTHORIZED.value()) {
                    rateLimiterService.recordLoginFailure(email);
                }
            }
            return;
        }

        if (path.equals("/api/auth/register")) {
            RateLimiterService.RateLimitResult ipResult = rateLimiterService.tryConsume(
                    "RATE:AUTH:REG:IP:" + clientIp, rateLimitProperties.getAuth().getRegisterIp());
            if (!ipResult.isAllowed()) {
                write429Response(response, path, ipResult.getRetryAfterSeconds());
                return;
            }

            CachedBodyHttpServletRequest cachedRequest = new CachedBodyHttpServletRequest(request);
            String email = extractEmailFromJsonBody(cachedRequest.getCachedBody());
            if (email != null && !email.isBlank()) {
                RateLimiterService.RateLimitResult acctResult = rateLimiterService.tryConsume(
                        "RATE:AUTH:REG:ACCT:" + email, rateLimitProperties.getAuth().getRegisterAccount());
                if (!acctResult.isAllowed()) {
                    write429Response(response, path, acctResult.getRetryAfterSeconds());
                    return;
                }
            }

            filterChain.doFilter(cachedRequest, response);
            return;
        }

        if (path.equals("/api/auth/forgot-password")) {
            RateLimiterService.RateLimitResult ipResult = rateLimiterService.tryConsume(
                    "RATE:AUTH:FORGOT:IP:" + clientIp, rateLimitProperties.getAuth().getForgotPasswordIp());
            if (!ipResult.isAllowed()) {
                write429Response(response, path, ipResult.getRetryAfterSeconds());
                return;
            }

            CachedBodyHttpServletRequest cachedRequest = new CachedBodyHttpServletRequest(request);
            String email = extractEmailFromJsonBody(cachedRequest.getCachedBody());
            if (email != null && !email.isBlank()) {
                RateLimiterService.RateLimitResult acctResult = rateLimiterService.tryConsume(
                        "RATE:AUTH:FORGOT:ACCT:" + email, rateLimitProperties.getAuth().getForgotPasswordAccount());
                if (!acctResult.isAllowed()) {
                    write429Response(response, path, acctResult.getRetryAfterSeconds());
                    return;
                }
            }

            filterChain.doFilter(cachedRequest, response);
            return;
        }

        if (path.equals("/api/auth/reset-password")) {
            RateLimiterService.RateLimitResult ipResult = rateLimiterService.tryConsume(
                    "RATE:AUTH:RESET:IP:" + clientIp, rateLimitProperties.getAuth().getResetPasswordIp());
            if (!ipResult.isAllowed()) {
                write429Response(response, path, ipResult.getRetryAfterSeconds());
                return;
            }

            filterChain.doFilter(request, response);
            return;
        }

        if (path.equals("/api/auth/verify-email")) {
            RateLimiterService.RateLimitResult ipResult = rateLimiterService.tryConsume(
                    "RATE:AUTH:VERIFY:IP:" + clientIp, rateLimitProperties.getAuth().getVerifyEmailIp());
            if (!ipResult.isAllowed()) {
                write429Response(response, path, ipResult.getRetryAfterSeconds());
                return;
            }

            filterChain.doFilter(request, response);
            return;
        }

        if (path.equals("/api/auth/resend-verification")) {
            RateLimiterService.RateLimitResult ipResult = rateLimiterService.tryConsume(
                    "RATE:AUTH:RESEND:IP:" + clientIp, rateLimitProperties.getAuth().getResendVerificationIp());
            if (!ipResult.isAllowed()) {
                write429Response(response, path, ipResult.getRetryAfterSeconds());
                return;
            }

            String email = request.getParameter("email");
            if (email != null && !email.isBlank()) {
                RateLimiterService.RateLimitResult acctResult = rateLimiterService.tryConsume(
                        "RATE:AUTH:RESEND:ACCT:" + email.toLowerCase().trim(),
                        rateLimitProperties.getAuth().getResendVerificationAccount());
                if (!acctResult.isAllowed()) {
                    write429Response(response, path, acctResult.getRetryAfterSeconds());
                    return;
                }
            }

            filterChain.doFilter(request, response);
            return;
        }

        if (path.equals("/api/auth/refresh-token")) {
            RateLimiterService.RateLimitResult ipResult = rateLimiterService.tryConsume(
                    "RATE:AUTH:REFRESH:IP:" + clientIp, rateLimitProperties.getAuth().getRefreshTokenIp());
            if (!ipResult.isAllowed()) {
                write429Response(response, path, ipResult.getRetryAfterSeconds());
                return;
            }

            filterChain.doFilter(request, response);
            return;
        }

        // Generic fallback for any other auth route
        RateLimiterService.RateLimitResult defaultAuthResult = rateLimiterService.tryConsume(
                "RATE:AUTH:GENERIC:IP:" + clientIp, rateLimitProperties.getAuth().getLoginIp());
        if (!defaultAuthResult.isAllowed()) {
            write429Response(response, path, defaultAuthResult.getRetryAfterSeconds());
            return;
        }

        filterChain.doFilter(request, response);
    }

    private RateLimitProperties.LimitConfig getAuthenticatedUserLimitConfig(String path, String method) {
        if (path.startsWith("/api/orders") && HttpMethod.POST.name().equalsIgnoreCase(method)) {
            return rateLimitProperties.getSensitive().getOrderCreation();
        }
        if (path.startsWith("/api/reviews") && HttpMethod.POST.name().equalsIgnoreCase(method)) {
            return rateLimitProperties.getSensitive().getReviewSubmission();
        }
        if (path.startsWith("/api/addresses") || path.startsWith("/api/users/profile") || path.startsWith("/api/users/address")) {
            if (HttpMethod.POST.name().equalsIgnoreCase(method) || HttpMethod.PUT.name().equalsIgnoreCase(method) || HttpMethod.DELETE.name().equalsIgnoreCase(method)) {
                return rateLimitProperties.getSensitive().getProfileMutation();
            }
        }
        if (path.startsWith("/api/notifications") && (HttpMethod.PUT.name().equalsIgnoreCase(method) || HttpMethod.POST.name().equalsIgnoreCase(method))) {
            return rateLimitProperties.getSensitive().getNotificationMutation();
        }

        return rateLimitProperties.getAuthenticated().getDefaultLimit();
    }

    private String getActionSubkey(String path, String method) {
        if (path.startsWith("/api/orders") && HttpMethod.POST.name().equalsIgnoreCase(method)) {
            return "ORDER_CREATE";
        }
        if (path.startsWith("/api/reviews") && HttpMethod.POST.name().equalsIgnoreCase(method)) {
            return "REVIEW_CREATE";
        }
        if (path.startsWith("/api/addresses") || path.startsWith("/api/users/profile") || path.startsWith("/api/users/address")) {
            if (HttpMethod.POST.name().equalsIgnoreCase(method) || HttpMethod.PUT.name().equalsIgnoreCase(method) || HttpMethod.DELETE.name().equalsIgnoreCase(method)) {
                return "PROFILE_MUTATE";
            }
        }
        if (path.startsWith("/api/notifications") && (HttpMethod.PUT.name().equalsIgnoreCase(method) || HttpMethod.POST.name().equalsIgnoreCase(method))) {
            return "NOTIF_MUTATE";
        }
        return null;
    }

    private boolean hasRole(Authentication authentication, String role) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(role));
    }

    private String extractEmailFromJsonBody(byte[] body) {
        if (body == null || body.length == 0) {
            return null;
        }
        try {
            JsonNode tree = objectMapper.readTree(body);
            if (tree.has("email") && tree.get("email").isTextual()) {
                return tree.get("email").asText().toLowerCase().trim();
            }
        } catch (Exception e) {
            log.debug("Could not parse email from request JSON body", e);
        }
        return null;
    }

    private void write429Response(HttpServletResponse response, String path, long retryAfterSeconds) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.TOO_MANY_REQUESTS.value())
                .error(HttpStatus.TOO_MANY_REQUESTS.getReasonPhrase())
                .message("Too many requests. Please try again later.")
                .path(path)
                .build();

        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
