import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const bannerService = {
  getActive: () => api.get(API_ENDPOINTS.BANNERS.ACTIVE),

  /** Admin endpoints */
  getAll: (params) => api.get(API_ENDPOINTS.BANNERS.ALL, { params }),

  create: (formData) =>
    api.post(API_ENDPOINTS.BANNERS.BASE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, formData) =>
    api.put(API_ENDPOINTS.BANNERS.UPDATE(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) => api.delete(API_ENDPOINTS.BANNERS.DELETE(id)),

  toggleStatus: (id) => api.patch(API_ENDPOINTS.BANNERS.TOGGLE_STATUS(id)),
};

export default bannerService;
