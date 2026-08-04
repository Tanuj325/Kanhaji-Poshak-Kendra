import { cn } from '@/utils/cn';

export default function Skeleton({ className, variant = 'text', count = 1 }) {
  const baseClass = 'animate-pulse bg-gradient-to-r from-stone-200/80 via-amber-100/60 to-stone-200/80 bg-[length:200%_100%] rounded-2xl';

  const variantClasses = {
    text: 'h-4 w-full rounded-lg',
    rect: 'h-36 w-full rounded-2xl',
    circle: 'h-10 w-10 rounded-full',
    card: 'h-80 w-full rounded-3xl',
    'table-row': 'h-12 w-full rounded-2xl',
  };

  if (count > 1) {
    return (
      <div className="flex flex-col gap-2.5" role="status" aria-label="Loading catalog item">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClass, variantClasses[variant], className)}
          />
        ))}
        <span className="sr-only">Loading catalog item...</span>
      </div>
    );
  }

  return (
    <div
      className={cn(baseClass, variantClasses[variant], className)}
      role="status"
      aria-label="Loading catalog item"
    >
      <span className="sr-only">Loading catalog item...</span>
    </div>
  );
}
