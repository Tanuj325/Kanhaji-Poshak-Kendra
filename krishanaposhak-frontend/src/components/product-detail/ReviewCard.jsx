import { memo, useState } from 'react';
import Rating from '@/components/ui/Rating';
import { formatDate } from '@/utils/formatDate';
import { FiCheckCircle, FiEdit2, FiTrash2, FiThumbsUp, FiShoppingBag } from 'react-icons/fi';

const ReviewCard = memo(function ReviewCard({ review, currentUserId, onEdit, onDelete }) {
  if (!review) return null;

  const { id, rating, comment, createdAt, user, userName, userId, customerName } = review;

  const [helpfulCount, setHelpfulCount] = useState(0);
  const [hasVotedHelpful, setHasVotedHelpful] = useState(false);

  const isOwner = currentUserId && (userId === currentUserId || user?.id === currentUserId);

  const displayName =
    customerName ||
    userName ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null) ||
    user?.name ||
    'Verified Customer';

  const userInitial = displayName.charAt(0).toUpperCase();

  const handleHelpfulClick = () => {
    if (!hasVotedHelpful) {
      setHelpfulCount((prev) => prev + 1);
      setHasVotedHelpful(true);
    } else {
      setHelpfulCount((prev) => Math.max(0, prev - 1));
      setHasVotedHelpful(false);
    }
  };

  return (
    <div className="w-full bg-white border border-amber-900/10 rounded-2xl p-5 sm:p-7 xl:p-8 shadow-[0_2px_12px_rgba(44,40,36,0.03)] space-y-4 font-body text-left transition-all hover:border-amber-900/20">
      {/* Top Header Row: User Avatar & Name Info (Left) | Secondary Action Buttons (Right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/10 pb-4">
        {/* User Info */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {/* Avatar circle */}
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-amber-900 text-amber-50 font-bold text-sm sm:text-base font-display flex items-center justify-center shrink-0 shadow-xs border border-amber-700/30">
            {userInitial}
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg xl:text-xl font-bold text-amber-950 leading-snug font-display">
                {displayName}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shrink-0 font-display">
                <FiCheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600" /> Verified Buyer
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-500 font-medium font-mono">
              Reviewed on {createdAt ? formatDate(createdAt, { format: 'date' }) : 'Verified Order'}
            </p>
          </div>
        </div>

        {/* Action Buttons (Helpful, Edit, Delete) - min 44px touch targets */}
        <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleHelpfulClick}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-colors font-display min-h-[44px] ${
              hasVotedHelpful
                ? 'bg-amber-900 text-amber-50 border-amber-900'
                : 'bg-amber-50/60 border-amber-900/10 text-stone-700 hover:bg-amber-100/60'
            }`}
          >
            <FiThumbsUp className="h-3.5 w-3.5 text-amber-800" />
            <span>Helpful {helpfulCount > 0 ? `(${helpfulCount})` : ''}</span>
          </button>

          {isOwner && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onEdit?.(review)}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-amber-950 bg-amber-100/60 hover:bg-amber-200/70 border border-amber-800/20 transition-colors font-display min-h-[44px]"
              >
                <FiEdit2 className="h-3.5 w-3.5 text-amber-800" /> Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete?.(id)}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors font-display min-h-[44px]"
              >
                <FiTrash2 className="h-3.5 w-3.5 text-rose-600" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rating Stars & Comment Text */}
      <div className="w-full space-y-2 min-w-0">
        <div className="pt-0.5">
          <Rating rating={rating || 5} size="sm" />
        </div>

        <p className="w-full max-w-none text-sm sm:text-base xl:text-lg text-stone-800 leading-relaxed font-normal pt-0.5 break-words whitespace-normal font-body">
          "{comment}"
        </p>
      </div>

      {/* Bottom Tag */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 pt-3 border-t border-amber-900/10 flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 font-bold text-amber-900 font-display text-xs sm:text-sm">
          <FiShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700" /> Verified Product Purchase
        </span>

        {helpfulCount > 0 && (
          <span className="font-semibold text-stone-600 text-xs font-mono">
            {helpfulCount} {helpfulCount === 1 ? 'person' : 'people'} found this helpful
          </span>
        )}
      </div>
    </div>
  );
});

export default ReviewCard;
