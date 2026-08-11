import api from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

/**
 * Authentication service matching backend AuthController exactly.
 * All endpoints are public (no JWT required).
 */
const authService = {
  register: (data) =>
    api.post(API_ENDPOINTS.AUTH.REGISTER, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      gender: data.gender || null,
      dateOfBirth: data.dateOfBirth || null,
    }),

  login: (email, password) =>
    api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password }),

  refreshToken: (refreshToken) =>
    api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken }),

  logout: (userId) =>
    api.post(API_ENDPOINTS.AUTH.LOGOUT(userId)),

  verifyEmail: (token) =>
    api.get(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      params: { token },
    }),

  resendVerification: (email) =>
    api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, null, { params: { email } }),

  forgotPassword: (email) =>
    api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

  resetPassword: (token, password) =>
    api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password }),
};

export default authService;
