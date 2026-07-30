import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAuth } from '@/context/AuthContext';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import { useRootCategories } from '@/hooks/useCategories';
import { siteConfig } from '@/config/siteConfig';
import { FiHeart, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';

import HeaderSearch from './HeaderSearch';
import HeaderMegaMenu from './HeaderMegaMenu';
import HeaderNotificationDropdown from './HeaderNotificationDropdown';
import HeaderUserMenu from './HeaderUserMenu';
import HeaderMobileDrawer from './HeaderMobileDrawer';
import CartDrawer from '@/components/cart/CartDrawer';

const mainNav = [
  { label: 'Home', to: ROUTE_PATHS.HOME, end: true },
  { label: 'Shop', to: ROUTE_PATHS.SHOP },
  { label: 'About', to: ROUTE_PATHS.ABOUT },
  { label: 'Contact', to: ROUTE_PATHS.CONTACT },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, role, logout } = useAuth();
  const { cartCount, openDrawer } = useCartContext();
  const { wishlistCount } = useWishlistContext();
  const { data: categories } = useRootCategories();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setNotifMenuOpen(false);
    setCategoriesOpen(false);
  }, [location.pathname]);

  const handleLogout = useCallback(async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await logout();
    navigate(ROUTE_PATHS.HOME, { replace: true });
  }, [logout, navigate]);

  const navLinkClass = useCallback(
    ({ isActive }) =>
      `relative text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors duration-200 py-1 whitespace-nowrap ${isActive ? 'text-amber-300' : 'text-slate-300 hover:text-white'
      }`,
    [],
  );

  const categoryData = useMemo(() => {
    return Array.isArray(categories) ? categories : categories?.data || categories?.content || [];
  }, [categories]);

  return (
    <header className="sticky top-0 z-40 w-full font-body">
      {/* ─── Announcement Bar ─── */}
      <div className="bg-deep-navy border-b border-temple-gold/20 py-1.5 px-4 text-center overflow-hidden">
        <p className="text-[10px] sm:text-xs text-temple-gold-light font-medium tracking-wide truncate">
          ✦ Handcrafted Divine Poshaks from Sacred Meerut • Free Shipping on ₹8,000+ ✦
        </p>
      </div>

      {/* ─── Main Header Bar ─── */}
      <div
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-deep-navy/98 backdrop-blur-xl border-temple-gold/30 shadow-elevated'
            : 'bg-deep-navy border-temple-gold/15 shadow-none'
        }`}
      >
        <div className="w-full max-w-[1600px] mx-auto h-16 sm:h-[68px] lg:h-[72px] flex items-center justify-between gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* ── Left & Center Group: Logo + Desktop Nav ── */}
          <div className="flex items-center gap-3 lg:gap-5 xl:gap-7 shrink-0">
            <Link
              to={ROUTE_PATHS.HOME}
              className="group flex items-center gap-2.5 shrink-0"
              aria-label={siteConfig.name}
            >
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-temple-gold-light via-temple-gold to-temple-gold-dark p-[1.5px] shadow-gold shrink-0 transition-transform group-hover:scale-105 overflow-hidden">
                <img src="/logo1.jpeg" alt="Krishana Poshak Logo" className="h-full w-full object-cover rounded-full" />
              </div>
              <span className="text-base sm:text-lg lg:text-xl font-display font-bold text-lotus-white tracking-wide whitespace-nowrap">
                {siteConfig.name}
              </span>
            </Link>

            {/* ── Desktop Nav (lg+) ── */}
            <nav className="hidden lg:flex items-center gap-1.5 lg:gap-2 xl:gap-3 shrink-0" aria-label="Main Navigation">
              {mainNav.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                  {({ isActive }) => (
                    <span className="relative py-1">
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-temple-gold rounded-full shadow-gold"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </span>
                  )}
                </NavLink>
              ))}

              <HeaderMegaMenu
                categories={categoryData}
                isOpen={categoriesOpen}
                onToggle={() => {
                  setCategoriesOpen((v) => !v);
                  setUserMenuOpen(false);
                  setNotifMenuOpen(false);
                }}
                onClose={() => setCategoriesOpen(false)}
              />
            </nav>
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
            {/* Search */}
            <HeaderSearch />

            {/* Wishlist (md+) */}
            <Link
              to={ROUTE_PATHS.WISHLIST}
              className="hidden md:flex relative items-center justify-center min-h-[44px] min-w-[44px] h-11 w-11 rounded-full text-muted-sand hover:text-temple-gold hover:bg-white/10 transition-all active:scale-95"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <FiHeart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 flex h-4.5 w-4.5 min-w-[18px] items-center justify-center rounded-full bg-temple-gold text-[9px] font-bold text-dark-charcoal font-mono leading-none shadow-gold"
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={openDrawer}
              className="relative flex items-center justify-center min-h-[44px] min-w-[44px] h-11 w-11 rounded-full text-muted-sand hover:text-temple-gold hover:bg-white/10 transition-all focus:outline-none active:scale-95"
              aria-label={`Cart (${cartCount} items)`}
            >
              <FiShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 flex h-4.5 w-4.5 min-w-[18px] items-center justify-center rounded-full bg-temple-gold text-[9px] font-bold text-dark-charcoal font-mono leading-none shadow-gold"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </button>

            {/* Notifications (md+, auth only) */}
            {isAuthenticated && (
              <div className="hidden md:block">
                <HeaderNotificationDropdown
                  isOpen={notifMenuOpen}
                  onToggle={() => {
                    setNotifMenuOpen((v) => !v);
                    setUserMenuOpen(false);
                    setCategoriesOpen(false);
                  }}
                  onClose={() => setNotifMenuOpen(false)}
                />
              </div>
            )}

            {/* User Menu / Auth Buttons */}
            {isAuthenticated ? (
              <HeaderUserMenu
                user={user}
                role={role}
                isOpen={userMenuOpen}
                onToggle={() => {
                  setUserMenuOpen((v) => !v);
                  setNotifMenuOpen(false);
                  setCategoriesOpen(false);
                }}
                onClose={() => setUserMenuOpen(false)}
                onLogout={handleLogout}
              />
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className="min-h-[44px] inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-lotus-white border border-temple-gold/30 rounded-full hover:bg-white/10 hover:border-temple-gold transition-all whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to={ROUTE_PATHS.REGISTER}
                  className="hidden xl:inline-flex min-h-[44px] items-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-dark-charcoal bg-temple-gold rounded-full hover:bg-temple-gold-light transition-all whitespace-nowrap shadow-gold"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger (< lg) */}
            <button
              type="button"
              className="flex lg:hidden items-center justify-center min-h-[44px] min-w-[44px] h-11 w-11 rounded-full text-muted-sand hover:text-temple-gold hover:bg-white/10 transition-all"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      <HeaderMobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categoryData}
        mainNav={mainNav}
        isAuthenticated={isAuthenticated}
        user={user}
        role={role}
        onLogout={handleLogout}
      />
      {/* ─── Cart Drawer ─── */}
      <CartDrawer />
    </header>
  );
}