import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiChevronDown,
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiBell,
  FiSettings,
  FiGrid,
  FiLogOut,
  FiFolder,
} from 'react-icons/fi';
import { ROUTE_PATHS, buildPath } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';
import { isAdmin } from '@/utils/roleChecker';
import HeaderSearch from './HeaderSearch';

export default function HeaderMobileDrawer({
  isOpen,
  onClose,
  categories = [],
  mainNav = [],
  isAuthenticated,
  user,
  role,
  onLogout,
}) {
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);

  const categoryList = Array.isArray(categories)
    ? categories
    : categories?.data || categories?.content || [];

  // Lock body scroll
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

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex font-display">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Sliding Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="relative w-[320px] max-w-[85vw] h-full bg-[#0B1728] border-r border-white/10 shadow-2xl flex flex-col z-10"
          >
            {/* Top Header Bar */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-[#081427]">
              <Link
                to={ROUTE_PATHS.HOME}
                onClick={onClose}
                className="font-serif text-sm font-bold text-white flex items-center gap-2"
              >
                <span className="h-6 w-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs font-bold border border-amber-400/30">
                  KP
                </span>
                <span>{siteConfig.name}</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close menu drawer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
              {/* Search Bar */}
              <HeaderSearch isMobileDrawer onCloseMobileDrawer={onClose} />

              {/* Main Nav Links */}
              <div className="space-y-0.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-1.5">
                  Navigation
                </p>
                {mainNav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {/* Category Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setCategoriesExpanded((v) => !v)}
                  className="w-full flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-slate-500 px-2 py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <FiFolder className="text-amber-400" /> Categories ({categoryList.length})
                  </span>
                  <FiChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${categoriesExpanded ? 'rotate-180 text-amber-400' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {categoriesExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-1 mt-2 pl-1"
                    >
                      {categoryList.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-slate-500">No categories loaded</p>
                      ) : (
                        categoryList.map((cat) => (
                          <Link
                            key={cat.id || cat.slug}
                            to={cat.slug ? buildPath.category(cat.slug) : `${ROUTE_PATHS.SHOP}?category=${cat.id}`}
                            onClick={onClose}
                            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-amber-400/10 hover:text-amber-300 transition-colors"
                          >
                            <span>{cat.name}</span>
                            {cat.productCount !== undefined && (
                              <span className="text-[10px] text-slate-500">{cat.productCount}</span>
                            )}
                          </Link>
                        ))
                      )}
                      <Link
                        to={ROUTE_PATHS.SHOP}
                        onClick={onClose}
                        className="block rounded-xl px-3 py-2 text-xs font-bold text-amber-300 hover:text-white transition-colors"
                      >
                        View All Collections →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Account Menu */}
              {isAuthenticated ? (
                <div className="space-y-0.5 border-t border-white/10 pt-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 px-2 mb-1.5">
                    Account &amp; Orders
                  </p>
                  {[
                    { to: ROUTE_PATHS.PROFILE, icon: FiUser, label: 'My Profile' },
                    { to: ROUTE_PATHS.ORDERS, icon: FiPackage, label: 'Order History' },
                    { to: ROUTE_PATHS.WISHLIST, icon: FiHeart, label: 'My Wishlist' },
                    { to: ROUTE_PATHS.ADDRESSES, icon: FiMapPin, label: 'Saved Addresses' },
                    { to: ROUTE_PATHS.NOTIFICATIONS, icon: FiBell, label: 'Notifications' },
                    { to: ROUTE_PATHS.SETTINGS, icon: FiSettings, label: 'Account Settings' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={onClose}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5 text-amber-400/70" /> {item.label}
                      </Link>
                    );
                  })}

                  {isAdmin(role) && (
                    <Link
                      to={ROUTE_PATHS.ADMIN}
                      onClick={onClose}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 hover:bg-white/5 transition-colors"
                    >
                      <FiGrid className="h-3.5 w-3.5 text-amber-400" /> Admin Console
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors mt-2"
                  >
                    <FiLogOut className="h-3.5 w-3.5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <Link
                    to={ROUTE_PATHS.LOGIN}
                    onClick={onClose}
                    className="block w-full rounded-xl border border-white/15 py-2.5 text-center text-xs font-semibold text-slate-200 hover:bg-white/5"
                  >
                    Login to Account
                  </Link>
                  <Link
                    to={ROUTE_PATHS.REGISTER}
                    onClick={onClose}
                    className="block w-full rounded-xl bg-amber-400 py-2.5 text-center text-xs font-bold text-stone-950 hover:bg-amber-300 shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
