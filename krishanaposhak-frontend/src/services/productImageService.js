import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const productImageService = {
  getByProduct: (productId) =>
    api.get(API_ENDPOINTS.IMAGES.BY_PRODUCT(productId)),

  add: (productId, data) =>
    api.post(API_ENDPOINTS.IMAGES.BY_PRODUCT(productId), data),

  update: (productId, imageId, data) =>
    api.put(API_ENDPOINTS.IMAGES.UPDATE(productId, imageId), data),

  delete: (productId, imageId) =>
    api.delete(API_ENDPOINTS.IMAGES.DELETE(productId, imageId)),

  setThumbnail: (productId, imageId) =>
    api.post(API_ENDPOINTS.IMAGES.SET_THUMBNAIL(productId, imageId)),
};

export default productImageService;