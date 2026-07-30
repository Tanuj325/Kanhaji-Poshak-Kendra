/**
 * Reusable validation helper functions for frontend form validation.
 * Mirrors common backend validation patterns.
 */

/**
 * Indian phone number validation (starts with 6-9, 10 digits).
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidIndianPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone?.replace(/\s/g, ''));
}

/**
 * Password strength check (min 8 chars).
 * @param {string} password
 * @returns {boolean}
 */
export function isValidPassword(password) {
  return password?.length >= 8;
}

/**
 * Check if string is blank (empty or whitespace only).
 * @param {string} value
 * @returns {boolean}
 */
export function isBlank(value) {
  return !value || value.trim().length === 0;
}

/**
 * Check if value is within a numeric range (inclusive).
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export function isInRange(value, min, max) {
  return Number(value) >= min && Number(value) <= max;
}

/**
 * Check if a value is a valid positive integer.
 * @param {*} value
 * @returns {boolean}
 */
export function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

/**
 * Validate product rating (1-5).
 * @param {number} rating
 * @returns {boolean}
 */
export function isValidRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Check if image file is valid type and size.
 * Backend Cloudinary: accepts jpg, jpeg, png, gif, webp
 * @param {File} file
 * @param {Object} options
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file, options = {}) {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'],
  } = options;

  if (!file) return { valid: false, error: 'No file provided' };
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}` };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File too large. Maximum ${maxSizeMB}MB` };
  }
  return { valid: true };
}

