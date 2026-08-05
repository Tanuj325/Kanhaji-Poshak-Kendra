import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiUser,
  FiPackage,
  FiHeart,
  FiGrid,
  FiLogOut,
  FiChevronRight,
  FiChevronDown,
  FiMapPin,
  FiBell,
  FiTag,
  FiPhone,
  FiHelpCircle,
  FiInfo,
  FiSettings,
  FiShield,
  FiShoppingBag,
} from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';
import { useAuth } from '@/context/AuthContext';
import { useCategoryDropdown } from '@/hooks/useCategories';
import { isAdmin } from '@/utils/roleChecker';

/**
 * MobileAppDrawer (Phase M1 Redesign)
 * Native App Style Navigation Drawer for Mobile (<768px).
 * Features:
 * 1. Top profile banner (Avatar, Greeting, Login/Register states)
 * 2. Categories Accordion with subcategories/category list
 * 3. Quick Account Links: Orders, Wishlist, Addresses, Notifications, Coupons, Support, About, Settings, Logout
 * 4. 48x48 Touch targets, ARIA dialog accessibility, and smooth animations.
 */
export default function MobileAppDrawer({ isOpen, onClose }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Categories accordion state
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { data: categoriesData } = useCategoryDropdown();

  const categoryList = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.data || categoriesData?.content || [];

  // Lock body scroll when open
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

  const userRole = user?.role || user?.roles?.[0] || 'CUSTOMER';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-[100] md:hidden flex"
        >
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Panel Container */}
          <motion.div
            initial={{ translateX: '-100%' }}
            animate={{ translateX: '0%' }}
            exit={{ translateX: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full max-w-[320px] bg-lotus-white h-dvh flex flex-col z-10 shadow-2xl overflow-hidden pt-safe pb-safe"
          >
            {/* ── 1. TOP PROFILE & GREETING BANNER ────────────────────── */}
            <div className="bg-gradient-to-r from-deep-navy via-royal-blue to-deep-navy text-lotus-white p-4 flex flex-col justify-between relative shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-temple-gold-light">
                  {siteConfig.name || 'Kanhaji Poshak'}
                </span>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu drawer"
                  className="touch-target text-lotus-white hover:text-temple-gold active-tap-scale rounded-full p-2"
                >
                  <FiX className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>

              {/* User Profile Card / Guest Welcome */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-12 h-12 rounded-full bg-temple-gold/20 border-2 border-temple-gold flex items-center justify-center text-temple-gold-light font-bold text-lg shadow-inner">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-temple-gold-light font-medium">Hello & Welcome,</p>
                    <p className="font-semibold text-sm truncate text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-muted-sand truncate">{user?.email}</p>
                    {isAdmin(userRole) && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-temple-gold text-deep-navy rounded">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <p className="text-sm font-semibold text-white">Welcome, Devotee!</p>
                  <p className="text-xs text-muted-sand">Sign in to manage orders, wishlist & addresses</p>
                  <div className="flex gap-2 mt-2">
                    <Link
                      to={ROUTE_PATHS.LOGIN}
                      onClick={onClose}
                      className="touch-target flex-1 py-2 px-3 bg-temple-gold text-deep-navy text-xs font-bold rounded-xl text-center active-tap-scale shadow-sm"
                    >
                      Login
                    </Link>
                    <Link
                      to={ROUTE_PATHS.REGISTER}
                      onClick={onClose}
                      className="touch-target flex-1 py-2 px-3 border border-temple-gold/50 text-lotus-white text-xs font-bold rounded-xl text-center active-tap-scale"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ── 2. SCROLLABLE APP MENU SECTIONS ────────────────────── */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-3">
              {/* Quick Actions / Categories Accordion */}
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-natural-wood">
                  Shop Categories
                </p>

                {/* Categories Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => setCategoriesOpen((prev) => !prev)}
                  className="touch-target w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale font-medium text-sm"
                >
                  <div className="flex items-center gap-3">
                    <FiGrid className="w-5 h-5 text-temple-gold-dark" aria-hidden="true" />
                    <span>All Categories</span>
                  </div>
                  <FiChevronDown
                    className={`w-4 h-4 text-natural-wood transition-transform duration-200 ${
                      categoriesOpen ? 'rotate-180 text-temple-gold-dark' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Accordion Categories List */}
                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4 space-y-1 border-l-2 border-temple-gold/30 ml-4 my-1"
                    >
                      <Link
                        to={ROUTE_PATHS.SHOP}
                        onClick={onClose}
                        className="touch-target flex items-center justify-between px-3 py-2 text-xs font-semibold text-temple-gold-dark hover:bg-warm-cream/60 rounded-lg"
                      >
                        <span>View All Products</span>
                        <FiChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>

                      {categoryList.slice(0, 10).map((cat) => (
                        <Link
                          key={cat.id}
                          to={`${ROUTE_PATHS.SHOP}?categoryId=${cat.id}`}
                          onClick={onClose}
                          className="touch-target flex items-center justify-between px-3 py-2 text-xs text-dark-charcoal hover:bg-warm-cream/60 rounded-lg"
                        >
                          <span className="truncate">{cat.name}</span>
                          <FiChevronRight className="w-3.5 h-3.5 text-natural-wood/60" aria-hidden="true" />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── 3. USER APP LINKS (Orders, Wishlist, Addresses, etc.) ── */}
              <div className="space-y-1 pt-2 border-t border-muted-sand/30">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-natural-wood">
                  App Account & Activity
                </p>

                {/* Orders */}
                <Link
                  to={isAuthenticated ? (ROUTE_PATHS.ORDERS || '/customer/orders') : ROUTE_PATHS.LOGIN}
                  onClick={onClose}
                  className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                >
                  <div className="flex items-center gap-3">
                    <FiPackage className="w-5 h-5 text-royal-blue" aria-hidden="true" />
                    <span className="text-sm font-medium">My Orders</span>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                </Link>

                {/* Wishlist */}
                <Link
                  to={ROUTE_PATHS.WISHLIST || '/customer/wishlist'}
                  onClick={onClose}
                  className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                >
                  <div className="flex items-center gap-3">
                    <FiHeart className="w-5 h-5 text-error" aria-hidden="true" />
                    <span className="text-sm font-medium">Wishlist</span>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                </Link>

                {/* Addresses */}
                <Link
                  to={isAuthenticated ? (ROUTE_PATHS.ADDRESSES || '/customer/addresses') : ROUTE_PATHS.LOGIN}
                  onClick={onClose}
                  className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                >
                  <div className="flex items-center gap-3">
                    <FiMapPin className="w-5 h-5 text-peacock-blue" aria-hidden="true" />
                    <span className="text-sm font-medium">Saved Addresses</span>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                </Link>

                {/* Notifications */}
                <Link
                  to={isAuthenticated ? (ROUTE_PATHS.NOTIFICATIONS || '/customer/notifications') : ROUTE_PATHS.LOGIN}
                  onClick={onClose}
                  className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                >
                  <div className="flex items-center gap-3">
                    <FiBell className="w-5 h-5 text-temple-gold-dark" aria-hidden="true" />
                    <span className="text-sm font-medium">Notifications</span>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                </Link>

                {/* Coupons */}
                <Link
                  to={ROUTE_PATHS.SHOP}
                  onClick={onClose}
                  className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                >
                  <div className="flex items-center gap-3">
                    <FiTag className="w-5 h-5 text-success" aria-hidden="true" />
                    <span className="text-sm font-medium">Offers & Coupons</span>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                </Link>
              </div>

              {/* ── 4. SUPPORT & APP INFO ─────────────────────────────── */}
              <div className="space-y-1 pt-2 border-t border-muted-sand/30">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-natural-wood">
                  Help & Settings
                </p>

                <Link
                  to={ROUTE_PATHS.CONTACT || '/contact'}
                  onClick={onClose}
                  className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                >
                  <div className="flex items-center gap-3">
                    <FiPhone className="w-5 h-5 text-peacock-blue" aria-hidden="true" />
                    <span className="text-sm font-medium">Customer Support</span>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                </Link>

                <Link
                  to={ROUTE_PATHS.ABOUT || '/about'}
                  onClick={onClose}
                  className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                >
                  <div className="flex items-center gap-3">
                    <FiInfo className="w-5 h-5 text-royal-blue" aria-hidden="true" />
                    <span className="text-sm font-medium">About Kanhaji Poshak</span>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                </Link>

                {isAuthenticated && (
                  <Link
                    to={ROUTE_PATHS.SETTINGS || '/customer/settings'}
                    onClick={onClose}
                    className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                  >
                    <div className="flex items-center gap-3">
                      <FiSettings className="w-5 h-5 text-natural-wood" aria-hidden="true" />
                      <span className="text-sm font-medium">Account Settings</span>
                    </div>
                    <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                  </Link>
                )}

                {/* Admin Control Panel Access */}
                {isAuthenticated && isAdmin(userRole) && (
                  <Link
                    to={ROUTE_PATHS.ADMIN || '/admin'}
                    onClick={onClose}
                    className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl bg-temple-gold/15 text-temple-gold-dark font-bold active-tap-scale mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <FiShield className="w-5 h-5" aria-hidden="true" />
                      <span className="text-sm">Admin Control Panel</span>
                    </div>
                    <FiChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>

            {/* ── 5. DRAWER FOOTER (LOGOUT BUTTON) ────────────────────── */}
            {isAuthenticated && (
              <div className="p-3 border-t border-muted-sand/30 bg-warm-cream/40">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="touch-target w-full flex items-center justify-center gap-2 py-2.5 text-error font-semibold text-sm rounded-xl hover:bg-error/10 active-tap-scale transition-colors"
                >
                  <FiLogOut className="w-5 h-5" aria-hidden="true" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
