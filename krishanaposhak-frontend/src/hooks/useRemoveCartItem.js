import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId) => cartService.removeCartItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
  });
}
