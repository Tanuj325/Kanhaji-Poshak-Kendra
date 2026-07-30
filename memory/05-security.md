# SECURITY - Complete Analysis

## Architecture Overview

```
Request → JwtAuthenticationFilter → JwtService (token validation)
         → SecurityContextHolder.setAuthentication()
         → Controller (with @PreAuthorize or manual userId extraction)
         → 401 if unauthenticated (JwtAuthenticationEntryPoint)
```

## JWT Flow

### Token Generation (JwtService)
- **Algorithm**: HMAC-SHA256 with secret key from `jwt.secret`
- **Access Token**: 
  - Claims: `userId`, `role`, `type="access"`, `sub` (email), `iat`, `exp`
  - Expiration: 15 min (configurable via `jwt.access-token-expiration-ms`)
- **Refresh Token**:
  - Claims: `userId`, `type="refresh"`, `sub` (email), `iat`, `exp`
  - Expiration: 7 days (configurable via `jwt.refresh-token-expiration-ms`)

### Authentication Flow
1. User sends `POST /api/auth/login` with email + password
2. `AuthService.login()` uses `AuthenticationManager` → `DaoAuthenticationProvider` → `CustomUserDetailsService.loadUserByUsername()`
3. On success: generates access + refresh tokens, returns `AuthResponse`
4. Subsequent requests include `Authorization: Bearer <access_token>` header
5. `JwtAuthenticationFilter` intercepts, validates token, sets `SecurityContext`

### Token Validation
- `isAccessTokenValid()`: checks token not expired AND type is "access"
- `isTokenValid(token, email)`: checks email matches + not expired
- Filter silently continues chain on invalid/malformed tokens (anonymous access)

### Refresh Token Flow
1. Client sends `POST /api/auth/refresh-token` with refresh token in body
2. `AuthService.refreshToken()` extracts userId from refresh token
3. Generates new access + refresh tokens
4. Returns new `AuthResponse`

## UserPrincipal (security/service/UserPrincipal.java)
```java
class UserPrincipal implements UserDetails {
    Long userId;           // Custom, used for ownership checks
    String email;          // Used as username
    String password;
    Boolean enabled;
    Boolean accountNonLocked;
    Collection<GrantedAuthority> authorities;  // ROLE_ADMIN or ROLE_CUSTOMER
}
```

## Public Endpoints (No Authentication)
```
GET /api/products/**
GET /api/categories/**
GET /api/banners/**
GET /api/reviews/product/**
ANY /api/auth/**
ANY /api/contact/**
```

## Public GET Endpoints Only
```
/api/products/**       - product listing, detail, featured, new-arrivals
/api/categories/**     - categories, dropdown, root, subcategories, by slug
/api/banners/**        - active banners only
/api/reviews/product/** - product reviews and average rating
```

## Protected Endpoints (All require authentication)
Everything else requires a valid JWT Bearer token.

## Admin-Only Endpoints (@PreAuthorize("hasRole('ADMIN')"))
- Product CRUD: `/api/products/admin/**`
- Category CRUD: `/api/categories/**` (POST, PUT, DELETE, PATCH)
- Banner management: `/api/banners/**` (POST, PUT, DELETE, PATCH, GET /all)
- Product Images: `/api/products/{productId}/images/**` (POST, PUT, DELETE)
- Product Variants: `/api/products/{productId}/variants/**` (POST, PUT, DELETE, PATCH)
- Order management: `/api/orders/admin/**`
- Coupon management: `/api/coupons/**` (GET all, DELETE, PATCH)
- User management: `/api/users/**` (GET all, PATCH status)
- Contact messages: `/api/contact/**` (GET, PUT, DELETE, POST reply)
- Analytics: `/api/admin/analytics/**`
- Activity: `/api/admin/analytics/activity`

## Ownership Rules
Ownership is checked in two ways:
1. **Spring Expression**: `@PreAuthorize("#userId == principal.userId or hasRole('ADMIN')")` on UserController endpoints
2. **Manual**: Most controllers extract userId from token and pass to service layer which verifies ownership (e.g., `orderService.getOrderById(userId, orderId)` throws if not owner)

## CORS Configuration
- Allowed origins: from `app.frontend.allowed-origins` property (supports comma-separated list)
- Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Allowed headers: *
- Allow credentials: true
- Applied to all paths

## Error Handling

### JwtAuthenticationEntryPoint
Returns 401 JSON response:
```json
{
  "timestamp": "...",
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication is required to access this resource",
  "path": "/api/some-endpoint"
}
```

### AccessDeniedException Handler
Returns 403 for authenticated users lacking required role.

### BadCredentialsException Handler
Returns 401 with "Invalid email or password" message.

