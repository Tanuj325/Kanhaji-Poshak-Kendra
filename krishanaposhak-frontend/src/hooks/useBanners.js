import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { bannerService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getErrorMessage } from '@/utils/apiErrorParser';
import toast from 'react-hot-toast';

export function useActiveBanners() {
  return useQuery({
    queryKey: [QUERY_KEYS.ACTIVE_BANNERS],
    queryFn: () => bannerService.getActive(),
    retry: false,
  });
}

/** Admin hooks */
export function useAllBanners(params) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_BANNERS, params],
    queryFn: () => bannerService.getAll(params),
    placeholderData: keepPreviousData,
    retry: false,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => bannerService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BANNERS] });
      toast.success('Banner created successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to create banner'));
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData, data }) => bannerService.update(id, formData || data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BANNERS] });
      toast.success('Banner updated successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update banner'));
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => bannerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BANNERS] });
      toast.success('Banner deleted successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to delete banner'));
    },
  });
}

export function useToggleBannerStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => bannerService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BANNERS] });
      toast.success('Banner status updated');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to toggle banner status'));
    },
  });
}
