import { useState, useEffect, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiBell,
  FiSettings,
  FiGrid,
  FiLogOut,
  FiFolder,
  FiChevronDown,
  FiChevronRight,
  FiHome,
  FiShoppingBag,
  FiTrendingUp,
  FiAward,
  FiPercent,
  FiCalendar,
  FiPhone,
  FiHeadphones,
  FiDownload,
} from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';
import { isAdmin } from '@/utils/roleChecker';
import HeaderSearch from './HeaderSearch';

const MOBILE_NAV = [
  { label: 'Home', to: ROUTE_PATHS.HOME, icon: FiHome, end: true },
  { label: 'Shop All', to: ROUTE_PATHS.SHOP, icon: FiShoppingBag },
  { label: 'New Arrivals', to: ROUTE_PATHS.SHOP, icon: FiTrendingUp },
  { label: 'Best Sellers', to: ROUTE_PATHS.SHOP, icon: FiAward },
  { label: 'Combo Offers', to: ROUTE_PATHS.SHOP, icon: FiPercent },
  { label: 'Festivals', to: ROUTE_PATHS.HOME, icon: FiCalendar },
  { label: 'Contact', to: ROUTE_PATHS.CONTACT, icon: FiPhone },
];

const ACCOUNT_ITEMS = [
  { to: ROUTE_PATHS.PROFILE, icon: FiUser, label: 'My Profile' },
  { to: ROUTE_PATHS.ORDERS, icon: FiPackage, label: 'Order History' },
  { to: ROUTE_PATHS.WISHLIST, icon: FiHeart, label: 'My Wishlist' },
  { to: ROUTE_PATHS.ADDRESSES, icon: FiMapPin, label: 'Saved Addresses' },
  { to: ROUTE_PATHS.NOTIFICATIONS, icon: FiBell, label: 'Notifications' },
  { to: ROUTE_PATHS.SETTINGS, icon: FiSettings, label: 'Account Settings' },
];

const UTILITY_LINKS = [
  { to: ROUTE_PATHS.CONTACT, icon: FiHeadphones, label: 'Support' },
  { to: ROUTE_PATHS.ORDERS, icon: FiPackage, label: 'Track Order' },
  { to: ROUTE_PATHS.HOME, icon: FiDownload, label: 'Download App' },
];

/**
 * App-like premium mobile drawer.
 * Contains: user section, inline search, nav, categories accordion,
 * account & orders links, admin console, logout, utility links.
 */
