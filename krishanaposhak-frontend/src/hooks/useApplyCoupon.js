import { useMutation } from '@tanstack/react-query';
import couponService from '@/services/couponService';
import toast from 'react-hot-toast';

export function useApplyCoupon() {
  return useMutation({
    mutationFn: ({ code, couponCode, orderAmount }) =>
      couponService.validate({ code, couponCode, orderAmount }),
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to apply coupon');
    },
  });
}
