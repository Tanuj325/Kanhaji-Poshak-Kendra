import { cn } from '@/utils/cn';

function Divider({
  orientation = 'horizontal',
  label,
  className,
}) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn(
          'mx-2 inline-block h-full min-h-[1em] w-px bg-muted-sand/40',
          className,
        )}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn('flex items-center gap-3', className)}
      >
        <span className="flex-1 border-t border-muted-sand/30" />
        <span className="text-sm font-medium text-natural-wood whitespace-nowrap">
          {label}
        </span>
        <span className="flex-1 border-t border-muted-sand/30" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('border-t border-muted-sand/30', className)}
    />
  );
}

export default Divider;

