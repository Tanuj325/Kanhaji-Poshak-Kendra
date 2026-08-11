import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Modal from '@/components/overlay/Modal';
import Button from '@/components/ui/Button';
import Textarea from '@/components/forms/Textarea';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { reviewSchema } from '@/validators/reviewSchemas';
import { FiStar, FiX, FiCheckCircle } from 'react-icons/fi';

const RATING_LABELS = {
  5: '✨ Divine Quality & Craftsmanship',
  4: '👍 Very Good Experience',
  3: '👌 Average Experience',
  2: '👎 Needs Improvement',
  1: '❌ Disappointed',
};

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  editingReview,
  isLoading = false,
}) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating || 5);
      setComment(editingReview.comment || '');
    } else {
      setRating(5);
      setComment('');
    }
  }, [editingReview, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { rating, comment: comment.trim() };
    const result = reviewSchema.safeParse(payload);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Please check your input';
      toast.error(firstError);
      return;
    }
    onSubmit(payload);
  };

  const activeStar = hoveredRating || rating;

  // ══════════════════════════════════════════════════════════════
  // MOBILE & TABLET BOTTOM SHEET VIEW (<1024px)
  // ══════════════════════════════════════════════════════════════
  if (!isDesktop) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 z-[75] bg-white rounded-t-[24px] p-4 sm:p-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] max-w-[767px] mx-auto overflow-y-auto max-h-[90vh] font-sans antialiased text-slate-800"
            >
              {/* Pull handle */}
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-3" />

              {/* Sheet Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {editingReview ? 'Edit Your Review' : 'Write a Customer Review'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Share your experience with Lord Krishna's sacred poshak
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-all min-h-[32px] min-w-[32px]"
                  aria-label="Close review modal"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Selector */}
                <div className="space-y-2 text-center p-4 rounded-2xl bg-gradient-to-b from-amber-50/70 to-stone-50/40 border border-amber-200/60">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    Overall Rating
                  </label>

                  <div className="flex items-center justify-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 hover:scale-125 active:scale-90 transition-transform focus:outline-none min-h-[40px] min-w-[40px] flex items-center justify-center"
                        aria-label={`Rate ${star} stars out of 5`}
                      >
                        <FiStar
                          className={`h-7 w-7 transition-colors ${
                            star <= activeStar
                              ? 'fill-amber-400 text-amber-500 shadow-2xs'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <p className="text-xs font-semibold text-amber-900 min-h-[1.25rem]">
                    {RATING_LABELS[activeStar]}
                  </p>
                </div>

                {/* Comment Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Your Feedback & Review <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your honest experience regarding fabric quality, stitching, embroidery, and delivery..."
                    rows={4}
                    required
                    className="w-full rounded-[14px] border border-slate-200 p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C99A3B]/40 focus:border-[#C99A3B] transition-all resize-none"
                  />
                  <div className="flex justify-end text-[10px] text-slate-400">
                    <span>{comment.length} characters</span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-[48px] px-4 rounded-[14px] border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all min-h-[48px]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || !comment.trim()}
                    className="h-[48px] flex-1 rounded-[14px] bg-gradient-to-r from-[#D4AF37] via-[#C99A3B] to-[#B3832B] text-white font-bold text-xs shadow-md shadow-[#C99A3B]/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                  >
                    <FiCheckCircle className="h-4 w-4" />
                    <span>{editingReview ? 'Update Review' : 'Submit Review'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // DESKTOP VIEW (>=1024px - 100% UNTOUCHED ORIGINAL MODAL)
  // ══════════════════════════════════════════════════════════════
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingReview ? 'Edit Your Review' : 'Write a Customer Review'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2 font-display">
        {/* Rating Selector */}
        <div className="space-y-3 text-center p-5 rounded-2xl bg-gradient-to-b from-amber-50/60 to-stone-50/40 border border-amber-900/10">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-950">
            Overall Rating
          </label>

          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 hover:scale-125 active:scale-95 transition-transform focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`Rate ${star} stars out of 5`}
              >
                <FiStar
                  className={`h-7 w-7 sm:h-8 sm:w-8 transition-colors ${
                    star <= activeStar
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-stone-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <p className="text-xs font-bold text-amber-900 min-h-[1.25rem]">
            {RATING_LABELS[activeStar]}
          </p>
        </div>

        {/* Comment Input */}
        <Textarea
          label="Your Feedback & Review *"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your honest experience regarding the fabric quality, stitching, vibrant colors, and delivery..."
          rows={4}
          required
          className="rounded-xl"
        />

        {/* Actions */}
        <div className="flex flex-col-reverse items-stretch gap-3 pt-4 border-t border-amber-900/10 sm:flex-row sm:items-center sm:justify-end">
          <Button variant="outline" onClick={onClose} type="button" className="rounded-xl min-h-[44px]">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isLoading}
            className="rounded-xl bg-gradient-to-r from-amber-900 to-stone-900 text-white font-bold min-h-[44px]"
          >
            {editingReview ? 'Update Review' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

