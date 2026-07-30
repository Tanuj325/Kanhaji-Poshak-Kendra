import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const variantService = {
  getByProduct: (productId) =>
    api.get(API_ENDPOINTS.VARIANTS.BY_PRODUCT(productId)),

  getById: (productId, variantId) =>
    api.get(API_ENDPOINTS.VARIANTS.BY_ID(productId, variantId)),

  /** Admin endpoints */
  create: (productId, data) =>
    api.post(API_ENDPOINTS.VARIANTS.BY_PRODUCT(productId), data),

  update: (productId, variantId, data) =>
    api.put(API_ENDPOINTS.VARIANTS.UPDATE(productId, variantId), data),

  delete: (productId, variantId) =>
    api.delete(API_ENDPOINTS.VARIANTS.DELETE(productId, variantId)),

  toggleStatus: (productId, variantId) =>
    api.patch(API_ENDPOINTS.VARIANTS.TOGGLE_STATUS(productId, variantId)),

  updateStock: (productId, variantId, data) =>
    api.patch(API_ENDPOINTS.VARIANTS.UPDATE_STOCK(productId, variantId), data),
};

export default variantService;
