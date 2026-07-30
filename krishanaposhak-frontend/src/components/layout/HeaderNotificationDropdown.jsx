import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck, FiInbox } from 'react-icons/fi';
import Spinner from '@/components/ui/Spinner';
import { formatDate } from '@/utils/formatDate';
import { ROUTE_PATHS } from '@/routes/routePaths';
import {
  useUnreadNotifications,
  useUnreadNotificationCount,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '@/hooks/useNotifications';

export default function HeaderNotificationDropdown({ isOpen, onToggle, onClose }) {
  const dropdownRef = useRef(null);

  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data: unreadNotifications = [], isLoading } = useUnreadNotifications();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const markReadMutation = useMarkNotificationRead();

  const unreadCountNum = typeof unreadCount === 'number' ? unreadCount : unreadCount?.data ?? 0;
  const notifList = Array.isArray(unreadNotifications)
    ? unreadNotifications
    : unreadNotifications?.content || unreadNotifications?.data || [];

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

  const handleNotificationClick = (notif) => {
    if (!notif.isRead && !notif.read) {
      markReadMutation.mutate({ id: notif.id, data: { isRead: true, read: true } });
    }
  };

  return (
    <div className="relative font-display" ref={dropdownRef}>
      <button
        type="button"
        onClick={onToggle}
        className="relative flex items-center justify-center h-9 w-9 rounded-full text-slate-300 hover:text-amber-300 hover:bg-white/10 transition-all focus:outline-none"
        aria-label={`Notifications (${unreadCountNum} unread)`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FiBell className="h-[18px] w-[18px]" />
        {unreadCountNum > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-0.5 text-[9px] font-bold text-white font-mono shadow-sm"
          >
            {unreadCountNum > 99 ? '99+' : unreadCountNum}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-3 w-80 max-w-[calc(100vw-24px)] origin-top-right rounded-2xl bg-[#0B1728]/98 backdrop-blur-2xl border border-amber-400/30 shadow-2xl overflow-hidden font-display"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#081427]">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Notifications
                </span>
                {unreadCountNum > 0 && (
                  <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[9px] font-bold text-rose-300 font-mono border border-rose-500/30">
                    {unreadCountNum} New
                  </span>
                )}
              </div>
              {unreadCountNum > 0 && (
                <button
                  type="button"
                  onClick={() => markAllReadMutation.mutate()}
                  disabled={markAllReadMutation.isPending}
                  className="text-[10px] font-bold text-amber-300 hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  <FiCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
              {isLoading ? (
                <div className="p-6 text-center">
                  <Spinner size="sm" label="Loading notifications..." />
                </div>
              ) : notifList.length > 0 ? (
                notifList.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className="p-3.5 hover:bg-amber-400/10 cursor-pointer transition-colors space-y-1"
                  >
                    <p className="text-xs text-white font-bold line-clamp-1">
                      {notif.title || notif.message}
                    </p>
                    {notif.description && (
                      <p className="text-[11px] text-slate-300 line-clamp-2 font-light">
                        {notif.description}
                      </p>
                    )}
                    <span className="text-[9px] text-slate-400 block font-mono">
                      {notif.createdAt ? formatDate(notif.createdAt, { format: 'datetime' }) : ''}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-1">
                  <FiInbox className="h-6 w-6 mx-auto opacity-50 text-amber-400" />
                  <p className="text-xs font-semibold">No new notifications</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 bg-[#081427]">
              <Link
                to={ROUTE_PATHS.NOTIFICATIONS}
                onClick={onClose}
                className="block text-center px-4 py-2.5 text-[11px] font-bold text-amber-300 hover:bg-white/5 transition-colors"
              >
                View Notification Center →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
