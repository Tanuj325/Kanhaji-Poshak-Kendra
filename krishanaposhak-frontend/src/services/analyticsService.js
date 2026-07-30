import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const analyticsService = {
  getTopSellingProducts: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.PRODUCTS_TOP_SELLING, { params }),

  getTopRatedProducts: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.PRODUCTS_TOP_RATED, { params }),

  getMostReviewedProducts: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.PRODUCTS_MOST_REVIEWED, { params }),

  getMostWishlistedProducts: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.PRODUCTS_MOST_WISHLISTED, { params }),

  getLowStockProducts: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.PRODUCTS_LOW_STOCK, { params }),

  getOutOfStockProducts: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.PRODUCTS_OUT_OF_STOCK, { params }),

  getTopSellingCategories: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.CATEGORIES_TOP_SELLING, { params }),

  getDailySales: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.SALES_DAILY, { params }),

  getWeeklySales: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.SALES_WEEKLY, { params }),

  getMonthlySales: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.SALES_MONTHLY, { params }),

  getYearlySales: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.SALES_YEARLY, { params }),

  getCustomSales: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.SALES_CUSTOM, { params }),

  getCustomerOverview: () =>
    api.get(API_ENDPOINTS.ANALYTICS.CUSTOMERS_OVERVIEW),

  getNewCustomers: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.CUSTOMERS_NEW, { params }),

  getRepeatCustomers: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.CUSTOMERS_REPEAT, { params }),

  getInactiveCustomers: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.CUSTOMERS_INACTIVE, { params }),

  getRecentUsers: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.CUSTOMERS_RECENT, { params }),

  getTopSpenders: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.CUSTOMERS_TOP_SPENDERS, { params }),

  getRecentActivity: (params) =>
    api.get(API_ENDPOINTS.ANALYTICS.ACTIVITY, { params }),
};

export default analyticsService;
