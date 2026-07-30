import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService, wishlistService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import toast from 'react-hot-toast';

export function useMoveWishlistToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ variantId, wishlistId }) => {
      await cartService.addItem({ productVariantId: variantId, quantity: 1 });
      await wishlistService.removeItem(variantId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
      toast.success('Item moved to cart');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to move item to cart');
    },
  });
}
