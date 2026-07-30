import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const reviewService = {
  getByProduct: (productId, params) =>
    api.get(API_ENDPOINTS.REVIEWS.BY_PRODUCT(productId), { params }),

  getAverageRating: (productId) =>
    api.get(API_ENDPOINTS.REVIEWS.AVERAGE_RATING(productId)),

  create: (data) => api.post(API_ENDPOINTS.REVIEWS.BASE, data),

  update: (reviewId, data) =>
    api.put(API_ENDPOINTS.REVIEWS.UPDATE(reviewId), data),

  delete: (reviewId) => api.delete(API_ENDPOINTS.REVIEWS.DELETE(reviewId)),
};

export default reviewService;
