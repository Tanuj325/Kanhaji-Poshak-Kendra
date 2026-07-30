# AUTHENTICATION FLOW

## State Machine

```
                    ┌─────────────────────────┐
                    │     NOT AUTHENTICATED    │
                    │  (no token / expired)    │
                    └──────┬──────────┬────────┘
                           │          │
              Register     │          │  Login
              ┌────────────┘          └────────────┐
              ▼                                     ▼
    ┌──────────────────┐                  ┌──────────────────┐
    │  REGISTERING     │                  │    LOGGING IN    │
    │  POST /api/auth/ │                  │  POST /api/auth/ │
    │  register        │                  │  login           │
    └────────┬─────────┘                  └────────┬─────────┘
             │ Success                              │ Success
             ▼                                      ▼
    ┌──────────────────┐                  ┌──────────────────┐
    │  EMAIL NOT       │                  │  AUTHENTICATED   │
    │  VERIFIED        │                  │ (tokens stored)  │
    │  (token in       │                  │                  │
    │   localStorage)  │                  │                  │
    └────────┬─────────┘                  └────────┬─────────┘
             │                                      │
    Verify   │  Click email link                    │  Token expires
    Email    │  GET /api/auth/verify-email          │
             ▼                                      ▼
    ┌──────────────────┐                  ┌──────────────────┐
    │  EMAIL           │                  │  REFRESHING      │
    │  VERIFIED        │                  │  TOKEN           │
    │  (emailVerified  │                  │  POST /api/auth/ │
    │   = true)        │                  │  refresh-token   │
    └──────────────────┘                  └────────┬─────────┘
                                                   │
                                        ┌──────────┴──────────┐
                                        │                     │
                                        ▼                     ▼
                               ┌────────────────┐   ┌──────────────────┐
                               │  TOKEN REFRESHED│   │  TOKEN EXPIRED   │
                               │  (back to       │   │  (force logout)  │
                               │   authenticated)│   │                  │
                               └────────────────┘   └────────┬─────────┘
                                                              │
                                                              ▼
                                                     ┌──────────────────┐
                                                     │ NOT AUTHENTICATED│
                                                     └──────────────────┘
```

## Authentication Data Flow

### Login Flow
```
1. User fills email + password → submits LoginPage form
2. React Hook Form validates with Zod schema
3. useApiMutation calls authApi.login(credentials)
4. Axios sends POST /api/auth/login
5. Backend returns AuthResponse { accessToken, refreshToken, userId, firstName, lastName, email, role }
6. AuthContext:
   a. Stores accessToken in memory (variable, NOT localStorage)
   b. Stores refreshToken in httpOnly-context (client-side: localStorage as fallback)
   c. Stores user object { id, firstName, lastName, email, role } in context state
   d. Sets isAuthenticated = true
7. React Query cache is invalidated for user-specific queries
8. Toast: "Welcome back, {firstName}!"
9. Redirect to previous page or home
```

### Register Flow
```
1. User fills registration form → submits RegisterPage
2. Zod validates: firstName, lastName, email, phoneNumber, password (min 8), gender, dateOfBirth
3. useApiMutation calls authApi.register(data)
4. Axios sends POST /api/auth/register
5. Backend creates user + returns AuthResponse (similar to login)
6. AuthContext stores tokens and user data
7. Toast: "Account created! Please check your email to verify."
8. Redirect to home
```

### Token Refresh Flow (Automatic)
```
1. JwtAuthenticationFilter returns 401
2. Axios interceptor catches 401
3. Interceptor checks: is this a refresh-token request itself? If yes → force logout
4. Interceptor queues the failed request
5. Calls authApi.refreshToken(refreshToken)
6. If success:
   a. Updates accessToken in memory
   b. Retries all queued requests with new token
7. If refresh fails:
   a. Clear tokens
   b. Redirect to /auth/login
   c. Toast: "Session expired. Please login again."
```

### Logout Flow
```
1. User clicks Logout
2. AuthContext:
   a. Calls POST /api/auth/logout/{userId} (fire-and-forget)
   b. Clears accessToken from memory
   c. Clears refreshToken from storage
   d. Sets isAuthenticated = false
   e. Clears user object
3. React Query: clears all cached queries (queryClient.clear())
4. CartContext: resets to empty
5. Redirect to /
```

### Verify Email Flow
```
1. User receives email with link: /auth/verify-email?token=xxx
2. VerifyEmailPage mounts → extracts token from URL params
3. useApiMutation calls authApi.verifyEmail(token)
4. Sends GET /api/auth/verify-email?token=xxx
5. Backend validates token → marks emailVerified = true
6. On success: Toast "Email verified successfully!"
7. AuthContext updates user.emailVerified = true
8. Redirect to /account/profile
```

### Forgot Password Flow
```
1. User clicks "Forgot Password" → ForgotPasswordPage
2. User enters email → submits
3. useApiMutation calls authApi.forgotPassword(email)
4. Sends POST /api/auth/forgot-password { email }
5. Backend always returns 200 (prevents email enumeration)
6. Toast: "If an account exists, a reset link has been sent."
```

### Reset Password Flow
```
1. User clicks email link: /auth/reset-password?token=xxx
2. ResetPasswordPage mounts → extracts token from URL
3. User enters new password + confirm password
4. Zod validates: password min 8, confirm matches
5. useApiMutation calls authApi.resetPassword(token, password)
6. Sends POST /api/auth/reset-password { token, password }
7. On success: Toast "Password reset successfully!"
8. Redirect to /auth/login
```

## Token Storage Strategy

| Token | Storage | Lifetime | Purpose |
|---|---|---|---|
| accessToken | JavaScript variable (memory) | 15 minutes | API authentication |
| refreshToken | localStorage | 7 days | Get new access token |
| user | AuthContext state | Session | User info for UI |

### Why not localStorage for accessToken?
- Prevents XSS attacks from stealing the active token
- Token is stored in a closure variable within AuthContext
- On page reload: refreshToken from localStorage is used to get a new accessToken
- Small UX trade-off (brief flash on reload) vs significant security gain

## AuthContext Shape

```javascript
const AuthContext = {
  // State
  user: {                     // null if not authenticated
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    role: 'CUSTOMER' | 'ADMIN',
    emailVerified: boolean,
    profileImageUrl: string | null,
  } | null,
  isAuthenticated: boolean,
  isLoading: boolean,         // true while checking stored token on mount
  
  // Actions
  login: (credentials) => Promise,
  register: (data) => Promise,
  logout: () => void,
  updateUser: (userData) => void,  // After profile update
  refreshUser: () => Promise,      // Refetch user data
};
```

## Protected Route Behavior

| Scenario | Behavior |
|---|---|
| Not authenticated, visiting /account/* | Redirect to /auth/login?redirect=/account/... |
| Not authenticated, visiting /admin/* | Redirect to /auth/login |
| Authenticated as CUSTOMER, visiting /admin/* | Redirect to /403 |
| Authenticated as ADMIN, visiting /admin/* | Allow access |
| Token expired, requesting protected API | Auto-refresh → retry → or force logout |
| Page refresh | Check refreshToken → get new accessToken → restore session |
</content>

