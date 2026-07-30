# EMAIL & NOTIFICATION - Complete Analysis

## Email Service (`service/EmailService.java`)
**Async**: `@EnableAsync` on main application, email methods annotated with `@Async`

### Configuration
| Property | Source |
|---|---|
| Host | `spring.mail.host` |
| Port | `spring.mail.port` (default: 587) |
| Username | `spring.mail.username` |
| Password | `spring.mail.password` |
| SMTP Auth | true |
| STARTTLS | true |
| Timeouts | connection=5s, read=5s, write=5s |

### Token Expiry
| Token Type | Expiry | Config Key |
|---|---|---|
| Email Verification | 60 minutes | `app.email.verification-token-expiry-minutes` |
| Password Reset | 30 minutes | `app.email.reset-token-expiry-minutes` |

### Email Templates (Thymeleaf, `templates/email/`)
| Template | Purpose |
|---|---|
| `verify-email.html` | Email verification link |
| `welcome.html` | Welcome email after registration |
| `order-confirmation.html` | Order placed confirmation |
| `reset-password.html` | Password reset link |
| `reset-password-success.html` | Password reset confirmation |
| `contact-reply.html` | Admin reply to contact message |

### Email Events
1. **Registration**: On register, creates `EmailVerificationToken` → sends verification email
2. **Email Verification**: GET `/api/auth/verify-email?token=` → validates token → marks email as verified → deletes token
3. **Forgot Password**: POST `/api/auth/forgot-password` → creates `PasswordResetToken` → sends reset email (silent on user not found - prevents enumeration)
4. **Reset Password**: POST `/api/auth/reset-password` → validates token → updates password → marks token used → sends success email
5. **Order Confirmation**: On order placement
6. **Contact Reply**: Admin replies via POST `/api/contact/{id}/reply` → sends reply email

## Notification Service (`service/NotificationService.java`)

### Notification Entity
| Field | Type | Description |
|---|---|---|
| user | User (ManyToOne) | Nullable - null means global notification |
| title | String(150) | Notification title |
| message | String(500) | Notification body |
| type | NotificationType | ORDER, PAYMENT, COUPON, SYSTEM, PROMOTION |
| isRead | Boolean | Default: false |

### API Endpoints
| Endpoint | Method | Description |
|---|---|---|
| `/api/notifications` | GET | Get paginated notifications (filterable by isRead) |
| `/api/notifications/unread` | GET | Get unread notifications list |
| `/api/notifications/unread/count` | GET | Get unread count |
| `/api/notifications/{id}` | PUT | Mark as read/unread (owner only) |
| `/api/notifications/mark-all-as-read` | PUT | Mark all as read |
| `/api/notifications/{id}` | DELETE | Delete notification (owner only) |

### Notification Types
| Type | Usage |
|---|---|
| ORDER | Order status changes, cancellations |
| PAYMENT | Payment success, failure, refunds |
| COUPON | Coupon applied, expired, new coupons |
| SYSTEM | System-wide announcements |
| PROMOTION | Marketing/promotional notifications |

### Business Rules
1. Notifications can be user-specific (userId set) or global (userId = null = all users)
2. Ownership check: user can only read/update/delete their own notifications
3. Pagination with optional read status filter
4. Unread count for badge display in frontend
5. Mark all as read for bulk operations
