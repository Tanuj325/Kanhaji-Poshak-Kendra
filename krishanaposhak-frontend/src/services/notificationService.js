import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const notificationService = {
  getAll: (params) => api.get(API_ENDPOINTS.NOTIFICATIONS.BASE, { params }),

  getUnread: () => api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD),

  getUnreadCount: () => api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT),

  markAsRead: (notificationId, data) =>
    api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId), data),

  markAllAsRead: () =>
    api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ),

  delete: (notificationId) =>
    api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationId)),
};

export default notificationService;
