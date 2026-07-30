import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const paymentService = {
  createRazorpayOrder: (orderId) =>
    api.post(API_ENDPOINTS.PAYMENTS.RAZORPAY_ORDER(orderId)),

  initiate: (data) => api.post(API_ENDPOINTS.PAYMENTS.INITIATE, data),

  verifyRazorpay: (params) =>
    api.post(API_ENDPOINTS.PAYMENTS.VERIFY_RAZORPAY, null, { params }),

  verifyRazorpayPayment: (params) =>
    api.post(API_ENDPOINTS.PAYMENTS.VERIFY_RAZORPAY, null, { params }),

  getByOrderId: (orderId) =>
    api.get(API_ENDPOINTS.PAYMENTS.BY_ORDER(orderId)),

  getById: (paymentId) => api.get(API_ENDPOINTS.PAYMENTS.BY_ID(paymentId)),

  updateStatus: (paymentId, data) =>
    api.put(API_ENDPOINTS.PAYMENTS.UPDATE(paymentId), data),
};

export default paymentService;
