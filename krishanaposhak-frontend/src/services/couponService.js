import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const couponService = {
  getAll: (params) => api.get(API_ENDPOINTS.COUPONS.BASE, { params }),

  getActive: () => api.get(API_ENDPOINTS.COUPONS.ACTIVE),

  getById: (id) => api.get(API_ENDPOINTS.COUPONS.BY_ID(id)),

  getByCode: (code) => api.get(API_ENDPOINTS.COUPONS.BY_CODE(code)),

  create: (data) => api.post(API_ENDPOINTS.COUPONS.CREATE, data),

  update: (id, data) => api.put(API_ENDPOINTS.COUPONS.UPDATE(id), data),

  validate: ({ code, couponCode, orderAmount }) =>
    api.post(
      `${API_ENDPOINTS.COUPONS.VALIDATE}?orderAmount=${encodeURIComponent(orderAmount || 0)}`,
      { couponCode: couponCode || code },
    ),

  delete: (id) => api.delete(API_ENDPOINTS.COUPONS.DELETE(id)),

  toggleStatus: (id) => api.patch(API_ENDPOINTS.COUPONS.TOGGLE_STATUS(id)),
};

export default couponService;
