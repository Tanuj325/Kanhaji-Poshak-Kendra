import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const contactService = {
  submit: (data) => api.post(API_ENDPOINTS.CONTACT.BASE, data),

  /** Admin endpoints */
  getAll: (params) => api.get(API_ENDPOINTS.CONTACT.BASE, { params }),

  getUnresolved: () => api.get(API_ENDPOINTS.CONTACT.UNRESOLVED),

  resolve: (id) => api.put(API_ENDPOINTS.CONTACT.RESOLVE(id)),

  delete: (id) => api.delete(API_ENDPOINTS.CONTACT.DELETE(id)),

  reply: (id, data) => api.post(API_ENDPOINTS.CONTACT.REPLY(id), data),
};

export default contactService;
