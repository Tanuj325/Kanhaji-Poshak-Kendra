import { memo } from 'react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';
import { FiBell, FiTrash2, FiCheck } from 'react-icons/fi';

const NotificationItem = memo(function NotificationItem({ notification, onMarkRead, onDelete }) {
  const isRead = notification.isRead ?? notification.read ?? false;

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4.5 rounded-2xl transition-all duration-300 border relative overflow-hidden',
        isRead
          ? 'bg-white/80 border-muted-sand/20'
          : 'bg-gradient-to-r from-warm-cream/40 via-white to-temple-gold/5 border-temple-gold/40 shadow-sm ring-1 ring-temple-gold/20'
      )}
      role="listitem"
      aria-label={notification.title || notification.message}
    >
      {!isRead && (
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-temple-gold to-amber-500" />
      )}

      <div
        className={cn(
          'flex-shrink-0 p-2.5 rounded-xl transition-colors',
          isRead ? 'bg-muted-sand/15 text-natural-wood' : 'bg-temple-gold/15 text-temple-gold border border-temple-gold/30'
        )}
      >
        <FiBell className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm leading-snug',
            isRead ? 'text-dark-charcoal/80 font-normal' : 'font-bold text-dark-charcoal'
          )}
        >
          {notification.title || notification.message}
        </p>
        {notification.description && (
          <p className="text-xs text-natural-wood/90 mt-1 line-clamp-2 leading-relaxed">{notification.description}</p>
        )}
        <p className="text-[11px] text-natural-wood/60 mt-1.5 font-medium">
          {notification.createdAt ? formatDate(notification.createdAt, { format: 'datetime' }) : ''}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 self-center">
        {!isRead && onMarkRead && (
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            className="inline-flex items-center gap-1 text-xs font-bold text-temple-gold hover:text-amber-600 bg-temple-gold/10 hover:bg-temple-gold/20 px-2.5 py-1.5 rounded-xl border border-temple-gold/30 transition-colors"
            aria-label="Mark as read"
          >
            <FiCheck className="h-3.5 w-3.5" /> Read
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(notification.id)}
            className="p-2 text-natural-wood/60 hover:text-error hover:bg-error/10 rounded-xl transition-colors"
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
