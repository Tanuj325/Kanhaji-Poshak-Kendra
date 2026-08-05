import { memo, useEffect, useMemo } from 'react';
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
import { cn } from '@/utils/cn';

const MobileAppDrawer = memo(function MobileAppDrawer({ isOpen, onClose }) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCartContext();
  const { data: wishlist } = useWishlist();

  const currentPath = location.pathname;

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

  // Menu items list (Exact requested order)
  const menuItems = [
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
    {
      id: 'wishlist',
      label: 'Wishlist',
      path: ROUTE_PATHS.WISHLIST || '/account/wishlist',
      icon: FiHeart,
      badge: wishlistCount > 0 ? { type: 'red', count: wishlistCount } : null,
    },
    {
      id: 'cart',
      label: 'Cart',
      path: ROUTE_PATHS.CART || '/cart',
      icon: FiShoppingCart,
      badge: cartCount > 0 ? { type: 'gold', count: cartCount } : null,
    },
    {
      id: 'orders',
      label: 'Orders',
      path: isAuthenticated ? (ROUTE_PATHS.ORDERS || '/account/orders') : ROUTE_PATHS.LOGIN,
      icon: FiPackage,
      badge: ordersCount > 0 ? { type: 'blue', count: ordersCount } : null,
    },
    {
      id: 'track-order',
      label: 'Track Order',
      path: isAuthenticated ? (ROUTE_PATHS.ORDERS || '/account/orders') : ROUTE_PATHS.LOGIN,
      icon: FiTruck,
    },
    {
      id: 'offers',
      label: 'Offers',
      path: `${ROUTE_PATHS.SHOP || '/shop'}?discount=10`,
      icon: FiTag,
    },
    {
      id: 'new-arrivals',
      label: 'New Arrivals',
      path: `${ROUTE_PATHS.SHOP || '/shop'}?sort=createdAt,desc`,
      icon: FiZap,
    },
    {
      id: 'contact',
      label: 'Contact',
      path: ROUTE_PATHS.CONTACT || '/contact',
      icon: FiPhone,
    },
    {
      id: 'about',
      label: 'About',
      path: ROUTE_PATHS.ABOUT || '/about',
      icon: FiInfo,
    },
    {
      id: 'faq',
      label: 'FAQ',
      path: ROUTE_PATHS.FAQ || '/faq',
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
      label: 'Terms',
      path: ROUTE_PATHS.TERMS || '/terms',
      icon: FiFileText,
    },
  ];

  const isRouteActive = (path) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || (path !== '/shop' && currentPath.startsWith(path));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-[100] lg:hidden flex"
        >
          {/* Backdrop Overlay (Black 40% opacity, 4px Blur) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[4px]"
            aria-hidden="true"
          />

          {/* Drawer Panel Container (Slide from Left, Mobile 85%/340px, Tablet 380px) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-[85%] max-w-[340px] md:w-[380px] md:max-w-[380px] h-full bg-white flex flex-col z-10 shadow-2xl overflow-hidden rounded-none font-body"
          >
            {/* ─── 1. TOP PROFILE SECTION (170px Height, Luxury Gradient #0F172A → #1E293B) ─── */}
            <div className="h-[170px] shrink-0 bg-gradient-to-b from-[#0F172A] to-[#1E293B] p-4 pt-[max(1rem,env(safe-area-inset-top))] flex flex-col justify-between relative shadow-md font-body">
              {/* Top Right Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu drawer"
                className="absolute right-3.5 top-3.5 text-stone-300 hover:text-white p-1 rounded-full active:scale-90 transition-transform"
              >
                <FiX className="w-5 h-5" />
              </button>

              {/* User Logged In vs Guest View */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3.5 mt-2">
                  {/* 64x64 Circular Profile Image */}
                  <div className="w-[64px] h-[64px] rounded-full border-2 border-temple-gold overflow-hidden bg-stone-800 flex items-center justify-center text-amber-300 font-bold text-xl shrink-0 shadow-inner">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user?.firstName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user?.firstName?.[0]?.toUpperCase() || 'U'}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-[15px] truncate leading-tight">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-stone-400 text-[12px] truncate mt-0.5">{user?.email}</p>
                    <Link
                      to={ROUTE_PATHS.ACCOUNT_DASHBOARD || '/account/dashboard'}
                      onClick={onClose}
                      className="inline-flex items-center justify-center h-[32px] px-3.5 mt-2 bg-temple-gold hover:bg-temple-gold-dark text-stone-950 text-[11px] font-extrabold rounded-lg shadow-xs active:scale-95 transition-transform"
                    >
                      My Account
                    </Link>
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

            {/* ─── 2. SCROLLABLE MENU ITEMS SECTION (56px Height, 14px Radius) ─── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.path);

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      'relative flex h-[56px] items-center px-4 rounded-[14px] transition-all duration-200 group active:scale-[0.98]',
                      active
                        ? 'bg-amber-50 text-amber-950 font-bold'
                        : 'text-stone-700 hover:bg-stone-100/70 hover:text-stone-900 font-semibold'
                    )}
                  >
                    {/* Active Route Left Indicator (Nike style) */}
                    {active && (
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-6 bg-temple-gold rounded-full" />
                    )}

                    {/* Icon (Left 22px) */}
                    <Icon
                      className={cn(
                        'w-[22px] h-[22px] shrink-0 transition-colors mr-3',
                        active ? 'text-amber-900' : 'text-stone-500 group-hover:text-stone-900'
                      )}
                    />

                    {/* Label (Middle 14px) */}
                    <span className="text-[14px] flex-1 truncate leading-none">
                      {item.label}
                    </span>

                    {/* Badge (Red for Wishlist, Gold for Cart, Blue for Orders) */}
                    {item.badge && (
                      <span
                        className={cn(
                          'inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-extrabold rounded-full mr-2 shadow-2xs',
                          item.badge.type === 'red' && 'bg-rose-600 text-white',
                          item.badge.type === 'gold' && 'bg-temple-gold text-stone-950',
                          item.badge.type === 'blue' && 'bg-blue-600 text-white'
                        )}
                      >
                        {item.badge.count}
                      </span>
                    )}

                    {/* Chevron (Right) */}
                    <FiChevronRight
                      className={cn(
                        'w-4 h-4 text-stone-400 transition-transform group-hover:translate-x-0.5',
                        active && 'text-amber-900'
                      )}
                    />
                  </Link>
                );
              })}
            </div>

            {/* ─── 3. STICKY BOTTOM SECTION (Always at bottom) ─── */}
            {isAuthenticated && (
              <div className="sticky bottom-0 z-20 border-t border-black/[0.06] bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full h-[44px] rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default MobileAppDrawer;
