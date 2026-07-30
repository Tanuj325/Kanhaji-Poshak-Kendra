import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchInput = forwardRef(function SearchInput(
  {
    label,
    name,
    placeholder = 'Search sacred poshaks, mukuts, accessories...',
    value,
    onChange,
    onClear,
    error,
    isDisabled = false,
    size = 'md',
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = name || generatedId;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-dark-charcoal font-display"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-natural-wood/70 group-focus-within:text-royal-blue transition-colors"
          aria-hidden="true"
        >
          <FiSearch className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
        </div>
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          aria-label={label || 'Search'}
          className={cn(
            'w-full rounded-2xl border bg-white/90 text-dark-charcoal placeholder:text-natural-wood/50 transition-all duration-300 focus:outline-none font-medium',
            'border-muted-sand/50 shadow-xs focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 focus:bg-white',
            isDisabled && 'cursor-not-allowed bg-muted-sand/10 opacity-60',
            'pl-10 pr-10',
            size === 'sm' && 'py-1.5 text-xs',
            size === 'md' && 'py-2.5 text-xs sm:text-sm',
            size === 'lg' && 'py-3 text-sm sm:text-base',
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            disabled={isDisabled}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-natural-wood/60 hover:text-dark-charcoal transition-colors focus:outline-none"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-sand/30 hover:bg-muted-sand/60 transition-colors">
              <FiX className="h-3 w-3" />
            </span>
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs font-semibold text-error" role="alert">{error}</p>
      )}
    </div>
  );
});

export default SearchInput;
