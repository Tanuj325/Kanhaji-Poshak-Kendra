import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useWishlistContext } from '@/context/WishlistContext';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { useOrders } from '@/hooks/useOrders';
import { useAddresses } from '@/hooks/useAddresses';
import { formatDate } from '@/utils/formatDate';
import { ROUTE_PATHS } from '@/routes/routePaths';
import toast from 'react-hot-toast';
import {
  FiChevronLeft,
  FiBell,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiTag,
  FiGift,
  FiHelpCircle,
  FiChevronRight,
  FiCreditCard,
  FiLock,
  FiSettings,
  FiInfo,
  FiLogOut,
  FiEdit3,
  FiUser,
  FiShield,
  FiHeadphones,
} from 'react-icons/fi';

/**
 * MobileDashboard
 * Native App-style Account Dashboard Rebuild for Mobile (<768px) and Tablet (768px-1023px).
 * Inspired by Apple Store, Nike App, Myntra, AJIO, Shopify Plus.
 */
export default function MobileDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlistContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount = typeof unreadData === 'number' ? unreadData : unreadData?.count || 0;

  const { data: ordersData } = useOrders({ page: 0, size: 5 });
  const { data: addresses } = useAddresses();

  const totalOrders = ordersData?.totalElements || (ordersData?.content || ordersData?.data || []).length || 0;
  const addrList = Array.isArray(addresses) ? addresses : addresses?.data || [];

  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Valued Devotee';
  const email = user?.email || 'devotee@krishanaposhak.com';
  const phone = user?.phoneNumber || 'No phone added';
  const memberSince = user?.createdAt ? formatDate(user.createdAt, { format: 'MMM YYYY' }) : 'Jan 2024';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate(ROUTE_PATHS.LOGIN, { replace: true });
    } catch (err) {
      toast.error('Failed to log out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const quickActions = [
    {
      id: 'orders',
      label: 'Orders',
      icon: FiShoppingBag,
      href: ROUTE_PATHS.ORDERS,
      count: totalOrders > 0 ? totalOrders : null,
      badgeColor: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: FiHeart,
      href: ROUTE_PATHS.WISHLIST,
      count: wishlistCount > 0 ? wishlistCount : null,
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: FiMapPin,
      href: ROUTE_PATHS.ADDRESSES,
      count: addrList.length > 0 ? addrList.length : null,
      badgeColor: 'bg-stone-100 text-stone-800',
    },
    {
      id: 'coupons',
      label: 'Coupons',
      icon: FiTag,
      href: ROUTE_PATHS.SHOP,
      badge: 'Active',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: FiGift,
      href: ROUTE_PATHS.SHOP,
      badge: 'Gold',
      badgeColor: 'bg-amber-200 text-amber-950 font-extrabold',
    },
    {
      id: 'support',
      label: 'Support',
      icon: FiHeadphones,
      href: ROUTE_PATHS.CONTACT,
      badge: '24/7',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
  ];

  const menuRows = [
    { id: 'orders', label: 'My Orders', icon: FiShoppingBag, href: ROUTE_PATHS.ORDERS },
    { id: 'addresses', label: 'Addresses Book', icon: FiMapPin, href: ROUTE_PATHS.ADDRESSES },
    { id: 'payments', label: 'Saved Payments & UPI', icon: FiCreditCard, href: ROUTE_PATHS.SETTINGS },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: FiBell,
      href: ROUTE_PATHS.NOTIFICATIONS,
      count: unreadCount > 0 ? unreadCount : null,
    },
    { id: 'password', label: 'Change Password', icon: FiLock, href: ROUTE_PATHS.PROFILE },
    { id: 'settings', label: 'Account Settings', icon: FiSettings, href: ROUTE_PATHS.SETTINGS },
    { id: 'help', label: 'Help & FAQs', icon: FiHelpCircle, href: ROUTE_PATHS.FAQ },
    { id: 'about', label: 'About Krishna Poshak', icon: FiInfo, href: ROUTE_PATHS.ABOUT },
  ];

  return (
    <div className="min-h-dvh w-full bg-[#FAF8F5] text-stone-900 font-display antialiased pb-28 md:pb-16">
      {/* ─── 1. HEADER (56px Height, Sticky, Back Button, Title, Notification) ─── */}
      <header className="sticky top-0 z-40 h-[56px] bg-white/95 backdrop-blur-xl border-b border-amber-900/10 px-4 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-800 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Back"
        >
          <FiChevronLeft className="h-5 w-5 stroke-[2.5]" />
        </button>

        <h1 className="text-[15px] font-heading font-extrabold text-amber-950 tracking-wide">
          My Account
        </h1>

        <Link
          to={ROUTE_PATHS.NOTIFICATIONS}
          className="relative h-9 w-9 rounded-full bg-stone-100 hover:bg-amber-50 text-stone-800 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Notifications"
        >
          <FiBell className="h-4.5 w-4.5 text-stone-700" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      </header>

      <main className="px-4 py-4 max-w-2xl mx-auto space-y-4">
        {/* ─── 2. PROFILE CARD (Premium Glass Card, 22px Radius, Soft Gold Gradient) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-[22px] bg-gradient-to-br from-white via-amber-50/70 to-amber-100/40 border border-amber-900/10 p-4 sm:p-5 shadow-sm overflow-hidden backdrop-blur-md space-y-3.5"
        >
          {/* Soft Gold Background Glow */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <Avatar
                  name={fullName}
                  src={user?.profileImageUrl}
                  size="lg"
                  className="border-2 border-amber-400 shadow-md ring-2 ring-amber-200/50"
                />
                <span
                  className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-2xs"
                  title="Active Member"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="bg-amber-200/80 text-amber-950 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-300/60 inline-flex items-center gap-1 font-heading">
                    <FiShield className="h-2.5 w-2.5 text-amber-800" /> Devotee Member
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-heading font-extrabold text-amber-950 truncate leading-snug">
                  {fullName}
                </h2>
                <p className="text-xs text-stone-600 truncate font-mono">{email}</p>
                <p className="text-[11px] text-stone-500 font-medium truncate pt-0.5">{phone}</p>
              </div>
            </div>

            <Link
              to={ROUTE_PATHS.PROFILE}
              className="shrink-0 h-8 px-3 rounded-full bg-amber-900 text-white font-extrabold text-[11px] hover:bg-amber-950 transition-all flex items-center gap-1 shadow-xs active:scale-95"
            >
              <FiEdit3 className="h-3 w-3" />
              <span>Edit</span>
            </Link>
          </div>

          <div className="pt-2.5 border-t border-amber-900/10 flex items-center justify-between text-[11px] font-medium text-stone-600 relative z-10">
            <span>Member Since: <strong className="text-amber-950 font-bold">{memberSince}</strong></span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              ✓ Verified Account
            </span>
          </div>
        </motion.div>

        {/* ─── 3. QUICK ACTION GRID (2 Columns, 90px Height Cards, Rounded 18px) ─── */}
        <section className="space-y-2">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900/70 px-1 font-heading">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate(action.href)}
                  className="h-[90px] rounded-[18px] bg-white border border-amber-900/10 p-3 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-900 flex items-center justify-center transition-colors">
                      <Icon className="h-4.5 w-4.5 stroke-[2]" />
                    </div>

                    {action.count !== null && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono shadow-2xs ${action.badgeColor}`}>
                        {action.count}
                      </span>
                    )}

                    {action.badge && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${action.badgeColor}`}>
                        {action.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-amber-950 font-heading">
                      {action.label}
                    </span>
                    <FiChevronRight className="h-4 w-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 4. ACCOUNT MENU (Premium List Cards, 56px Row Height, Chevron, Soft Divider) ─── */}
        <section className="space-y-2">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900/70 px-1 font-heading">
            Account Details & Preferences
          </h3>

          <div className="rounded-[22px] bg-white border border-amber-900/10 shadow-xs divide-y divide-amber-900/10 overflow-hidden">
            {menuRows.map((row) => {
              const Icon = row.icon;
              return (
                <motion.div
                  key={row.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(row.href)}
                  className="h-[56px] px-4 flex items-center justify-between hover:bg-amber-50/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-amber-50/80 group-hover:bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="h-4 w-4 stroke-[2]" />
                    </div>
                    <span className="text-[13px] font-bold text-stone-900 font-heading truncate">
                      {row.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {row.count !== null && row.count > 0 && (
                      <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono shadow-2xs">
                        {row.count}
                      </span>
                    )}
                    <FiChevronRight className="h-4 w-4 text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 5. LOGOUT BUTTON (Outlined, 14px Radius, Height ~46px, Not Oversized) ─── */}
        <div className="pt-2 pb-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="w-full h-[46px] rounded-[14px] border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-bold text-[13px] shadow-2xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <FiLogOut className="h-4 w-4 text-rose-600" />
            <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out of Account'}</span>
          </motion.button>
        </div>
      </main>
    </div>
  );
}
