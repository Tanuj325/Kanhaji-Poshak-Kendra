import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services';
import { tokenService } from '@/services/tokenService';
import { QUERY_KEYS } from '@/constants/queryKeys';
import toast from 'react-hot-toast';

const hasValidAccessToken = () => !!tokenService.getAccessToken();

export function useNotifications(params = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, params],
    queryFn: () => notificationService.getAll(params),
    enabled: hasValidAccessToken(),
    staleTime: 15_000,
    retry: false,
  });
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD],
    queryFn: () => notificationService.getUnread(),
    enabled: hasValidAccessToken(),
    staleTime: 15_000,
    refetchInterval: () => (hasValidAccessToken() ? 30_000 : false),
    retry: false,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: hasValidAccessToken(),
    staleTime: 15_000,
    refetchInterval: () => (hasValidAccessToken() ? 30_000 : false),
    retry: false,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => notificationService.markAsRead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update notification');
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT] });
      toast.success('All notifications marked as read');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to mark all as read');
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_UNREAD_COUNT] });
      toast.success('Notification deleted');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete notification');
    },
  });
}
