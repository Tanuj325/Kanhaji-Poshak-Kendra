/**
 * Parses backend error responses into a consistent frontend format.
 * Backend uses:
 * - ErrorResponse: { timestamp, status, error, message, path }
 * - ValidationErrorResponse: { timestamp, status, error, validationErrors, path }
 */

/**
 * Extract a human-readable error message from an API error.
 * @param {Error} error - Axios error object
 * @param {string} fallback - Fallback message
 * @returns {string}
 */
export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (!error?.response) {
    if (error?.code === 'ERR_CANCELED') return 'Request was cancelled';
    if (error?.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
    if (!navigator.onLine) return 'No internet connection. Please check your network.';
    return fallback;
  }

  const { data, status } = error.response;

  const statusMessages = {
    400: 'Invalid request. Please check your input.',
    401: 'Authentication required. Please log in.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'Cannot complete action due to a conflict (e.g., existing orders or dependencies).',
    422: 'Validation failed. Please check your input.',
    429: 'Too many requests. Please slow down.',
    500: 'Server error. Please try again later.',
    503: 'Service unavailable. Please try again later.',
  };

  const rawMessage = data?.message || data?.error;
  if (rawMessage && typeof rawMessage === 'string') {
    // Intercept and sanitize any raw technical leak strings (SQL, Exception, Hibernate, StackTrace, file paths)
    const isTechnicalLeak = /SQL|Hibernate|Exception|Constraint|NullPointer|Jdbc|Column|Table|SyntaxError|StackTrace|C:\\|\/var\/www|Cloudinary|SMTP/i.test(rawMessage);
    if (!isTechnicalLeak) {
      return rawMessage;
    }
  }

  return statusMessages[status] || fallback;
}

/**
 * Extract validation errors from a 422 response.
 * @param {Error} error - Axios error object
 * @returns {Object|null} - { field: message } or null
 */
export function getValidationErrors(error) {
  if (!error?.response?.data?.validationErrors) return null;
  return error.response.data.validationErrors;
}

/**
 * Extract HTTP status code from error.
 * @param {Error} error
 * @returns {number|null}
 */
export function getStatusCode(error) {
  return error?.response?.status ?? null;
}

/**
 * Check if error is a specific HTTP status.
 * @param {Error} error
 * @param {number} status
 * @returns {boolean}
 */
export function isStatus(error, status) {
  return getStatusCode(error) === status;
}

/**
 * Get the original server error response data.
 * @param {Error} error
 * @returns {Object|null}
 */
export function getErrorResponse(error) {
  return error?.response?.data ?? null;
}

