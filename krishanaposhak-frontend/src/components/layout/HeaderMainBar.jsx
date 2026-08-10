import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';
import { useAuth } from '@/context/AuthContext';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import HeaderSearch from './HeaderSearch';
import HeaderUserMenu from './HeaderUserMenu';
import HeaderNotificationDropdown from './HeaderNotificationDropdown';

/**
 * MAIN HEADER BAR (Compact Height: 64px, Shrinks to 58px on scroll)
 * Desktop & Mobile: Perfect baseline alignment, uniform 20px icons, non-clipping 44x44 mobile hamburger.
 */
export default function HeaderMainBar({
  isScrolled,
  mobileOpen,
  onToggleMobile,
  userMenuOpen,
  onToggleUserMenu,
  onCloseUserMenu,
  onLogout,
}) {
  const { user, isAuthenticated } = useAuth();
  const { cartCount, openDrawer } = useCartContext();
  const { wishlistCount } = useWishlistContext();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div
      className={`w-full bg-white transition-all duration-200 ${
        isScrolled
          ? 'border-b border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
          : 'border-b border-slate-100'
      }`}
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* ROW 1: Logo (Left) · Search (Center 560-620px) · Icon Actions (Right) */}
        <div
          className={`flex items-center justify-between gap-3 sm:gap-5 transition-all duration-200 ${
            isScrolled ? 'h-[58px]' : 'h-[64px]'
          }`}
        >
          {/* LEFT — Logo + Brand Name + Tagline (Vertically Centered Baseline) */}
          <Link
            to={ROUTE_PATHS.HOME}
            className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap flex-nowrap"
            aria-label={`${siteConfig.name} - home`}
          >
            {/* Logo image circle: h-9 w-9 on mobile (< md), h-11 w-11 on desktop (md+) */}
            <div className="relative flex h-9 w-9 md:h-11 md:w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200/90 bg-slate-50 p-0.5 shadow-xs transition-transform duration-200 group-hover:scale-105 group-hover:border-[#C99A3B]">
              <img
                src="/logo1.jpeg"
                alt="Kanhaji Poshak Logo"
                className="h-full w-full rounded-full object-cover"
                loading="eager"
              />
            </div>

            {/* Brand text & Tagline container */}
            <div className="flex flex-col justify-center shrink-0">
              {/* Brand Name — Visible on Desktop lg+ (>= 1024px) */}
              <span className="hidden lg:block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0F2440] leading-none transition-colors group-hover:text-[#C99A3B] whitespace-nowrap">
                Kanhaji Poshak
              </span>
              {/* Tagline — Visible ONLY on Desktop xl+ (>= 1280px) */}
              <span className="hidden xl:block text-[10px] font-semibold tracking-widest uppercase text-amber-700/80 mt-1 leading-none whitespace-nowrap">
                Divine Attire &amp; Accessories
              </span>
            </div>
          </Link>

          {/* CENTER — Large Search Bar (560px - 620px width on desktop md+) */}
          <div className="hidden md:flex min-w-0 flex-1 justify-center max-w-[620px] w-full mx-2 lg:mx-6">
            <HeaderSearch />
          </div>

          {/* RIGHT — Account · Wishlist · Cart · Hamburger */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-6 text-[#0F2440]">
            {/* Account (Desktop lg+: Icon + Label + Arrow; Mobile: inside drawer) */}
            <div className="hidden lg:block">
              {isAuthenticated ? (
                <HeaderUserMenu
                  user={user}
                  role={user?.role}
                  isOpen={userMenuOpen}
                  onToggle={onToggleUserMenu}
                  onClose={onCloseUserMenu}
                  onLogout={onLogout}
                />
              ) : (
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#C99A3B] transition-colors py-1.5 px-2"
                  aria-label="Login or create account"
                >
                  <FiUser className="h-5 w-5 text-[#0F2440]" />
                  <span>Account</span>
                </Link>
              )}
            </div>

            {/* Notification Bell (Visible when authenticated) */}
            {isAuthenticated && (
              <HeaderNotificationDropdown
                isOpen={notifOpen}
                onToggle={() => setNotifOpen((v) => !v)}
                onClose={() => setNotifOpen(false)}
              />
            )}

            {/* Wishlist */}
            <Link
              to={ROUTE_PATHS.WISHLIST}
              className="relative flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#C99A3B] transition-colors py-1.5 px-1 sm:px-2"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <FiHeart className="h-5 w-5 text-[#0F2440] hover:text-[#C99A3B] transition-colors shrink-0" />
              <span className="hidden lg:inline">Wishlist</span>
            </Link>

            {/* Cart — Badge count ONLY when cartCount > 0 */}
            <button
              type="button"
              onClick={openDrawer}
              className="relative flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#C99A3B] transition-colors py-1.5 px-1 sm:px-2"
              aria-label={`Cart (${cartCount} items)`}
            >
              <FiShoppingBag className="h-5 w-5 text-[#0F2440] hover:text-[#C99A3B] transition-colors shrink-0" />
              <span className="hidden lg:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 lg:top-0 lg:right-0 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C99A3B] px-1 text-[10px] font-bold text-slate-950 shadow-xs ring-2 ring-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Button (< md) — Minimum 44x44 Touch Target */}
            <button
              type="button"
              onClick={onToggleMobile}
              className="flex md:hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-[#0F2440] hover:bg-slate-100 transition-colors"
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE ROW 2: Full Width Search Bar */}
        <div className="pb-2.5 pt-0.5 md:hidden">
          <HeaderSearch mobileRow />
        </div>
      </div>
    </div>
  );
}
