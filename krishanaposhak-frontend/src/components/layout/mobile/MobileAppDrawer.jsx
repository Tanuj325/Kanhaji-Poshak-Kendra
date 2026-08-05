import { useEffect } from 'react';
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
  FiHome,
  FiShoppingBag,
  FiPhone,
  FiHelpCircle,
  FiFileText,
  FiShield,
} from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/utils/roleChecker';

/**
 * MobileAppDrawer (Phase M0)
 * Native App Style Navigation Drawer for Mobile (<768px).
 * Features user profile header card, app category links, customer support section,
 * touch targets >= 48px, ARIA accessibility dialog roles, and body lock.
 */
export default function MobileAppDrawer({ isOpen, onClose, categories = [] }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
        <div className="fixed inset-0 z-[100] md:hidden flex" role="dialog" aria-modal="true" aria-label="Navigation Menu">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Content Container */}
          <motion.div
            initial={{ translateX: '-100%' }}
            animate={{ translateX: '0%' }}
            exit={{ translateX: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-[320px] bg-lotus-white h-dvh flex flex-col z-10 shadow-2xl overflow-hidden pt-safe pb-safe"
          >
            {/* Drawer Header (App User Profile Banner) */}
            <div className="bg-gradient-to-r from-deep-navy via-royal-blue to-deep-navy text-lotus-white p-4 flex flex-col justify-between relative shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-widest text-temple-gold-light font-bold">
                  {siteConfig.name || 'Kanhaji Poshak'}
                </span>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="touch-target text-lotus-white hover:text-temple-gold active-tap-scale rounded-full p-2"
                >
                  <FiX className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>

              {/* Account Quick Card */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-12 h-12 rounded-full bg-temple-gold/20 border-2 border-temple-gold flex items-center justify-center text-temple-gold-light font-bold text-lg">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-sand truncate">{user?.email}</p>
                    {isAdmin(userRole) && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-temple-gold text-deep-navy rounded">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <p className="text-sm font-semibold text-white">Welcome to Kanhaji Poshak</p>
                  <p className="text-xs text-muted-sand">Sign in for a personalized shopping experience</p>
                  <div className="flex gap-2 mt-2">
                    <Link
                      to={ROUTE_PATHS.LOGIN}
                      onClick={onClose}
                      className="touch-target flex-1 py-2 px-4 bg-temple-gold text-deep-navy text-xs font-bold rounded-lg text-center active-tap-scale"
                    >
                      Login
                    </Link>
                    <Link
                      to={ROUTE_PATHS.REGISTER}
                      onClick={onClose}
                      className="touch-target flex-1 py-2 px-4 border border-temple-gold/40 text-lotus-white text-xs font-bold rounded-lg text-center active-tap-scale"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Navigation Sections */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
              {/* Core App Navigation */}
              <div className="space-y-1">
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-natural-wood/80">
                  Shop & Browse
                </p>

                <Link
                  to={ROUTE_PATHS.HOME}
                  onClick={onClose}
                  className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                >
                  <div className="flex items-center gap-3">
                    <FiHome className="w-5 h-5 text-temple-gold-dark" aria-hidden="true" />
                    <span className="text-sm font-medium">Home Page</span>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                </Link>

                <Link
                  to={ROUTE_PATHS.SHOP}
                  onClick={onClose}
                  className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                >
                  <div className="flex items-center gap-3">
                    <FiShoppingBag className="w-5 h-5 text-temple-gold-dark" aria-hidden="true" />
                    <span className="text-sm font-medium">All Categories & Shop</span>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                </Link>
              </div>

              {/* User Account Shortcuts */}
              {isAuthenticated && (
                <div className="space-y-1 pt-2 border-t border-muted-sand/30">
                  <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-natural-wood/80">
                    My Account
                  </p>

                  <Link
                    to={ROUTE_PATHS.ACCOUNT_DASHBOARD || '/customer/account'}
                    onClick={onClose}
                    className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                  >
                    <div className="flex items-center gap-3">
                      <FiUser className="w-5 h-5 text-royal-blue" aria-hidden="true" />
                      <span className="text-sm font-medium">Account Dashboard</span>
                    </div>
                    <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                  </Link>

                  <Link
                    to={ROUTE_PATHS.ORDERS || '/customer/orders'}
                    onClick={onClose}
                    className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                  >
                    <div className="flex items-center gap-3">
                      <FiPackage className="w-5 h-5 text-royal-blue" aria-hidden="true" />
                      <span className="text-sm font-medium">My Orders</span>
                    </div>
                    <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                  </Link>

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

                  {isAdmin(userRole) && (
                    <Link
                      to={ROUTE_PATHS.ADMIN || '/admin'}
                      onClick={onClose}
                      className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl bg-temple-gold/10 text-temple-gold-dark font-semibold active-tap-scale"
                    >
                      <div className="flex items-center gap-3">
                        <FiGrid className="w-5 h-5" aria-hidden="true" />
                        <span className="text-sm">Admin Control Panel</span>
                      </div>
                      <FiChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              )}

              {/* Support & Legal Section */}
              <div className="space-y-1 pt-2 border-t border-muted-sand/30">
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-natural-wood/80">
                  Help & Info
                </p>

                <Link
                  to={ROUTE_PATHS.CONTACT || '/contact'}
                  onClick={onClose}
                  className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                >
                  <div className="flex items-center gap-3">
                    <FiPhone className="w-5 h-5 text-peacock-blue" aria-hidden="true" />
                    <span className="text-sm font-medium">Contact Us</span>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                </Link>

                <Link
                  to={ROUTE_PATHS.FAQ || '/faq'}
                  onClick={onClose}
                  className="touch-target flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-charcoal hover:bg-warm-cream/60 active-tap-scale"
                >
                  <div className="flex items-center gap-3">
                    <FiHelpCircle className="w-5 h-5 text-peacock-blue" aria-hidden="true" />
                    <span className="text-sm font-medium">FAQs & Help</span>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-natural-wood" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            {isAuthenticated && (
              <div className="p-3 border-t border-muted-sand/30 bg-warm-cream/40">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="touch-target w-full flex items-center justify-center gap-2 py-2.5 text-error font-medium text-sm rounded-xl hover:bg-error/10 active-tap-scale transition-colors"
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
