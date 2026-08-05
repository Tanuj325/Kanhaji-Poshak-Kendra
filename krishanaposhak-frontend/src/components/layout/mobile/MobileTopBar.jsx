import { Link } from 'react-router-dom';
import { FiMenu, FiSearch, FiShoppingBag, FiBell } from 'react-icons/fi';
import { siteConfig } from '@/config/siteConfig';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

/**
 * MobileTopBar (Phase M0)
 * Native App Style Top Header Bar for Mobile (<768px).
 * Includes drawer toggle, brand header, search trigger, and cart badge.
 */
export default function MobileTopBar({ onOpenDrawer, onOpenSearch }) {
  const { cartCount } = useCartContext();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky-header-mobile w-full md:hidden bg-deep-navy text-lotus-white shadow-md transition-all duration-200">
      <div className="flex items-center justify-between h-[56px] px-3 max-w-full">
        {/* App Drawer Toggle */}
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open App Menu"
          className="touch-target text-lotus-white hover:text-temple-gold active-tap-scale p-2 rounded-lg"
        >
          <FiMenu className="w-6 h-6" aria-hidden="true" />
        </button>

        {/* Brand Logo / App Title */}
        <Link
          to="/"
          className="flex items-center gap-2 active-tap-scale focus-visible:outline-none"
        >
          <span className="font-display text-lg font-bold tracking-tight text-temple-gold-light truncate max-w-[200px]">
            {siteConfig.name || 'Kanhaji Poshak'}
          </span>
        </Link>

        {/* Action Buttons: Search & Cart */}
        <div className="flex items-center gap-1">
          {/* Quick Search Button */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search items"
              className="touch-target text-lotus-white hover:text-temple-gold active-tap-scale p-2 rounded-lg"
            >
              <FiSearch className="w-5 h-5" aria-hidden="true" />
            </button>
          )}

          {/* Cart Icon Link */}
          <Link
            to={ROUTE_PATHS.CART || '/cart'}
            aria-label={`Shopping cart with ${cartCount} items`}
            className="touch-target relative text-lotus-white hover:text-temple-gold active-tap-scale p-2 rounded-lg"
          >
            <FiShoppingBag className="w-5 h-5" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-temple-gold text-deep-navy text-[10px] font-bold rounded-full border border-deep-navy">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
