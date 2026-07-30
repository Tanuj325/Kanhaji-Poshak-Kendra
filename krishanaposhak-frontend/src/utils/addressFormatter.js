/**
 * Format address object into display strings.
 * Backend Address entity fields: fullName, phoneNumber, addressLine1,
 * addressLine2, city, state, country, postalCode
 */

/**
 * Format a full address as a single-line string.
 * @param {Object} address
 * @returns {string}
 */
export function formatAddressLine(address) {
  if (!address) return '';
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean);
  return parts.join(', ');
}

/**
 * Format address as a multi-line string for display.
 * @param {Object} address
 * @returns {Array<string>}
 */
export function formatAddressMultiline(address) {
  if (!address) return [];
  const lines = [
    address.fullName,
    address.phoneNumber,
    address.addressLine1,
  ];
  if (address.addressLine2) lines.push(address.addressLine2);
  lines.push(`${address.city}, ${address.state} ${address.postalCode}`);
  lines.push(address.country);
  return lines.filter(Boolean);
}

/**
 * Format address as HTML string.
 * @param {Object} address
 * @returns {string}
 */
export function formatAddressHtml(address) {
  return formatAddressMultiline(address).join('<br/>');
}

/**
 * Get a short label for an address (city, state).
 * @param {Object} address
 * @returns {string}
 */
export function getAddressLabel(address) {
  if (!address) return '';
  return `${address.city}, ${address.state}`.trim();
}

