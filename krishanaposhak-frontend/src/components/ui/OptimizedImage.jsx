import { useState, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FiImage } from 'react-icons/fi';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80';

/**
 * Build optimized Cloudinary URL with auto-format, auto-quality, and responsive sizing.
 * Falls back to the original URL or placeholder if not a Cloudinary URL.
 */
function getCloudinaryOptimizedUrl(url, width = 400, height = 500) {
  if (!url) return null;
  // Only apply Cloudinary transformations if it's a Cloudinary URL
  if (url.includes('cloudinary')) {
    const upload = '/upload/';
    const uploadIdx = url.indexOf(upload);
    if (uploadIdx !== -1) {
      const baseUrl = url.substring(0, uploadIdx + upload.length);
      const path = url.substring(uploadIdx + upload.length);
      return `${baseUrl}w_${width},h_${height},c_fill,f_auto,q_auto:eco/${path}`;
    }
  }
  return url;
}

/**
 * Preconnect to Cloudinary when an image component mounts
 * (idempotent — safe to call multiple times)
 */
function preconnectCloudinary() {
  if (typeof window !== 'undefined' && !window.__cloudinaryPreconnected) {
    const link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://res.cloudinary.com';
    document.head.appendChild(link1);
    window.__cloudinaryPreconnected = true;
  }
}

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt = 'Kanahaji Poshak product image',
  className = '',
  aspectRatio = 'aspect-square',
  loading = 'lazy',
  fetchpriority,
  fallbackSrc = FALLBACK_IMAGE,
  width = 400,
  height = 500,
  onClick,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Preconnect to Cloudinary on first mount
  useState(() => {
    if (src?.includes('cloudinary')) {
      preconnectCloudinary();
    }
  });

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setLoaded(true);
  }, []);

  // Build optimized URL for Cloudinary images
  const optimizedSrc = src?.includes('cloudinary')
    ? getCloudinaryOptimizedUrl(src, width, height)
    : src;

  const finalSrc = error || !optimizedSrc ? fallbackSrc : optimizedSrc;

  return (
    <div
      className={`relative overflow-hidden bg-stone-900/40 ${aspectRatio} ${className}`}
      onClick={onClick}
    >
      {/* Skeleton / Blur placeholder while loading */}
      {!loaded && (
        <div
          className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-stone-800/60 via-stone-700/40 to-stone-800/60"
          aria-hidden="true"
        />
      )}

      {/* Actual Image with fetchpriority support */}
      <img
        src={finalSrc}
        alt={alt}
        loading={loading}
        {...(fetchpriority ? { fetchpriority } : {})}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'
          }`}
        {...props}
      />

      {/* Error State Overlay Icon if fallback also fails */}
      {error && !loaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-900 text-stone-600">
          <FiImage className="h-6 w-6" />
        </div>
      )}
    </div>
  );
});

OptimizedImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  aspectRatio: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  fetchpriority: PropTypes.oneOf(['high', 'low', 'auto']),
  fallbackSrc: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  onClick: PropTypes.func,
};

export default OptimizedImage;

