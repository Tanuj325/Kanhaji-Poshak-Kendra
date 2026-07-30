/**
 * Decodes JWT payload without verification.
 * Used only to read claims like userId, role, email from the token.
 * Never use for server-side trust — only for frontend display/UX convenience.
 */

/**
 * Decode a JWT token payload.
 * @param {string} token
 * @returns {Object|null} decoded payload or null
 */
export function decodeJwt(token) {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    // Base64 URL-safe decode
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Extract the user ID from a JWT token.
 * @param {string} token
 * @returns {number|null}
 */
export function getUserIdFromToken(token) {
  const payload = decodeJwt(token);
  return payload?.userId ?? null;
}

/**
 * Extract the role from a JWT token.
 * @param {string} token
 * @returns {string|null}
 */
export function getRoleFromToken(token) {
  const payload = decodeJwt(token);
  return payload?.role ?? null;
}

/**
 * Extract the email from a JWT token.
 * @param {string} token
 * @returns {string|null}
 */
export function getEmailFromToken(token) {
  const payload = decodeJwt(token);
  return payload?.sub ?? null;
}

/**
 * Check if a JWT token is expired by reading its exp claim.
 * @param {string} token
 * @returns {boolean}
 */
export function isTokenExpired(token) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

/**
 * Get token expiration date.
 * @param {string} token
 * @returns {Date|null}
 */
export function getTokenExpiry(token) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return null;
  return new Date(payload.exp * 1000);
}

