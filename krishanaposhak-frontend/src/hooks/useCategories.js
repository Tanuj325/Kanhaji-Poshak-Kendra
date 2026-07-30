import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/apiErrorParser';

export function useCategories(params) {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, params],
    queryFn: () => categoryService.getAll(params),
    retry: false,
  });
}

export function useCategoryDropdown() {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORY_DROPDOWN],
    queryFn: () => categoryService.getDropdown(),
    retry: false,
  });
}

export function useRootCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.ROOT_CATEGORIES],
    queryFn: () => categoryService.getRoot(),
    retry: false,
  });
}

export function useSubcategories(parentId) {
  return useQuery({
    queryKey: [QUERY_KEYS.SUBCATEGORIES, parentId],
    queryFn: () => categoryService.getSubcategories(parentId),
    enabled: !!parentId,
    retry: false,
  });
}

export function useCategoryBySlug(slug) {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORY_BY_SLUG, slug],
    queryFn: () => categoryService.getBySlug(slug),
    enabled: !!slug,
    retry: false,
  });
}

export function useCategoryById(id) {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
    retry: false,
  });
}

/** Admin hooks */
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_DROPDOWN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROOT_CATEGORIES] });
      toast.success('Category created successfully');
    },
    onError: (err) => {
      const msg = getErrorMessage(err, 'Failed to create category');
      toast.error(msg);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_DROPDOWN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROOT_CATEGORIES] });
      toast.success('Category updated successfully');
    },
    onError: (err) => {
      const msg = getErrorMessage(err, 'Failed to update category');
      toast.error(msg);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_DROPDOWN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROOT_CATEGORIES] });
      toast.success('Category deleted successfully');
    },
    onError: (err) => {
      const msg = getErrorMessage(err, 'Failed to delete category');
      toast.error(msg);
    },
  });
}

export function useToggleCategoryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => categoryService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      toast.success('Category status updated');
    },
    onError: (err) => {
      const msg = getErrorMessage(err, 'Failed to toggle category status');
      toast.error(msg);
    },
  });
}
