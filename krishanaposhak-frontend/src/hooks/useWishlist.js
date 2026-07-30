import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@/services';
import { tokenService } from '@/services/tokenService';
import { QUERY_KEYS } from '@/constants/queryKeys';
import toast from 'react-hot-toast';

const hasValidToken = () => !!tokenService.getAccessToken();

export function useWishlist() {
  return useQuery({
    queryKey: [QUERY_KEYS.WISHLIST],
    queryFn: async () => {
      const data = await wishlistService.getWishlist();
      return Array.isArray(data) ? data : data?.data || data?.items || [];
    },
    enabled: hasValidToken(),
    staleTime: 10_000,
    retry: false,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => wishlistService.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
      toast.success('Added to wishlist');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to add to wishlist');
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productVariantId) => wishlistService.removeItem(productVariantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
      toast.success('Removed from wishlist');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to remove from wishlist');
    },
  });
}

export function useCheckWishlist(productVariantId) {
  return useQuery({
    queryKey: [QUERY_KEYS.WISHLIST_CHECK, productVariantId],
    queryFn: () => wishlistService.checkItem(productVariantId),
    enabled: hasValidToken() && !!productVariantId,
    retry: false,
  });
}
