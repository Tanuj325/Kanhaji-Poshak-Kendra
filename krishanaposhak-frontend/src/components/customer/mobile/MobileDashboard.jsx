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
 * Native Full-Screen Account Dashboard Page for Mobile (<768px) and Tablet (768px-1023px).
 * Inspired by Apple Store, Nike, Myntra, Flipkart, Amazon.
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
  const memberSince = user?.createdAt ? formatDate(user.createdAt, { format: 'short' }) : 'Devotee';

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
    {
      id: 'orders',
      label: 'Orders',
      icon: FiShoppingBag,
      href: ROUTE_PATHS.ORDERS,
      count: totalOrders > 0 ? totalOrders : null,
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: FiMapPin,
      href: ROUTE_PATHS.ADDRESSES,
      count: addrList.length > 0 ? addrList.length : null,
    },
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
    <div className="w-full min-h-screen bg-[#FAF8F5] text-stone-900 font-display antialiased pb-24">
      {/* ─── 1. PAGE TITLE / HEADER BAR ─── */}
      <header className="sticky top-0 z-30 h-[52px] w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-3 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center active:scale-95 transition-transform shrink-0"
          aria-label="Back"
        >
          <FiChevronLeft className="h-5 w-5 stroke-[2.5]" />
        </button>

        <h1 className="text-[17px] font-heading font-extrabold text-amber-950 tracking-tight text-center flex-1 mx-2 truncate">
          My Account
        </h1>

        <Link
          to={ROUTE_PATHS.NOTIFICATIONS}
          className="relative h-8 w-8 rounded-full bg-stone-100 hover:bg-amber-50 text-stone-800 flex items-center justify-center active:scale-95 transition-transform shrink-0"
          aria-label="Notifications"
        >
          <FiBell className="h-4 w-4 text-stone-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-3.5 min-w-[14px] px-1 rounded-full bg-rose-600 text-white text-[8px] font-extrabold flex items-center justify-center shadow-2xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* ─── MAIN CONTENT CONTAINER (Full Width w-full) ─── */}
      <main className="w-full px-3 sm:px-4 pt-3 pb-8 space-y-4">
        {/* ─── 2. PROFILE CARD (Clean Row Layout, No Overlaps) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full rounded-2xl bg-gradient-to-br from-[#FFFBF0] via-[#FAF0D9] to-[#F5E5C9] border border-amber-400/30 p-3.5 sm:p-4 shadow-xs relative overflow-hidden space-y-3"
        >
          {/* Top Row: Avatar + Info + Edit Button */}
          <div className="flex items-center justify-between gap-3 w-full border-b border-amber-900/10 pb-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar
                name={fullName}
                src={user?.profileImageUrl}
                size="lg"
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-amber-500/80 shadow-xs shrink-0"
              />

              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-extrabold text-amber-900/70 font-heading block uppercase tracking-wider">
                  Welcome back
                </span>
                <h2 className="text-[16px] sm:text-[18px] font-heading font-extrabold text-amber-950 truncate leading-snug">
                  {fullName}
                </h2>
                {email && (
                  <p className="text-[12px] text-stone-600 truncate font-mono flex items-center gap-1 mt-0.5">
                    <FiMail className="h-3 w-3 text-amber-800 shrink-0" />
                    <span className="truncate">{email}</span>
                  </p>
                )}
                {phone && (
                  <p className="text-[12px] text-stone-600 truncate font-mono flex items-center gap-1 mt-0.5">
                    <FiPhone className="h-3 w-3 text-amber-800 shrink-0" />
                    <span>{phone}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.PROFILE)}
              className="h-[36px] px-3 sm:px-4 rounded-xl bg-amber-950 hover:bg-amber-900 text-white text-[12px] font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <FiEdit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* Bottom Row: Member Since & Badge */}
          <div className="flex items-center justify-between text-[12px] font-medium text-stone-700 w-full pt-0.5">
            <span>
              Member since: <strong className="text-amber-950 font-extrabold">{memberSince}</strong>
            </span>
            <span className="text-emerald-800 font-bold flex items-center gap-1 text-[11px] bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shrink-0">
              <FiShield className="h-3 w-3" /> Devotee Member
            </span>
          </div>
        </motion.div>

        {/* ─── 3. QUICK ACTION GRID (2 Columns, Clear Icons & Un-truncated Labels) ─── */}
        <section className="w-full space-y-2">
          <h2 className="text-[15px] sm:text-[16px] font-heading font-extrabold text-amber-950 px-0.5">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: idx * 0.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(action.href)}
                  className="w-full bg-white rounded-2xl border border-stone-200/80 p-3 sm:p-3.5 shadow-2xs hover:border-amber-400/50 cursor-pointer flex flex-col justify-between gap-2.5 transition-all group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center shrink-0">
                      <Icon className="h-4.5 w-4.5 stroke-[2]" />
                    </div>

                    {action.count !== null && (
                      <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full font-mono ${action.badgeColor}`}>
                        {action.count}
                      </span>
                    )}

                    {action.badge && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${action.badgeColor}`}>
                        {action.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between w-full min-w-0">
                    <span className="text-[13px] font-heading font-bold text-stone-900 group-hover:text-amber-950 truncate">
                      {action.label}
                    </span>
                    <FiChevronRight className="h-4 w-4 text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 4. ACCOUNT OPTIONS MENU (Full Width, 56px Rows, No Label Truncation) ─── */}
        <section className="w-full space-y-2">
          <h2 className="text-[15px] sm:text-[16px] font-heading font-extrabold text-amber-950 px-0.5">
            Account Options
          </h2>

          <div className="w-full rounded-2xl bg-white border border-stone-200/80 shadow-2xs divide-y divide-stone-100 overflow-hidden">
            {menuRows.map((row) => {
              const Icon = row.icon;
              const handleClick = row.action ? row.action : () => navigate(row.href);

              return (
                <motion.div
                  key={row.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClick}
                  className={`h-[52px] sm:h-[56px] px-3.5 sm:px-4 flex items-center justify-between hover:bg-amber-50/40 active:bg-stone-100 cursor-pointer transition-colors group ${
                    row.isDanger ? 'hover:bg-rose-50/40 active:bg-rose-100/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-8.5 w-8.5 rounded-lg bg-stone-50 group-hover:bg-amber-100/60 flex items-center justify-center shrink-0 transition-colors">
                      <Icon className={`h-4 w-4 stroke-[2] ${row.isDanger ? 'text-rose-600' : 'text-amber-900'}`} />
                    </div>
                    <span className={`text-[14px] font-heading font-bold truncate ${row.isDanger ? 'text-rose-600' : 'text-stone-900'}`}>
                      {row.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {row.count !== null && row.count > 0 && (
                      <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono shadow-2xs">
                        {row.count}
                      </span>
                    )}
                    <FiChevronRight className={`h-4 w-4 transition-all ${row.isDanger ? 'text-rose-400' : 'text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5'}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ─── 5. STANDALONE LOGOUT BUTTON (Height 44px, Rounded 14px) ─── */}
        <div className="w-full pt-1 pb-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="w-full h-[44px] rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 font-bold text-[13px] shadow-2xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <FiLogOut className="h-4 w-4 text-rose-600" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out of Account'}</span>
          </motion.button>
        </div>
      </main>
    </div>
  );
}
