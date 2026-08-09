import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const categoryService = {
  getAll: (params) => api.get(API_ENDPOINTS.CATEGORIES.BASE, { params }),

  getDropdown: () => api.get(API_ENDPOINTS.CATEGORIES.DROPDOWN),

  getRoot: () => api.get(API_ENDPOINTS.CATEGORIES.ROOT),

  getSubcategories: (parentId) =>
    api.get(API_ENDPOINTS.CATEGORIES.SUBCATEGORIES(parentId)),

  getById: (id) => api.get(API_ENDPOINTS.CATEGORIES.BY_ID(id)),

  getBySlug: (slug) => api.get(API_ENDPOINTS.CATEGORIES.BY_SLUG(slug)),

  /** Admin endpoints */
  create: (formData) =>
    api.post(API_ENDPOINTS.CATEGORIES.BASE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, formData) =>
    api.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) => api.delete(API_ENDPOINTS.CATEGORIES.DELETE(id)),

  toggleStatus: (id) =>
    api.patch(API_ENDPOINTS.CATEGORIES.TOGGLE_STATUS(id)),
};

export default categoryService;
