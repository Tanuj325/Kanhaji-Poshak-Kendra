import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useWishlistContext } from '@/context/WishlistContext';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { useOrders } from '@/hooks/useOrders';
import { useAddresses } from '@/hooks/useAddresses';
import { useActiveCoupons } from '@/hooks/useCoupons';
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
  FiMail,
  FiPhone,
} from 'react-icons/fi';

/**
 * MobileDashboard
 * Native Full-Screen Luxury Ecommerce Account Dashboard Page for Mobile (<768px) and Tablet (768px-1023px).
 * Inspired by Nike, Amazon, Myntra, AJIO, Apple Store, and Shopify Plus.
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
  const { data: activeCoupons } = useActiveCoupons();

  const totalOrders = ordersData?.totalElements || (ordersData?.content || ordersData?.data || []).length || 0;
  const addrList = Array.isArray(addresses) ? addresses : addresses?.data || [];
  const couponCount = Array.isArray(activeCoupons) ? activeCoupons.length : 0;

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Valued Devotee';
  const email = user?.email || '';
  const phone = user?.phoneNumber || '';
  const memberSince = user?.createdAt ? formatDate(user.createdAt, { format: 'short' }) : 'Devotee Member';

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

  // Quick Action Cards configuration
  const quickActions = [
    {
      id: 'orders',
      label: 'Orders',
      subtitle: totalOrders > 0 ? `${totalOrders} Orders Placed` : 'Track Recent Orders',
      icon: FiShoppingBag,
      href: ROUTE_PATHS.ORDERS,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      subtitle: wishlistCount > 0 ? `${wishlistCount} Saved Items` : 'Your Saved Items',
      icon: FiHeart,
      href: ROUTE_PATHS.WISHLIST,
    },
    {
      id: 'addresses',
      label: 'Addresses',
      subtitle: addrList.length > 0 ? `${addrList.length} Delivery Places` : 'Manage Addresses',
      icon: FiMapPin,
      href: ROUTE_PATHS.ADDRESSES,
    },
    {
      id: 'coupons',
      label: 'Coupons',
      subtitle: couponCount > 0 ? `${couponCount} Active Offers` : 'Special Discounts',
      icon: FiTag,
      href: ROUTE_PATHS.SHOP,
    },
    {
      id: 'rewards',
      label: 'Rewards',
      subtitle: 'Devotee Club Gold',
      icon: FiGift,
      href: ROUTE_PATHS.SHOP,
    },
    {
      id: 'support',
      label: 'Support',
      subtitle: '24/7 Customer Care',
      icon: FiHeadphones,
      href: ROUTE_PATHS.CONTACT,
    },
  ];

  // Menu Rows configuration
  const menuRows = [
    {
      id: 'orders',
      label: 'My Orders',
      icon: FiShoppingBag,
      href: ROUTE_PATHS.ORDERS,
      count: totalOrders > 0 ? totalOrders : null,
    },
    {
      id: 'wishlist',
      label: 'Saved Wishlist',
      icon: FiHeart,
      href: ROUTE_PATHS.WISHLIST,
      count: wishlistCount > 0 ? wishlistCount : null,
    },
    {
      id: 'addresses',
      label: 'Delivery Addresses',
      icon: FiMapPin,
      href: ROUTE_PATHS.ADDRESSES,
      count: addrList.length > 0 ? addrList.length : null,
    },
    {
      id: 'payments',
      label: 'Payment Methods',
      icon: FiCreditCard,
      href: ROUTE_PATHS.SETTINGS,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: FiBell,
      href: ROUTE_PATHS.NOTIFICATIONS,
      count: unreadCount > 0 ? unreadCount : null,
    },
    {
      id: 'settings',
      label: 'Account Settings',
      icon: FiSettings,
      href: ROUTE_PATHS.SETTINGS,
    },
    {
      id: 'help',
      label: 'Help & FAQs',
      icon: FiHelpCircle,
      href: ROUTE_PATHS.FAQ,
    },
    {
      id: 'about',
      label: 'About Kanhaji Poshak',
      icon: FiInfo,
      href: ROUTE_PATHS.ABOUT,
    },
    {
      id: 'privacy',
      label: 'Privacy Policy',
      icon: FiShield,
      href: ROUTE_PATHS.PRIVACY,
    },
    {
      id: 'terms',
      label: 'Terms of Service',
      icon: FiFileText,
      href: ROUTE_PATHS.TERMS,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F9F7F4] text-stone-900 font-display antialiased pb-24 overflow-x-hidden">
      {/* ─── 1. STICKY HEADER ─── */}
      <header className="sticky top-0 z-30 h-[56px] w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center active:scale-95 transition-transform shrink-0"
          aria-label="Back"
        >
          <FiChevronLeft className="h-5 w-5 stroke-[2.5]" />
        </button>

        <h1 className="text-[22px] font-heading font-extrabold text-amber-950 tracking-tight text-center flex-1 mx-2 truncate">
          Account
        </h1>

        <Link
          to={ROUTE_PATHS.NOTIFICATIONS}
          className="relative h-9 w-9 rounded-full bg-stone-100 hover:bg-amber-50 text-stone-800 flex items-center justify-center active:scale-95 transition-transform shrink-0"
          aria-label="Notifications"
        >
          <FiBell className="h-5 w-5 text-stone-800" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-2xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* ─── MAIN CONTENT CONTAINER (Full Width, Exact Spacing) ─── */}
      <main className="w-full px-4 pt-4 space-y-[18px]">
        {/* ─── 2. PROFILE CARD (Height 170-190px, Radius 22px, Gold Gradient) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full min-h-[178px] rounded-[22px] bg-gradient-to-br from-[#FFFDF7] via-[#FCEECB] to-[#F5D898] border border-[#E6C687] p-[18px] shadow-md relative overflow-hidden flex flex-col justify-between gap-3"
        >
          {/* TOP ROW: Avatar (64px), Name (20px), Email (13px), Edit Button (44px height, 14px rounded) */}
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <Avatar
                name={fullName}
                src={user?.profileImageUrl}
                size="xl"
                className="w-[64px] h-[64px] rounded-full border-2 border-amber-600 shadow-sm shrink-0 object-cover"
              />

              <div className="min-w-0 flex-1">
                <h2 className="text-[20px] font-heading font-extrabold text-amber-950 truncate leading-snug">
                  {fullName}
                </h2>
                {email && (
                  <p className="text-[13px] text-stone-700 truncate font-medium flex items-center gap-1 mt-0.5">
                    <FiMail className="h-3.5 w-3.5 text-amber-900 shrink-0" />
                    <span className="truncate">{email}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.PROFILE)}
              className="h-[44px] px-4 rounded-[14px] bg-amber-950 hover:bg-amber-900 text-white text-[13px] font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <FiEdit3 className="h-4 w-4" />
              <span>Edit</span>
            </button>
          </div>

          {/* MIDDLE ROW: Phone (13px) & Member Since (13px) */}
          <div className="flex items-center justify-between text-[13px] font-medium text-stone-800 border-t border-amber-900/15 pt-2 w-full">
            <span className="flex items-center gap-1.5 truncate">
              <FiPhone className="h-3.5 w-3.5 text-amber-900 shrink-0" />
              <span>{phone || 'No phone added'}</span>
            </span>
            <span className="shrink-0 text-amber-950 font-semibold">
              Member since: <strong className="font-extrabold">{memberSince}</strong>
            </span>
          </div>

          {/* BOTTOM ROW: Statistics (Orders, Wishlist, Coupons - Dynamically Loaded) */}
          <div className="w-full bg-white/75 backdrop-blur-md rounded-[14px] p-2 border border-amber-400/40 flex items-center justify-around">
            <div className="flex flex-col items-center flex-1 border-r border-amber-900/10 last:border-r-0">
              <span className="text-[16px] font-extrabold font-mono text-amber-950 leading-none">
                {totalOrders}
              </span>
              <span className="text-[11px] font-bold text-stone-700 mt-1 uppercase tracking-wider">
                Orders
              </span>
            </div>

            <div className="flex flex-col items-center flex-1 border-r border-amber-900/10 last:border-r-0">
              <span className="text-[16px] font-extrabold font-mono text-amber-950 leading-none">
                {wishlistCount}
              </span>
              <span className="text-[11px] font-bold text-stone-700 mt-1 uppercase tracking-wider">
                Wishlist
              </span>
            </div>

            <div className="flex flex-col items-center flex-1">
              <span className="text-[16px] font-extrabold font-mono text-amber-950 leading-none">
                {couponCount}
              </span>
              <span className="text-[11px] font-bold text-stone-700 mt-1 uppercase tracking-wider">
                Coupons
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── 3. QUICK ACTIONS (2 Columns, Height 100px, Rounded 18px, Icon 28px, Label 14px, Subtitle 13px) ─── */}
        <section className="w-full space-y-3">
          <h3 className="text-[17px] font-heading font-extrabold text-amber-950 px-0.5">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-[14px] w-full">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: idx * 0.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(action.href)}
                  className="w-full h-[100px] rounded-[18px] bg-white border border-stone-200/80 p-[18px] shadow-2xs hover:border-amber-400/60 cursor-pointer flex flex-col justify-between transition-all group"
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className="w-[28px] h-[28px] text-amber-900 stroke-[1.8] group-hover:scale-105 transition-transform shrink-0" />
                    <FiChevronRight className="w-5 h-5 text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>

                  <div className="w-full min-w-0">
                    <div className="text-[14px] font-heading font-bold text-stone-900 group-hover:text-amber-950 truncate leading-snug">
                      {action.label}
                    </div>
                    <div className="text-[13px] text-stone-500 font-medium truncate">
                      {action.subtitle}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 4. ACCOUNT MENU (One Large White Card, Rounded 18px, Rows 60px Height, Menu Text 15px) ─── */}
        <section className="w-full space-y-3">
          <h3 className="text-[17px] font-heading font-extrabold text-amber-950 px-0.5">
            Account Options
          </h3>

          <div className="w-full rounded-[18px] bg-white border border-stone-200/80 shadow-2xs divide-y divide-stone-100 overflow-hidden">
            {menuRows.map((row) => {
              const Icon = row.icon;
              return (
                <motion.div
                  key={row.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(row.href)}
                  className="h-[60px] px-[18px] flex items-center justify-between hover:bg-amber-50/40 active:bg-stone-100 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <Icon className="w-6 h-6 text-amber-900 stroke-[1.8] shrink-0 group-hover:scale-105 transition-transform" />
                    <span className="text-[15px] font-heading font-bold text-stone-900 truncate">
                      {row.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {row.count !== null && row.count > 0 && (
                      <span className="bg-amber-100 text-amber-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full font-mono shadow-2xs">
                        {row.count}
                      </span>
                    )}
                    <FiChevronRight className="w-5 h-5 text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 5. STANDALONE SIGN OUT BUTTON (44px Height, Rounded 14px) ─── */}
        <div className="w-full pt-1 pb-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="w-full h-[44px] rounded-[14px] border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 font-bold text-[14px] shadow-2xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <FiLogOut className="h-4 w-4 text-rose-600" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out of Account'}</span>
          </motion.button>
        </div>
      </main>
    </div>
  );
}

