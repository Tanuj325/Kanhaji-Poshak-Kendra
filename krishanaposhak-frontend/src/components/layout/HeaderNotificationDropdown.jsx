import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck, FiInbox, FiChevronDown } from 'react-icons/fi';
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
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={onToggle}
        className={`group relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-slate-200 bg-white text-dark-charcoal transition-all duration-200 hover:border-temple-gold/60 hover:bg-temple-gold/10 hover:text-temple-gold-dark hover:shadow-[0_6px_18px_rgba(201,154,59,0.18)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-temple-gold/60 ${
          isOpen ? 'border-temple-gold/60 bg-temple-gold/10 text-temple-gold-dark' : ''
        }`}
        aria-label={`Notifications (${unreadCountNum} unread)`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FiBell className="h-5 w-5" />
        {unreadCountNum > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold font-mono text-white shadow-sm animate-badge-pop"
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
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-3 w-[min(21rem,calc(100vw-1rem))] max-w-[calc(100vw-24px)] origin-top-right overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,36,64,0.18)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-warm-cream/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-deep-navy">
                  Notifications
                </span>
                {unreadCountNum > 0 && (
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold text-rose-600 font-mono border border-rose-500/30">
                    {unreadCountNum} New
                  </span>
                )}
              </div>
              {unreadCountNum > 0 && (
                <button
                  type="button"
                  onClick={() => markAllReadMutation.mutate()}
                  disabled={markAllReadMutation.isPending}
                  className="flex items-center gap-1 text-[10px] font-bold text-temple-gold-dark hover:underline disabled:opacity-50"
                >
                  <FiCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
              {isLoading ? (
                <div className="p-6 text-center">
                  <Spinner size="sm" label="Loading notifications..." />
                </div>
              ) : notifList.length > 0 ? (
                notifList.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className="cursor-pointer space-y-1 p-3.5 transition-colors hover:bg-temple-gold/5"
                  >
                    <p className="text-xs text-dark-charcoal font-bold line-clamp-1">
                      {notif.title || notif.message}
                    </p>
                    {notif.description && (
                      <p className="text-[11px] text-natural-wood line-clamp-2 font-light">
                        {notif.description}
                      </p>
                    )}
                    <span className="text-[9px] text-natural-wood block font-mono">
                      {notif.createdAt ? formatDate(notif.createdAt, { format: 'datetime' }) : ''}
                    </span>
                  </div>
                ))
              ) : (
                <div className="space-y-1 p-8 text-center text-natural-wood">
                  <FiInbox className="h-6 w-6 mx-auto opacity-50 text-temple-gold" />
                  <p className="text-xs font-semibold">No new notifications</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-warm-cream/20">
              <Link
                to={ROUTE_PATHS.NOTIFICATIONS}
                onClick={onClose}
                className="flex items-center justify-center gap-1 px-4 py-2.5 text-[11px] font-bold text-temple-gold-dark hover:bg-warm-cream/60 transition-colors"
              >
                View Notification Center <FiChevronDown className="h-3.5 w-3.5 -rotate-90" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

