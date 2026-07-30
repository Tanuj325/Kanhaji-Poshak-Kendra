import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const productService = {
  getAll: (params) => api.get(API_ENDPOINTS.PRODUCTS.BASE, { params }),

  getById: (id) => api.get(API_ENDPOINTS.PRODUCTS.BY_ID(id)),

  getBySlug: (slug) => api.get(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug)),

  getFeatured: () => api.get(API_ENDPOINTS.PRODUCTS.FEATURED),

  getNewArrivals: () => api.get(API_ENDPOINTS.PRODUCTS.NEW_ARRIVALS),

  /** Admin endpoints */
  getAllAdmin: (params) => api.get(API_ENDPOINTS.PRODUCTS.ADMIN_LIST, { params }),

  create: (data) => api.post(API_ENDPOINTS.PRODUCTS.ADMIN_LIST, data),

  update: (id, data) => api.put(API_ENDPOINTS.PRODUCTS.ADMIN_UPDATE(id), data),

  delete: (id) => api.delete(API_ENDPOINTS.PRODUCTS.ADMIN_DELETE(id)),

  toggleStatus: (id) =>
    api.patch(API_ENDPOINTS.PRODUCTS.ADMIN_TOGGLE_STATUS(id)),
};

export default productService;
