import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { FiImage } from 'react-icons/fi';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80';

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt = 'Kanahaji Poshak product image',
  className = '',
  aspectRatio = 'aspect-square',
  loading = 'lazy',
  fallbackSrc = FALLBACK_IMAGE,
  onClick,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  const finalSrc = error || !src ? fallbackSrc : src;

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

      {/* Actual Image */}
      <img
        src={finalSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
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
  fallbackSrc: PropTypes.string,
  onClick: PropTypes.func,
};

export default OptimizedImage;
