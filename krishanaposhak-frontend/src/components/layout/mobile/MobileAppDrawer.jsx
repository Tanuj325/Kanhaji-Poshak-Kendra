import { memo, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiHome,
  FiShoppingBag,
  FiGrid,
  FiHeart,
  FiShoppingCart,
  FiPackage,
  FiTruck,
  FiTag,
  FiZap,
  FiPhone,
  FiInfo,
  FiHelpCircle,
  FiShield,
  FiFileText,
  FiChevronRight,
  FiLogOut,
  FiUser,
} from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAuth } from '@/context/AuthContext';
import { useCartContext } from '@/context/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { isAdmin } from '@/utils/roleChecker';
import { cn } from '@/utils/cn';

// Subcomponent for Profile Avatar rendering with image fallback to initial letter
function UserDrawerAvatar({ user }) {
  const [imgError, setImgError] = useState(false);

  const avatarSrc =
    user?.profileImageUrl ||
    user?.avatarUrl ||
    user?.avatar ||
    user?.profileImage ||
    user?.image ||
    user?.imageUrl ||
    null;

  const initialLetter =
    user?.firstName?.[0]?.toUpperCase() ||
    user?.name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'U';

  return (
    <div className="w-[64px] h-[64px] rounded-full border-2 border-temple-gold overflow-hidden bg-stone-800 flex items-center justify-center text-amber-300 font-bold text-xl shrink-0 shadow-inner">
      {avatarSrc && !imgError ? (
        <img
          src={avatarSrc}
          alt={user?.firstName || user?.name || 'Profile'}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{initialLetter}</span>
      )}
    </div>
  );
}

