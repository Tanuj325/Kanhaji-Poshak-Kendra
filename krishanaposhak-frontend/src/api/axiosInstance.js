import axios from 'axios';
import { tokenService } from '../services/tokenService';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090').replace(/\/+$/, '') + '/api';
const TIMEOUT = 30000;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];
let refreshSubscribers = [];

function processQueue(error, token = null) {
  refreshSubscribers.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  refreshSubscribers = [];
  failedQueue = [];
}

// Custom event for auth-expired notification
function emitAuthExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:expired'));
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshingNow = false;

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Don't retry refresh-token requests — clear tokens and emit expired
    if (
      originalRequest.url?.includes('/auth/refresh-token')
    ) {
      tokenService.clearTokens();
      emitAuthExpired();
      return Promise.reject(error);
    }

    // Handle 401 — token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Already refreshing — queue this request
      if (isRefreshingNow) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshingNow = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const baseApiUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090').replace(/\/+$/, '');
        const refreshUrl = `${baseApiUrl}/api/auth/refresh-token`;
        const response = await axios.post(refreshUrl, { refreshToken });

        const data = response.data;
        const newAccessToken = data.accessToken || data.access_token;
        const newRefreshToken = data.refreshToken || data.refresh_token;

        if (!newAccessToken) {
          throw new Error('Refresh response missing access token');
        }

        tokenService.setAccessToken(newAccessToken);
        if (newRefreshToken) {
          tokenService.setRefreshToken(newRefreshToken, tokenService.isRememberMe());
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenService.clearTokens();
        emitAuthExpired();
        return Promise.reject(refreshError);
      } finally {
        isRefreshingNow = false;
      }
    }

    // Handle 403 — Forbidden (admin pages redirect to /403)
    if (error.response?.status === 403) {
      return Promise.reject(error);
    }

    // Handle 422 — Validation errors (for forms)
    if (error.response?.status === 422) {
      return Promise.reject(error.response.data);
    }

    // Handle 409 — Duplicate / Conflict
    if (error.response?.status === 409) {
      return Promise.reject(error.response.data);
    }

    // Network error / no response
    if (!error.response) {
      return Promise.reject({
        message: 'Unable to connect to server. Please check your internet connection.',
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
