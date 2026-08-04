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
    isLoading = false,
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
    <div className={cn('w-full font-display', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-amber-950"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-amber-900/60 group-focus-within:text-amber-900 transition-colors z-10"
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
          aria-label={label || 'Search catalog'}
          className={cn(
            'w-full rounded-2xl border bg-amber-50/30 text-amber-950 placeholder:text-stone-400 transition-all duration-300 focus:outline-none font-medium truncate',
            'border-amber-900/15 shadow-2xs focus:border-amber-800 focus:ring-2 focus:ring-amber-700/20 focus:bg-white',
            isDisabled && 'cursor-not-allowed bg-stone-100 opacity-60',
            'pl-10 pr-11 min-h-[48px] sm:min-h-[44px]',
            size === 'sm' && 'py-2 text-xs',
            size === 'md' && 'py-2.5 text-xs sm:text-sm',
            size === 'lg' && 'py-3.5 text-sm sm:text-base',
          )}
          {...props}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 z-10">
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-800 border-t-transparent mr-2" />
          ) : value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              disabled={isDisabled}
              aria-label="Clear search query"
              className="flex h-11 w-11 items-center justify-center rounded-full text-stone-400 hover:text-amber-950 hover:bg-amber-100/60 transition-colors focus:outline-none min-h-[44px] min-w-[44px]"
            >
              <FiX className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs font-semibold text-rose-600" role="alert">{error}</p>
      )}
    </div>
  );
});

export default SearchInput;
