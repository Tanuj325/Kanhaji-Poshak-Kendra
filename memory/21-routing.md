# COMPLETE ROUTING ARCHITECTURE

## Route Structure

```
/                                   PublicLayout
├── /                               HomePage
├── /shop                           ShopPage
├── /shop?category=:slug            ShopPage (filtered)
├── /shop?search=:query             ShopPage (searched)
├── /product/:slug                  ProductDetailPage
├── /category/:slug                 CategoryPage
├── /about                          AboutPage
├── /contact                        ContactPage
├── /faq                            FAQPage
├── /terms                          TermsPage
├── /privacy                        PrivacyPage
│
├── /auth                           AuthLayout
│   ├── /auth/login                 LoginPage
│   ├── /auth/register              RegisterPage
│   ├── /auth/verify-email          VerifyEmailPage
│   ├── /auth/forgot-password       ForgotPasswordPage
│   └── /auth/reset-password        ResetPasswordPage
│
├── /account                        CustomerLayout (Protected)
│   ├── /account/profile            ProfilePage
│   ├── /account/addresses          AddressesPage
│   ├── /account/orders             OrdersPage
│   ├── /account/orders/:orderId    OrderDetailPage
│   ├── /account/wishlist           WishlistPage
│   ├── /account/notifications      NotificationsPage
│   └── /account/settings           SettingsPage
│
├── /cart                           CartPage
├── /checkout                       CheckoutPage (Protected)
├── /order/confirmation/:orderId    OrderConfirmationPage (Protected)
│
├── /admin                          AdminLayout (Admin Only)
│   ├── /admin                     DashboardPage
│   ├── /admin/analytics/products  ProductAnalyticsPage
│   ├── /admin/analytics/sales     SalesAnalyticsPage
│   ├── /admin/analytics/customers CustomerAnalyticsPage
│   ├── /admin/products            ProductsListPage
│   ├── /admin/products/new        ProductCreatePage
│   ├── /admin/products/:id/edit   ProductEditPage
│   ├── /admin/categories          CategoriesListPage
│   ├── /admin/categories/new      CategoryCreatePage
│   ├── /admin/categories/:id/edit CategoryEditPage
│   ├── /admin/orders              OrdersListPage
│   ├── /admin/orders/:orderId     OrderDetailAdminPage
│   ├── /admin/users               UsersListPage
│   ├── /admin/users/:userId       UserDetailPage
│   ├── /admin/coupons             CouponsListPage
│   ├── /admin/coupons/new         CouponCreatePage
│   ├── /admin/coupons/:id/edit    CouponEditPage
│   ├── /admin/banners             BannersListPage
│   ├── /admin/banners/new         BannerCreatePage
│   ├── /admin/banners/:id/edit    BannerEditPage
│   ├── /admin/messages            ContactMessagesPage
│   ├── /admin/reviews             ReviewsListPage
│   └── /admin/settings            SettingsAdminPage
│
├── /403                           ForbiddenPage
├── /500                           ServerErrorPage
└── /maintenance                   MaintenancePage
└── *                              NotFoundPage (404)
```

## Route Configuration (routePaths.js)

```javascript
// PUBLIC
export const PUBLIC_ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT_DETAIL: '/product/:slug',
  CATEGORY: '/category/:slug',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  TERMS: '/terms',
  PRIVACY: '/privacy',
};

// AUTH
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
};

// CUSTOMER (Protected)
export const CUSTOMER_ROUTES = {
  PROFILE: '/account/profile',
  ADDRESSES: '/account/addresses',
  ORDERS: '/account/orders',
  ORDER_DETAIL: '/account/orders/:orderId',
  WISHLIST: '/account/wishlist',
  NOTIFICATIONS: '/account/notifications',
  SETTINGS: '/account/settings',
};

// PUBLIC CUSTOMER PAGES
export const PUBLIC_CUSTOMER_ROUTES = {
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order/confirmation/:orderId',
};

// ADMIN (Admin Only)
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  PRODUCT_ANALYTICS: '/admin/analytics/products',
  SALES_ANALYTICS: '/admin/analytics/sales',
  CUSTOMER_ANALYTICS: '/admin/analytics/customers',
  PRODUCTS: '/admin/products',
  PRODUCT_NEW: '/admin/products/new',
  PRODUCT_EDIT: '/admin/products/:id/edit',
  CATEGORIES: '/admin/categories',
  CATEGORY_NEW: '/admin/categories/new',
  CATEGORY_EDIT: '/admin/categories/:id/edit',
  ORDERS: '/admin/orders',
  ORDER_DETAIL: '/admin/orders/:orderId',
  USERS: '/admin/users',
  USER_DETAIL: '/admin/users/:userId',
  COUPONS: '/admin/coupons',
  COUPON_NEW: '/admin/coupons/new',
  COUPON_EDIT: '/admin/coupons/:id/edit',
  BANNERS: '/admin/banners',
  BANNER_NEW: '/admin/banners/new',
  BANNER_EDIT: '/admin/banners/:id/edit',
  MESSAGES: '/admin/messages',
  REVIEWS: '/admin/reviews',
  SETTINGS: '/admin/settings',
};

// ERROR
export const ERROR_ROUTES = {
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
  MAINTENANCE: '/maintenance',
  NOT_FOUND: '*',
};
```

## Route Guards

