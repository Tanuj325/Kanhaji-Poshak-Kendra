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

  const totalOrders = ordersData?.totalElements || (ordersData?.content || ordersData?.data || []).length || 0;
  const addrList = Array.isArray(addresses) ? addresses : addresses?.data || [];

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Valued Devotee';
  const email = user?.email || '';
  const phone = user?.phoneNumber || '';
  const memberSince = user?.createdAt ? formatDate(user.createdAt, { format: 'short' }) : 'Devotee Member';
  const profilePic = user?.profileImageUrl || user?.avatarUrl || user?.avatar || user?.profileImage || user?.image || user?.imageUrl || null;

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
    <div className="fixed inset-0 z-40 bg-[#F9F7F4] text-stone-900 font-display antialiased overflow-y-auto lg:hidden pb-28 sm:pb-12">
      {/* ─── 1. TOP STICKY HEADER ─── */}
      <header className="sticky top-0 z-30 h-[56px] w-full bg-[#F9F7F4]/95 backdrop-blur-xl border-b border-stone-200/80 px-4 sm:px-5 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-7 w-7 rounded-full bg-white text-stone-800 border border-stone-200/80 flex items-center justify-center active:scale-95 transition-transform shadow-2xs shrink-0"
          aria-label="Back"
        >
          <FiChevronLeft className="w-[22px] h-[22px] stroke-[2.2]" />
        </button>

        <span className="text-[17px] font-heading font-extrabold text-stone-900">
          My Account
        </span>

        <Link
          to={ROUTE_PATHS.NOTIFICATIONS}
          className="relative h-7 w-7 rounded-full bg-white text-stone-800 border border-stone-200/80 flex items-center justify-center active:scale-95 transition-transform shadow-2xs shrink-0"
          aria-label="Notifications"
        >
          <FiBell className="w-[20px] h-[20px] text-stone-800" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-[18px] min-w-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-2xs border border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* ─── 2. PAGE GREETING ─── */}
      <div className="w-full px-4 sm:px-5 pt-3 pb-1">
        <p className="text-[16px] text-stone-600 font-medium">
          Welcome back, <span className="font-bold text-amber-900">{user?.firstName || 'Devotee'}</span>
        </p>
      </div>

      {/* ─── MAIN CONTENT CONTAINER (Full Width, 16px Mobile / 20px Tablet Spacing) ─── */}
      <main className="w-full px-4 sm:px-5 pt-2 space-y-5">
        {/* ─── 3. PROFILE CARD (Flexbox Flow, 0 Absolute Positioning) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full rounded-[20px] bg-gradient-to-br from-[#FFFDF7] via-[#FDF5E6] to-[#F5E6CA] border border-[#E6C687]/60 p-4 sm:p-5 shadow-[0_4px_16px_rgba(201,154,59,0.12)] flex flex-col gap-4"
        >
          {/* TOP ROW: Avatar (60px) & Edit Button (115px x 42px) */}
          <div className="flex items-center justify-between gap-3 w-full">
            <Avatar
              name={fullName}
              src={profilePic}
              size="xl"
              className="w-[60px] h-[60px] rounded-full border-2 border-amber-500/70 shadow-sm shrink-0 overflow-hidden"
            />

            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.PROFILE)}
              className="w-[115px] h-[42px] rounded-full bg-amber-950 hover:bg-amber-900 active:scale-95 text-white text-[14px] font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <FiEdit3 className="w-[16px] h-[16px]" />
              <span>Edit</span>
            </button>
          </div>

          {/* USER DETAILS SECTION (Left aligned, 10-12px spacing, 18px icons, 15-16px text) */}
          <div className="flex flex-col gap-2.5 w-full">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[20px] sm:text-[22px] font-heading font-extrabold text-amber-950 leading-snug">
                {fullName}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                <FiShield className="w-[14px] h-[14px]" /> Devotee Member
              </span>
            </div>

            {email && (
              <div className="flex items-center gap-2.5 text-[13px] text-stone-700 font-medium">
                <FiMail className="w-[18px] h-[18px] text-amber-900 shrink-0" />
                <span className="break-all">{email}</span>
              </div>
            )}

            {phone && (
              <div className="flex items-center gap-2.5 text-[15px] text-stone-700 font-medium">
                <FiPhone className="w-[18px] h-[18px] text-amber-900 shrink-0" />
                <span>{phone}</span>
              </div>
            )}
          </div>

          {/* DIVIDER */}
          <div className="w-full h-px bg-amber-900/15" />

          {/* STATS SECTION (Directly below divider, equal width, centered) */}
          <div className="w-full bg-white/80 backdrop-blur-md rounded-[14px] p-2.5 border border-amber-300/40 grid grid-cols-2 divide-x divide-amber-900/10 text-center">
            <div
              onClick={() => navigate(ROUTE_PATHS.ORDERS)}
              className="flex flex-col items-center justify-center py-1 cursor-pointer active:scale-95 transition-transform"
            >
              <span className="text-[16px] font-extrabold font-mono text-amber-950 leading-none">
                {totalOrders}
              </span>
              <span className="text-[11px] font-semibold text-stone-600 mt-1 uppercase tracking-wider">
                Orders
              </span>
            </div>

            <div
              onClick={() => navigate(ROUTE_PATHS.WISHLIST)}
              className="flex flex-col items-center justify-center py-1 cursor-pointer active:scale-95 transition-transform"
            >
              <span className="text-[16px] font-extrabold font-mono text-amber-950 leading-none">
                {wishlistCount}
              </span>
              <span className="text-[11px] font-semibold text-stone-600 mt-1 uppercase tracking-wider">
                Wishlist
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── 4. QUICK ACTION GRID (2 Columns, Height 96px Mobile / 108px Tablet, Vertical Layout for Full Text Visibility) ─── */}
        <section className="w-full space-y-3">
          <h3 className="text-[16px] font-heading font-extrabold text-amber-950 px-0.5">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
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
                  className="w-full h-full sm:h-[108px] rounded-[18px] bg-white border border-stone-200/80 p-2 shadow-2xs hover:border-amber-400/60 cursor-pointer flex flex-col justify-between transition-all group"
                >
                  {/* TOP ROW: Icon (Left) & Chevron (Right) */}
                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-900 shrink-0">
                      <Icon className="w-[18px] h-[18px] stroke-[1.8] group-hover:scale-105 transition-transform" />
                    </div>
                    <FiChevronRight className="w-[16px] h-[16px] text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>

                  {/* BOTTOM ROW: Title & Subtitle (Full 130px+ Width for Crisp Text Visibility) */}
                  <div className="w-full min-w-0">
                    <div className="text-[15px] font-heading font-bold text-stone-900 group-hover:text-amber-950 truncate leading-snug">
                      {action.label}
                    </div>
                    <div className="text-[12px] text-stone-500 font-medium truncate mt-0.5">
                      {action.subtitle}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 5. ACCOUNT OPTIONS (Apple Settings Style, Rows 58px Height, Icon 20px) ─── */}
        <section className="w-full space-y-3">
          <h3 className="text-[16px] font-heading font-extrabold text-amber-950 px-0.5">
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
                  className="h-[58px] px-4 flex items-center justify-between hover:bg-amber-50/40 active:bg-stone-100 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <Icon className="w-[20px] h-[20px] text-amber-900 stroke-[1.8] shrink-0 group-hover:scale-105 transition-transform" />
                    <span className="text-[15px] font-heading font-bold text-stone-900 truncate">
                      {row.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {row.count !== null && row.count > 0 && (
                      <span className="bg-amber-100 text-amber-950 text-[11px] font-extrabold h-[18px] px-2 rounded-full font-mono flex items-center justify-center shadow-2xs">
                        {row.count}
                      </span>
                    )}
                    <FiChevronRight className="w-[18px] h-[18px] text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 6. PREMIUM iOS SIGN OUT BUTTON (56px Height, 18px Radius) ─── */}
        <div className="w-full pt-1 pb-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="w-full h-[56px] rounded-[18px] border border-rose-200 bg-white hover:bg-rose-50/50 active:bg-rose-100 text-rose-600 font-bold text-[15px] shadow-2xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <FiLogOut className="w-[20px] h-[20px] text-rose-600" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out of Account'}</span>
          </motion.button>
        </div>
      </main>
    </div>
  );
}


