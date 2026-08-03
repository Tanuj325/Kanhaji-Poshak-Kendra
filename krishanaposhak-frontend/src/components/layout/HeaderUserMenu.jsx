import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiSettings,
  FiGrid,
  FiLogOut,
  FiChevronDown,
} from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { isAdmin } from '@/utils/roleChecker';

export default function HeaderUserMenu({ user, role, isOpen, onToggle, onClose, onLogout }) {
  const dropdownRef = useRef(null);

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
    { label: 'Settings', to: ROUTE_PATHS.SETTINGS, icon: FiSettings },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account Button: User Icon, Label, and Gold Arrow */}
      <button
        type="button"
        onClick={onToggle}
        className={`group flex items-center gap-1.5 py-1.5 px-2 text-xs font-semibold text-slate-700 hover:text-[#C99A3B] transition-colors ${
          isOpen ? 'text-[#0F2440]' : ''
        }`}
        aria-label="User Account Menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FiUser className="h-5 w-5 text-[#0F2440] group-hover:text-[#C99A3B] transition-colors" />
        <span>{user?.firstName || 'Account'}</span>
        <FiChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#C99A3B]' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl text-xs text-slate-800"
            role="menu"
          >
            {/* User Info */}
            <div className="border-b border-slate-100 px-3 py-2">
              <p className="truncate font-bold text-[#0F2440]">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-[11px] text-slate-400 font-normal">{user?.email}</p>
            </div>

            {/* Menu Links */}
            <div className="py-1 space-y-0.5" role="none">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#0F2440] transition-colors"
                    role="menuitem"
                  >
                    <Icon className="h-3.5 w-3.5 text-[#C99A3B]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isAdmin(role) && (
                <Link
                  to={ROUTE_PATHS.ADMIN}
                  onClick={onClose}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-bold text-[#0F2440] hover:bg-amber-50/60 transition-colors"
                  role="menuitem"
                >
                  <FiGrid className="h-3.5 w-3.5 text-[#C99A3B]" />
                  <span>Admin Console</span>
                </Link>
              )}
            </div>

            {/* Logout */}
            <div className="border-t border-slate-100 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
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
