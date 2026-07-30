import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import toast from 'react-hot-toast';

export function useAddresses() {
  return useQuery({
    queryKey: [QUERY_KEYS.ADDRESSES],
    queryFn: () => addressService.getAll(),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => addressService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADDRESSES] });
      toast.success('Address added successfully');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to add address');
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, data }) => addressService.update(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADDRESSES] });
      toast.success('Address updated successfully');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update address');
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId) => addressService.delete(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADDRESSES] });
      toast.success('Address deleted');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete address');
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId) => addressService.setDefault(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADDRESSES] });
      toast.success('Default address updated');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to set default address');
    },
  });
}

