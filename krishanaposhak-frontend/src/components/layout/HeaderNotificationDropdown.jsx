import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell,
  FiCheck,
  FiInbox,
  FiChevronRight,
  FiShoppingBag,
  FiCreditCard,
  FiTag,
  FiInfo,
  FiGift,
} from 'react-icons/fi';
import Spinner from '@/components/ui/Spinner';
import { formatDate } from '@/utils/formatDate';
import { ROUTE_PATHS } from '@/routes/routePaths';
import {
  useUnreadNotifications,
  useUnreadNotificationCount,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '@/hooks/useNotifications';

const getNotifIcon = (type) => {
  switch (type) {
    case 'ORDER':
      return <FiShoppingBag className="h-3.5 w-3.5 text-amber-700" />;
    case 'PAYMENT':
      return <FiCreditCard className="h-3.5 w-3.5 text-emerald-700" />;
    case 'COUPON':
      return <FiTag className="h-3.5 w-3.5 text-indigo-700" />;
    case 'PROMOTION':
      return <FiGift className="h-3.5 w-3.5 text-rose-700" />;
    case 'SYSTEM':
    default:
      return <FiInfo className="h-3.5 w-3.5 text-blue-700" />;
  }
};

const getIconBg = (type) => {
  switch (type) {
    case 'ORDER':
      return 'bg-amber-100/80 border-amber-200/60';
    case 'PAYMENT':
      return 'bg-emerald-100/80 border-emerald-200/60';
    case 'COUPON':
      return 'bg-indigo-100/80 border-indigo-200/60';
    case 'PROMOTION':
      return 'bg-rose-100/80 border-rose-200/60';
    case 'SYSTEM':
    default:
      return 'bg-blue-100/80 border-blue-200/60';
  }
};

export default function HeaderNotificationDropdown({ isOpen, onToggle, onClose, buttonClassName }) {
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

  const defaultBtnClass = isOpen
    ? 'border-[#C99A3B]/60 bg-amber-50/80 text-[#C99A3B] shadow-2xs'
    : 'border-slate-200/80 bg-slate-50/70 text-slate-700 hover:border-[#C99A3B]/50 hover:bg-amber-50/50 hover:text-[#C99A3B]';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        type="button"
        onClick={onToggle}
        className={`group relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C99A3B]/50 ${
          buttonClassName || defaultBtnClass
        }`}
        aria-label={`Notifications (${unreadCountNum} unread)`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FiBell className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105" />
        {unreadCountNum > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 font-mono text-[9px] font-bold text-white shadow-2xs ring-2 ring-white"
          >
            {unreadCountNum > 99 ? '99+' : unreadCountNum}
          </motion.span>
        )}
      </button>

      {/* Dropdown Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-2.5 w-[calc(100vw-1.5rem)] max-w-sm origin-top-right overflow-hidden rounded-2xl border border-slate-200/90 bg-white font-sans text-slate-800 shadow-[0_20px_50px_rgba(15,36,64,0.16)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-amber-50/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#0F2440]">
                  Notifications
                </span>
                {unreadCountNum > 0 && (
                  <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-600">
                    {unreadCountNum} New
                  </span>
                )}
              </div>
              {unreadCountNum > 0 && (
                <button
                  type="button"
                  onClick={() => markAllReadMutation.mutate()}
                  disabled={markAllReadMutation.isPending}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#C99A3B] transition-colors hover:text-amber-800 hover:underline disabled:opacity-50"
                >
                  <FiCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="p-6 text-center">
                  <Spinner size="sm" label="Loading notifications..." />
                </div>
              ) : notifList.length > 0 ? (
                notifList.map((notif) => {
                  const isUnread = !notif.isRead && !notif.read;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`flex cursor-pointer items-start gap-3 p-3.5 transition-colors ${
                        isUnread ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${getIconBg(notif.type)}`}>
                        {getNotifIcon(notif.type)}
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-start justify-between gap-1">
                          <p className={`text-xs leading-snug ${isUnread ? 'font-bold text-slate-950 font-heading' : 'font-semibold text-slate-800 font-sans'}`}>
                            {notif.title || notif.message}
                          </p>
                          {isUnread && (
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                          )}
                        </div>

                        {notif.title && notif.message && (
                          <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-500 font-normal">
                            {notif.message}
                          </p>
                        )}

                        <span className="block font-mono text-[9px] text-slate-400">
                          {notif.createdAt ? formatDate(notif.createdAt, { format: 'datetime' }) : ''}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="space-y-1 p-8 text-center text-slate-400">
                  <FiInbox className="mx-auto h-6 w-6 text-amber-500/70 opacity-60" />
                  <p className="text-xs font-semibold text-slate-600">No unread notifications</p>
                  <p className="text-[11px] text-slate-400">You are all caught up!</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50/60 p-1.5 text-center">
              <Link
                to={ROUTE_PATHS.NOTIFICATIONS}
                onClick={onClose}
                className="flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-[#C99A3B] transition-colors hover:bg-white hover:shadow-2xs"
              >
                Notification Center <FiChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

