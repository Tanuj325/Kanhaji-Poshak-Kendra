import { useQuery, useQueryClient } from '@tanstack/react-query';
import analyticsService from '@/services/analyticsService';

const ANALYTICS_KEYS = {
  TOP_SELLING: 'analytics-top-selling',
  TOP_RATED: 'analytics-top-rated',
  MOST_REVIEWED: 'analytics-most-reviewed',
  MOST_WISHLISTED: 'analytics-most-wishlisted',
  LOW_STOCK: 'analytics-low-stock',
  OUT_OF_STOCK: 'analytics-out-of-stock',
  TOP_CATEGORIES: 'analytics-top-categories',
  SALES_DAILY: 'analytics-sales-daily',
  SALES_WEEKLY: 'analytics-sales-weekly',
  SALES_MONTHLY: 'analytics-sales-monthly',
  SALES_YEARLY: 'analytics-sales-yearly',
  SALES_CUSTOM: 'analytics-sales-custom',
  CUSTOMER_OVERVIEW: 'analytics-customer-overview',
  NEW_CUSTOMERS: 'analytics-new-customers',
  REPEAT_CUSTOMERS: 'analytics-repeat-customers',
  INACTIVE_CUSTOMERS: 'analytics-inactive-customers',
  RECENT_CUSTOMERS: 'analytics-recent-customers',
  TOP_SPENDERS: 'analytics-top-spenders',
  ACTIVITY: 'analytics-activity',
};

export function useTopSellingProducts(limit = 10) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.TOP_SELLING, limit],
    queryFn: () => analyticsService.getTopSellingProducts({ limit }),
    staleTime: 60_000,
  });
}

export function useTopRatedProducts(limit = 10) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.TOP_RATED, limit],
    queryFn: () => analyticsService.getTopRatedProducts({ limit }),
    staleTime: 60_000,
  });
}

export function useMostReviewedProducts(limit = 10) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.MOST_REVIEWED, limit],
    queryFn: () => analyticsService.getMostReviewedProducts({ limit }),
    staleTime: 60_000,
  });
}

export function useMostWishlistedProducts(limit = 10) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.MOST_WISHLISTED, limit],
    queryFn: () => analyticsService.getMostWishlistedProducts({ limit }),
    staleTime: 60_000,
  });
}

export function useLowStockProducts(threshold = 10) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.LOW_STOCK, threshold],
    queryFn: () => analyticsService.getLowStockProducts({ threshold }),
    staleTime: 60_000,
  });
}

export function useOutOfStockProducts() {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.OUT_OF_STOCK],
    queryFn: () => analyticsService.getOutOfStockProducts(),
    staleTime: 60_000,
  });
}

export function useTopSellingCategories(limit = 10) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.TOP_CATEGORIES, limit],
    queryFn: () => analyticsService.getTopSellingCategories({ limit }),
    staleTime: 60_000,
  });
}

export function useDailySales() {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.SALES_DAILY],
    queryFn: () => analyticsService.getDailySales(),
    staleTime: 60_000,
  });
}

export function useWeeklySales() {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.SALES_WEEKLY],
    queryFn: () => analyticsService.getWeeklySales(),
    staleTime: 60_000,
  });
}

export function useMonthlySales() {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.SALES_MONTHLY],
    queryFn: () => analyticsService.getMonthlySales(),
    staleTime: 60_000,
  });
}

export function useYearlySales() {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.SALES_YEARLY],
    queryFn: () => analyticsService.getYearlySales(),
    staleTime: 60_000,
  });
}

export function useCustomSales(startDate, endDate) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.SALES_CUSTOM, startDate, endDate],
    queryFn: () => analyticsService.getCustomSales({ startDate, endDate }),
    enabled: !!startDate && !!endDate,
    staleTime: 60_000,
  });
}

export function useCustomerOverview() {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.CUSTOMER_OVERVIEW],
    queryFn: () => analyticsService.getCustomerOverview(),
    staleTime: 60_000,
  });
}

export function useNewCustomers(params = {}) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.NEW_CUSTOMERS, params],
    queryFn: () => analyticsService.getNewCustomers(params),
    staleTime: 60_000,
  });
}

export function useRepeatCustomers(params = {}) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.REPEAT_CUSTOMERS, params],
    queryFn: () => analyticsService.getRepeatCustomers(params),
    staleTime: 60_000,
  });
}

export function useInactiveCustomers(params = {}) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.INACTIVE_CUSTOMERS, params],
    queryFn: () => analyticsService.getInactiveCustomers(params),
    staleTime: 60_000,
  });
}

export function useRecentCustomers(params = {}) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.RECENT_CUSTOMERS, params],
    queryFn: () => analyticsService.getRecentUsers(params),
    staleTime: 60_000,
  });
}

export function useTopSpenders(params = {}) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.TOP_SPENDERS, params],
    queryFn: () => analyticsService.getTopSpenders(params),
    staleTime: 60_000,
  });
}

export function useRecentActivity(params = {}) {
  return useQuery({
    queryKey: [ANALYTICS_KEYS.ACTIVITY, params],
    queryFn: () => analyticsService.getRecentActivity(params),
    staleTime: 30_000,
  });
}

export function useRefreshAnalytics() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.TOP_SELLING] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.TOP_RATED] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.MOST_REVIEWED] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.MOST_WISHLISTED] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.LOW_STOCK] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.OUT_OF_STOCK] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.TOP_CATEGORIES] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.SALES_DAILY] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.SALES_WEEKLY] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.SALES_MONTHLY] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.SALES_YEARLY] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.SALES_CUSTOM] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.CUSTOMER_OVERVIEW] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.NEW_CUSTOMERS] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.REPEAT_CUSTOMERS] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.INACTIVE_CUSTOMERS] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.RECENT_CUSTOMERS] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.TOP_SPENDERS] });
    queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEYS.ACTIVITY] });
  };
}

export function useSalesData(range) {
  const daily = useDailySales();
  const weekly = useWeeklySales();
  const monthly = useMonthlySales();
  const yearly = useYearlySales();

  const queries = { daily, weekly, monthly, yearly };
  const current = queries[range] || daily;

  return {
    data: current.data || [],
    isLoading: current.isLoading,
    error: current.error,
    refetch: current.refetch,
  };
}
