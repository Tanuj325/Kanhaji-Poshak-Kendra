import { cn } from '@/utils/cn';

function Chip({
  label,
  onRemove,
  variant = 'default',
  size = 'md',
  isDisabled = false,
  className,
}) {
  const variantStyles = {
    default:
      'bg-muted-sand/20 text-dark-charcoal border-muted-sand/40',
    primary:
      'bg-royal-blue/10 text-royal-blue border-royal-blue/20',
    success:
      'bg-success/10 text-success border-success/20',
    warning:
      'bg-warning/10 text-warning border-warning/20',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={isDisabled}
          aria-label={`Remove ${label}`}
          className="ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 hover:bg-black/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

export default Chip;

