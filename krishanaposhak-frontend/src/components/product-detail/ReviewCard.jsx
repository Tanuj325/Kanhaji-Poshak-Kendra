import { memo, useState } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white border border-amber-900/10 rounded-2xl p-4 sm:p-6 xl:p-7 shadow-[0_2px_12px_rgba(44,40,36,0.03)] space-y-3.5 font-body text-left transition-all hover:border-amber-900/20"
    >
      {/* Header: Avatar + Name + Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar */}
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-amber-900 text-amber-50 font-bold text-sm font-display flex items-center justify-center shrink-0 shadow-xs border border-amber-700/30">
            {userInitial}
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-amber-950 leading-snug font-display truncate">
                {displayName}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 shrink-0 font-display">
                <FiCheckCircle className="h-3 w-3 text-emerald-600" /> Verified
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-stone-500 font-medium font-mono">
              {createdAt ? formatDate(createdAt, { format: 'date' }) : 'Verified Order'}
            </p>
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onEdit?.(review)}
              className="flex items-center justify-center h-10 w-10 sm:h-9 sm:w-9 rounded-lg text-amber-800 hover:bg-amber-100/60 transition-colors min-h-[44px] min-w-[44px]"
              aria-label="Edit review"
            >
              <FiEdit2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(id)}
              className="flex items-center justify-center h-10 w-10 sm:h-9 sm:w-9 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors min-h-[44px] min-w-[44px]"
              aria-label="Delete review"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Rating & Comment */}
      <div className="w-full space-y-2 min-w-0">
        <Rating rating={rating || 5} size="xs" />
        <p className="w-full max-w-none text-xs sm:text-base text-stone-800 leading-relaxed font-normal break-words whitespace-normal font-body">
          "{comment}"
        </p>
      </div>

      {/* Footer: Helpful + Purchase Tag */}
      <div className="flex items-center justify-between text-xs pt-3 border-t border-amber-900/10 flex-wrap gap-2">
        <button
          type="button"
          onClick={handleHelpfulClick}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors font-display min-h-[44px] ${
            hasVotedHelpful
              ? 'bg-amber-900 text-amber-50 border-amber-900'
              : 'bg-amber-50/60 border-amber-900/10 text-stone-700 hover:bg-amber-100/60'
          }`}
        >
          <FiThumbsUp className="h-3.5 w-3.5 shrink-0" />
          <span>Helpful {helpfulCount > 0 ? `(${helpfulCount})` : ''}</span>
        </button>

        <span className="inline-flex items-center gap-1 font-bold text-amber-900 font-display text-[10px] sm:text-[11px]">
          <FiShoppingBag className="h-3 w-3 text-amber-700 shrink-0" /> Verified Purchase
        </span>
      </div>
    </motion.div>
  );
});

export default ReviewCard;
