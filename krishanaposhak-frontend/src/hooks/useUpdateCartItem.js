import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartItemId, quantity }) =>
      cartService.updateCartItem(cartItemId, { quantity }),
    onMutate: async ({ cartItemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.CART] });
      const previousCart = queryClient.getQueryData([QUERY_KEYS.CART]);
      if (previousCart) {
        queryClient.setQueryData([QUERY_KEYS.CART], (old) => ({
          ...old,
          items: old.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        }));
      }
      return { previousCart };
    },
    onError: (err, vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData([QUERY_KEYS.CART], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
  });
}
