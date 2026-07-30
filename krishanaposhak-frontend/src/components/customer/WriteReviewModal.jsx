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
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        <div className="flex items-center gap-4 border-b border-muted-sand/15 pb-4">
          <img
            src={product.imageUrl || '/placeholder.svg'}
            alt={product.productName}
            className="h-14 w-14 rounded-lg object-cover bg-warm-cream flex-shrink-0"
          />
          <div>
            <h4 className="font-display font-bold text-dark-charcoal text-sm">{product.productName}</h4>
            {product.size && <p className="text-xs text-natural-wood">Size: {product.size}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-dark-charcoal mb-2">Overall Rating *</label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transition-transform hover:scale-125"
              >
                <FiStar
                  className={`h-7 w-7 ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-muted-sand/40'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-bold text-dark-charcoal">
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
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-muted-sand/15">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={createReview.isPending}>
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
}
