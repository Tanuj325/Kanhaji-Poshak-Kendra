import { useState, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { FiStar } from 'react-icons/fi';

function Rating({
  rating = 0,
  maxRating = 5,
  size = 'sm',
  isInteractive = false,
  onChange,
  showValue = false,
  count,
  className,
}) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const displayRating = isInteractive && hoveredRating ? hoveredRating : rating;

  const handleClick = useCallback(
    (value) => {
      if (isInteractive && onChange) {
        onChange(value);
      }
    },
    [isInteractive, onChange],
  );

  const starSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5',
        isInteractive && 'cursor-pointer',
        className,
      )}
      role={isInteractive ? 'radiogroup' : 'img'}
      aria-label={
        isInteractive
          ? `Rating: ${rating} out of ${maxRating} stars`
          : `${rating} out of ${maxRating} stars`
      }
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= Math.round(displayRating);

          return (
            <span
              key={i}
              className={cn(
                'transition-all duration-200',
                filled ? 'text-amber-500 fill-amber-500' : 'text-slate-300',
                isInteractive && 'hover:scale-125 hover:text-amber-600',
              )}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => isInteractive && setHoveredRating(starValue)}
              onMouseLeave={() => isInteractive && setHoveredRating(0)}
              role={isInteractive ? 'radio' : undefined}
              tabIndex={isInteractive ? 0 : undefined}
            >
              <FiStar className={cn(starSizes[size], filled && 'fill-amber-500')} />
            </span>
          );
        })}
      </div>
      {(showValue || rating > 0) && (
        <span className="text-xs font-bold font-mono text-dark-charcoal/90">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {count !== undefined && count > 0 && (
        <span className="text-[11px] font-medium text-natural-wood/60">
          ({count})
        </span>
      )}
    </div>
  );
}

export default Rating;
