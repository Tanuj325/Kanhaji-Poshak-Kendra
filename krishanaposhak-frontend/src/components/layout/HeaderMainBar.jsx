import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';
import { useAuth } from '@/context/AuthContext';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import HeaderSearch from './HeaderSearch';
import HeaderUserMenu from './HeaderUserMenu';
import HeaderNotificationDropdown from './HeaderNotificationDropdown';

/**
 * MAIN HEADER BAR — Premium Edition
 * Desktop & Mobile: Refined spacing, layered shadows, gold-accent micro-interactions.
 * Height: 64px default, 58px on scroll (smooth compress).
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
      className={`w-full bg-white/95 backdrop-blur-md transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-200/80 shadow-[0_4px_24px_rgba(15,36,64,0.06)]'
          : 'border-b border-slate-100'
      }`}
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* ROW 1: Logo (Left) · Search (Center) · Icon Actions (Right) */}
        <div
          className={`flex items-center justify-between gap-3 sm:gap-5 transition-all duration-300 ${
            isScrolled ? 'h-[58px]' : 'h-[64px]'
          }`}
        >
          {/* LEFT — Logo + Brand Name + Tagline */}
          <Link
            to={ROUTE_PATHS.HOME}
            className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap flex-nowrap"
            aria-label={`${siteConfig.name} - home`}
          >
            {/* Logo image circle */}
            <div className="relative flex h-9 w-9 md:h-11 md:w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200/90 bg-slate-50 p-0.5 shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#C99A3B] group-hover:shadow-[0_2px_10px_rgba(201,154,59,0.25)]">
              <img
                src="/logo1.jpeg"
                alt="Kanhaji Poshak Logo"
                className="h-full w-full rounded-full object-cover"
                loading="eager"
              />
              {/* subtle gold ring on hover */}
              <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-[#C99A3B]/0 transition-all duration-300 group-hover:ring-[#C99A3B]/40" />
            </div>

            {/* Brand text & Tagline */}
            <div className="flex flex-col justify-center shrink-0">
              <span className="hidden lg:block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0F2440] leading-none transition-colors duration-300 group-hover:text-[#C99A3B] whitespace-nowrap">
                Kanhaji Poshak
              </span>
              <span className="hidden xl:flex items-center gap-1 text-[10px] font-semibold tracking-[0.15em] uppercase text-amber-700/70 mt-1 leading-none whitespace-nowrap">
                <span className="h-[3px] w-[3px] rounded-full bg-amber-600/60" />
                Divine Attire &amp; Accessories
              </span>
            </div>
          </Link>

          {/* CENTER — Search Bar */}
          <div className="hidden md:flex min-w-0 flex-1 justify-center max-w-[620px] w-full mx-2 lg:mx-6">
            <HeaderSearch />
          </div>

          {/* RIGHT — Account · Wishlist · Cart · Hamburger */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3 text-[#0F2440]">
            {/* Account */}
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
                  className="flex items-center gap-1.5 rounded-full py-2 px-3 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-amber-50 hover:text-[#B8860B]"
                  aria-label="Login or create account"
                >
                  <FiUser className="h-[18px] w-[18px]" />
                  <span>Account</span>
                  <FiChevronDown className="h-3 w-3 opacity-50" />
                </Link>
              )}
            </div>

            {/* Notification Bell */}
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
              className="group relative flex items-center gap-1.5 rounded-full py-2 px-2 sm:px-3 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-amber-50 hover:text-[#B8860B]"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <FiHeart className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden lg:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 lg:static lg:ml-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#0F2440] px-1 text-[9px] font-bold text-white ring-2 ring-white lg:ring-0">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={openDrawer}
              className="group relative flex items-center gap-1.5 rounded-full py-2 px-2 sm:px-3 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-amber-50 hover:text-[#B8860B]"
              aria-label={`Cart (${cartCount} items)`}
            >
              <FiShoppingBag className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden lg:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 lg:top-0.5 lg:right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gradient-to-b from-[#E8C158] via-[#C99A3B] to-[#B8860B] px-1 text-[10px] font-bold text-slate-950 shadow-[0_1px_3px_rgba(184,134,11,0.4)] ring-2 ring-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={onToggleMobile}
              className="flex md:hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-[#0F2440] transition-all duration-200 hover:border-[#C99A3B]/50 hover:bg-amber-50 active:scale-95"
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE ROW 2: Full Width Search Bar */}
        <div className="pb-3 pt-0.5 md:hidden">
          <HeaderSearch mobileRow />
        </div>
      </div>
    </div>
  );
}