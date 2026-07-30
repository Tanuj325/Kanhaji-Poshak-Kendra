import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Label = forwardRef(function Label(
  {
    htmlFor,
    children,
    isRequired = false,
    className,
    ...props
  },
  ref,
) {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn(
        'mb-1.5 block text-sm font-medium text-dark-charcoal',
        className,
      )}
      {...props}
    >
      {children}
      {isRequired && (
        <span className="ml-0.5 text-error" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
});

export default Label;
