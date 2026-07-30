import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const wishlistService = {
  getWishlist: () => api.get(API_ENDPOINTS.WISHLIST.BASE),

  addItem: (data) => api.post(API_ENDPOINTS.WISHLIST.BASE, data),

  removeItem: (productVariantId) =>
    api.delete(API_ENDPOINTS.WISHLIST.REMOVE_ITEM(productVariantId)),

  checkItem: (productVariantId) =>
    api.get(API_ENDPOINTS.WISHLIST.CHECK_ITEM(productVariantId)),
};

export default wishlistService;
