/**
 * Role-checking helpers for UI conditional rendering.
 * NOTE: Never use these for security. Backend enforces all authorization.
 */

export const Roles = Object.freeze({
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
});

/**
 * Check if a role is ADMIN.
 * @param {string} role
 * @returns {boolean}
 */
export function isAdmin(role) {
  return role === Roles.ADMIN;
}

/**
 * Check if a role is CUSTOMER.
 * @param {string} role
 * @returns {boolean}
 */
export function isCustomer(role) {
  return role === Roles.CUSTOMER;
}

/**
 * Check if a user has access to a specific area.
 * @param {string} userRole
 * @param {'admin'|'customer'} requiredArea
 * @returns {boolean}
 */
export function hasAccess(userRole, requiredArea) {
  if (requiredArea === 'admin') return isAdmin(userRole);
  if (requiredArea === 'customer') return !!userRole;
  return false;
}

/**
 * Check if a user can manage a specific resource (ADMIN or owner).
 * @param {string} userRole
 * @param {number} ownerId
 * @param {number} currentUserId
 * @returns {boolean}
 */
export function canManage(userRole, ownerId, currentUserId) {
  return isAdmin(userRole) || ownerId === currentUserId;
}/**
 * Check if user has role provided.
 * @param {string} userRole - role string
 * @param {string} requiredRole - one of Role values
 * @returns {boolean}
 */
export function hasRole(userRole, requiredRole) {
  return userRole === requiredRole;
}

