import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const userService = {
  getProfile: () => api.get(API_ENDPOINTS.USERS.ME),

  getUserById: (userId) => api.get(API_ENDPOINTS.USERS.BY_ID(userId)),

  updateProfile: (userId, formData) =>
    api.put(API_ENDPOINTS.USERS.UPDATE(userId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  toggleStatus: (userId) =>
    api.patch(API_ENDPOINTS.USERS.TOGGLE_STATUS(userId)),

  deleteUser: (userId) => api.delete(API_ENDPOINTS.USERS.DELETE(userId)),

  getAllUsers: (params) => api.get(API_ENDPOINTS.USERS.LIST, { params }),
};

export default userService;
