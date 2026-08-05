import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiHeart, FiShoppingBag, FiUser } from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAuth } from '@/context/AuthContext';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';

/**
 * MobileBottomNav (Phase M0)
 * Native App Style Bottom Navigation for Mobile (<768px).
 * Features 48x48px minimum touch targets, safe area bottom insets, 
 * active tab highlighting, and real-time badge counts.
 */
export default function MobileBottomNav({ onOpenDrawer }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCartContext();
  const { wishlistCount } = useWishlistContext();

  const currentPath = location.pathname;

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      path: ROUTE_PATHS.HOME || '/',
      icon: FiHome,
      badge: 0,
    },
    {
      id: 'shop',
      label: 'Categories',
      path: ROUTE_PATHS.SHOP || '/shop',
      icon: FiGrid,
      badge: 0,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      path: ROUTE_PATHS.WISHLIST || '/customer/wishlist',
      icon: FiHeart,
      badge: wishlistCount,
    },
    {
      id: 'cart',
      label: 'Cart',
      path: ROUTE_PATHS.CART || '/cart',
      icon: FiShoppingBag,
      badge: cartCount,
    },
    {
      id: 'account',
      label: isAuthenticated ? 'Account' : 'Sign In',
      path: isAuthenticated ? (ROUTE_PATHS.ACCOUNT_DASHBOARD || '/customer/account') : (ROUTE_PATHS.LOGIN || '/login'),
      icon: FiUser,
      badge: 0,
    },
  ];

  const isTabActive = (itemPath) => {
    if (itemPath === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(itemPath);
  };

  return (
    <nav
      role="navigation"
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-muted-sand/40 shadow-[0_-4px_20px_rgba(44,40,36,0.08)] pb-safe transition-transform duration-200"
    >
      <div className="flex items-center justify-around h-[64px] px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isTabActive(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              className={`touch-target flex-1 flex flex-col items-center justify-center py-1 relative active-tap-scale group transition-colors duration-150 ${
                active ? 'text-temple-gold-dark font-semibold' : 'text-natural-wood hover:text-dark-charcoal'
              }`}
            >
              {/* Active Indicator Top Line */}
              {active && (
                <span className="absolute top-0 w-8 h-[3px] bg-temple-gold rounded-b-full shadow-sm animate-nav-pop" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center mb-0.5">
                <Icon
                  aria-hidden="true"
                  className={`w-5 h-5 transition-transform duration-150 ${
                    active ? 'scale-110 text-temple-gold-dark' : 'group-hover:scale-105'
                  }`}
                />

                {/* Badge Count Indicator */}
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-temple-gold text-deep-navy text-[10px] font-bold rounded-full border border-white shadow-sm animate-badge-pop">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              {/* Tab Label */}
              <span className="text-[10px] tracking-tight leading-none text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