### ProtectedRoute (Auth Guard)
```
<ProtectedRoute>
  - Checks AuthContext for authenticated user
  - If NOT authenticated → redirect to /auth/login?redirect=current_path
  - If authenticated → render children (CustomerLayout)
  - Shows loading skeleton while checking auth status
```

### AdminRoute (Role Guard)
```
<AdminRoute>
  - Checks AuthContext for user.role === 'ADMIN'
  - If NOT authenticated → redirect to /auth/login
  - If authenticated but NOT admin → redirect to /403
  - If authenticated AND admin → render children (AdminLayout)
```

### GuestRoute (Redirect if logged in)
```
<GuestRoute>
  - Used for /auth/* pages
  - If already authenticated → redirect to /
  - If not authenticated → render children (AuthLayout)
```

## Router Tree (AppRouter.jsx)

```
<BrowserRouter>
  <HelmetProvider>
    <QueryClientProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ThemeProvider>
              <Toaster />
              <Routes>
                
                {/* PUBLIC LAYOUT */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/cart" element={<CartPage />} />
                </Route>
                
                {/* AUTH LAYOUT */}
                <Route element={<GuestRoute />}>
                  <Route element={<AuthLayout />}>
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                    <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                  </Route>
                </Route>
                
                {/* CUSTOMER LAYOUT (Protected) */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<CustomerLayout />}>
                    <Route path="/account/profile" element={<ProfilePage />} />
                    <Route path="/account/addresses" element={<AddressesPage />} />
                    <Route path="/account/orders" element={<OrdersPage />} />
                    <Route path="/account/orders/:orderId" element={<OrderDetailPage />} />
                    <Route path="/account/wishlist" element={<WishlistPage />} />
                    <Route path="/account/notifications" element={<NotificationsPage />} />
                    <Route path="/account/settings" element={<SettingsPage />} />
                  </Route>
                </Route>
                
                {/* PROTECTED PUBLIC PAGES */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order/confirmation/:orderId" element={<OrderConfirmationPage />} />
                </Route>
                
                {/* ADMIN LAYOUT */}
                <Route element={<AdminRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<DashboardPage />} />
                    {/* Analytics */}
                    <Route path="/admin/analytics/products" element={<ProductAnalyticsPage />} />
                    <Route path="/admin/analytics/sales" element={<SalesAnalyticsPage />} />
                    <Route path="/admin/analytics/customers" element={<CustomerAnalyticsPage />} />
                    {/* Products */}
                    <Route path="/admin/products" element={<ProductsListPage />} />
                    <Route path="/admin/products/new" element={<ProductCreatePage />} />
                    <Route path="/admin/products/:id/edit" element={<ProductEditPage />} />
                    {/* Categories */}
                    <Route path="/admin/categories" element={<CategoriesListPage />} />
                    <Route path="/admin/categories/new" element={<CategoryCreatePage />} />
                    <Route path="/admin/categories/:id/edit" element={<CategoryEditPage />} />
                    {/* Orders */}
                    <Route path="/admin/orders" element={<OrdersListPage />} />
                    <Route path="/admin/orders/:orderId" element={<OrderDetailAdminPage />} />
                    {/* Users */}
                    <Route path="/admin/users" element={<UsersListPage />} />
                    <Route path="/admin/users/:userId" element={<UserDetailPage />} />
                    {/* Coupons */}
                    <Route path="/admin/coupons" element={<CouponsListPage />} />
                    <Route path="/admin/coupons/new" element={<CouponCreatePage />} />
                    <Route path="/admin/coupons/:id/edit" element={<CouponEditPage />} />
                    {/* Banners */}
                    <Route path="/admin/banners" element={<BannersListPage />} />
                    <Route path="/admin/banners/new" element={<BannerCreatePage />} />
                    <Route path="/admin/banners/:id/edit" element={<BannerEditPage />} />
                    {/* Other */}
                    <Route path="/admin/messages" element={<ContactMessagesPage />} />
                    <Route path="/admin/reviews" element={<ReviewsListPage />} />
                    <Route path="/admin/settings" element={<SettingsAdminPage />} />
                  </Route>
                </Route>
                
                {/* ERROR PAGES */}
                <Route path="/403" element={<ForbiddenPage />} />
                <Route path="/500" element={<ServerErrorPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="*" element={<NotFoundPage />} />
                
              </Routes>
            </ThemeProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
</BrowserRouter>
```

## Route Category Mapping to Backend

| Frontend Route | Backend API | Auth |
|---|---|---|
| / | GET /api/products/featured, GET /api/banners, GET /api/categories | Public |
| /shop | GET /api/products (with filters) | Public |
| /product/:slug | GET /api/products/slug/:slug | Public |
| /auth/login | POST /api/auth/login | Public |
| /auth/register | POST /api/auth/register | Public |
| /auth/verify-email | GET /api/auth/verify-email?token= | Public |
| /auth/forgot-password | POST /api/auth/forgot-password | Public |
| /auth/reset-password | POST /api/auth/reset-password | Public |
| /account/* | Various /api/users/*, /api/orders/* etc. | JWT |
| /cart | GET /api/cart, POST/DELETE /api/cart/* | JWT |
| /checkout | GET /api/addresses, POST /api/orders | JWT |
| /admin/* | All /api/admin/** endpoints | JWT + ADMIN |
</content>

