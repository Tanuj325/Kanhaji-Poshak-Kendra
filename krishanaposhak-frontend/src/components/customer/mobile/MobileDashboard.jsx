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
    <div className="fixed inset-0 z-40 bg-[#FAF8F5] text-stone-900 font-display antialiased overflow-y-auto lg:hidden pb-28 sm:pb-12">
      {/* ─── 1. SLEEK STICKY HEADER (← Back, Centered Title, Notifications) ─── */}
      <header className="sticky top-0 z-30 h-[52px] w-full bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-stone-200/60 px-4 sm:px-5 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-full bg-white text-stone-700 border border-stone-200/80 flex items-center justify-center active:scale-95 transition-transform shadow-2xs shrink-0"
          aria-label="Back"
        >
          <FiChevronLeft className="w-[18px] h-[18px] stroke-[2.2]" />
        </button>

        <span className="text-[15px] font-heading font-bold text-stone-900 tracking-tight">
          My Account
        </span>

        <Link
          to={ROUTE_PATHS.NOTIFICATIONS}
          className="relative h-9 w-9 rounded-full bg-white text-stone-700 border border-stone-200/80 flex items-center justify-center active:scale-95 transition-transform shadow-2xs shrink-0"
          aria-label="Notifications"
        >
          <FiBell className="w-[18px] h-[18px] text-stone-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-2xs border border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* ─── 2. SLEEK GREETING BANNER ─── */}
      <div className="w-full px-4 sm:px-5 pt-3 pb-1">
        <span className="text-[11px] font-semibold text-amber-900/80 uppercase tracking-wider">
          Welcome Back
        </span>
        <h1 className="text-[20px] font-heading font-extrabold text-stone-900 tracking-tight leading-tight mt-0.5">
          {fullName}
        </h1>
      </div>

      {/* ─── MAIN CONTENT CONTAINER (Full Width, Perfect Spacing) ─── */}
      <main className="w-full px-4 sm:px-5 pt-2 space-y-4">
        {/* ─── 3. ULTRA-LUXURY PROFILE CARD (Spacious, Proportional, Champagne Gold Glass) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full rounded-[20px] bg-gradient-to-br from-[#FFFFFF] via-[#FCF9F3] to-[#F5EEDF] border border-[#E4D5BE]/70 p-4 shadow-[0_4px_16px_rgba(201,154,59,0.08)] relative overflow-hidden flex flex-col justify-between"
        >
          {/* TOP ROW: Avatar (52px), User Info, Edit Button */}
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar
                name={fullName}
                src={user?.profileImageUrl}
                size="lg"
                className="w-[52px] h-[52px] rounded-full border-2 border-amber-500/50 shadow-sm shrink-0 object-cover"
              />

              <div className="min-w-0 flex-1">
                <h2 className="text-[17px] font-heading font-bold text-stone-900 truncate leading-tight">
                  {fullName}
                </h2>
                {email && (
                  <p className="text-[12px] text-stone-600 truncate font-medium flex items-center gap-1.5 mt-1">
                    <FiMail className="w-[12px] h-[12px] text-amber-900/80 shrink-0" />
                    <span className="truncate">{email}</span>
                  </p>
                )}
                {phone && (
                  <p className="text-[12px] text-stone-600 truncate font-medium flex items-center gap-1.5 mt-0.5">
                    <FiPhone className="w-[12px] h-[12px] text-amber-900/80 shrink-0" />
                    <span className="truncate">{phone}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.PROFILE)}
              className="h-8 px-3 rounded-full bg-amber-950 hover:bg-amber-900 active:scale-95 text-white text-[12px] font-semibold shadow-2xs transition-all flex items-center gap-1 shrink-0"
            >
              <FiEdit3 className="w-[12px] h-[12px]" />
              <span>Edit</span>
            </button>
          </div>

          {/* BOTTOM ROW: Stats bar */}
          <div className="mt-3.5 w-full bg-white/90 backdrop-blur-md rounded-[14px] p-2 border border-stone-200/60 shadow-2xs grid grid-cols-3 divide-x divide-stone-100 text-center">
            <div
              onClick={() => navigate(ROUTE_PATHS.ORDERS)}
              className="flex flex-col items-center justify-center py-0.5 cursor-pointer active:scale-95 transition-transform"
            >
              <span className="text-[15px] font-bold font-mono text-stone-900 leading-none">
                {totalOrders}
              </span>
              <span className="text-[10px] font-semibold text-stone-500 mt-1 uppercase tracking-wider">
                Orders
              </span>
            </div>

            <div
              onClick={() => navigate(ROUTE_PATHS.WISHLIST)}
              className="flex flex-col items-center justify-center py-0.5 cursor-pointer active:scale-95 transition-transform"
            >
              <span className="text-[15px] font-bold font-mono text-stone-900 leading-none">
                {wishlistCount}
              </span>
              <span className="text-[10px] font-semibold text-stone-500 mt-1 uppercase tracking-wider">
                Wishlist
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-0.5">
              <span className="text-[15px] font-bold font-mono text-stone-900 leading-none">
                {couponCount}
              </span>
              <span className="text-[10px] font-semibold text-stone-500 mt-1 uppercase tracking-wider">
                Coupons
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── 4. QUICK ACTION GRID (2 Columns, Height 84px, Rounded 16px, Proportional Icons) ─── */}
        <section className="w-full space-y-2.5">
          <h3 className="text-[13px] font-heading font-bold text-stone-800 px-0.5 uppercase tracking-wider">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-3 w-full">
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
                  className="w-full h-[84px] rounded-[16px] bg-white border border-stone-200/70 p-3 shadow-2xs hover:border-amber-400/60 cursor-pointer flex flex-col justify-between transition-all group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-900 shrink-0">
                      <Icon className="w-[16px] h-[16px] stroke-[1.8] group-hover:scale-105 transition-transform" />
                    </div>
                    <FiChevronRight className="w-[14px] h-[14px] text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>

                  <div className="w-full min-w-0">
                    <div className="text-[14px] font-heading font-bold text-stone-900 group-hover:text-amber-950 truncate leading-snug">
                      {action.label}
                    </div>
                    <div className="text-[11px] text-stone-500 font-medium truncate">
                      {action.subtitle}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 5. ACCOUNT OPTIONS (Apple Settings Style, Rows 52px Height, Icon 16px) ─── */}
        <section className="w-full space-y-2.5">
          <h3 className="text-[13px] font-heading font-bold text-stone-800 px-0.5 uppercase tracking-wider">
            Account Options
          </h3>

          <div className="w-full rounded-[16px] bg-white border border-stone-200/70 shadow-2xs divide-y divide-stone-100 overflow-hidden">
            {menuRows.map((row) => {
              const Icon = row.icon;
              return (
                <motion.div
                  key={row.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(row.href)}
                  className="h-[52px] px-3.5 flex items-center justify-between hover:bg-amber-50/40 active:bg-stone-100 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-stone-50 group-hover:bg-amber-100/60 flex items-center justify-center text-amber-900 shrink-0 transition-colors">
                      <Icon className="w-[16px] h-[16px] stroke-[1.8]" />
                    </div>
                    <span className="text-[14px] font-heading font-semibold text-stone-900 truncate">
                      {row.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {row.count !== null && row.count > 0 && (
                      <span className="bg-amber-100 text-amber-950 text-[10px] font-extrabold h-[16px] min-w-[16px] px-1.5 rounded-full font-mono flex items-center justify-center shadow-2xs">
                        {row.count}
                      </span>
                    )}
                    <FiChevronRight className="w-[14px] h-[14px] text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 6. PREMIUM iOS SIGN OUT BUTTON (48px Height, 14px Radius) ─── */}
        <div className="w-full pt-1 pb-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="w-full h-[48px] rounded-[14px] border border-rose-200 bg-white hover:bg-rose-50/50 active:bg-rose-100 text-rose-600 font-bold text-[14px] shadow-2xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <FiLogOut className="w-[16px] h-[16px] text-rose-600" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out of Account'}</span>
          </motion.button>
        </div>
      </main>
    </div>
  );
}


