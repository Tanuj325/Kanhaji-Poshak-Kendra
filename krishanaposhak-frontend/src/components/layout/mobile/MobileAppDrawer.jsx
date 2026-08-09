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
    <div className="w-11 h-11 rounded-full border-2 border-amber-500/80 overflow-hidden bg-amber-100/80 flex items-center justify-center text-amber-950 font-bold text-base shrink-0 shadow-2xs">
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

  // Menu items list
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
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer Container (82% width, max 310px) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-[82%] max-w-[310px] h-full bg-white border-r border-amber-900/10 shadow-xl flex flex-col justify-between text-stone-900"
          >
            {/* ─── 1. HEADER SECTION (User Info & Close Button) ─── */}
            <div className="p-1.5 border-b border-amber-900/10 bg-gradient-to-b from-amber-50/70 to-white relative">
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation drawer"
                className="absolute top-1 right-1 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>

              {/* User Logged In vs Guest View */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3 pr-6">
                  {/* Compact Profile Avatar Component with Fallback to First Letter */}
                  <UserDrawerAvatar user={user} />

                  <div className="flex-1 min-w-0">
                    <p className="text-amber-950 font-bold text-[13.5px] truncate leading-tight">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-stone-500 text-[11px] truncate mt-0.5">{user?.email}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <Link
                        to={ROUTE_PATHS.ACCOUNT_DASHBOARD || '/account/dashboard'}
                        onClick={onClose}
                        className="inline-flex items-center justify-center h-[26px] px-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-[10.5px] font-extrabold rounded-md shadow-2xs active:scale-95 transition-transform"
                      >
                        My Account
                      </Link>
                      {isUserAdmin && (
                        <Link
                          to={ROUTE_PATHS.ADMIN || '/admin'}
                          onClick={onClose}
                          className="inline-flex items-center justify-center h-[26px] px-2 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10.5px] font-extrabold rounded-md shadow-2xs active:scale-95 transition-transform gap-1"
                        >
                          <FiShield className="w-3 h-3" />
                          <span>Admin</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 pr-6">
                  {/* Compact Guest Avatar */}
                  <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                    <FiUser className="w-5 h-5 text-amber-700" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-amber-950 font-bold text-[13.5px]">Welcome, Devotee</p>
                    <p className="text-stone-500 text-[10.5px] truncate mt-0.5">Explore sacred poshak &amp; adornments</p>
                    <div className="flex flex-col md:flex-row items-center gap-1.5 mt-1.5">
                      <Link
                        to={ROUTE_PATHS.LOGIN || '/login'}
                        onClick={onClose}
                        className="flex-1 inline-flex p-2 items-center justify-center h-[26px] bg-amber-500 text-stone-950 text-[10.5px] font-extrabold rounded-md shadow-2xs active:scale-95 transition-transform"
                      >
                        Login
                      </Link>
                      <Link
                        to={ROUTE_PATHS.REGISTER || '/register'}
                        onClick={onClose}
                        className="flex-1 inline-flex p-2 items-center justify-center h-[26px] border border-amber-500/40 text-amber-900 text-[10.5px] font-bold rounded-md active:scale-95 transition-transform"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─── 2. SCROLLABLE NAVIGATION MENU LIST (Compact spacing & sizing) ─── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-2 px-2.5 space-y-0.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      'flex items-center justify-between px-2.5 py-2 rounded-lg transition-all font-medium text-[12.5px]',
                      isActive
                        ? 'bg-amber-100/80 border border-amber-500/30 text-amber-950 font-bold'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-amber-700' : 'text-stone-400')} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full uppercase font-mono tracking-wider',
                            item.badge.type === 'gold'
                              ? 'bg-amber-500 text-stone-950 shadow-2xs'
                              : 'bg-stone-200 text-stone-700 border border-stone-300'
                          )}
                        >
                          {item.badge.count}
                        </span>
                      )}
                      <FiChevronRight className="w-3.5 h-3.5 text-stone-400 opacity-60" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ─── 3. FOOTER SECTION ─── */}
            {isAuthenticated && (
              <div className="p-3 border-t border-amber-900/10 bg-amber-50/40">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 h-[34px] rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-[11.5px] font-bold hover:bg-rose-100 active:scale-98 transition-all cursor-pointer"
                >
                  <FiLogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Account</span>
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
