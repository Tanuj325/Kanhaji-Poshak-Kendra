import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAuth } from '@/context/AuthContext';
import { useRootCategories } from '@/hooks/useCategories';

import HeaderTopBar from './HeaderTopBar';
import HeaderMainBar from './HeaderMainBar';
import HeaderNavBar from './HeaderNavBar';
import HeaderMegaMenu from './HeaderMegaMenu';
import HeaderMobileDrawer from './HeaderMobileDrawer';
import CartDrawer from '@/components/cart/CartDrawer';

/**
 * HEADER REDESIGN V3 - PREMIUM LUXURY HEADER
 * 1. TopBar (34px): Dark Navy | Free Shipping promo | Track Order | Support
 * 2. MainBar (72px -> 64px): Logo + Brand + Tagline | Dominant Search (560-620px) | Account + Arrow, Wishlist, Cart
 * 3. NavBar (50px): Gold "All Categories" button (180-210px, shrink-0, NEVER overlaps) | Centered Links (Home, Shop, New Arrivals, Best Sellers, Festivals, Contact)
 * 4. Mega Menu: Opens ONLY from "All Categories" button
 * 5. Sticky Header: Entire header group stays sticky with smooth height transition & shadow
 * 6. Mobile Header: Row 1 (Logo | Wishlist | Cart | Hamburger); Row 2 (Full Width Search)
 * 7. Mobile Drawer: User profile card, Orders, Wishlist, Categories accordion, Nav links, Logout
 */
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, role, logout } = useAuth();
  const { data: categories } = useRootCategories();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const closeTimer = useRef(null);

  const categoryData = useMemo(() => {
    const raw = Array.isArray(categories) ? categories : categories?.data || categories?.content || [];
    return raw;
  }, [categories]);

  // Scroll listener for smooth sticky shadow & height animation
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close overlays on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setMegaMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = useCallback(async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await logout();
    navigate(ROUTE_PATHS.HOME, { replace: true });
  }, [logout, navigate]);

  // Mega Menu handlers — ONLY trigger from ALL CATEGORIES button
  const handleMegaMenuEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaMenuOpen(true);
  }, []);

  const handleMegaMenuLeave = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaMenuOpen(false), 200);
  }, []);

  const handleToggleMobile = useCallback(() => {
    setMobileOpen((v) => !v);
    setUserMenuOpen(false);
    setMegaMenuOpen(false);
  }, []);

  const handleToggleUserMenu = useCallback(() => {
    setUserMenuOpen((v) => !v);
    setMegaMenuOpen(false);
  }, []);

  const handleToggleMegaMenu = useCallback(() => {
    setMegaMenuOpen((v) => !v);
    setUserMenuOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full font-sans">
      {/* 1. TOP BAR (32-34px) */}
      <HeaderTopBar />

      {/* 2. MAIN HEADER (72px -> 64px) & 3. NAVIGATION BAR (50px) */}
      <div className="relative bg-white">
        <HeaderMainBar
          isScrolled={isScrolled}
          mobileOpen={mobileOpen}
          onToggleMobile={handleToggleMobile}
          userMenuOpen={userMenuOpen}
          onToggleUserMenu={handleToggleUserMenu}
          onCloseUserMenu={() => setUserMenuOpen(false)}
          onLogout={handleLogout}
        />

        <HeaderNavBar
          megaMenuOpen={megaMenuOpen}
          onToggleMegaMenu={handleToggleMegaMenu}
          onMegaMenuEnter={handleMegaMenuEnter}
          onMegaMenuLeave={handleMegaMenuLeave}
        />

        {/* 4. MEGA MENU (Opens ONLY from ALL CATEGORIES button) */}
        <div onMouseEnter={handleMegaMenuEnter} onMouseLeave={handleMegaMenuLeave}>
          <HeaderMegaMenu
            categories={categoryData}
            isOpen={megaMenuOpen}
            onClose={() => setMegaMenuOpen(false)}
          />
        </div>
      </div>

      {/* 5. MOBILE DRAWER */}
      <HeaderMobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categoryData}
        isAuthenticated={isAuthenticated}
        user={user}
        role={role}
        onLogout={handleLogout}
      />

      <CartDrawer />
    </header>
  );
}
