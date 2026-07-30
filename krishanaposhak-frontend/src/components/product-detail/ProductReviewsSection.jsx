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
    <section className="w-full mt-12 sm:mt-16 xl:mt-20 font-display space-y-8 xl:space-y-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-900/10">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-amber-950 tracking-tight flex items-center gap-3 font-heading">
            <FiMessageSquare className="h-6 w-6 sm:h-7 sm:w-7 text-amber-800" />
            <span>Devotee & Customer Reviews</span>
          </h2>
          <p className="text-xs sm:text-sm xl:text-base text-stone-600 font-medium font-body">
            Real customer experiences & verified ratings ({totalReviews})
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={openCreateModal}
          leftIcon={<FiEdit3 className="h-5 w-5 text-amber-200" />}
          className="rounded-2xl bg-amber-900 hover:bg-amber-950 text-amber-50 font-bold py-3.5 px-6 text-sm sm:text-base shrink-0 shadow-md border border-amber-500/20 self-start sm:self-auto min-h-[44px]"
        >
          Write a Review
        </Button>
      </div>

      {/* Summary Card (3 Column Grid) */}
      <ReviewSummary
        avgRating={avgRating}
        totalReviews={totalReviews}
        ratingCounts={ratingCounts}
      />

      {/* Filter Chips (Scrollable Pills) */}
      {totalReviews > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-950">
              Filter by Rating
            </h3>
            {selectedStarFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSelectedStarFilter('ALL')}
                className="text-xs sm:text-sm font-bold text-amber-800 hover:underline"
              >
                Clear Filter
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

      {/* Full Width Review Cards List */}
      {isLoadingReviews ? (
        <div className="py-16 text-center">
          <Spinner label="Loading customer reviews..." />
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
            <Button variant="primary" size="md" onClick={openCreateModal} className="rounded-2xl bg-amber-900 text-white min-h-[44px]">
              Write Review
            </Button>
          }
        />
      ) : (
        <div className="w-full space-y-4 sm:space-y-5 pt-2">
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

      {/* Review Submission Modal */}
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
