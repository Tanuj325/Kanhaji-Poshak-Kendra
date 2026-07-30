import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services';
import { tokenService } from '@/services/tokenService';
import { QUERY_KEYS } from '@/constants/queryKeys';
import toast from 'react-hot-toast';

const hasValidToken = () => !!tokenService.getAccessToken();

export function useCart() {
  return useQuery({
    queryKey: [QUERY_KEYS.CART],
    queryFn: async () => {
      const data = await cartService.getCart();
      return data?.data || data || { items: [], totalItems: 0, subTotal: 0, discount: 0, shippingCharge: 0, grandTotal: 0 };
    },
    enabled: hasValidToken(),
    staleTime: 10_000,
    retry: false,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => cartService.addItem(data),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData([QUERY_KEYS.CART], data);
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      toast.success('Added to cart');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to add to cart');
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartItemId, data }) => cartService.updateQuantity(cartItemId, data),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData([QUERY_KEYS.CART], data);
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update cart');
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId) => cartService.removeItem(cartItemId),
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData([QUERY_KEYS.CART], data);
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      toast.success('Removed from cart');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to remove item');
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      toast.success('Cart cleared');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to clear cart');
    },
  });
}
