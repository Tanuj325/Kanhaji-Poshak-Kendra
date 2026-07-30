import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const cartService = {
  getCart: () => api.get(API_ENDPOINTS.CART.BASE),

  addItem: (data) => api.post(API_ENDPOINTS.CART.ITEMS, data),

  updateQuantity: (cartItemId, data) =>
    api.put(API_ENDPOINTS.CART.UPDATE_ITEM(cartItemId), data),

  removeItem: (cartItemId) =>
    api.delete(API_ENDPOINTS.CART.REMOVE_ITEM(cartItemId)),

  clearCart: () => api.delete(API_ENDPOINTS.CART.BASE),
};

export default cartService;
