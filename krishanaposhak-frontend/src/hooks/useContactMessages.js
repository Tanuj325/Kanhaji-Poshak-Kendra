import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import contactService from '@/services/contactService';
import { QUERY_KEYS } from '@/constants/queryKeys';
import toast from 'react-hot-toast';

const CONTACT_KEYS = {
  ALL: 'contact-messages-all',
  UNRESOLVED: 'contact-messages-unresolved',
};

export function useContactMessages() {
  return useQuery({
    queryKey: [CONTACT_KEYS.ALL],
    queryFn: () => contactService.getAll(),
    staleTime: 30_000,
  });
}

export function useUnresolvedMessages() {
  return useQuery({
    queryKey: [CONTACT_KEYS.UNRESOLVED],
    queryFn: () => contactService.getUnresolved(),
    staleTime: 30_000,
  });
}

export function useResolveMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => contactService.resolve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACT_KEYS.ALL] });
      queryClient.invalidateQueries({ queryKey: [CONTACT_KEYS.UNRESOLVED] });
      toast.success('Message resolved');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to resolve message');
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACT_KEYS.ALL] });
      queryClient.invalidateQueries({ queryKey: [CONTACT_KEYS.UNRESOLVED] });
      toast.success('Message deleted');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete message');
    },
  });
}

export function useReplyToMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reply }) => contactService.reply(id, { reply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACT_KEYS.ALL] });
      queryClient.invalidateQueries({ queryKey: [CONTACT_KEYS.UNRESOLVED] });
      toast.success('Reply sent successfully');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to send reply');
    },
  });
}

