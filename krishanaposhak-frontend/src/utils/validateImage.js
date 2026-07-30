const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function validateImage(file) {
  const errors = [];

  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    errors.push(
      `Invalid file type "${file.type || 'unknown'}". Allowed: JPEG, PNG, WebP, GIF`
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    errors.push(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: ${MAX_SIZE_MB}MB`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateImageUrl(url) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
