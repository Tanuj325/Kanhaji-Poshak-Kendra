import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import toast from 'react-hot-toast';

export function useOrders(params) {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, params],
    queryFn: () => orderService.getUserOrders(params),
  });
}

export function useOrder(orderId) {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDER, orderId],
    queryFn: () => orderService.getById(orderId),
    enabled: !!orderId,
  });
}

export function useOrderByNumber(orderNumber) {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDER_BY_NUMBER, orderNumber],
    queryFn: () => orderService.getByNumber(orderNumber),
    enabled: !!orderNumber,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => orderService.placeOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      toast.success('Order placed successfully');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => orderService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      toast.success('Order cancelled');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to cancel order');
    },
  });
}

/** Admin hooks */
export function useAllOrders(params) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_ORDERS, params],
    queryFn: () => orderService.getAllOrders(params),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }) => orderService.updateStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_ORDERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      toast.success('Order status updated');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    },
  });
}

