import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiBell,
  FiSettings,
  FiGrid,
  FiLogOut,
} from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { isAdmin } from '@/utils/roleChecker';

export default function HeaderUserMenu({ user, role, isOpen, onToggle, onClose, onLogout }) {
  const dropdownRef = useRef(null);

  const initials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}`.toUpperCase()
    : 'U';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    { label: 'Profile', to: ROUTE_PATHS.PROFILE, icon: FiUser },
    { label: 'Orders', to: ROUTE_PATHS.ORDERS, icon: FiPackage },
    { label: 'Wishlist', to: ROUTE_PATHS.WISHLIST, icon: FiHeart },
    { label: 'Addresses', to: ROUTE_PATHS.ADDRESSES, icon: FiMapPin },
    { label: 'Notifications', to: ROUTE_PATHS.NOTIFICATIONS, icon: FiBell },
    { label: 'Settings', to: ROUTE_PATHS.SETTINGS, icon: FiSettings },
  ];

  return (
    <div className="relative font-display" ref={dropdownRef}>
      {/* Avatar trigger button */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-stone-950 font-bold text-xs hover:scale-105 transition-all ring-2 ring-amber-400/40 hover:ring-amber-400/80 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
        aria-label="User Account Menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.firstName || 'User'}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-3 w-56 max-w-[calc(100vw-24px)] origin-top-right rounded-2xl bg-[#0B1728]/98 backdrop-blur-2xl border border-amber-400/30 shadow-2xl font-display overflow-hidden"
            role="menu"
            aria-orientation="vertical"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-white/10 bg-white/[0.03]">
              <p className="truncate text-xs font-bold text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-[10px] text-slate-400 font-mono mt-0.5">
                {user?.email}
              </p>
            </div>

            {/* Links */}
            <div className="py-1.5 space-y-0.5 px-1.5" role="none">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-amber-400/10 hover:text-amber-300 transition-colors"
                    role="menuitem"
                  >
                    <Icon className="h-3.5 w-3.5 text-amber-400/70" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isAdmin(role) && (
                <Link
                  to={ROUTE_PATHS.ADMIN}
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-400/15 transition-colors"
                  role="menuitem"
                >
                  <FiGrid className="h-3.5 w-3.5 text-amber-400" />
                  <span>Admin Console</span>
                </Link>
              )}
            </div>

            {/* Logout */}
            <div className="border-t border-white/10 p-1.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                role="menuitem"
              >
                <FiLogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
