import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const paymentService = {
  createRazorpayOrder: (orderId) =>
    api.post(API_ENDPOINTS.PAYMENTS.RAZORPAY_ORDER(orderId)),

  initiate: (data) => api.post(API_ENDPOINTS.PAYMENTS.INITIATE, data),

  verifyRazorpay: (data) =>
    api.post(API_ENDPOINTS.PAYMENTS.VERIFY_RAZORPAY, data),

  verifyRazorpayPayment: (data) =>
    api.post(API_ENDPOINTS.PAYMENTS.VERIFY_RAZORPAY, data),

  getByOrderId: (orderId) =>
    api.get(API_ENDPOINTS.PAYMENTS.BY_ORDER(orderId)),

  getById: (paymentId) => api.get(API_ENDPOINTS.PAYMENTS.BY_ID(paymentId)),

  updateStatus: (paymentId, data) =>
    api.put(API_ENDPOINTS.PAYMENTS.UPDATE(paymentId), data),

  getRecoveryStatus: () => api.get(API_ENDPOINTS.PAYMENTS.RECOVERY),

  getAdminMonitoringData: (params) =>
    api.get(API_ENDPOINTS.PAYMENTS.ADMIN_MONITORING, { params }),

  triggerReconciliation: () =>
    api.post(API_ENDPOINTS.PAYMENTS.ADMIN_RECONCILE),

  triggerRefundRetry: () =>
    api.post(API_ENDPOINTS.PAYMENTS.ADMIN_RETRY_REFUNDS),

  triggerCleanup: () =>
    api.post(API_ENDPOINTS.PAYMENTS.ADMIN_CLEANUP),
};

export default paymentService;
