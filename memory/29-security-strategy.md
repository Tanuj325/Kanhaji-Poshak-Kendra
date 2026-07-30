# SECURITY STRATEGY

## Frontend Security Principles

1. **Never expose tokens** in URLs, console logs, or error messages
2. **Never trust frontend role** — role is for UI only, backend enforces authorization
3. **Minimum token lifetime** — access tokens in memory (not localStorage)
4. **Graceful degradation** — handle unauthorized states without crashes
5. **Input validation** — Zod validation mirrors backend validation

---

## Token Management

### Storage Strategy
```
accessToken → JavaScript variable in AuthContext module scope
              (NOT in localStorage, NOT in sessionStorage)
              Lost on page refresh → restored via refreshToken

refreshToken → localStorage (with key: 'kp_refresh_token')
              Used only for token refresh API call
              Never sent to any other endpoint

user data   → AuthContext state (memory only)
              Re-fetched on page refresh via refresh flow
```

### Why This Approach
| Attack Vector | Mitigation |
|---|---|
| XSS stealing accessToken | Token is in memory closure, not accessible to injected scripts |
| XSS stealing refreshToken | RefreshToken can only be used at `/api/auth/refresh-token` endpoint |
| CSRF | Backend uses stateless JWT, no session cookies, CORS configured |
| Man-in-the-middle | All requests over HTTPS |
| Token replay | Short access token lifetime (15 min) limits window |

### Token Refresh on Page Load
```
1. User refreshes page
2. AuthContext mounts
3. Check localStorage for refreshToken
4. If found:
   a. Set isLoading = true
   b. POST /api/auth/refresh-token { refreshToken }
   c. If success: store new accessToken, set user, isAuthenticated = true
   d. If fail: clear tokens, isAuthenticated = false
5. If not found: isAuthenticated = false
6. Set isLoading = false
```

---

## Frontend Role Handling

### DO NOT
```javascript
// ❌ NEVER do this — role can be manipulated
if (user.role === 'ADMIN') {
  showDeleteButton = true;
}
```

### DO
```javascript
// ✅ Role-based UI rendering is fine — backend enforces
{user.role === 'ADMIN' && <AdminSidebar />}

// ✅ API calls go through — backend returns 403 if not authorized
const { mutate } = useDeleteProduct();

// ✅ Always handle 403 responses
if (error.status === 403) {
  toast.error('You do not have permission to perform this action');
  navigate('/403');
}
```

### Important Rules
- UI hides/shows elements based on role for UX, NOT for security
- All sensitive operations are protected by backend `@PreAuthorize`
- If a user bypasses frontend and hits admin API directly → backend returns 403
- Admin route wrapper is convenience, not security — backend is the source of truth

---

## Protected Route Implementation

```javascript
// routes/ProtectedRoute.jsx
function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show nothing while checking auth status
  if (isLoading) {
    return <FullPageLoader />;
  }

  // Not authenticated → redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Authenticated → render customer layout
  return <CustomerLayout />;
}

// routes/AdminRoute.jsx
function AdminRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Authenticated but not admin → forbidden
  if (user.role !== 'ADMIN') {
    return <Navigate to="/403" replace />;
  }

  return <AdminLayout />;
}
```

---

## Error Handling for Security

| Scenario | User Experience | Technical Action |
|---|---|---|
| Token expired | Silent refresh, then retry | Axios interceptor refreshes token |
| Refresh token expired | Redirect to login + toast | Clear all tokens, clear React Query cache |
| 403 on admin page | Redirect to /403 page | Navigate to /403 |
| 403 on customer action | Toast: "Action not permitted" | Show error, log to console |
| Network error | Toast: "Connection lost" | Retry logic with exponential backoff |
| Rate limit (429) | Toast: "Too many requests" | Wait and retry |

---

## Sensitive Data Protection

| Data | Storage | Exposure |
|---|---|---|
| Access token | JS closure (memory) | Never exposed |
| Refresh token | localStorage | Only sent to refresh endpoint |
| User password | Never stored | Only in form state (cleared on submit) |
| API keys | Server-side (backend) | Never in frontend code |
| Payment details | Handled by Razorpay SDK | Never touches our server directly |
| User profile | AuthContext (memory) | Fetched from /api/users/me |

---

## Additional Security Measures

### Request Validation
- All forms validate client-side with Zod before submission
- File uploads validate type and size before sending
- Search inputs sanitized (no HTML injection)

### XSS Prevention
- React's JSX auto-escapes all output (primary defense)
- No `dangerouslySetInnerHTML` except for rich text from backend (sanitized)
- CSP headers configured on backend

### CSRF Protection
- Backend uses stateless JWT (no cookies)
- CORS restricts to allowed origins only
- No cross-origin requests from unauthorized domains

### Rate Limiting
- Implement retry logic with exponential backoff in Axios interceptor
- Show appropriate feedback on 429 responses

### File Upload Security
| Check | Implementation |
|---|---|
| File type | Accept only image/* MIME types |
| File size | Max 5MB (configurable) |
| Dimensions | Validate on client before upload |
| Server-side | Backend validates again + Cloudinary sanitizes |
</content>

