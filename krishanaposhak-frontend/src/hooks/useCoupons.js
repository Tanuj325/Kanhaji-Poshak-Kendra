import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import couponService from '@/services/couponService';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getErrorMessage } from '@/utils/apiErrorParser';
import toast from 'react-hot-toast';

/** Admin: paginated list with code search, active/expired filters, sort */
export function useAllCoupons(params) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_COUPONS, params],
    queryFn: () => couponService.getAll(params),
    placeholderData: keepPreviousData,
    retry: false,
  });
}

/** Admin: single coupon by ID */
export function useCoupon(id) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_COUPONS, id],
    queryFn: () => couponService.getById(id),
    enabled: !!id,
    retry: false,
  });
}

/** Admin: create a new coupon */
export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => couponService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_COUPONS] });
      toast.success('Coupon created successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to create coupon'));
    },
  });
}

/** Admin: update an existing coupon */
export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => couponService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_COUPONS] });
      toast.success('Coupon updated successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update coupon'));
    },
  });
}

/** Admin: delete a coupon */
export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => couponService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_COUPONS] });
      toast.success('Coupon deleted successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to delete coupon'));
    },
  });
}

/** Admin: toggle coupon active/inactive status */
export function useToggleCouponStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => couponService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_COUPONS] });
      toast.success('Coupon status updated');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to toggle coupon status'));
    },
  });
}

/** Customer: fetch active coupons for coupon suggestions in cart */
export function useActiveCoupons() {
  return useQuery({
    queryKey: [QUERY_KEYS.COUPONS_ACTIVE],
    queryFn: async () => {
      const res = await couponService.getActive();
      return Array.isArray(res) ? res : res?.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
