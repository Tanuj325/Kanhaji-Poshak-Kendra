import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ROUTE_PATHS } from './routePaths';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GuestRoute from './GuestRoute';
import Loader from '@/components/ui/Loader';

// Layouts (lazy loaded)
const PublicLayout = lazy(() => import('@/components/layout/PublicLayout'));
const AuthLayout = lazy(() => import('@/components/layout/AuthLayout'));
const CustomerLayout = lazy(() => import('@/components/layout/CustomerLayout'));
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'));

// Pages (lazy loaded)
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const ShopPage = lazy(() => import('@/pages/public/ShopPage'));
const CategoriesPage = lazy(() => import('@/pages/public/CategoriesPage'));
const ProductDetailPage = lazy(() => import('@/pages/public/ProductDetailPage'));
const CategoryPage = lazy(() => import('@/pages/public/CategoryPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const FAQPage = lazy(() => import('@/pages/public/FAQPage'));
const LegalPage = lazy(() => import('@/pages/public/LegalPage'));
const CartPage = lazy(() => import('@/pages/customer/CartPage'));

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

const CustomerDashboardPage = lazy(() => import('@/pages/customer/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/customer/ProfilePage'));
const AddressesPage = lazy(() => import('@/pages/customer/AddressesPage'));
const OrdersPage = lazy(() => import('@/pages/customer/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/customer/OrderDetailPage'));
const WishlistPage = lazy(() => import('@/pages/customer/WishlistPage'));
const NotificationsPage = lazy(() => import('@/pages/customer/NotificationsPage'));
const SettingsPage = lazy(() => import('@/pages/customer/SettingsPage'));
const CheckoutPage = lazy(() => import('@/pages/customer/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('@/pages/customer/OrderConfirmationPage'));

const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const ProductsListPage = lazy(() => import('@/pages/admin/ProductsListPage'));
const ProductCreatePage = lazy(() => import('@/pages/admin/ProductCreatePage'));
const ProductEditPage = lazy(() => import('@/pages/admin/ProductEditPage'));
const CategoriesListPage = lazy(() => import('@/pages/admin/CategoriesListPage'));
const CategoryCreatePage = lazy(() => import('@/pages/admin/CategoryCreatePage'));
const CategoryEditPage = lazy(() => import('@/pages/admin/CategoryEditPage'));
const OrdersListPage = lazy(() => import('@/pages/admin/OrdersListPage'));
const OrderDetailAdminPage = lazy(() => import('@/pages/admin/OrderDetailAdminPage'));
const UsersListPage = lazy(() => import('@/pages/admin/UsersListPage'));
const UserDetailPage = lazy(() => import('@/pages/admin/UserDetailPage'));
const CouponsListPage = lazy(() => import('@/pages/admin/CouponsListPage'));
const CouponCreatePage = lazy(() => import('@/pages/admin/CouponCreatePage'));
const CouponEditPage = lazy(() => import('@/pages/admin/CouponEditPage'));
const BannersListPage = lazy(() => import('@/pages/admin/BannersListPage'));
const BannerCreatePage = lazy(() => import('@/pages/admin/BannerCreatePage'));
const BannerEditPage = lazy(() => import('@/pages/admin/BannerEditPage'));
const ContactMessagesPage = lazy(() => import('@/pages/admin/ContactMessagesPage'));
const SettingsAdminPage = lazy(() => import('@/pages/admin/SettingsAdminPage'));
const ActivityLogsPage = lazy(() => import('@/pages/admin/ActivityLogsPage'));
const ProductAnalyticsPage = lazy(() => import('@/pages/admin/ProductAnalyticsPage'));
const SalesAnalyticsPage = lazy(() => import('@/pages/admin/SalesAnalyticsPage'));
const CustomerAnalyticsPage = lazy(() => import('@/pages/admin/CustomerAnalyticsPage'));
const PaymentMonitoringPage = lazy(() => import('@/pages/admin/PaymentMonitoringPage'));

const NotFoundPage = lazy(() => import('@/pages/error/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@/pages/error/ForbiddenPage'));
const ServerErrorPage = lazy(() => import('@/pages/error/ServerErrorPage'));
const MaintenancePage = lazy(() => import('@/pages/error/MaintenancePage'));

const LoadingFallback = () => <Loader isFullPage />;

export default function AppRouter() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Layout */}
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path={ROUTE_PATHS.SHOP} element={<ShopPage />} />
              <Route path={ROUTE_PATHS.CATEGORIES} element={<CategoriesPage />} />
              <Route path={ROUTE_PATHS.PRODUCT_DETAIL} element={<ProductDetailPage />} />
              <Route path={ROUTE_PATHS.CATEGORY} element={<CategoryPage />} />
              <Route path={ROUTE_PATHS.ABOUT} element={<AboutPage />} />
              <Route path={ROUTE_PATHS.CONTACT} element={<ContactPage />} />
              <Route path={ROUTE_PATHS.FAQ} element={<FAQPage />} />
              <Route path={ROUTE_PATHS.LEGAL} element={<LegalPage />} />
              <Route path={ROUTE_PATHS.TERMS} element={<LegalPage />} />
              <Route path={ROUTE_PATHS.PRIVACY} element={<LegalPage />} />
              <Route path={ROUTE_PATHS.SHIPPING} element={<LegalPage />} />
              <Route path={ROUTE_PATHS.CART} element={<CartPage />} />
            </Route>

            {/* Auth Routes accessible to all (Guests & Logged-in users resetting password / verifying email) */}
            <Route element={<AuthLayout />}>
              <Route path={ROUTE_PATHS.VERIFY_EMAIL} element={<VerifyEmailPage />} />
              <Route path={ROUTE_PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              <Route path={ROUTE_PATHS.RESET_PASSWORD} element={<ResetPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/* Guest-only Auth Routes (Login / Register) */}
            <Route element={<GuestRoute />}>
              <Route element={<AuthLayout />}>
                <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
                <Route path={ROUTE_PATHS.REGISTER} element={<RegisterPage />} />
              </Route>
            </Route>

            {/* Protected Customer Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<CustomerLayout />}>
                <Route path={ROUTE_PATHS.ACCOUNT_DASHBOARD} element={<CustomerDashboardPage />} />
                <Route path={ROUTE_PATHS.PROFILE} element={<ProfilePage />} />
                <Route path={ROUTE_PATHS.ADDRESSES} element={<AddressesPage />} />
                <Route path={ROUTE_PATHS.ORDERS} element={<OrdersPage />} />
                <Route path={ROUTE_PATHS.ORDER_DETAIL} element={<OrderDetailPage />} />
                <Route path={ROUTE_PATHS.WISHLIST} element={<WishlistPage />} />
                <Route path={ROUTE_PATHS.NOTIFICATIONS} element={<NotificationsPage />} />
                <Route path={ROUTE_PATHS.SETTINGS} element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Protected Public Pages */}
            <Route element={<ProtectedRoute />}>
              <Route path={ROUTE_PATHS.CHECKOUT} element={<CheckoutPage />} />
              <Route path={ROUTE_PATHS.ORDER_CONFIRMATION} element={<OrderConfirmationPage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index path={ROUTE_PATHS.ADMIN} element={<DashboardPage />} />
                <Route path={ROUTE_PATHS.ADMIN_PAYMENTS} element={<PaymentMonitoringPage />} />
                <Route path={ROUTE_PATHS.ADMIN_PRODUCT_ANALYTICS} element={<ProductAnalyticsPage />} />
                <Route path={ROUTE_PATHS.ADMIN_SALES_ANALYTICS} element={<SalesAnalyticsPage />} />
                <Route path={ROUTE_PATHS.ADMIN_CUSTOMER_ANALYTICS} element={<CustomerAnalyticsPage />} />
                <Route path={ROUTE_PATHS.ADMIN_PRODUCTS} element={<ProductsListPage />} />
                <Route path={ROUTE_PATHS.ADMIN_PRODUCT_NEW} element={<ProductCreatePage />} />
                <Route path={ROUTE_PATHS.ADMIN_PRODUCT_EDIT} element={<ProductEditPage />} />
                <Route path={ROUTE_PATHS.ADMIN_CATEGORIES} element={<CategoriesListPage />} />
                <Route path={ROUTE_PATHS.ADMIN_CATEGORY_NEW} element={<CategoryCreatePage />} />
                <Route path={ROUTE_PATHS.ADMIN_CATEGORY_EDIT} element={<CategoryEditPage />} />
                <Route path={ROUTE_PATHS.ADMIN_ORDERS} element={<OrdersListPage />} />
                <Route path={ROUTE_PATHS.ADMIN_ORDER_DETAIL} element={<OrderDetailAdminPage />} />
                <Route path={ROUTE_PATHS.ADMIN_USERS} element={<UsersListPage />} />
                <Route path={ROUTE_PATHS.ADMIN_USER_DETAIL} element={<UserDetailPage />} />
                <Route path={ROUTE_PATHS.ADMIN_COUPONS} element={<CouponsListPage />} />
                <Route path={ROUTE_PATHS.ADMIN_COUPON_NEW} element={<CouponCreatePage />} />
                <Route path={ROUTE_PATHS.ADMIN_COUPON_EDIT} element={<CouponEditPage />} />
                <Route path={ROUTE_PATHS.ADMIN_BANNERS} element={<BannersListPage />} />
                <Route path={ROUTE_PATHS.ADMIN_BANNER_NEW} element={<BannerCreatePage />} />
                <Route path={ROUTE_PATHS.ADMIN_BANNER_EDIT} element={<BannerEditPage />} />
                <Route path={ROUTE_PATHS.ADMIN_MESSAGES} element={<ContactMessagesPage />} />
                <Route path={ROUTE_PATHS.ADMIN_ACTIVITY_LOGS} element={<ActivityLogsPage />} />
                <Route path={ROUTE_PATHS.ADMIN_SETTINGS} element={<SettingsAdminPage />} />
              </Route>
            </Route>

            {/* Error Pages */}
            <Route path={ROUTE_PATHS.FORBIDDEN} element={<ForbiddenPage />} />
            <Route path={ROUTE_PATHS.SERVER_ERROR} element={<ServerErrorPage />} />
            <Route path={ROUTE_PATHS.MAINTENANCE} element={<MaintenancePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

