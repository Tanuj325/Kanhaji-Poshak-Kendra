import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const orderService = {
  placeOrder: (data) => api.post(API_ENDPOINTS.ORDERS.BASE, data),

  createRazorpayOrder: (data) =>
    api.post(API_ENDPOINTS.ORDERS.RAZORPAY, data),

  getById: (orderId) => api.get(API_ENDPOINTS.ORDERS.BY_ID(orderId)),

  getByNumber: (orderNumber) =>
    api.get(API_ENDPOINTS.ORDERS.BY_NUMBER(orderNumber)),

  getUserOrders: (params) => api.get(API_ENDPOINTS.ORDERS.BASE, { params }),

  cancelOrder: (orderId) =>
    api.post(API_ENDPOINTS.ORDERS.CANCEL(orderId)),

  /** Admin endpoints */
  getAllOrders: (params) =>
    api.get(API_ENDPOINTS.ORDERS.ADMIN_LIST, { params }),

updateStatus: (orderId, status) =>
    api.put(API_ENDPOINTS.ORDERS.ADMIN_UPDATE_STATUS(orderId), null, { params: { status } }),
};

export default orderService;
