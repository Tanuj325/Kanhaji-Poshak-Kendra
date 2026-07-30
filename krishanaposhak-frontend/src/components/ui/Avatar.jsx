import { useState } from 'react';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/getInitials';

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-20 w-20 text-2xl',
};

const onlineDotSizes = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-2.5 w-2.5',
  xl: 'h-3 w-3',
  '2xl': 'h-3.5 w-3.5',
};

function Avatar({
  src,
  alt = '',
  name,
  size = 'md',
  isOnline = false,
  className,
}) {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;
  const initials = name ? getInitials(name.split(' ')[0], name.split(' ')[1]) : null;

  return (
    <span
      className={cn('relative inline-flex flex-shrink-0', className)}
      role="img"
      aria-label={alt || name || 'Avatar'}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name || ''}
          onError={() => setImgError(true)}
          className={cn(
            'rounded-full object-cover',
            sizeClasses[size],
          )}
        />
      ) : (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-royal-blue/10 text-royal-blue font-medium',
            sizeClasses[size],
          )}
          aria-hidden="true"
        >
          {initials || (
            <svg
              className="h-1/2 w-1/2 text-natural-wood"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </span>
      )}
      {isOnline && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full bg-success ring-2 ring-white',
            onlineDotSizes[size],
          )}
          aria-label="Online"
        />
      )}
    </span>
  );
}

export default Avatar;

