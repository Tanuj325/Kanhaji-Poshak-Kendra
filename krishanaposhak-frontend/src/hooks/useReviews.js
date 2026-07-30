import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import toast from 'react-hot-toast';

export function useProductReviews(productId, params) {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, productId, params],
    queryFn: () => reviewService.getByProduct(productId, params),
    enabled: !!productId,
  });
}

export function useAverageRating(productId) {
  return useQuery({
    queryKey: [QUERY_KEYS.AVERAGE_RATING, productId],
    queryFn: () => reviewService.getAverageRating(productId),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => reviewService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVERAGE_RATING] });
      toast.success('Review submitted successfully');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, data }) => reviewService.update(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVERAGE_RATING] });
      toast.success('Review updated successfully');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update review');
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId) => reviewService.delete(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AVERAGE_RATING] });
      toast.success('Review deleted successfully');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete review');
    },
  });
}
