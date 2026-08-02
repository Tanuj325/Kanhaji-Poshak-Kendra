import { memo } from 'react';
import { cn } from '@/utils/cn';
import Avatar from '@/components/ui/Avatar';
import Rating from '@/components/ui/Rating';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDate } from '@/utils/formatDate';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const ReviewCard = memo(function ReviewCard({
  review,
  currentUserId,
  onEdit,
  onDelete,
  className,
}) {
  if (!review) return null;

  const {
    id,
    customerName,
    rating,
    comment,
    createdAt,
    userId,
    user,
  } = review;

  const displayName = customerName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Customer');
  const isOwner = currentUserId && (userId === currentUserId || user?.id === currentUserId);

  return (
    <Card variant="default" padding="md" className={cn('border border-muted-sand/20 bg-white/90', className)}>
      <div className="flex items-start gap-3">
        <Avatar
          src={user?.profileImageUrl}
          name={displayName}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-dark-charcoal truncate">
                {displayName}
              </span>
            </div>
            <span className="text-xs text-natural-wood flex-shrink-0">
              {createdAt ? formatDate(createdAt, { format: 'datetime' }) : ''}
            </span>
          </div>

          <Rating rating={rating} size="sm" className="mt-1" />

          {comment && (
            <p className="mt-2 text-sm text-dark-charcoal leading-relaxed whitespace-pre-line">
              {comment}
            </p>
          )}

          {isOwner && (
            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-muted-sand/10">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(review)}
                  className="flex min-h-[44px] items-center gap-1 rounded-full px-2 text-xs font-medium text-royal-blue hover:bg-royal-blue/5"
                >
                  <FiEdit2 className="h-3 w-3" /> Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(id)}
                  className="flex min-h-[44px] items-center gap-1 rounded-full px-2 text-xs font-medium text-error hover:bg-error/5"
                >
                  <FiTrash2 className="h-3 w-3" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});

export default ReviewCard;
