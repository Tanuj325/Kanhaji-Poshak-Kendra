/**
 * Image utility helpers for product images, banners, avatars.
 * All Cloudinary URLs are optimized with auto-format, auto-quality, and responsive sizing.
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
 * Build an optimized Cloudinary URL with transformations.
 * Uses f_auto for automatic format selection (WebP/AVIF),
 * q_auto:eco for eco quality (good balance of quality vs size),
 * and responsive width/height with c_fill crop.
 *
 * @param {string} url - Original Cloudinary URL
 * @param {number} width - Desired width (default: 400)
 * @param {number} height - Desired height (default: 500)
 * @returns {string}
 */
export function getOptimizedImageUrl(url, width = 400, height = 500) {
  if (!url || !url.includes('cloudinary')) return url || PLACEHOLDER_IMAGE;
  const upload = '/upload/';
  const uploadIdx = url.indexOf(upload);
  if (uploadIdx === -1) return url;
  const baseUrl = url.substring(0, uploadIdx + upload.length);
  const path = url.substring(uploadIdx + upload.length);
  return `${baseUrl}w_${width},h_${height},c_fill,f_auto,q_auto:eco/${path}`;
}

/**
 * Build a Cloudinary URL for avatar with optimization.
 * @param {string} url
 * @param {number} size
 * @returns {string|null}
 */
export function getAvatarUrl(url, size = 80) {
  if (!url) return null;
  if (!url.includes('cloudinary')) return url;
  const upload = '/upload/';
  const uploadIdx = url.indexOf(upload);
  if (uploadIdx === -1) return url;
  const baseUrl = url.substring(0, uploadIdx + upload.length);
  const path = url.substring(uploadIdx + upload.length);
  return `${baseUrl}w_${size},h_${size},c_fill,f_auto,q_auto:eco/${path}`;
}

/**
 * Get responsive srcSet for a Cloudinary image URL.
 * Generates multiple widths for responsive images.
 * @param {string} url - Original Cloudinary URL
 * @param {number[]} widths - Array of widths to generate
 * @returns {string|null} - srcSet string or null
 */
export function getResponsiveSrcSet(url, widths = [320, 480, 640, 800, 1024, 1280]) {
  if (!url || !url.includes('cloudinary')) return null;
  const upload = '/upload/';
  const uploadIdx = url.indexOf(upload);
  if (uploadIdx === -1) return null;
  const baseUrl = url.substring(0, uploadIdx + upload.length);
  const path = url.substring(uploadIdx + upload.length);
  
  return widths
    .map((w) => `${baseUrl}w_${w},c_fill,f_auto,q_auto:eco/${path} ${w}w`)
    .join(', ');
}

/**
 * Get the dominant color or a generated placeholder for blur-up loading.
 * @param {string} url - Cloudinary URL
 * @returns {string} - A low-quality image placeholder URL or empty string
 */
export function getBlurPlaceholder(url) {
  if (!url || !url.includes('cloudinary')) return '';
  const upload = '/upload/';
  const uploadIdx = url.indexOf(upload);
  if (uploadIdx === -1) return '';
  const baseUrl = url.substring(0, uploadIdx + upload.length);
  const path = url.substring(uploadIdx + upload.length);
  return `${baseUrl}w_20,c_fill,f_auto,q_auto:low/${path}`;
}

