import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contactService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getErrorMessage } from '@/utils/apiErrorParser';
import toast from 'react-hot-toast';

export function useSubmitContact() {
  return useMutation({
    mutationFn: (data) => contactService.submit(data),
    onSuccess: () => {
      toast.success('Your message has been sent successfully! Our team will get back to you shortly.');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || 'Failed to send message. Please try again.');
    },
  });
}

/** Admin hooks */
export function useAllContactMessages(params) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_MESSAGES, params],
    queryFn: () => contactService.getAll(params),
  });
}

export function useUnresolvedContactMessages() {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_MESSAGES_UNRESOLVED],
    queryFn: () => contactService.getUnresolved(),
  });
}

export function useResolveContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => contactService.resolve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_MESSAGES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_MESSAGES_UNRESOLVED] });
      toast.success('Message marked as resolved');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_MESSAGES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_MESSAGES_UNRESOLVED] });
      toast.success('Message deleted');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}

export function useReplyContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reply }) => contactService.reply(id, { reply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_MESSAGES] });
      toast.success('Reply sent successfully');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}
