import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  useUnreadNotifications,
  useUnreadNotificationCount,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '@/hooks/useNotifications';
import {
  FiBell,
  FiUser,
  FiMenu,
  FiChevronDown,
  FiCheck,
  FiInbox,
  FiHome,
  FiLogOut,
  FiSearch,
  FiX,
  FiSettings,
  FiShield,
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTE_PATHS } from '@/routes/routePaths';
import Avatar from '@/components/ui/Avatar';
import Spinner from '@/components/ui/Spinner';
import { formatDate } from '@/utils/formatDate';

export default function AdminTopbar({ title, onMenuToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  // Real backend notification hooks
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data: unreadNotifications = [], isLoading: isLoadingNotifs } = useUnreadNotifications();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const markReadMutation = useMarkNotificationRead();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setNotificationsOpen(false);
        setProfileOpen(false);
        setSearchModalOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((v) => !v);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchModalOpen]);

  const pageTitle = title || location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment) =>
      segment
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    )
    .join(' > ') ||
    'Dashboard';

  const handleLogoutClick = useCallback(async () => {
    setProfileOpen(false);
    await logout();
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  }, [logout, navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`${ROUTE_PATHS.ADMIN_PRODUCTS}?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchModalOpen(false);
  };

  const countDisplay = typeof unreadCount === 'number' ? unreadCount : unreadCount?.data ?? 0;
  const notifList = Array.isArray(unreadNotifications)
    ? unreadNotifications
    : unreadNotifications?.content || unreadNotifications?.data || [];

  return (
    <div className="flex h-full w-full items-center justify-between px-3 sm:px-4 lg:px-6 font-display text-slate-800">
      {/* Left section: Menu Toggle & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 lg:flex-initial pr-2">
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none lg:hidden shrink-0"
          aria-label="Toggle admin navigation menu"
        >
          <FiMenu className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-2 min-w-0 flex-1 lg:flex-initial truncate">
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 border border-amber-500/20 font-heading shrink-0">
            <FiShield className="h-2.5 w-2.5 text-amber-600" /> Admin
          </span>
          <h1 className="font-heading text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate min-w-0 flex-1">
            {pageTitle}
          </h1>
          <span className="hidden md:inline-flex items-center gap-1 shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Right section: Search, Notifications, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Mobile Search Icon Button */}
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="flex sm:hidden h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
          aria-label="Open admin search"
        >
          <FiSearch className="h-3.5 w-3.5" />
        </button>

        {/* Tablet & Desktop Search Pill */}
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-100/70 px-3 py-1 text-xs text-slate-400 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-2xs"
        >
          <FiSearch className="h-3 w-3 text-slate-400" />
          <span className="text-slate-500 text-[11px] font-medium">Search catalog...</span>
          <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-mono text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Notification Trigger */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
            aria-label={`Admin Notifications (${countDisplay} unread)`}
            aria-expanded={notificationsOpen}
          >
            <FiBell className="h-3.5 w-3.5" />
            {countDisplay > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-mono font-bold text-white shadow-2xs">
                {countDisplay > 99 ? '99+' : countDisplay}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-24px)] origin-top-right rounded-2xl bg-white/98 p-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.08)] border border-slate-200/90 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-800 font-heading">
                    Notifications ({countDisplay})
                  </span>
                  {countDisplay > 0 && (
                    <button
                      type="button"
                      onClick={() => markAllReadMutation.mutate()}
                      disabled={markAllReadMutation.isPending}
                      className="text-xs text-amber-700 hover:underline font-semibold flex items-center gap-1"
                    >
                      <FiCheck className="h-3 w-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 my-1 custom-scrollbar">
                  {isLoadingNotifs ? (
                    <div className="p-4 text-center">
                      <Spinner size="sm" label="Loading notifications..." />
                    </div>
                  ) : notifList.length > 0 ? (
                    notifList.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.isRead && !notif.read) {
                            markReadMutation.mutate({ id: notif.id, data: { isRead: true, read: true } });
                          }
                        }}
                        className="p-2.5 hover:bg-slate-50 cursor-pointer transition-colors rounded-xl m-0.5"
                      >
                        <p className="text-xs text-slate-900 font-semibold">{notif.title || notif.message}</p>
                        {notif.description && (
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{notif.description}</p>
                        )}
                        <span className="text-[9px] text-slate-400 mt-1 block font-mono">
                          {notif.createdAt ? formatDate(notif.createdAt, { format: 'datetime' }) : ''}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-400">
                      <FiInbox className="h-5 w-5 mx-auto mb-1.5 opacity-40 text-amber-500" />
                      <p className="text-xs">No unread notifications</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-1 text-center">
                  <Link
                    to={ROUTE_PATHS.NOTIFICATIONS}
                    onClick={() => setNotificationsOpen(false)}
                    className="block rounded-xl px-3 py-1.5 text-xs text-amber-700 hover:bg-slate-50 font-bold transition-colors"
                  >
                    View All Notifications →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 p-1 pr-2.5 hover:bg-slate-100 hover:border-slate-300 focus:outline-none transition-all shadow-2xs"
            aria-label="Admin profile menu"
            aria-expanded={profileOpen}
          >
            {user ? (
              <Avatar
                name={`${user.firstName} ${user.lastName}`}
                src={user.profileImageUrl || user.avatarUrl}
                size="xs"
                className="h-6 w-6 rounded-full border border-amber-500/30"
              />
            ) : (
              <FiUser className="h-3.5 w-3.5 text-slate-700" />
            )}
            <span className="hidden text-[11px] font-bold text-slate-800 md:block max-w-[80px] truncate">
              {user ? `${user.firstName}` : 'Admin'}
            </span>
            <FiChevronDown className="h-3 w-3 text-slate-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-50 mt-2 w-56 max-w-[calc(100vw-24px)] origin-top-right rounded-2xl bg-white/98 p-2 shadow-[0_12px_36px_rgba(0,0,0,0.08)] border border-slate-200/90 backdrop-blur-xl"
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1 bg-slate-50/80 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <FiShield className="h-3.5 w-3.5 text-amber-600" />
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>

                <Link
                  to={ROUTE_PATHS.PROFILE}
                  className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <FiUser className="h-3.5 w-3.5 text-amber-600" /> My Profile
                </Link>
                <Link
                  to={ROUTE_PATHS.ADMIN_SETTINGS}
                  className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <FiSettings className="h-3.5 w-3.5 text-amber-600" /> Admin Settings
                </Link>
                <Link
                  to={ROUTE_PATHS.HOME}
                  className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <FiHome className="h-3.5 w-3.5 text-amber-600" /> Storefront
                </Link>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors mt-1 border-t border-slate-100 pt-1.5"
                >
                  <FiLogOut className="h-3.5 w-3.5 text-rose-600" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Global Quick Search Modal */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-white/98 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200/90 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FiShield className="h-3.5 w-3.5 text-amber-600" /> Admin Search
                </span>
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-3 relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, orders, customers..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </form>

              <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between px-1">
                <span>Press ENTER to view matching products</span>
                <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px]">
                  ESC to close
                </kbd>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