export default function HeaderMobileDrawer({
  isOpen,
  onClose,
  categories = [],
  isAuthenticated,
  user,
  role,
  onLogout,
}) {
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const categoryList = useMemo(() => {
    const raw = Array.isArray(categories) ? categories : categories?.data || categories?.content || [];
    return raw.slice(0, 10);
  }, [categories]);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const initials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}`.toUpperCase()
    : 'U';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden" id="header-mobile-drawer">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="relative z-10 flex h-full w-[min(24rem,calc(100vw-0.75rem))] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-[0_28px_80px_rgba(0,0,0,0.35)]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3.5">
              <Link
                to={ROUTE_PATHS.HOME}
                onClick={onClose}
                className="flex min-w-0 items-center gap-2 text-sm font-semibold text-deep-navy"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] p-[1.5px]">
                  <img src="/logo1.jpeg" alt="Krishana Poshak Logo" className="h-full w-full rounded-full object-cover" />
                </span>
                <span className="truncate font-display tracking-wide">{siteConfig.name}</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-slate-200 text-natural-wood transition-colors hover:border-temple-gold/40 hover:bg-warm-cream/60 hover:text-royal-blue"
                aria-label="Close menu drawer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto bg-lotus-white px-4 py-4 space-y-5">
              {/* User card / guest CTA */}
              {isAuthenticated ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] text-sm font-black text-white shadow-[0_10px_24px_rgba(201,154,59,0.25)]">
                      {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt={user.firstName || 'User'} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-dark-charcoal">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="truncate text-[11px] text-natural-wood">{user?.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      to={ROUTE_PATHS.PROFILE}
                      onClick={onClose}
                      className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-temple-gold/10 border border-temple-gold/30 text-xs font-bold text-temple-gold-dark transition-colors hover:bg-temple-gold/20"
                    >
                      <FiUser className="h-4 w-4" /> My Profile
                    </Link>
                    <Link
                      to={ROUTE_PATHS.ORDERS}
                      onClick={onClose}
                      className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-dark-charcoal transition-colors hover:bg-warm-cream/60"
                    >
                      <FiPackage className="h-4 w-4" /> My Orders
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-dark-charcoal">
                    Welcome to <span className="font-display font-bold text-royal-blue">{siteConfig.name}</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-natural-wood">
                    Login to view orders, wishlist & addresses.
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      to={ROUTE_PATHS.LOGIN}
                      onClick={onClose}
                      className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 text-xs font-semibold text-dark-charcoal transition-colors hover:bg-warm-cream/60"
                    >
                      Login
                    </Link>
                    <Link
                      to={ROUTE_PATHS.REGISTER}
                      onClick={onClose}
                      className="flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-br from-temple-gold-light via-temple-gold to-temple-gold-dark text-xs font-bold text-white shadow-gold transition-colors hover:brightness-105"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}

              {/* Inline search */}
              <div className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
                <HeaderSearch isMobileDrawer onCloseMobileDrawer={onClose} />
              </div>

              {/* Navigation */}
              <div className="space-y-1 rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
                <p className="px-1 mb-1 text-[9px] font-bold uppercase tracking-widest text-natural-wood">
                  Navigate
                </p>
                {MOBILE_NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex min-h-[46px] items-center gap-2.5 rounded-2xl px-3 text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-temple-gold/10 text-temple-gold-dark border border-temple-gold/30'
                            : 'border border-transparent text-dark-charcoal hover:bg-warm-cream/60'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 text-temple-gold/80" /> {item.label}
                      <FiChevronRight className="ml-auto h-3.5 w-3.5 text-natural-wood" />
                    </NavLink>
                  );
                })}
              </div>

              {/* Categories */}
              <div className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
                <button
                  type="button"
                  onClick={() => setCategoriesOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-1 pb-1 text-[9px] font-bold uppercase tracking-widest text-natural-wood"
                  aria-expanded={categoriesOpen}
                >
                  <span className="flex items-center gap-1.5">
                    <FiFolder className="text-temple-gold" /> Categories ({categoryList.length})
                  </span>
                  <FiChevronDown
                    className={`h-4 w-4 text-temple-gold transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1.5 pt-2">
                        {categoryList.length === 0 ? (
                          <p className="px-1 pb-1 text-xs text-natural-wood">No categories loaded</p>
                        ) : (
                          categoryList.map((cat) => (
                            <Link
                              key={cat.id}
                              to={cat.slug ? `/category/${cat.slug}` : `${ROUTE_PATHS.SHOP}?categoryId=${cat.id}`}
                              onClick={onClose}
                              className="flex min-h-[44px] items-center justify-between rounded-2xl border border-slate-200 bg-lotus-white px-3 text-xs text-dark-charcoal transition-colors hover:border-temple-gold/40 hover:bg-warm-cream/60"
                            >
                              <span>{cat.name}</span>
                              <FiChevronRight className="h-3.5 w-3.5 text-temple-gold" />
                            </Link>
                          ))
                        )}
                        <Link
                          to={ROUTE_PATHS.SHOP}
                          onClick={onClose}
                          className="flex min-h-[44px] items-center justify-between rounded-2xl border border-temple-gold/25 bg-temple-gold/10 px-3 text-xs font-bold text-temple-gold-dark transition-colors hover:bg-temple-gold/15"
                        >
                          <span>View All Collections</span>
                          <FiChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Account & Orders */}
              {isAuthenticated && (
                <div className="space-y-1 rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="px-1 pb-1 text-[9px] font-bold uppercase tracking-widest text-natural-wood">
                    Account &amp; Orders
                  </p>
                  {ACCOUNT_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={onClose}
                        className="flex min-h-[44px] items-center gap-2.5 rounded-2xl px-3 text-xs text-dark-charcoal transition-colors hover:bg-warm-cream/60 hover:text-royal-blue"
                      >
                        <Icon className="h-4 w-4 text-temple-gold/80" /> {item.label}
                      </Link>
                    );
                  })}
                  {isAdmin(role) && (
                    <Link
                      to={ROUTE_PATHS.ADMIN}
                      onClick={onClose}
                      className="flex min-h-[44px] items-center gap-2.5 rounded-2xl px-3 text-xs font-bold text-temple-gold-dark transition-colors hover:bg-temple-gold/10"
                    >
                      <FiGrid className="h-4 w-4 text-temple-gold" /> Admin Console
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="mt-2 flex w-full min-h-[44px] items-center gap-2.5 rounded-2xl px-3 text-xs text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <FiLogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}

              {/* Utility links */}
              <div className="grid grid-cols-1 gap-2">
                {UTILITY_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={onClose}
                      className="flex min-h-[44px] items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-semibold text-dark-charcoal transition-colors hover:border-temple-gold/40 hover:bg-warm-cream/60"
                    >
                      <Icon className="h-4 w-4 text-temple-gold" /> {link.label}
                    </Link>
                  );
                })}
              </div>

              <p className="pt-1 text-center text-[10px] text-natural-wood">
                Handcrafted with devotion in {siteConfig.address.city}, {siteConfig.address.state}
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

