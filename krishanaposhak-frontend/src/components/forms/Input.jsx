import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

const sizeStyles = {
  sm: 'min-h-[40px] px-2.5 py-1.5 text-sm',
  md: 'min-h-[44px] px-3 py-2 text-base',
  lg: 'min-h-[48px] px-4 py-2.5 text-lg',
};

const Input = forwardRef(function Input(
  {
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    helperText,
    isDisabled = false,
    isReadOnly = false,
    isRequired = false,
    leftIcon,
    rightIcon,
    size = 'md',
    maxLength,
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = name || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText && !error ? `${inputId}-helper` : undefined;

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
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-natural-wood" aria-hidden="true">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          readOnly={isReadOnly}
          required={isRequired}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={errorId || helperId}
          aria-required={isRequired}
          className={cn(
            'w-full rounded-xl border bg-white text-dark-charcoal text-xs placeholder:text-natural-wood/60 transition-all duration-200 focus:outline-none focus:ring-2 shadow-xs',
            'border-muted-sand/40 focus:border-royal-blue focus:ring-royal-blue/20',
            error && 'border-error focus:border-error focus:ring-error/20',
            isDisabled && 'cursor-not-allowed bg-muted-sand/10 opacity-60',
            isReadOnly && 'bg-muted-sand/5 cursor-default',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            sizeStyles[size],
          )}
          {...props}
        />
        {rightIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-natural-wood" aria-hidden="true">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1 text-sm text-natural-wood">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;

