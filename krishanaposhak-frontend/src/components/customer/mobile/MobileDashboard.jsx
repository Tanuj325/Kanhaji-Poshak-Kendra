import { useState } from 'react';
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
  FiSettings,
  FiInfo,
  FiLogOut,
  FiEdit3,
  FiShield,
  FiHeadphones,
  FiFileText,
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
    { id: 'orders', label: 'Orders', icon: FiShoppingBag, href: ROUTE_PATHS.ORDERS },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin, href: ROUTE_PATHS.ADDRESSES },
    { id: 'payments', label: 'Payments', icon: FiCreditCard, href: ROUTE_PATHS.SETTINGS },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: FiBell,
      href: ROUTE_PATHS.NOTIFICATIONS,
      count: unreadCount > 0 ? unreadCount : null,
    },
    { id: 'settings', label: 'Settings', icon: FiSettings, href: ROUTE_PATHS.SETTINGS },
    { id: 'help', label: 'Help', icon: FiHelpCircle, href: ROUTE_PATHS.FAQ },
    { id: 'about', label: 'About', icon: FiInfo, href: ROUTE_PATHS.ABOUT },
    { id: 'privacy', label: 'Privacy', icon: FiShield, href: ROUTE_PATHS.PRIVACY },
    { id: 'terms', label: 'Terms', icon: FiFileText, href: ROUTE_PATHS.TERMS },
    { id: 'logout', label: 'Logout', icon: FiLogOut, action: handleLogout, isDanger: true },
  ];

  return (
    <div className="min-h-dvh w-full overflow-x-hidden bg-[#FAF8F5] text-stone-900 font-display antialiased pb-24 md:pb-16">
      {/* ─── 1. HEADER (56px Sticky, Back Button, Center Title, Notification Icon, Profile Avatar) ─── */}
      <header className="sticky top-0 z-40 h-[56px] w-full bg-white/95 backdrop-blur-xl border-b border-stone-200/80 px-4 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-800 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Back"
        >
          <FiChevronLeft className="h-5 w-5 stroke-[2.5]" />
        </button>

        <h1 className="text-[16px] font-heading font-extrabold text-amber-950 tracking-wide text-center flex-1 mx-2 truncate">
          My Account
        </h1>

        <div className="flex items-center gap-2">
          <Link
            to={ROUTE_PATHS.NOTIFICATIONS}
            className="relative h-9 w-9 rounded-full bg-stone-100 hover:bg-amber-50 text-stone-800 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Notifications"
          >
            <FiBell className="h-4.5 w-4.5 text-stone-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <Link
            to={ROUTE_PATHS.PROFILE}
            className="h-9 w-9 rounded-full border border-amber-400/80 overflow-hidden active:scale-95 transition-transform shrink-0"
            aria-label="Profile"
          >
            <Avatar name={fullName} src={user?.profileImageUrl} size="sm" className="h-full w-full" />
          </Link>
        </div>
      </header>

      {/* ─── MAIN CONTENT WRAPPER (Full Width w-full, px-4 outer padding) ─── */}
      <main className="w-full px-4 py-4 space-y-4">
        {/* ─── 2. WELCOME CARD (Full Width, Rounded 22px, Soft Gold Gradient, Height ~110px) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full rounded-[22px] bg-gradient-to-br from-[#FFFBF0] via-[#FAF0D9] to-[#F5E5C9] border border-amber-400/30 p-4 shadow-sm overflow-hidden relative flex flex-col justify-between gap-3 min-h-[110px]"
        >
          {/* Ambient Soft Gold Background Glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between gap-3 relative z-10 w-full">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar
                name={fullName}
                src={user?.profileImageUrl}
                size="lg"
                className="h-14 w-14 rounded-full border-2 border-amber-500/80 shadow-sm shrink-0"
              />

              <div className="min-w-0 flex-1">
                <span className="text-[13px] font-bold text-amber-900/80 font-heading block">
                  Welcome back
                </span>
                <h2 className="text-[18px] font-heading font-extrabold text-amber-950 leading-tight truncate">
                  {fullName}
                </h2>
                <p className="text-[13px] text-stone-600 truncate font-mono">{email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.PROFILE)}
              className="h-[44px] px-3.5 rounded-[14px] bg-amber-900 hover:bg-amber-950 text-white text-[13px] font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <FiEdit3 className="h-4 w-4" />
              <span>Edit</span>
            </button>
          </div>

          <div className="pt-2 border-t border-amber-900/10 flex items-center justify-between text-[13px] font-medium text-stone-700 relative z-10 w-full">
            <span>Member since: <strong className="text-amber-950 font-extrabold">{memberSince}</strong></span>
            <span className="text-emerald-800 font-extrabold flex items-center gap-1 text-[12px] bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
              <FiShield className="h-3 w-3" /> Devotee Member
            </span>
          </div>
        </motion.div>

        {/* ─── 3. QUICK ACTIONS (2 Columns, Equal Width, Gap 12px, Height 90px, Rounded 18px) ─── */}
        <section className="w-full space-y-2">
          <h3 className="text-[16px] font-heading font-extrabold text-amber-950 px-1">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-[12px] w-full">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate(action.href)}
                  className="w-full h-[90px] rounded-[18px] bg-white border border-stone-200/80 p-3 shadow-xs hover:border-amber-400/50 cursor-pointer flex flex-col justify-between transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className="h-[28px] w-[28px] text-amber-900 stroke-[1.8] shrink-0" />

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

                  <div className="flex items-center justify-between w-full">
                    <span className="text-[13px] font-heading font-bold text-stone-900 group-hover:text-amber-950 truncate">
                      {action.label}
                    </span>
                    <FiChevronRight className="h-4 w-4 text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 4. ACCOUNT MENU (Full Width, White Card, Rounded 18px, 56px Row Height) ─── */}
        <section className="w-full space-y-2">
          <h3 className="text-[16px] font-heading font-extrabold text-amber-950 px-1">
            Account Details & Preferences
          </h3>

          <div className="w-full rounded-[18px] bg-white border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
            {menuRows.map((row) => {
              const Icon = row.icon;
              const handleClick = row.action ? row.action : () => navigate(row.href);

              return (
                <motion.div
                  key={row.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClick}
                  className={`h-[56px] px-4 flex items-center justify-between hover:bg-amber-50/40 cursor-pointer transition-colors group ${
                    row.isDanger ? 'hover:bg-rose-50/40' : ''
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Icon className={`h-5 w-5 stroke-[2] shrink-0 ${row.isDanger ? 'text-rose-600' : 'text-amber-900'}`} />
                    <span className={`text-[15px] font-heading font-bold truncate ${row.isDanger ? 'text-rose-600' : 'text-stone-900'}`}>
                      {row.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {row.count !== null && row.count > 0 && (
                      <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono shadow-2xs">
                        {row.count}
                      </span>
                    )}
                    <FiChevronRight className={`h-4.5 w-4.5 transition-all ${row.isDanger ? 'text-rose-400' : 'text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5'}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 5. LOGOUT BUTTON (Height 44px, Rounded 14px, Not Oversized) ─── */}
        <div className="w-full pt-2 pb-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="w-full h-[44px] rounded-[14px] border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 font-bold text-[13px] shadow-2xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <FiLogOut className="h-4 w-4 text-rose-600" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out of Account'}</span>
          </motion.button>
        </div>
      </main>
    </div>
  );
}

