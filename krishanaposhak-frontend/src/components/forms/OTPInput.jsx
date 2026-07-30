import { forwardRef, useRef, useCallback, useId } from 'react';
import { cn } from '@/utils/cn';

const OTPInput = forwardRef(function OTPInput(
  {
    label,
    name,
    value = '',
    onChange,
    error,
    isDisabled = false,
    isRequired = false,
    length = 6,
    size = 'md',
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = name || generatedId;
  const inputRefs = useRef([]);

  const values = Array.from({ length }, (_, i) => value[i] || '');

  const handleChange = useCallback(
    (index, e) => {
      const char = e.target.value;
      if (char && !/^\d$/.test(char)) return;

      const newValue = value.split('');
      newValue[index] = char;
      const joined = newValue.join('').slice(0, length);
      onChange?.(joined);

      if (char && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [value, onChange, length],
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === 'Backspace' && !values[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [values, length],
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      onChange?.(pasted);
      const focusIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    },
    [onChange, length],
  );

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-dark-charcoal">
          {label}
          {isRequired && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
        </label>
      )}
      <div
        className="flex items-center gap-2"
        role="group"
        aria-label={`OTP input with ${length} digits`}
      >
        {values.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            id={index === 0 ? inputId : undefined}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={isDisabled}
            required={isRequired}
            aria-label={`Digit ${index + 1}`}
            className={cn(
              'w-full max-w-[3rem] rounded border bg-white text-center font-semibold text-dark-charcoal transition-colors duration-150 focus:outline-none focus:ring-1',
              'border-muted-sand focus:border-royal-blue focus:ring-royal-blue/30',
              error && 'border-error focus:border-error focus:ring-error/30',
              isDisabled && 'cursor-not-allowed bg-muted-sand/10 opacity-60',
              size === 'sm' && 'h-9 text-sm',
              size === 'md' && 'h-11 text-lg',
              size === 'lg' && 'h-13 text-xl',
            )}
            {...props}
          />
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-error" role="alert">{error}</p>
      )}
    </div>
  );
});

export default OTPInput;

