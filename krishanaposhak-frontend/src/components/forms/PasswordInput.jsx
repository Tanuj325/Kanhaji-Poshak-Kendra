import { forwardRef, useState, useId } from 'react';
import { cn } from '@/utils/cn';

const PasswordInput = forwardRef(function PasswordInput(
  {
    label,
    name,
    placeholder = 'Enter password',
    value,
    onChange,
    error,
    helperText,
    isDisabled = false,
    isRequired = false,
    size = 'md',
    showStrength = false,
    className,
    ...props
  },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const inputId = name || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  const getStrength = (val) => {
    if (!val) return { label: '', color: '', width: '0%' };
    const hasLower = /[a-z]/.test(val);
    const hasUpper = /[A-Z]/.test(val);
    const hasNumber = /\d/.test(val);
    const hasSpecial = /[^a-zA-Z0-9]/.test(val);
    const length = val.length >= 8;
    const score = [hasLower, hasUpper, hasNumber, hasSpecial, length].filter(Boolean).length;

    if (score <= 2) return { label: 'Weak', color: 'bg-error', width: '25%' };
    if (score <= 3) return { label: 'Fair', color: 'bg-warning', width: '50%' };
    if (score <= 4) return { label: 'Good', color: 'bg-info', width: '75%' };
    return { label: 'Strong', color: 'bg-success', width: '100%' };
  };

  const strength = showStrength ? getStrength(value || '') : null;

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
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          required={isRequired}
          aria-invalid={!!error}
          aria-describedby={errorId}
          aria-required={isRequired}
          autoComplete="current-password"
          className={cn(
            'w-full rounded border bg-white text-dark-charcoal placeholder:text-natural-wood/60 transition-colors duration-150 focus:outline-none focus:ring-1',
            'border-muted-sand focus:border-royal-blue focus:ring-royal-blue/30',
            error && 'border-error focus:border-error focus:ring-error/30',
            isDisabled && 'cursor-not-allowed bg-muted-sand/10 opacity-60',
            'pr-10',
            size === 'sm' && 'px-2.5 py-1.5 text-sm',
            size === 'md' && 'px-3 py-2 text-base',
            size === 'lg' && 'px-4 py-2.5 text-lg',
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={isDisabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-natural-wood hover:text-dark-charcoal transition-colors focus:outline-none"
        >
          {showPassword ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-natural-wood">{helperText}</p>
      )}
      {showStrength && value && (
        <div className="mt-2">
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted-sand/30">
            <div
              className={cn('h-full rounded-full transition-all duration-300', strength.color)}
              style={{ width: strength.width }}
            />
          </div>
          <p className="mt-0.5 text-xs text-natural-wood">
            Password strength: {strength.label}
          </p>
        </div>
      )}
    </div>
  );
});

export default PasswordInput;

