import { memo } from 'react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import {
  FiBell,
  FiTrash2,
  FiCheck,
  FiShoppingBag,
  FiCreditCard,
  FiTag,
  FiInfo,
  FiGift,
  FiClock,
} from 'react-icons/fi';

const getNotifTypeIcon = (type) => {
  switch (type) {
    case 'ORDER':
      return <FiShoppingBag className="h-4 w-4 text-amber-700" />;
    case 'PAYMENT':
      return <FiCreditCard className="h-4 w-4 text-emerald-700" />;
    case 'COUPON':
      return <FiTag className="h-4 w-4 text-indigo-700" />;
    case 'PROMOTION':
      return <FiGift className="h-4 w-4 text-rose-700" />;
    case 'SYSTEM':
    default:
      return <FiInfo className="h-4 w-4 text-blue-700" />;
  }
};

const getNotifIconBg = (type, isRead) => {
  if (isRead) {
    return 'bg-slate-100 border-slate-200 text-slate-500';
  }
  switch (type) {
    case 'ORDER':
      return 'bg-amber-100/90 border-amber-300/80 shadow-2xs';
    case 'PAYMENT':
      return 'bg-emerald-100/90 border-emerald-300/80 shadow-2xs';
    case 'COUPON':
      return 'bg-indigo-100/90 border-indigo-300/80 shadow-2xs';
    case 'PROMOTION':
      return 'bg-rose-100/90 border-rose-300/80 shadow-2xs';
    case 'SYSTEM':
    default:
      return 'bg-blue-100/90 border-blue-300/80 shadow-2xs';
  }
};

const NotificationItem = memo(function NotificationItem({ notification, onMarkRead, onDelete }) {
  const isRead = notification.isRead ?? notification.read ?? false;

  return (
    <div
      className={cn(
        'group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border font-sans overflow-hidden',
        isRead
          ? 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
          : 'bg-gradient-to-r from-amber-50/70 via-white to-amber-50/20 border-amber-300/70 shadow-2xs ring-1 ring-amber-400/20'
      )}
      role="listitem"
      aria-label={notification.title || notification.message}
    >
      {/* Unread Left Bar Indicator */}
      {!isRead && (
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-600 rounded-r-full" />
      )}

      {/* Left Icon & Body */}
      <div className="flex items-start gap-3 min-w-0 flex-1 w-full sm:w-auto">
        <div
          className={cn(
            'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors',
            getNotifIconBg(notification.type, isRead)
          )}
        >
          {getNotifTypeIcon(notification.type)}
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className={cn(
                'text-sm leading-snug font-heading',
                isRead ? 'font-semibold text-slate-800' : 'font-extrabold text-slate-950'
              )}
            >
              {notification.title || notification.message}
            </p>
            {notification.type && (
              <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                {notification.type}
              </span>
            )}
          </div>

          {notification.title && notification.message && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
              {notification.message}
            </p>
          )}

          <div className="flex items-center gap-1.5 pt-0.5">
            <FiClock className="h-3 w-3 text-slate-400" />
            <span className="text-[11px] text-slate-400 font-mono">
              {notification.createdAt ? formatDate(notification.createdAt, { format: 'datetime' }) : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
        {!isRead && onMarkRead && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead(notification.id);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300/80 transition-colors min-h-[36px] sm:min-h-[40px]"
            aria-label="Mark as read"
          >
            <FiCheck className="h-3.5 w-3.5 text-amber-900" /> Read
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center"
            aria-label="Delete notification"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
});

export default NotificationItem;
