# LAYOUTS & NAVIGATION

## Layout Structure

```
App
├── PublicLayout
│   ├── Header (with mega menu, search, cart/wishlist icons)
│   ├── <Outlet /> (page content)
│   └── Footer
│
├── AuthLayout
│   ├── Minimal header (logo only)
│   ├── <Outlet /> (auth forms)
│   └── Minimal footer (links only)
│
├── CustomerLayout
│   ├── Header (simplified, no mega menu)
│   ├── Mobile top bar
│   ├── <Outlet /> (customer dashboard content)
│   └── Footer (minimal)
│
└── AdminLayout
    ├── Top bar (search, notifications, profile)
    ├── Sidebar (collapsible, nav menu)
    └── <Outlet /> (admin content)
```

---

## 1. Public Layout

### Header Components
```
┌──────────────────────────────────────────────────────────┐
│  [Logo]  Categories ▼  Search...  [🔍]  [♡] [🛒3] [👤] │  ← Top bar
│  ┌──────────────────────────────────────────────────────┐│
│  │  Sarees  Kurtas  Sherwanis  Lehengas  Accessories   ││  ← Category nav
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

### Header Behavior
| Feature | Desktop | Tablet | Mobile |
|---|---|---|---|
| Logo | Left, full | Left, full | Left, full |
| Categories | Horizontal mega menu | Hamburger menu | Hamburger menu |
| Search | Input field | Icon → overlay | Icon → overlay |
| Cart | Icon + count badge | Icon + count badge | Icon + count badge |
| Wishlist | Icon | Icon | Icon |
| User Menu | Avatar dropdown | Avatar dropdown | Icon → drawer |
| Category Nav | Full width bar | Hidden | Hidden |

### Header States
- **Scrolled**: Sticky header with shadow, slightly smaller
- **At top**: Full header without shadow
- **Mobile**: Hamburger replaces categories, search becomes icon
- **Search active**: Full-screen search overlay with results

### Mega Menu (Categories)
```
┌──────────────────────────────────────────────────┐
│  WOMENS                  │  MENS                 │
│  ├── Sarees              │  ├── Sherwanis        │
│  │   ├── Banarasi        │  ├── Kurtas           │
│  │   ├── Kanjivaram      │  ├── Nehru Jackets    │
│  │   └── Printed         │  └── Pagdis           │
│  ├── Lehengas            │                       │
│  ├── Kurtis              │  ACCESSORIES          │
│  └── Salwar Suits        │  ├── Jewelry          │
│                          │  ├── Footwear         │
│  KIDS                    │  └── Bags             │
│  ├── Boys                │                       │
│  └── Girls               │  [Featured Image]     │
└──────────────────────────────────────────────────┘
```

### Footer Components
```
┌──────────────────────────────────────────────────────────┐
│  ┌──────┐ ┌──────────┐ ┌─────────────┐ ┌───────────┐   │
│  │ LOGO │ │  SHOP    │ │   SUPPORT   │ │ CONNECT   │   │
│  │      │ │  Sarees  │ │   Contact   │ │ Facebook  │   │
│  │Desc.. │ │  Kurtas  │ │   FAQ       │ │ Instagram │   │
│  │      │ │  ..       │ │   Terms     │ │ YouTube   │   │
│  └──────┘ └──────────┘ └─────────────┘ └───────────┘   │
│  ───────────────────────────────────────────────────── │
│  © 2024 Krishana Poshak. All rights reserved.           │
│  [Newsletter Signup]                                     │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Auth Layout

```
┌──────────────────────────────────────────────────────────┐
│  [Logo]                                        [Help]   │
│                                                          │
│                                                          │
│              ┌──────────────────────────┐                │
│              │      Logo (small)        │                │
│              │                          │                │
│              │   Welcome to             │                │
│              │   Krishana Poshak        │                │
│              │                          │                │
│              │   ┌──────────────────┐   │                │
│              │   │  Email           │   │                │
│              │   └──────────────────┘   │                │
│              │   ┌──────────────────┐   │                │
│              │   │  Password        │   │                │
│              │   └──────────────────┘   │                │
│              │                          │                │
│              │   [Login Button]         │                │
│              │                          │                │
│              │   Forgot password?       │                │
│              │   Don't have account?    │                │
│              └──────────────────────────┘                │
│                                                          │
│                                                          │
│  [Footer links: Terms | Privacy | Contact]               │
└──────────────────────────────────────────────────────────┘
```

- Centered card on a subtle gradient/pattern background
- No sidebar, no mega menu
- Minimal distractions for focus on form

---

## 3. Customer Layout (Dashboard)

```
┌──────────────────────────────────────────────────────────┐
│  [Logo]  [🔍]  [🔔5]  [♡]  [🛒2]  [Avatar ▼]          │ ← Top bar
├──────────┬───────────────────────────────────────────────┤
│          │                                               │
│  👤 My   │  Dashboard content                            │
│  Profile │                                               │
│          │  ┌─────────────────────────────────────┐      │
│  📦 My   │  │ Order #KP-1234          Status: ●  │      │
│  Orders  │  │ Items: 3    Total: ₹4,999          │      │
│          │  └─────────────────────────────────────┘      │
│  ❤️      │                                               │
│  Wishlist│  ┌─────────────────────────────────────┐      │
│          │  │ Order #KP-1235          Status: ●  │      │
│  📍      │  │ Items: 1    Total: ₹1,299          │      │
│  Address │  └─────────────────────────────────────┘      │
│          │                                               │
│  🔔      │                                               │
│  Notif.  │                                               │
│          │                                               │
│  ⚙️      │                                               │
│  Settings│                                               │
│          │                                               │
└──────────┴───────────────────────────────────────────────┘
```

