import { useState, useEffect, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
  FiHome,
  FiShoppingBag,
  FiCalendar,
  FiPhone,
} from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';
import { isAdmin } from '@/utils/roleChecker';

const MOBILE_NAV = [
  { label: 'Home', to: ROUTE_PATHS.HOME, icon: FiHome, end: true },
  { label: 'Shop', to: ROUTE_PATHS.SHOP, icon: FiShoppingBag },
  { label: 'Festivals', to: ROUTE_PATHS.SHOP, query: 'category=festivals', icon: FiCalendar },
  { label: 'Contact', to: ROUTE_PATHS.CONTACT, icon: FiPhone },
];

function resolveNavPath(item) {
  return item.query ? `${item.to}?${item.query}` : item.to;
}

export default function HeaderMobileDrawer({
  isOpen,
  onClose,
  categories = [],
  isAuthenticated,
  user,
  role,
  onLogout,
}) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);

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

  const initials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}`.toUpperCase()
    : 'U';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" id="header-mobile-drawer">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Drawer content */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative z-10 flex h-full w-[85vw] max-w-sm flex-col bg-white text-slate-900 shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <Link to={ROUTE_PATHS.HOME} onClick={onClose} className="flex items-center gap-2.5">
                <img src="/logo1.jpeg" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
                <span className="font-serif text-lg font-bold text-[#0F2440]">
                  {siteConfig.name}
                </span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close menu"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Account / User Profile Card */}
              {isAuthenticated ? (
                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F2440] font-bold text-white text-sm">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#0F2440]">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="truncate text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to={ROUTE_PATHS.PROFILE}
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      <FiUser className="h-3.5 w-3.5" /> Account
                    </Link>
                    <Link
                      to={ROUTE_PATHS.ORDERS}
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      <FiPackage className="h-3.5 w-3.5" /> Orders
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-3 text-center">
                  <p className="text-xs font-medium text-slate-600">
                    Welcome to <strong className="text-[#0F2440]">{siteConfig.name}</strong>
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Link
                      to={ROUTE_PATHS.LOGIN}
                      onClick={onClose}
                      className="flex-1 rounded-xl border border-slate-300 bg-white py-2 text-center text-xs font-bold text-slate-900 hover:bg-slate-50"
                    >
                      Login
                    </Link>
                    <Link
                      to={ROUTE_PATHS.REGISTER}
                      onClick={onClose}
                      className="flex-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-2 text-center text-xs font-bold text-slate-950 shadow-xs hover:brightness-105"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
                  Menu
                </p>
                {MOBILE_NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.label}
                      to={resolveNavPath(item)}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-amber-400/15 text-amber-900 border border-amber-400/30'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 text-amber-600" />
                      <span>{item.label}</span>
                      <FiChevronRight className="ml-auto h-3.5 w-3.5 text-slate-400" />
                    </NavLink>
                  );
                })}
              </div>

              {/* Wishlist Link */}
              <Link
                to={ROUTE_PATHS.WISHLIST}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <FiHeart className="h-4 w-4 text-amber-600" />
                <span>Wishlist</span>
              </Link>

              {/* Categories Accordion */}
              {categoryList.length > 0 && (
                <div className="space-y-1 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                  >
                    <span>Categories Accordion</span>
                    <FiChevronDown className={`h-3.5 w-3.5 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {categoriesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1"
                      >
                        {categoryList.map((cat) => (
                          <Link
                            key={cat.id}
                            to={cat.slug ? `/category/${cat.slug}` : `${ROUTE_PATHS.SHOP}?categoryId=${cat.id}`}
                            onClick={onClose}
                            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                          >
                            <span>{cat.name}</span>
                            <FiChevronRight className="h-3.5 w-3.5 text-slate-300" />
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Admin Console & Logout */}
              {isAuthenticated && (
                <div className="space-y-1 border-t border-slate-100 pt-4">
                  {isAdmin(role) && (
                    <Link
                      to={ROUTE_PATHS.ADMIN}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-[#0F2440] hover:bg-slate-50"
                    >
                      <FiGrid className="h-4 w-4 text-amber-600" /> Admin Console
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <FiLogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
