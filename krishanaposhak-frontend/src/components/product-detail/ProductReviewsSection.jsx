import { useMemo, useState, lazy, Suspense } from 'react';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import ReviewSummary from './ReviewSummary';
import ReviewFilterChips from './ReviewFilterChips';
import ReviewCard from './ReviewCard';

const ReviewModal = lazy(() => import('./ReviewModal'));
import { useAuth } from '@/context/AuthContext';
import {
  useProductReviews,
  useAverageRating,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from '@/hooks/useReviews';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { FiMessageSquare, FiEdit3 } from 'react-icons/fi';

export default function ProductReviewsSection({ productId, productAverageRating = 0 }) {
  const { user, isAuthenticated } = useAuth();

  const { data: reviewsData, isLoading: isLoadingReviews, refetch } = useProductReviews(productId, { page: 0, size: 50 });
  const { data: avgRatingData } = useAverageRating(productId);

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [selectedStarFilter, setSelectedStarFilter] = useState('ALL');

  const reviewsList = useMemo(() => {
    return Array.isArray(reviewsData)
      ? reviewsData
      : reviewsData?.content || reviewsData?.data || [];
  }, [reviewsData]);

  const avgRating = typeof avgRatingData === 'number'
    ? avgRatingData
    : (avgRatingData?.data ?? productAverageRating ?? 0);

  const openCreateModal = () => {
    if (!isAuthenticated) {
      toast.error('Please login to write a customer review');
      return;
    }
    setEditingReview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rev) => {
    setEditingReview(rev);
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async (data) => {
    try {
      if (editingReview) {
        await updateReview.mutateAsync({
          reviewId: editingReview.id,
          data: { productId, ...data },
        });
        toast.success('Review updated successfully!');
      } else {
        await createReview.mutateAsync({
          productId,
          ...data,
        });
        toast.success('Review submitted successfully!');
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview.mutateAsync(reviewId);
        toast.success('Review deleted');
        refetch();
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    }
  };

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [reviewsList]);

  const totalReviews = reviewsList.length;

  const filteredReviews = useMemo(() => {
    if (selectedStarFilter === 'ALL') return reviewsList;
    const targetStar = Number(selectedStarFilter);
    return reviewsList.filter((r) => Math.round(r.rating || 5) === targetStar);
  }, [reviewsList, selectedStarFilter]);

  return (
    <section className="w-full font-display space-y-3.5 sm:space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <h2 className="text-sm sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-heading">
            <FiMessageSquare className="h-4 w-4 text-[#C99A3B]" />
            <span>Customer Reviews</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium font-body">
            Real experiences & verified ratings ({totalReviews})
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl bg-[#C99A3B] hover:bg-[#B3832B] text-white font-bold text-[11px] shrink-0 shadow-2xs transition-all active:scale-95"
        >
          <FiEdit3 className="h-3.5 w-3.5" />
          <span>Write Review</span>
        </button>
      </div>

      {/* Summary Card */}
      <ReviewSummary
        avgRating={avgRating}
        totalReviews={totalReviews}
        ratingCounts={ratingCounts}
      />

      {/* Filter Chips */}
      {totalReviews > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Filter by Rating
            </h3>
            {selectedStarFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSelectedStarFilter('ALL')}
                className="text-[11px] font-semibold text-[#C99A3B] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <ReviewFilterChips
            selectedStarFilter={selectedStarFilter}
            onSelectFilter={setSelectedStarFilter}
            totalReviews={totalReviews}
            ratingCounts={ratingCounts}
          />
        </div>
      )}

      {/* Review Cards */}
      {isLoadingReviews ? (
        <div className="py-8 text-center">
          <Spinner label="Loading reviews..." />
        </div>
      ) : filteredReviews.length === 0 ? (
        <EmptyState
          title={selectedStarFilter !== 'ALL' ? `No ${selectedStarFilter}-star reviews found` : 'No reviews yet'}
          message={
            selectedStarFilter !== 'ALL'
              ? 'Try selecting a different rating filter or view all customer reviews.'
              : 'Be the first devotee to share your thoughts on this sacred poshak!'
          }
          action={
            <Button variant="primary" size="sm" onClick={openCreateModal} className="rounded-xl bg-[#C99A3B] text-white">
              Write Review
            </Button>
          }
        />
      ) : (
        <div className="w-full space-y-2.5 sm:space-y-3 pt-1">
          {filteredReviews.map((rev) => (
            <ReviewCard
              key={rev.id}
              review={rev}
              currentUserId={user?.id}
              onEdit={openEditModal}
              onDelete={handleDeleteReview}
            />
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Suspense fallback={null}>
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleReviewSubmit}
          editingReview={editingReview}
          isLoading={createReview.isPending || updateReview.isPending}
        />
      </Suspense>
    </section>
  );
}
