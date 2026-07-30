# FRONTEND FOLDER STRUCTURE

```
krishanaposhak-frontend/
├── public/
│   ├── favicon.ico
│   ├── og-image.png          # Open Graph default image
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   │
│   ├── api/                   # API Layer
│   │   ├── axiosInstance.js   # Axios config, interceptors, base URL
│   │   ├── authApi.js         # POST /api/auth/*
│   │   ├── userApi.js         # GET/PUT/DELETE /api/users/*
│   │   ├── addressApi.js      # CRUD /api/addresses/*
│   │   ├── productApi.js      # GET /api/products/*
│   │   ├── categoryApi.js     # GET/POST/PUT /api/categories/*
│   │   ├── cartApi.js         # CRUD /api/cart/*
│   │   ├── wishlistApi.js     # CRUD /api/wishlist/*
│   │   ├── orderApi.js        # POST/GET /api/orders/*
│   │   ├── paymentApi.js      # POST/GET /api/payments/*
│   │   ├── reviewApi.js       # CRUD /api/reviews/*
│   │   ├── couponApi.js       # GET/POST /api/coupons/*
│   │   ├── bannerApi.js       # GET /api/banners/*
│   │   ├── contactApi.js      # POST /api/contact/*
│   │   ├── notificationApi.js # GET/PUT /api/notifications/*
│   │   ├── adminApi.js        # All /api/admin/** endpoints
│   │   └── uploadApi.js       # Multipart upload helpers
│   │
│   ├── assets/
│   │   ├── images/            # Static images (logo, placeholders, icons)
│   │   │   ├── logo.svg
│   │   │   ├── logo-white.svg
│   │   │   ├── empty-cart.svg
│   │   │   ├── empty-wishlist.svg
│   │   │   ├── not-found.svg
│   │   │   ├── server-error.svg
│   │   │   ├── under-maintenance.svg
│   │   │   └── placeholder.png
│   │   ├── fonts/             # Custom fonts if self-hosted
│   │   └── animations/        # Lottie files if needed
│   │
│   ├── components/
│   │   ├── ui/                # Primitives (pure, reusable, presentational)
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── RadioGroup.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Drawer.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Breadcrumb.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   ├── FilterDropdown.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── DataGrid.jsx
│   │   │   ├── Tooltip.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── Accordion.jsx
│   │   │   ├── Divider.jsx
│   │   │   ├── Tag.jsx
│   │   │   ├── Stepper.jsx
│   │   │   ├── CountBadge.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── index.js          # Barrel export
│   │   │
│   │   ├── forms/                 # Form-specific components
│   │   │   ├── FormField.jsx      # Wrapper: label + input + error
│   │   │   ├── FormSelect.jsx
│   │   │   ├── FormCheckbox.jsx
│   │   │   ├── FormRadioGroup.jsx
│   │   │   ├── FormDatePicker.jsx
│   │   │   ├── FormPhoneInput.jsx
│   │   │   ├── FormFileUpload.jsx
│   │   │   ├── PasswordInput.jsx  # With show/hide toggle
│   │   │   ├── SearchForm.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── cards/                 # Business-specific cards
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductCardSkeleton.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── OrderCard.jsx
│   │   │   ├── OrderSummaryCard.jsx
│   │   │   ├── AddressCard.jsx
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── CartItemCard.jsx
│   │   │   ├── WishlistItemCard.jsx
│   │   │   ├── BannerCard.jsx
│   │   │   ├── NotificationCard.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── tables/                # Admin data tables
│   │   │   ├── ProductsTable.jsx
│   │   │   ├── OrdersTable.jsx
│   │   │   ├── UsersTable.jsx
│   │   │   ├── CategoriesTable.jsx
│   │   │   ├── CouponsTable.jsx
│   │   │   ├── BannersTable.jsx
│   │   │   ├── ContactMessagesTable.jsx
│   │   │   ├── ReviewsTable.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── charts/                # Analytics charts (Recharts)
│   │   │   ├── SalesChart.jsx
│   │   │   ├── RevenueChart.jsx
│   │   │   ├── OrdersChart.jsx
│   │   │   ├── ProductPerformanceChart.jsx
│   │   │   ├── CategoryPieChart.jsx
│   │   │   ├── CustomerGrowthChart.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── feedback/              # User feedback components
│   │   │   ├── Toast.jsx           # React Hot Toast config
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── SuccessDialog.jsx
│   │   │   ├── ErrorDialog.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingOverlay.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── navigation/            # Navigation components
│   │   │   ├── Header.jsx
│   │   │   ├── HeaderCartIcon.jsx
│   │   │   ├── HeaderWishlistIcon.jsx
│   │   │   ├── HeaderUserMenu.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   ├── Sidebar.jsx        # Admin sidebar
│   │   │   ├── SidebarMenuItem.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── BreadcrumbNav.jsx
│   │   │   ├── BottomNav.jsx      # Mobile bottom nav
│   │   │   ├── SearchOverlay.jsx  # Full-screen search
│   │   │   ├── CategoryMegaMenu.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── layout/                # Layout wrappers
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── CustomerLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── common/                # Shared business components
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   ├── SortDropdown.jsx
│   │   │   ├── PriceRangeSlider.jsx
│   │   │   ├── AddressForm.jsx
│   │   │   ├── AddressSelector.jsx
│   │   │   ├── OrderTracker.jsx
│   │   │   ├── CouponInput.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   ├── ReviewList.jsx
│   │   │   ├── RatingSummary.jsx
│   │   │   ├── ImageGallery.jsx
│   │   │   ├── VariantSelector.jsx
│   │   │   ├── QuantitySelector.jsx
│   │   │   ├── SocialShare.jsx
│   │   │   ├── NewsletterSignup.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── index.js
│   │   │
│   │   └── seo/                   # SEO components
│   │       ├── HelmetHead.jsx     # Wraps react-helmet-async
│   │       ├── ProductSchema.jsx  # Structured data for products
│   │       ├── BreadcrumbSchema.jsx
│   │       └── OrganizationSchema.jsx
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useWishlist.js
│   │   ├── useProducts.js
│   │   ├── useProduct.js         # Single product by slug
│   │   ├── useOrders.js
│   │   ├── useOrder.js
│   │   ├── useAddresses.js
│   │   ├── useCategories.js
│   │   ├── useReviews.js
│   │   ├── useBanners.js
│   │   ├── useNotifications.js
│   │   ├── useCoupons.js
│   │   ├── useDebounce.js
│   │   ├── useMediaQuery.js
│   │   ├── useIntersectionObserver.js
│   │   ├── useLocalStorage.js
│   │   ├── usePagination.js
│   │   ├── useApiQuery.js        # Wrapper for react-query GET
│   │   ├── useApiMutation.js     # Wrapper for react-query POST/PUT/DELETE
│   │   └── index.js
│   │
│   ├── context/                   # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── WishlistContext.jsx
│   │   ├── ThemeContext.jsx
│   │   ├── NotificationContext.jsx
│   │   └── index.js
│   │
│   ├── pages/                     # Page components (one per route)
│   │   ├── public/                # Public pages (no auth required)
│   │   │   ├── HomePage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── FAQPage.jsx
│   │   │   ├── TermsPage.jsx
│   │   │   └── PrivacyPage.jsx
│   │   │
│   │   ├── auth/                  # Authentication pages
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── VerifyEmailPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   │
│   │   ├── customer/              # Customer dashboard pages
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── AddressesPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── OrderDetailPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderConfirmationPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   │
│   │   ├── admin/                 # Admin dashboard pages
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProductsListPage.jsx
│   │   │   ├── ProductCreatePage.jsx
│   │   │   ├── ProductEditPage.jsx
│   │   │   ├── CategoriesListPage.jsx
│   │   │   ├── CategoryCreatePage.jsx
│   │   │   ├── CategoryEditPage.jsx
│   │   │   ├── OrdersListPage.jsx
│   │   │   ├── OrderDetailAdminPage.jsx
│   │   │   ├── UsersListPage.jsx
│   │   │   ├── UserDetailPage.jsx
│   │   │   ├── CouponsListPage.jsx
│   │   │   ├── CouponCreatePage.jsx
│   │   │   ├── CouponEditPage.jsx
│   │   │   ├── BannersListPage.jsx
│   │   │   ├── BannerCreatePage.jsx
│   │   │   ├── BannerEditPage.jsx
│   │   │   ├── ContactMessagesPage.jsx
│   │   │   ├── ReviewsListPage.jsx
│   │   │   ├── ProductAnalyticsPage.jsx
│   │   │   ├── SalesAnalyticsPage.jsx
│   │   │   ├── CustomerAnalyticsPage.jsx
│   │   │   └── SettingsAdminPage.jsx
│   │   │
│   │   └── error/                 # Error pages
│   │       ├── NotFoundPage.jsx   # 404
│   │       ├── ForbiddenPage.jsx  # 403
│   │       ├── ServerErrorPage.jsx # 500
│   │       └── MaintenancePage.jsx
│   │
│   ├── routes/                    # Route configuration
│   │   ├── AppRouter.jsx          # Root router
│   │   ├── PublicRoutes.jsx
│   │   ├── CustomerRoutes.jsx
│   │   ├── AdminRoutes.jsx
│   │   ├── AuthRoutes.jsx
│   │   ├── ProtectedRoute.jsx    # Auth guard wrapper
│   │   ├── AdminRoute.jsx        # Role guard wrapper
│   │   └── routePaths.js         # Route path constants
│   │
│   ├── services/                  # Business logic outside components
│   │   ├── tokenService.js       # Token storage & management
│   │   ├── storageService.js     # localStorage/sessionStorage wrapper
│   │   ├── formatService.js      # Price, date, text formatting
│   │   └── analyticsService.js   # Client-side event tracking
│   │
│   ├── utils/                     # Pure utility functions
│   │   ├── cn.js                 # clsx/twMerge helper
│   │   ├── formatPrice.js
│   │   ├── formatDate.js
│   │   ├── generateSlug.js
│   │   ├── truncateText.js
│   │   ├── getInitials.js
│   │   ├── calculateDiscount.js
│   │   ├── validateImage.js
│   │   └── index.js
│   │
│   ├── constants/                 # Application constants
│   │   ├── apiEndpoints.js       # All API URL constants
│   │   ├── queryKeys.js          # React Query key constants
│   │   ├── orderStatus.js        # Order status display mapping
│   │   ├── paymentStatus.js      # Payment status display mapping
│   │   ├── enums.js              # Frontend enum mirrors
│   │   ├── routes.js             # Route path constants
│   │   ├── breakpoints.js        # Responsive breakpoints
│   │   └── index.js
│   │
│   ├── config/                    # Configuration
│   │   ├── siteConfig.js         # Site name, description, URLs
│   │   ├── queryConfig.js        # React Query default options
│   │   └── themeConfig.js        # Theme object for Tailwind
│   │
│   ├── types/                     # Type definitions (JSDoc / future TS)
│   │   ├── user.types.js
│   │   ├── product.types.js
│   │   ├── order.types.js
│   │   ├── cart.types.js
│   │   ├── address.types.js
│   │   ├── payment.types.js
│   │   ├── api.types.js          # ApiResponse, PaginationResponse
│   │   └── index.js
│   │
│   ├── validators/                # Zod schemas
│   │   ├── authSchemas.js        # Login, Register, ForgotPassword
│   │   ├── profileSchemas.js     # Update profile
│   │   ├── addressSchemas.js     # Address form
│   │   ├── productSchemas.js     # Admin product management
│   │   ├── categorySchemas.js    # Admin category
│   │   ├── couponSchemas.js      # Admin coupon
│   │   ├── bannerSchemas.js      # Admin banner
│   │   ├── reviewSchemas.js      # Review form
│   │   ├── contactSchemas.js     # Contact form
│   │   └── index.js
│   │
│   └── styles/                    # Global styles
│       ├── index.css             # Tailwind directives + base styles
│       ├── globals.css           # CSS custom properties, fonts
│       ├── animations.css        # Custom subtle animations
│       └── swiper.css            # Swiper overrides
│
├── index.html
├── vite.config.js                # Vite config with path aliases
├── tailwind.config.js            # Full theme customization
├── postcss.config.js
├── jsconfig.json                 # Path aliases for imports
├── .env                          # VITE_API_BASE_URL=http://localhost:9090
├── .env.production               # Production API URL
├── .eslintrc.cjs
└── package.json
```

### Key Design Decisions

1. **api/**: One file per backend controller group. Every API function returns the axios promise directly (React Query handles the response).

2. **components/ui/**: Pure presentational components with NO business logic. Accept props only. Use `forwardRef` where applicable.

3. **components/cards/**: Business-specific cards that combine UI primitives with data from hooks.

4. **hooks/**: Custom hooks that wrap React Query calls. Each hook maps to a specific backend service. Hooks return `{ data, isLoading, error, ...queryInfo }`.

5. **pages/**: Organized by access level (public, auth, customer, admin, error). One file = one route.

6. **validators/**: Zod schemas mirror backend validation. One schema per form type.

7. **constants/**: Centralized string constants to avoid magic strings everywhere.

8. **services/**: Non-React utilities for token management, formatting, storage.

</content>

