import { memo } from 'react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { FiBell, FiTrash2, FiCheck } from 'react-icons/fi';

const NotificationItem = memo(function NotificationItem({ notification, onMarkRead, onDelete }) {
  const isRead = notification.isRead ?? notification.read ?? false;

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4.5 rounded-3xl transition-all duration-200 border relative overflow-hidden font-display',
        isRead
          ? 'bg-white border-amber-900/10'
          : 'bg-gradient-to-r from-amber-50/70 via-white to-amber-100/30 border-amber-500/30 shadow-xs ring-1 ring-amber-400/20'
      )}
      role="listitem"
      aria-label={notification.title || notification.message}
    >
      {!isRead && (
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-600" />
      )}

      <div
        className={cn(
          'shrink-0 p-2.5 rounded-2xl transition-colors',
          isRead ? 'bg-stone-100 text-stone-500' : 'bg-amber-900 text-amber-200 shadow-xs'
        )}
      >
        <FiBell className="h-4.5 w-4.5" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm leading-snug font-heading',
            isRead ? 'text-stone-700 font-semibold' : 'font-extrabold text-amber-950'
          )}
        >
          {notification.title || notification.message}
        </p>
        {notification.description && (
          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed font-body">{notification.description}</p>
        )}
        <p className="text-[11px] text-stone-400 mt-1.5 font-mono">
          {notification.createdAt ? formatDate(notification.createdAt, { format: 'datetime' }) : ''}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-center">
        {!isRead && onMarkRead && (
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 transition-colors min-h-[44px]"
            aria-label="Mark as read"
          >
            <FiCheck className="h-3.5 w-3.5 text-amber-900" /> Read
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(notification.id)}
            className="p-2 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
