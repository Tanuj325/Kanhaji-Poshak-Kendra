/**
 * Image utility helpers for product images, banners, avatars.
 */

/** Backend Cloudinary folder structure */
const CLOUDINARY_FOLDERS = {
  PRODUCTS: 'krishanaposhak/products',
  BANNERS: 'krishanaposhak/banners',
  PROFILES: 'krishanaposhak/profiles',
};

/**
 * Get Cloudinary folder path for given entity type.
 * @param {'products'|'banners'|'profiles'} type
 * @returns {string}
 */
export function getCloudinaryFolder(type) {
  return CLOUDINARY_FOLDERS[type.toUpperCase()] || 'krishanaposhak';
}

/**
 * Get product thumbnail URL.
 * Prioritizes the image marked as thumbnail, falls back to first image.
 * @param {Array<{thumbnail: boolean, imageUrl: string}>} images
 * @returns {string|null}
 */
export function getProductThumbnail(images) {
  if (!images?.length) return null;
  const thumbnail = images.find((img) => img.thumbnail);
  return thumbnail?.imageUrl || images[0]?.imageUrl || null;
}

/**
 * Get all product image URLs sorted by displayOrder.
 * @param {Array<{displayOrder: number, imageUrl: string}>} images
 * @returns {Array<string>}
 */
export function getProductImages(images) {
  if (!images?.length) return [];
  return [...images]
    .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99))
    .map((img) => img.imageUrl)
    .filter(Boolean);
}

/**
 * Get user's initials for avatar fallback.
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
export function getUserInitials(firstName, lastName) {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || '?';
}

/**
 * Default placeholder image URL when no image available.
 */
export const PLACEHOLDER_IMAGE = '/placeholder.png';

/**
 * Build a Cloudinary URL with transformations.
 * @param {string} url - Original Cloudinary URL
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @returns {string}
 */
export function getOptimizedImageUrl(url, width = 400, height = 500) {
  if (!url || !url.includes('cloudinary')) return url || PLACEHOLDER_IMAGE;
  return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`);
}

/**
 * Build a Cloudinary URL for avatar.
 * @param {string} url
 * @param {number} size
 * @returns {string}
 */
export function getAvatarUrl(url, size = 80) {
  if (!url) return null;
  return url.replace('/upload/', `/upload/w_${size},h_${size},c_fill,f_auto,q_auto/`);
}

