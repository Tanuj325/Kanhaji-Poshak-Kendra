import { useMutation } from '@tanstack/react-query';
import { orderService } from '@/services';

export function usePlaceRazorpayOrder() {
  return useMutation({
    mutationFn: (data) => orderService.createRazorpayOrder(data),
  });
}
