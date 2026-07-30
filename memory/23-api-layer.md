# API LAYER DESIGN

## Axios Instance Architecture

```
axiosInstance (base URL, timeout, headers)
    │
    ├── Request Interceptor
    │   ├── Attach Authorization: Bearer <accessToken>
    │   └── Attach Content-Type (json / multipart)
    │
    └── Response Interceptor
        ├── Success: return response.data (unwrap)
        ├── Error 401: attempt token refresh → retry
        ├── Error 403: redirect to /403
        ├── Error 404: handled by component (show not found)
        ├── Error 422: return validation errors to form
        ├── Error 500: show generic error toast
        └── Network Error: show "Connection lost" toast
```

## axiosInstance.js Configuration

```javascript
import axios from 'axios';
import { tokenService } from '../services/tokenService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';
const TIMEOUT = 30000; // 30 seconds

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Request Interceptor

```javascript
// Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If multipart/form-data, let browser set Content-Type with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);
```

## Response Interceptor (with Refresh Token Logic)

```javascript
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response.data,  // Unwrap: .data becomes the promise result
  async (error) => {
    const originalRequest = error.config;
    
    // Don't retry refresh-token requests
    if (originalRequest.url?.includes('/api/auth/refresh-token')) {
      tokenService.clearTokens();
      window.location.href = '/auth/login';
      return Promise.reject(error);
    }
    
    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        const response = await axios.post(`${BASE_URL}/api/auth/refresh-token`, {
          refreshToken,
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        tokenService.setAccessToken(accessToken);
        tokenService.setRefreshToken(newRefreshToken);
        
        processQueue(null, accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenService.clearTokens();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      // If user is on an admin page, redirect to /403
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/403';
      }
    }
    
    // Handle 422 - Validation errors (for forms)
    if (error.response?.status === 422) {
      // Return the error data as-is for form handling
      return Promise.reject(error.response.data);
    }
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Unable to connect to server. Please check your internet connection.',
      });
    }
    
    return Promise.reject(error);
  }
);
```

## API Function Pattern

Every API file follows the same pattern:

```javascript
// api/productApi.js
import axiosInstance from './axiosInstance';

export const productApi = {
  // Public
  getAll: (params) => axiosInstance.get('/api/products', { params }),
  getBySlug: (slug) => axiosInstance.get(`/api/products/slug/${slug}`),
  getFeatured: () => axiosInstance.get('/api/products/featured'),
  getNewArrivals: () => axiosInstance.get('/api/products/new-arrivals'),
  
  // Admin
  getAllAdmin: (params) => axiosInstance.get('/api/products/admin', { params }),
  create: (data) => axiosInstance.post('/api/products/admin', data),
  update: (id, data) => axiosInstance.put(`/api/products/admin/${id}`, data),
  delete: (id) => axiosInstance.delete(`/api/products/admin/${id}`),
  toggleStatus: (id) => axiosInstance.patch(`/api/products/admin/${id}/toggle-status`),
};
```

```javascript
// api/authApi.js
import axiosInstance from './axiosInstance';

export const authApi = {
  login: (credentials) => axiosInstance.post('/api/auth/login', credentials),
  register: (data) => axiosInstance.post('/api/auth/register', data),
  refreshToken: (refreshToken) => axiosInstance.post('/api/auth/refresh-token', { refreshToken }),
  logout: (userId) => axiosInstance.post(`/api/auth/logout/${userId}`),
  verifyEmail: (token) => axiosInstance.get('/api/auth/verify-email', { params: { token } }),
  forgotPassword: (email) => axiosInstance.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => axiosInstance.post('/api/auth/reset-password', { token, password }),
};
```

```javascript
// api/orderApi.js
import axiosInstance from './axiosInstance';

export const orderApi = {
  placeOrder: (data) => axiosInstance.post('/api/orders', data),
  createRazorpayOrder: (data) => axiosInstance.post('/api/orders/razorpay', data),
  getById: (id) => axiosInstance.get(`/api/orders/${id}`),
  getByOrderNumber: (number) => axiosInstance.get(`/api/orders/number/${number}`),
  getUserOrders: (params) => axiosInstance.get('/api/orders', { params }),
  cancelOrder: (id) => axiosInstance.post(`/api/orders/${id}/cancel`),
  
  // Admin
  getAllOrders: (params) => axiosInstance.get('/api/orders/admin', { params }),
  updateStatus: (id, status) => axiosInstance.put(`/api/orders/admin/${id}/status`, null, { params: { status } }),
};
```

## Multipart Upload Pattern

```javascript
// api/uploadApi.js (helper usage within other APIs)
export const createFormData = (data, fileField) => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (key === fileField && value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  
  return formData;
};
```

Usage in API functions:
```javascript
// In userApi.js
updateProfile: (userId, data) => {
  const formData = createFormData(data, 'file');
  return axiosInstance.put(`/api/users/${userId}`, formData);
}
```

## Error Response Mapping

| Backend HTTP Status | Frontend Handling |
|---|---|
| 200-201 | Success: return unwrapped data |
| 400 (validation) | Show field-level errors in form |
| 401 (unauthorized) | Trigger token refresh or redirect to login |
| 403 (forbidden) | Redirect to /403 page |
| 404 (not found) | Show "Not Found" UI in component |
| 409 (conflict) | Show toast with conflict message |
| 413 (file too large) | Show file size error |
| 422 (business rule) | Show toast with business error message |
| 429 (rate limit) | Show "Too many requests" toast |
| 5xx (server error) | Show generic error toast + fallback UI |

## API Endpoints Constants

```javascript
// constants/apiEndpoints.js
export const API = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    LOGOUT: '/api/auth/logout',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  USERS: {
    BASE: '/api/users',
    ME: '/api/users/me',
    BY_ID: (id) => `/api/users/${id}`,
    STATUS: (id) => `/api/users/${id}/status`,
  },
  PRODUCTS: {
    BASE: '/api/products',
    BY_SLUG: (slug) => `/api/products/slug/${slug}`,
    BY_ID: (id) => `/api/products/${id}`,
    FEATURED: '/api/products/featured',
    NEW_ARRIVALS: '/api/products/new-arrivals',
    ADMIN: '/api/products/admin',
    ADMIN_BY_ID: (id) => `/api/products/admin/${id}`,
    TOGGLE_STATUS: (id) => `/api/products/admin/${id}/toggle-status`,
    VARIANTS: (productId) => `/api/products/${productId}/variants`,
    VARIANT_BY_ID: (productId, variantId) => `/api/products/${productId}/variants/${variantId}`,
    IMAGES: (productId) => `/api/products/${productId}/images`,
    IMAGE_BY_ID: (productId, imageId) => `/api/products/${productId}/images/${imageId}`,
  },
  CART: {
    BASE: '/api/cart',
    ITEMS: '/api/cart/items',
    ITEM_BY_ID: (id) => `/api/cart/items/${id}`,
  },
  ORDERS: {
    BASE: '/api/orders',
    RAZORPAY: '/api/orders/razorpay',
    BY_ID: (id) => `/api/orders/${id}`,
    BY_NUMBER: (number) => `/api/orders/number/${number}`,
    CANCEL: (id) => `/api/orders/${id}/cancel`,
    ADMIN: '/api/orders/admin',
    ADMIN_STATUS: (id) => `/api/orders/admin/${id}/status`,
  },
  // ... remaining endpoints follow same pattern
};
```
</content>

