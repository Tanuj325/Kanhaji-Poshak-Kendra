import { cn } from '@/utils/cn';

const sizeStyles = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
  xl: 'h-12 w-12 border-4',
};

const colorStyles = {
  'royal-blue': 'border-muted-sand/30 border-t-royal-blue',
  white: 'border-white/30 border-t-white',
  'temple-gold': 'border-temple-gold-light border-t-temple-gold',
};

function Spinner({
  size = 'md',
  color = 'royal-blue',
  isFullPage = false,
  label,
  className,
}) {
  return (
    <div
      role="status"
      aria-label={label || 'Loading'}
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        isFullPage && 'fixed inset-0 z-50 bg-lotus-white',
        className,
      )}
    >
      <div
        className={cn(
          'animate-spin rounded-full',
          sizeStyles[size],
          colorStyles[color],
        )}
      />
      {label && (
        <p className="text-sm text-natural-wood">{label}</p>
      )}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );
}

export default Spinner;

