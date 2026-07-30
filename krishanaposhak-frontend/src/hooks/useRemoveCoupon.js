import { useMutation } from '@tanstack/react-query';
import couponService from '@/services/couponService';
import toast from 'react-hot-toast';

export function useRemoveCoupon() {
  return useMutation({
    mutationFn: () => Promise.resolve(),
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to remove coupon');
    },
  });
}
