import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';
import { useAuth } from '@/context/AuthContext';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import HeaderSearch from './HeaderSearch';
import HeaderUserMenu from './HeaderUserMenu';
import HeaderNotificationDropdown from './HeaderNotificationDropdown';

function Badge({ count }) {
  if (!count || count <= 0) return null;
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-temple-gold px-1 text-[9px] font-bold text-white font-mono leading-none shadow-gold animate-badge-pop"
      aria-hidden="true"
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  );
}

/**
 * Premium white main bar (80–90px).
 * LEFT: logo + tagline · CENTER: large luxury search · RIGHT: account/wishlist/cart/notifications.
 */
export default function HeaderMainBar({
  isScrolled,
  mobileOpen,
  onToggleMobile,
  userMenuOpen,
  onToggleUserMenu,
  onCloseUserMenu,
  notifMenuOpen,
  onToggleNotif,
  onCloseNotif,
  onCloseAllMenus,
  onLogout,
}) {
  const { user, isAuthenticated, role } = useAuth();
  const { cartCount, openDrawer } = useCartContext();
  const { wishlistCount } = useWishlistContext();

  const isLoggedIn = isAuthenticated;

  const iconButtonClass =
    'group relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-slate-200 bg-white text-dark-charcoal transition-all duration-200 hover:border-temple-gold/60 hover:bg-temple-gold/10 hover:text-temple-gold-dark hover:shadow-[0_6px_18px_rgba(201,154,59,0.18)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-temple-gold/60';

  const iconTooltipClass =
    'pointer-events-none absolute -bottom-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-deep-navy px-2.5 py-1 text-[10px] font-semibold text-lotus-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5';

  return (
    <div
      className={`w-full border-b transition-all duration-300 ${
        isScrolled
          ? 'border-temple-gold/25 bg-white/95 shadow-[0_10px_34px_rgba(15,36,64,0.12)] backdrop-blur-xl'
          : 'border-slate-200/80 bg-white shadow-none'
      }`}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-[1600px] items-center gap-2 px-3 min-[400px]:gap-3 min-[400px]:px-4 sm:h-[80px] sm:gap-4 sm:px-6 lg:h-[88px] lg:gap-5 lg:px-10 xl:px-12 2xl:px-16">
        {/* ── LEFT: Logo + Tagline ── */}
        <Link
          to={ROUTE_PATHS.HOME}
          className="group flex shrink-0 items-center gap-2 min-w-0 sm:gap-2.5 lg:gap-3"
          aria-label={`${siteConfig.name} — home`}
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] p-[1.5px] shadow-[0_8px_20px_rgba(201,154,59,0.25)] transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11 lg:h-12 lg:w-12">
            <img
              src="/logo1.jpeg"
              alt="Krishana Poshak Logo"
              className="h-full w-full rounded-full object-cover"
              loading="eager"
              fetchpriority="high"
            />
          </div>
          <div className="min-w-0">
            <span className="block truncate font-display text-base font-bold leading-tight tracking-wide text-deep-navy transition-colors group-hover:text-temple-gold-dark sm:text-lg lg:text-xl">
              {siteConfig.name}
            </span>
            <span className="hidden max-w-[10rem] truncate text-[9px] font-medium uppercase tracking-[0.16em] text-natural-wood md:block lg:max-w-[12rem] lg:text-[10px]">
              Divine Dress for Your Kanha
            </span>
          </div>
        </Link>

        {/* ── CENTER: Large luxury search bar ── */}
        <div className="min-w-0 flex-1 px-1 sm:px-2 lg:px-4">
          <HeaderSearch />
        </div>

        {/* ── RIGHT: Icon cluster ── */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1 lg:gap-2">
          {/* Account */}
          {isLoggedIn ? (
            <div className="hidden lg:block">
              <HeaderUserMenu
                user={user}
                role={role}
                isOpen={userMenuOpen}
                onToggle={onToggleUserMenu}
                onClose={onCloseUserMenu}
                onLogout={onLogout}
              />
            </div>
          ) : (
            <Link
              to={ROUTE_PATHS.LOGIN}
              className={`${iconButtonClass} hidden lg:flex`}
              aria-label="Login or create account"
              title="Login"
            >
              <FiUser className="h-5 w-5" />
            </Link>
          )}

          {/* Wishlist (hidden on mobile — appears in mobile top row instead) */}
          <Link
            to={ROUTE_PATHS.WISHLIST}
            className={`${iconButtonClass} hidden md:inline-flex`}
            aria-label={`Wishlist (${wishlistCount} items)`}
          >
            <FiHeart className="h-5 w-5" />
            <Badge count={wishlistCount} />
            <span className={iconTooltipClass} role="tooltip">
              Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}
            </span>
          </Link>

          {/* Cart */}
          <button
            type="button"
            onClick={openDrawer}
            className={iconButtonClass}
            aria-label={`Cart (${cartCount} items)`}
          >
            <FiShoppingBag className="h-5 w-5" />
            <Badge count={cartCount} />
            <span className={iconTooltipClass} role="tooltip">
              Cart {cartCount > 0 ? `(${cartCount})` : ''}
            </span>
          </button>

          {/* Notifications (desktop) */}
          {isLoggedIn && (
            <div className="hidden lg:block">
              <HeaderNotificationDropdown
                isOpen={notifMenuOpen}
                onToggle={onToggleNotif}
                onClose={onCloseNotif}
              />
            </div>
          )}

          {/* Account (mobile) + Wishlist (mobile) */}
          {isLoggedIn ? (
            <Link
              to={ROUTE_PATHS.PROFILE}
              className={`${iconButtonClass} md:hidden`}
              aria-label="My profile"
            >
              <FiUser className="h-5 w-5" />
            </Link>
          ) : (
            <Link
              to={ROUTE_PATHS.LOGIN}
              className={`${iconButtonClass} md:hidden`}
              aria-label="Login"
            >
              <FiUser className="h-5 w-5" />
            </Link>
          )}

          <Link
            to={ROUTE_PATHS.WISHLIST}
            className={`${iconButtonClass} md:hidden`}
            aria-label={`Wishlist (${wishlistCount} items)`}
          >
            <FiHeart className="h-5 w-5" />
            <Badge count={wishlistCount} />
          </Link>

          {/* Hamburger — mobile & tablet (below lg) */}
          <button
            type="button"
            onClick={onToggleMobile}
            className={`${iconButtonClass} lg:hidden`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="header-mobile-drawer"
          >
            {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