### Sidebar Menu Items
| Icon | Label | Route | Badge |
|---|---|---|---|
| 👤 | My Profile | /account/profile | - |
| 📦 | My Orders | /account/orders | - |
| ❤️ | Wishlist | /account/wishlist | Count |
| 📍 | Addresses | /account/addresses | - |
| 🔔 | Notifications | /account/notifications | Unread count |
| ⚙️ | Settings | /account/settings | - |

### Mobile Customer Layout
- Bottom tab bar instead of sidebar
- 5 tabs: Home, Orders, Wishlist, Profile, More
- Swipeable panels

---

## 4. Admin Layout

```
┌───┬───────────────────────────────────────────────────────┐
│ ☰ │  [Logo]                    [🔍] [🔔3] [Admin ▼]   │ ← Top bar
├───┼───────────────────────────────────────────────────────┤
│   │                                                       │
│ 📊│  Dashboard content                                    │
│ D │                                                       │
│ a │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│ s │  │₹1.2L │ │ 156  │ │ 23   │ │ 4.5★ │                │
│ h │  │Revenue│ │Orders│ │Users │ │Rating│                │
│   │  └──────┘ └──────┘ └──────┘ └──────┘                │
│ 📦│                                                       │
│ O │  ┌──────────────────────────────────────────┐        │
│ r │  │     Revenue Chart (Recharts)             │        │
│ d │  │                                           │        │
│ e │  └──────────────────────────────────────────┘        │
│ r │                                                       │
│ s │  ┌──────────────────────────────────────────┐        │
│   │  │     Recent Orders Table                  │        │
│ 📁│  │  #KP-1283  │ ₹2,499  │ Shipped  │  ✓   │        │
│ P │  │  #KP-1284  │ ₹4,999  │ Pending  │  ⏳  │        │
│ r │  └──────────────────────────────────────────┘        │
│ o │                                                       │
│ d │                                                       │
│ u │                                                       │
│ c │                                                       │
│ t │                                                       │
│ s │                                                       │
│   │                                                       │
│ 📋│                                                       │
│ C │                                                       │
│ a │                                                       │
│ t │                                                       │
│ e │                                                       │
│ g │                                                       │
│   │                                                       │
│ 🏷️│                                                       │
│ C │                                                       │
│ o │                                                       │
│ u │                                                       │
│ p │                                                       │
│ o │                                                       │
│ n │                                                       │
│ s │                                                       │
│   │                                                       │
│ 🖼️│                                                       │
│ B │                                                       │
│ a │                                                       │
│ n │                                                       │
│ n │                                                       │
│ e │                                                       │
│ r │                                                       │
│ s │                                                       │
│   │                                                       │
│ 💬│                                                       │
│ M │                                                       │
│ s │                                                       │
│ g │                                                       │
│ s │                                                       │
│   │                                                       │
│ ⭐│                                                       │
│ R │                                                       │
│ e │                                                       │
│ v │                                                       │
│ s │                                                       │
│   │                                                       │
│ 👥│                                                       │
│ U │                                                       │
│ s │                                                       │
│ e │                                                       │
│ r │                                                       │
│ s │                                                       │
│   │                                                       │
│ ⚙️│                                                       │
│ S │                                                       │
│ e │                                                       │
│ t │                                                       │
│ t │                                                       │
│ s │                                                       │
└───┴───────────────────────────────────────────────────────┘
```

### Admin Sidebar - Section Organization
```
MAIN
├── 📊 Dashboard
├── 📦 Orders
├── 📁 Products
├── 📋 Categories
├── 👥 Users

MARKETING
├── 🏷️ Coupons
├── 🖼️ Banners

ENGAGEMENT
├── 💬 Messages
├── ⭐ Reviews

ANALYTICS
├── 📈 Product Analytics
├── 💰 Sales Analytics
├── 👤 Customer Analytics

SYSTEM
├── ⚙️ Settings
```

### Sidebar States
- **Expanded**: Full labels, 240px width
- **Collapsed**: Icons only, 64px width (toggle via hamburger)
- **Hover on collapsed**: Tooltip shows label
- **Active**: Royal blue left border + highlight
- **Mobile**: Full-width drawer overlay

---

## 5. Mobile Bottom Navigation

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                    (Page Content)                         │
│                                                          │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  🏠    🔍    🛒    ♡    👤                              │
│ Home  Shop  Cart(2) Wishlist  Profile                    │
└──────────────────────────────────────────────────────────┘
```

- Fixed bottom bar on mobile
- Active tab highlighted with royal blue
- Badge on Cart and Wishlist icons
- Profile icon changes to avatar if logged in

---

## 6. Breadcrumb Navigation

```
Home › Sarees › Banarasi Silk Saree
Home › My Account › Orders › #KP-1234
Admin › Products › Edit Product
```

- Auto-generated from route hierarchy
- Last item is plain text (current page), rest are links
- Separator: "›"
- Hidden on mobile for single-level pages
- Structured data for SEO

---

## Navigation State Diagram

```
USER STATE                    NAVIGATION VISIBLE
─────────────                 ──────────────────
Not logged in                 Home, Shop, Categories, About, Contact, Cart
                              Login, Register (in header)
                              Auth pages

Logged in (CUSTOMER)          Home, Shop, Categories, About, Contact, Cart
                              My Account dropdown (Orders, Wishlist, Profile)
                              Logout button
                              Customer dashboard pages

Logged in (ADMIN)             Everything customer sees
                              PLUS: Admin link in user dropdown
                              Admin dashboard (sidebar nav)
                              All admin CRUD pages
```
</content>

