import { cn } from '@/utils/cn';

function ProgressBar({
  value = 0,
  max = 100,
  variant = 'royal-blue',
  size = 'md',
  showLabel = false,
  isIndeterminate = false,
  className,
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantStyles = {
    'royal-blue': 'bg-royal-blue',
    'temple-gold': 'bg-temple-gold',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-error',
  };

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm text-natural-wood">Progress</span>
          <span className="text-sm font-medium text-dark-charcoal">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label="Progress"
        className={cn(
          'w-full overflow-hidden rounded-full bg-muted-sand/30',
          sizeStyles[size],
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            variantStyles[variant],
            isIndeterminate && 'animate-pulse w-1/2',
            !isIndeterminate && 'transition-all',
          )}
          style={{ width: isIndeterminate ? undefined : `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;

