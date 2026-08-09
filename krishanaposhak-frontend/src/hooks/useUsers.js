import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getErrorMessage } from '@/utils/apiErrorParser';
import toast from 'react-hot-toast';

export function useAllUsers() {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_USERS],
    queryFn: () => userService.getAllUsers(),
    staleTime: 30_000,
  });
}

export function useUser(userId) {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE, userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => userService.toggleStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      toast.success('User status updated');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update user status'));
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USERS] });
      toast.success('User deleted');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to delete user'));
    },
  });
}

