# CONTEXT STRUCTURE

## Context Architecture Overview

```
<AuthProvider>          ─── Manages auth state, tokens, user
  <CartProvider>        ─── Cart data + operations (synced with API)
    <WishlistProvider>  ─── Wishlist data + operations
      <ThemeProvider>   ─── Theme (light mode, dark mode later)
        <NotificationProvider>  ─── In-app notification polling + unread count
          <App />
```

## 1. AuthContext

### Purpose
Central authentication state. Stores user profile, tokens, and provides login/logout/refresh methods.

### State Shape
```javascript
{
  user: {
    id: 1,
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul@example.com',
    phoneNumber: '9876543210',
    role: 'CUSTOMER',     // 'CUSTOMER' | 'ADMIN'
    emailVerified: true,
    profileImageUrl: 'https://res.cloudinary.com/...',
    gender: 'MALE',
    dateOfBirth: '1995-06-15',
  } | null,
  
  isAuthenticated: false,   // Derived from user !== null
  isLoading: true,          // True while checking stored tokens on mount
  
  accessToken: null,        // In-memory only (not persisted)
}
```

### Provided Methods
```javascript
{
  login: async (credentials) => Promise<AuthResponse>,
  register: async (data) => Promise<AuthResponse>,
  logout: () => void,
  updateUser: (partialUser) => void,
  refreshSession: () => Promise<void>,
}
```

### Mount Behavior
1. On app mount, check localStorage for refreshToken
2. If exists, call POST /api/auth/refresh-token
3. If success: restore user data + set isAuthenticated = true
4. If fails: clear tokens, set isAuthenticated = false
5. Set isLoading = false

### Key Decisions
- `accessToken` stored in memory (JS variable), not localStorage
- On page refresh, AuthContext attempts token refresh automatically
- User object stored in context state (not localStorage) for security
- `isLoading` prevents flash of protected routes during session restoration

---

## 2. CartContext

### Purpose
Maintains cart state synchronized with backend API. Provides cart operations and cached cart data for instant UI updates.

### State Shape
```javascript
{
  items: [
    {
      cartItemId: 1,
      productId: 5,
      variantId: 12,
      productName: 'Banarasi Silk Saree',
      slug: 'banarasi-silk-saree',
      imageUrl: 'https://...',
      size: 'M',
      price: 4999,
      discountPrice: 3999,
      quantity: 2,
      totalPrice: 7998,
      stock: 15,
    },
  ],
  totalItems: 3,
  subTotal: 14997,
  discount: 1000,
  shippingCharge: 0,
  grandTotal: 13997,
  
  isOpen: false,          // Cart drawer/sidebar visibility
  isLoading: false,       // Loading state for operations
}
```

### Provided Methods
```javascript
{
  fetchCart: () => Promise<void>,
  addItem: (productVariantId, quantity) => Promise<void>,
  updateQuantity: (cartItemId, quantity) => Promise<void>,
  removeItem: (cartItemId) => Promise<void>,
  clearCart: () => Promise<void>,
  toggleCart: () => void,       // Open/close cart drawer
  openCart: () => void,
  closeCart: () => void,
  getItemCount: () => number,
}
```

### Behavior Rules
- Cart data fetched on login (not on mount for guests)
- Cart drawer shows as slide-in panel on add-to-cart
- Optimistic updates for quantity changes and item removal
- Invalidated after successful order placement (cart cleared)
- Shows loading skeleton during initial fetch

---

## 3. WishlistContext

### Purpose
Manages wishlist state with quick check for heart icon display on product cards and detail pages.

### State Shape
```javascript
{
  items: [
    {
      wishlistId: 1,
      productId: 5,
      productName: 'Banarasi Silk Saree',
      slug: 'banarasi-silk-saree',
      imageUrl: 'https://...',
      price: 4999,
      discountPrice: 3999,
      inStock: true,
    },
  ],
  wishlistIds: Set([5, 12, 18]),   // Fast lookup for heart icons
  isLoading: false,
}
```

### Provided Methods
```javascript
{
  fetchWishlist: () => Promise<void>,
  addItem: (productId) => Promise<void>,
  removeItem: (variantId) => Promise<void>,
  isInWishlist: (variantId) => boolean,
  toggleItem: (productId) => Promise<void>,   // Add if not present, remove if present
}
```

### Behavior Rules
- `wishlistIds` is a Set for O(1) lookup time in grid views
- Heart icon uses `isInWishlist()` for instant visual feedback
- Optimistic toggle: update Set immediately, rollback on API error
- Wishlist page fetches full item details separately

---

## 4. ThemeContext

### Purpose
Manages theme preferences (future: light/dark mode support). Currently initializes the single premium theme from Tailwind config.

### State Shape
```javascript
{
  mode: 'light',                // 'light' | 'dark' (future)
  primaryColor: 'royal-blue',   // Future: color customization
  isDarkMode: false,
}
```

### Provided Methods
```javascript
{
  toggleMode: () => void,       // Future: toggle light/dark
  setMode: (mode) => void,
}
```

### Notes
- Theme is primarily CSS-driven via Tailwind classes
- Context mainly for future dark mode toggle
- Default theme uses the premium color palette defined globally

---

## 5. NotificationContext

### Purpose
Manages real-time notification state. Polls for unread count and provides notification list.

### State Shape
```javascript
{
  unreadCount: 5,
  notifications: [],
  isLoading: false,
  isOpen: false,              // Notification dropdown visibility
}
```

### Provided Methods
```javascript
{
  fetchNotifications: (params) => Promise,
  fetchUnreadCount: () => Promise,
  markAsRead: (notificationId) => Promise<void>,
  markAllAsRead: () => Promise<void>,
  deleteNotification: (notificationId) => Promise<void>,
  togglePanel: () => void,
}
```

### Polling Strategy
- Poll `/api/notifications/unread/count` every 30 seconds when authenticated
- Stop polling when notification panel is open
- Update header badge count in real-time
- No polling when user is not authenticated

---

## Context Data Flow Diagram

```
                    ┌─────────────────────┐
                    │     AuthContext      │
                    │  (user, tokens,     │
                    │   login/logout)      │
                    └──────────┬──────────┘
                               │ user.id
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
  │  CartContext  │    │WishlistContext│   │NotificationCtx   │
  │ (cart data,  │    │(wishlistIds, │    │(unread count,    │
  │  operations)  │    │  operations) │    │  poll)            │
  └──────────────┘    └──────────────┘    └──────────────────┘
          │                    │
          │ Auth required      │ Auth required
          ▼                    ▼
    Protected routes      Protected routes
```

### Context Access Patterns

| Component | Context Used | Purpose |
|---|---|---|
| Header | Auth, Cart, Wishlist, Notification | User menu, cart count, wishlist heart, bell icon |
| ProductCard | Wishlist | Heart icon filled/outline |
| ProductDetail | Cart, Wishlist | Add to cart, wishlist toggle |
| CartPage | Cart | Full cart management |
| Checkout | Cart, Auth | Order placement |
| Account pages | Auth | User profile display |
| Admin sidebar | Auth | Admin check for menu items |
| Footer | None | Static content |
</content>

