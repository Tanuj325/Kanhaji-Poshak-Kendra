import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { productService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';
import toast from 'react-hot-toast';

export function useProducts(params) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, params],
    queryFn: () => productService.getAll(params),
    placeholderData: keepPreviousData,
    retry: false,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
    retry: false,
  });
}

export function useProductBySlug(slug) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_BY_SLUG, slug],
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
    retry: false,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: [QUERY_KEYS.FEATURED_PRODUCTS],
    queryFn: () => productService.getFeatured(),
    retry: false,
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: [QUERY_KEYS.NEW_ARRIVALS],
    queryFn: () => productService.getNewArrivals(),
    retry: false,
  });
}

/** Admin hooks */
export function useAdminProducts(params) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PRODUCTS, params],
    queryFn: () => productService.getAllAdmin(params),
    retry: false,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PRODUCTS] });
      toast.success('Product created successfully');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PRODUCTS] });
      toast.success('Product updated successfully');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PRODUCTS] });
      toast.success('Product deleted successfully');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete product');
    },
  });
}
