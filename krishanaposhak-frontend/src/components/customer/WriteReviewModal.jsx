import { useState } from 'react';
import Modal from '@/components/overlay/Modal';
import Button from '@/components/ui/Button';
import Textarea from '@/components/forms/Textarea';
import { useCreateReview } from '@/hooks/useReviews';
import { FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function WriteReviewModal({ isOpen, onClose, product }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const createReview = useCreateReview();

  if (!product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter your review feedback');
      return;
    }

    try {
      await createReview.mutateAsync({
        productId: product.productId || product.id,
        rating,
        comment: comment.trim(),
      });
      onClose();
      setComment('');
      setRating(5);
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Write Review for ${product.productName || 'Product'}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2 font-display">
        <div className="flex items-center gap-4 border-b border-amber-900/10 pb-4">
          <img
            src={product.imageUrl || '/placeholder.svg'}
            alt={product.productName}
            className="h-14 w-14 rounded-xl object-cover bg-amber-50 shrink-0 border border-amber-900/10"
          />
          <div>
            <h4 className="font-heading font-extrabold text-amber-950 text-sm">{product.productName}</h4>
            {product.size && <p className="text-xs text-stone-500 font-body">Size: {product.size}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-amber-950 mb-2 font-heading">Overall Rating *</label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transition-transform hover:scale-125 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <FiStar
                  className={`h-6 w-6 ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-stone-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-bold text-amber-950 font-mono">
              {rating} / 5 Stars
            </span>
          </div>
        </div>

        <Textarea
          label="Your Detailed Experience *"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you love about this Krishna Poshak attire? (Fabric, fit, stitching, design...)"
          rows={4}
          className="rounded-xl"
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-amber-900/10">
          <Button variant="outline" type="button" onClick={onClose} className="rounded-xl border-amber-900/20 font-bold min-h-[40px]">
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={createReview.isPending} className="rounded-xl bg-amber-900 text-white font-bold min-h-[40px]">
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
}