const MobileAppDrawer = memo(function MobileAppDrawer({ isOpen, onClose }) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCartContext();
  const { data: wishlist } = useWishlist();

  const currentPath = location.pathname;
  const userRole = user?.role || user?.roles?.[0] || 'CUSTOMER';
  const isUserAdmin = isAuthenticated && isAdmin(userRole);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  // Dynamic Wishlist Count
  const wishlistCount = useMemo(() => {
    if (!wishlist) return 0;
    const items = Array.isArray(wishlist) ? wishlist : wishlist?.items || wishlist?.data || [];
    return items.length;
  }, [wishlist]);

  // Order count if available on user object
  const ordersCount = user?.ordersCount || user?.orders?.length || 0;

  // Menu items list (Exact requested order + Admin Control Panel if admin)
  const menuItems = useMemo(() => {
    const items = [
      {
        id: 'home',
        label: 'Home',
        path: ROUTE_PATHS.HOME || '/',
        icon: FiHome,
      },
      {
        id: 'shop',
        label: 'Shop',
        path: ROUTE_PATHS.SHOP || '/shop',
        icon: FiShoppingBag,
      },
      {
        id: 'categories',
        label: 'Categories',
        path: ROUTE_PATHS.CATEGORIES || '/categories',
        icon: FiGrid,
      },
    ];

    // Admin option if logged in user is Admin
    if (isUserAdmin) {
      items.push({
        id: 'admin-panel',
        label: 'Admin Control Panel',
        path: ROUTE_PATHS.ADMIN || '/admin',
        icon: FiShield,
        badge: { type: 'gold', count: 'ADMIN' },
      });
    }

    items.push(
      {
        id: 'my-orders',
        label: 'My Orders',
        path: ROUTE_PATHS.ORDERS || '/account/orders',
        icon: FiPackage,
        badge: ordersCount > 0 ? { type: 'neutral', count: ordersCount } : null,
      },
      {
        id: 'wishlist',
        label: 'My Wishlist',
        path: ROUTE_PATHS.WISHLIST || '/account/wishlist',
        icon: FiHeart,
        badge: wishlistCount > 0 ? { type: 'gold', count: wishlistCount } : null,
      },
      {
        id: 'cart',
        label: 'Shopping Cart',
        path: ROUTE_PATHS.CART || '/cart',
        icon: FiShoppingCart,
        badge: cartCount > 0 ? { type: 'gold', count: cartCount } : null,
      },
      {
        id: 'track-order',
        label: 'Track Order',
        path: ROUTE_PATHS.ORDERS || '/account/orders',
        icon: FiTruck,
      },
      {
        id: 'coupons',
        label: 'Offers & Coupons',
        path: `${ROUTE_PATHS.SHOP || '/shop'}?offers=true`,
        icon: FiTag,
        badge: { type: 'gold', count: 'HOT' },
      },
      {
        id: 'about',
        label: 'About Us',
        path: ROUTE_PATHS.ABOUT || '/about',
        icon: FiInfo,
      },
      {
        id: 'contact',
        label: 'Contact Support',
        path: ROUTE_PATHS.CONTACT || '/contact',
        icon: FiPhone,
      },
      {
        id: 'faqs',
        label: 'FAQs & Help',
        path: ROUTE_PATHS.FAQ || '/faqs',
        icon: FiHelpCircle,
      },
      {
        id: 'privacy',
        label: 'Privacy Policy',
        path: ROUTE_PATHS.PRIVACY || '/privacy',
        icon: FiShield,
      },
      {
        id: 'terms',
        label: 'Terms & Conditions',
        path: ROUTE_PATHS.TERMS || '/terms',
        icon: FiFileText,
      }
    );

    return items;
  }, [isUserAdmin, ordersCount, wishlistCount, cartCount]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-display lg:hidden">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer Container (85% width, max 360px) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-[85%] max-w-[360px] h-full bg-[#0D1626] border-r border-amber-900/20 shadow-2xl flex flex-col justify-between text-stone-100"
          >
            {/* ─── 1. HEADER SECTION (User Info & Close Button) ─── */}
            <div className="p-4 sm:p-5 border-b border-amber-900/20 bg-gradient-to-b from-[#111C30] to-[#0D1626]">
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation drawer"
                className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* User Logged In vs Guest View */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3.5 mt-2">
                  {/* 64x64 Profile Avatar Component with Fallback to First Letter */}
                  <UserDrawerAvatar user={user} />

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-[15px] truncate leading-tight">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-stone-400 text-[12px] truncate mt-0.5">{user?.email}</p>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <Link
                        to={ROUTE_PATHS.ACCOUNT_DASHBOARD || '/account/dashboard'}
                        onClick={onClose}
                        className="inline-flex items-center justify-center h-[32px] px-3 bg-temple-gold hover:bg-temple-gold-dark text-stone-950 text-[11px] font-extrabold rounded-lg shadow-xs active:scale-95 transition-transform"
                      >
                        My Account
                      </Link>
                      {isUserAdmin && (
                        <Link
                          to={ROUTE_PATHS.ADMIN || '/admin'}
                          onClick={onClose}
                          className="inline-flex items-center justify-center h-[32px] px-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-extrabold rounded-lg shadow-xs active:scale-95 transition-transform gap-1"
                        >
                          <FiShield className="w-3.5 h-3.5" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3.5 mt-2">
                  {/* 64x64 Guest Avatar */}
                  <div className="w-[64px] h-[64px] rounded-full bg-stone-800 border-2 border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-xl shrink-0">
                    <FiUser className="w-7 h-7 text-amber-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-[15px]">Welcome, Devotee</p>
                    <p className="text-stone-400 text-[11px] mt-0.5">Explore sacred poshak & adornments</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Link
                        to={ROUTE_PATHS.LOGIN || '/login'}
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center h-[32px] bg-temple-gold text-stone-950 text-[11px] font-extrabold rounded-lg shadow-xs active:scale-95 transition-transform"
                      >
                        Login
                      </Link>
                      <Link
                        to={ROUTE_PATHS.REGISTER || '/register'}
                        onClick={onClose}
                        className="flex-1 inline-flex items-center justify-center h-[32px] border border-amber-400/40 text-amber-300 text-[11px] font-bold rounded-lg active:scale-95 transition-transform"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─── 2. SCROLLABLE NAVIGATION MENU LIST ─── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-3 px-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-3 rounded-xl transition-all font-medium text-[13.5px]',
                      isActive
                        ? 'bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold'
                        : 'text-stone-300 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={cn('w-4.5 h-4.5 shrink-0', isActive ? 'text-amber-400' : 'text-stone-400')} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase font-mono tracking-wider',
                            item.badge.type === 'gold'
                              ? 'bg-amber-400 text-stone-950 shadow-2xs'
                              : 'bg-stone-800 text-stone-300 border border-stone-700'
                          )}
                        >
                          {item.badge.count}
                        </span>
                      )}
                      <FiChevronRight className="w-4 h-4 text-stone-500 opacity-60" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ─── 3. FOOTER SECTION ─── */}
            <div className="p-4 border-t border-amber-900/20 bg-[#0A111E] space-y-3">
              {/* Quick Contact Row */}
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>Sacred Meerut Artistry</span>
                <a href={`tel:${siteConfig.phone}`} className="text-amber-400 font-bold hover:underline">
                  {siteConfig.phone}
                </a>
              </div>

              {/* Logout Button if authenticated */}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 h-[38px] rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-bold hover:bg-rose-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Log Out of Account</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default MobileAppDrawer;
