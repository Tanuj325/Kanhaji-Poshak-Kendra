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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-white border border-slate-100 rounded-xl p-3 sm:p-4 shadow-2xs space-y-2.5 font-sans text-left transition-all hover:border-slate-200"
    >
      {/* Header: Avatar + Name + Actions */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Avatar */}
          <div className="h-8 w-8 rounded-full bg-slate-900 text-amber-200 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs border border-slate-800 font-mono">
            {userInitial}
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug truncate">
                {displayName}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                <FiCheckCircle className="h-3 w-3 text-emerald-600" /> Verified
              </span>
            </div>

            <p className="text-[10px] text-slate-400 font-mono">
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
              className="flex items-center justify-center h-7 w-7 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Edit review"
            >
              <FiEdit2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(id)}
              className="flex items-center justify-center h-7 w-7 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
              aria-label="Delete review"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Rating & Comment */}
      <div className="w-full space-y-1 min-w-0">
        <Rating rating={rating || 5} size="xs" />
        <p className="w-full max-w-none text-xs text-slate-700 leading-relaxed font-normal break-words whitespace-normal">
          "{comment}"
        </p>
      </div>

      {/* Footer: Helpful + Purchase Tag */}
      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 flex-wrap gap-2">
        <button
          type="button"
          onClick={handleHelpfulClick}
          className={`inline-flex items-center justify-center gap-1 h-7 px-2.5 rounded-lg border text-[11px] font-semibold transition-colors ${hasVotedHelpful
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
        >
          <FiThumbsUp className="h-3 w-3 shrink-0" />
          <span>Helpful {helpfulCount > 0 ? `(${helpfulCount})` : ''}</span>
        </button>

        <span className="inline-flex items-center gap-1 font-semibold text-slate-500 text-[10px]">
          <FiShoppingBag className="h-3 w-3 text-amber-700 shrink-0" /> Verified Purchase
        </span>
      </div>
    </motion.div>
  );
});

export default ReviewCard;
