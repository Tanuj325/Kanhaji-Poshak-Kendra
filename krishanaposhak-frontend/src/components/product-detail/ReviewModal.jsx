import { useState, useEffect } from 'react';
import Modal from '@/components/overlay/Modal';
import Button from '@/components/ui/Button';
import Textarea from '@/components/forms/Textarea';
import { FiStar } from 'react-icons/fi';

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
    if (!comment.trim()) return;
    onSubmit({ rating, comment: comment.trim() });
  };

  const activeStar = hoveredRating || rating;

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
