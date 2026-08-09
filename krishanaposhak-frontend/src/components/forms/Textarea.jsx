import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

const Textarea = forwardRef(function Textarea(
  {
    label,
    name,
    placeholder,
    value,
    onChange,
    error,
    helperText,
    isDisabled = false,
    isReadOnly = false,
    isRequired = false,
    rows = 4,
    maxLength,
    resizable = 'vertical',
    size = 'md',
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = name || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  const resizeStyles = {
    none: 'resize-none',
    vertical: 'resize-y',
    both: 'resize',
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-dark-charcoal"
        >
          {label}
          {isRequired && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        name={name}
        placeholder={placeholder}
        {...(value !== undefined ? { value } : {})}
        onChange={onChange}
        disabled={isDisabled}
        readOnly={isReadOnly}
        required={isRequired}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={errorId}
        aria-required={isRequired}
        className={cn(
          'w-full rounded border bg-white text-dark-charcoal placeholder:text-natural-wood/60 transition-colors duration-150 focus:outline-none focus:ring-1',
          'border-muted-sand focus:border-royal-blue focus:ring-royal-blue/30',
          error && 'border-error focus:border-error focus:ring-error/30',
          isDisabled && 'cursor-not-allowed bg-muted-sand/10 opacity-60',
          isReadOnly && 'bg-muted-sand/5 cursor-default',
          resizeStyles[resizable],
          size === 'sm' && 'px-2.5 py-1.5 text-sm',
          size === 'md' && 'px-3 py-2 text-base',
          size === 'lg' && 'px-4 py-2.5 text-lg',
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-natural-wood">{helperText}</p>
      )}
    </div>
  );
});

export default Textarea;

