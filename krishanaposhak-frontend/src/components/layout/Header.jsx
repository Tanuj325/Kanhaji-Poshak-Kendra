import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAuth } from '@/context/AuthContext';
import { useRootCategories } from '@/hooks/useCategories';

import HeaderTopBar from './HeaderTopBar';
import HeaderMainBar from './HeaderMainBar';
import HeaderNavBar from './HeaderNavBar';
import HeaderMegaMenu from './HeaderMegaMenu';
import HeaderFeatureBar from './HeaderFeatureBar';
import HeaderMobileDrawer from './HeaderMobileDrawer';
import CartDrawer from '@/components/cart/CartDrawer';

/**
 * Premium ecommerce header.
 * ┌─────────────────────────────────────────────┐
 * │ TopBar (navy thin: shipping · tagline · app)│
 * │ MainBar (white 80–90px: logo · search · icons)
 * │ NavBar (navy: All Categories + nav links)   │
 * │ FeatureBar (trust strip, md+)               │
 * └─────────────────────────────────────────────┘
 * Sticky wrapper with smooth shadow transition, no jump/flicker.
 */
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, role, logout } = useAuth();
  const { data: categories } = useRootCategories();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [renderMegaMenu, setRenderMegaMenu] = useState(false);
  const closeTimer = useRef(null);

  const categoryData = useMemo(() => {
    const raw = Array.isArray(categories) ? categories : categories?.data || categories?.content || [];
    return raw;
  }, [categories]);

  // Scroll state — sticky shadow with a tiny debounce to avoid flicker
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close all overlays on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setNotifMenuOpen(false);
    setMegaMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = useCallback(async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await logout();
    navigate(ROUTE_PATHS.HOME, { replace: true });
  }, [logout, navigate]);

  const closeAllMenus = useCallback(() => {
    setUserMenuOpen(false);
    setNotifMenuOpen(false);
    setMegaMenuOpen(false);
  }, []);

  // Hover-based mega menu: open immediately on enter, delayed close on leave
  const handleMegaMenuEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaMenuOpen(true);
  }, []);

  const handleMegaMenuLeave = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaMenuOpen(false), 180);
  }, []);

  // Toggle handlers for mobile / user / notifications (mutual exclusion)
  const handleToggleMobile = useCallback(() => {
    setMobileOpen((v) => !v);
    setUserMenuOpen(false);
    setNotifMenuOpen(false);
    setMegaMenuOpen(false);
  }, []);

  const handleToggleUserMenu = useCallback(() => {
    setUserMenuOpen((v) => !v);
    setNotifMenuOpen(false);
    setMegaMenuOpen(false);
  }, []);

  const handleToggleNotif = useCallback(() => {
    setNotifMenuOpen((v) => !v);
    setUserMenuOpen(false);
    setMegaMenuOpen(false);
  }, []);

  const handleToggleMegaMenu = useCallback(() => {
    setMegaMenuOpen((v) => !v);
    setUserMenuOpen(false);
    setNotifMenuOpen(false);
  }, []);

  // AnimatePresence cleanup to keep exit animation smooth
  useEffect(() => {
    if (megaMenuOpen) setRenderMegaMenu(true);
  }, [megaMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full font-body">
      {/* TopBar is always rendered (not sticky-scroll dependent) */}
      <HeaderTopBar />

      {/* Sticky group: MainBar + NavBar + FeatureBar */}
      <div className="transition-shadow duration-300">
        <HeaderMainBar
          isScrolled={isScrolled}
          mobileOpen={mobileOpen}
          onToggleMobile={handleToggleMobile}
          userMenuOpen={userMenuOpen}
          onToggleUserMenu={handleToggleUserMenu}
          onCloseUserMenu={() => setUserMenuOpen(false)}
          notifMenuOpen={notifMenuOpen}
          onToggleNotif={handleToggleNotif}
          onCloseNotif={() => setNotifMenuOpen(false)}
          onCloseAllMenus={closeAllMenus}
          onLogout={handleLogout}
        />

        <div
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleMegaMenuLeave}
        >
          <HeaderNavBar
            isScrolled={isScrolled}
            megaMenuOpen={megaMenuOpen}
            onToggleMegaMenu={handleToggleMegaMenu}
          />
          {/* <HeaderFeatureBar /> */}

          {/* Mega menu positioned under the nav bar */}
          <AnimatePresence>
            {megaMenuOpen && renderMegaMenu && (
              <HeaderMegaMenu
                categories={categoryData}
                isOpen={megaMenuOpen}
                onToggle={handleToggleMegaMenu}
                onClose={() => setMegaMenuOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <HeaderMobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categoryData}
        isAuthenticated={isAuthenticated}
        user={user}
        role={role}
        onLogout={handleLogout}
      />

      {/* Cart drawer (shared) */}
      <CartDrawer />
    </header>
  );
}

