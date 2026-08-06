import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiGrid, FiShoppingCart, FiUser } from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAuth } from '@/context/AuthContext';
import { useCartContext } from '@/context/CartContext';

/**
 * MobileBottomNav (App Redesign)
 * Native App Style Bottom Navigation for Mobile (<768px).
 * Exactly 5 items: Home, Shop, Categories, Cart, Profile.
 * Wishlist is located ONLY in the top right header.
 */
export default function MobileBottomNav({ onOpenDrawer }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCartContext();

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
      label: 'Shop',
      path: ROUTE_PATHS.SHOP || '/shop',
      icon: FiShoppingBag,
      badge: 0,
    },
    {
      id: 'categories',
      label: 'Categories',
      path: ROUTE_PATHS.CATEGORIES || '/categories',
      icon: FiGrid,
      badge: 0,
    },
    {
      id: 'cart',
      label: 'Cart',
      path: ROUTE_PATHS.CART || '/cart',
      icon: FiShoppingCart,
      badge: cartCount,
    },
    {
      id: 'account',
      label: isAuthenticated ? 'Profile' : 'Sign In',
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
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-stone-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] pb-safe transition-transform duration-200"
    >
      <div className="flex items-center justify-around h-[56px] px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isTabActive(item.path);

          if (item.onClick) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                aria-label={item.label}
                className="flex-1 flex flex-col items-center justify-center py-1 relative active-tap-scale group text-stone-500 hover:text-stone-900"
              >
                <div className="relative flex items-center justify-center mb-0.5">
                  <Icon className="icon-m-bottom-nav w-[20px] h-[20px] group-hover:scale-105" aria-hidden="true" />
                </div>
                <span className="text-m-nav text-[10px] font-medium tracking-tight leading-none text-center">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.path}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative active-tap-scale transition-colors ${active ? 'text-amber-900 font-bold' : 'text-stone-500 hover:text-stone-900'
                }`}
            >
              <div className="relative flex items-center justify-center mb-0.5">
                <Icon
                  className={`icon-m-bottom-nav w-[20px] h-[20px] transition-transform ${active ? 'scale-105 text-amber-900' : 'text-stone-500'
                    }`}
                  aria-hidden="true"
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 flex items-center justify-center bg-rose-600 text-white text-[9px] font-extrabold rounded-full border border-white shadow-2xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-m-nav text-[10px] tracking-tight leading-none text-center ${active ? 'font-bold text-amber-900' : 'font-medium text-stone-500'
                  }`}
              >
                {item.label}
              </span>

              {/* Active Tab Accent Indicator */}
              {active && (
                <span className="absolute bottom-0 w-1 h-1 rounded-full bg-amber-600" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
