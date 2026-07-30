import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const addressService = {
  getAll: () => api.get(API_ENDPOINTS.ADDRESSES.BASE),

  getById: (addressId) => api.get(API_ENDPOINTS.ADDRESSES.BY_ID(addressId)),

  create: (data) => api.post(API_ENDPOINTS.ADDRESSES.BASE, data),

  update: (addressId, data) =>
    api.put(API_ENDPOINTS.ADDRESSES.UPDATE(addressId), data),

  delete: (addressId) => api.delete(API_ENDPOINTS.ADDRESSES.DELETE(addressId)),

  setDefault: (addressId) =>
    api.put(API_ENDPOINTS.ADDRESSES.SET_DEFAULT(addressId)),
};

export default addressService;
