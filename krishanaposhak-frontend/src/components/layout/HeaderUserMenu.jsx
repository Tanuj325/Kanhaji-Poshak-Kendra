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
  FiChevronDown,
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
    <div className="relative" ref={dropdownRef}>
      {/* Avatar trigger with premium ring */}
      <button
        type="button"
        onClick={onToggle}
        className={`group flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2 transition-all duration-200 hover:border-temple-gold/50 hover:shadow-[0_6px_18px_rgba(201,154,59,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-temple-gold/60 ${
          isOpen ? 'border-temple-gold/60 shadow-[0_6px_18px_rgba(201,154,59,0.16)]' : ''
        }`}
        aria-label="User Account Menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] text-[11px] font-bold text-white ring-2 ring-temple-gold/30">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt={user.firstName || 'User'} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </span>
        <span className="hidden max-w-[5.5rem] truncate text-[11px] font-bold text-dark-charcoal xl:block">
          {user?.firstName || 'Account'}
        </span>
        <FiChevronDown
          className={`hidden h-3.5 w-3.5 text-natural-wood transition-transform duration-200 xl:block ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-3 w-64 max-w-[calc(100vw-24px)] origin-top-right overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,36,64,0.18)]"
            role="menu"
            aria-orientation="vertical"
          >
            {/* User info */}
            <div className="border-b border-slate-100 bg-warm-cream/40 px-4 py-3">
              <p className="truncate text-xs font-bold text-dark-charcoal">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="mt-0.5 truncate text-[10px] text-natural-wood font-mono">{user?.email}</p>
            </div>

            {/* Links */}
            <div className="space-y-0.5 px-1.5 py-1.5" role="none">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className="flex items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-medium text-dark-charcoal transition-colors hover:bg-temple-gold/10 hover:text-temple-gold-dark"
                    role="menuitem"
                  >
                    <Icon className="h-3.5 w-3.5 text-temple-gold/80" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isAdmin(role) && (
                <Link
                  to={ROUTE_PATHS.ADMIN}
                  onClick={onClose}
                  className="flex items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-bold text-temple-gold-dark transition-colors hover:bg-temple-gold/15"
                  role="menuitem"
                >
                  <FiGrid className="h-3.5 w-3.5 text-temple-gold" />
                  <span>Admin Console</span>
                </Link>
              )}
            </div>

            {/* Logout */}
            <div className="border-t border-slate-100 p-1.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
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

