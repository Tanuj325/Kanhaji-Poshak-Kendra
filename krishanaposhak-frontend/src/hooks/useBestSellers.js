import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productService } from '@/services';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function useBestSellers() {
  return useQuery({
    queryKey: [QUERY_KEYS.BEST_SELLERS],
    queryFn: () => productService.getAll({ sort: 'createdAt,desc', size: 8, active: true }),
    placeholderData: keepPreviousData,
    retry: false,
  });
}
