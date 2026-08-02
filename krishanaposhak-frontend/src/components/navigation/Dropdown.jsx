import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/utils/cn';

function Dropdown({
  trigger,
  items = [],
  placement = 'bottom-start',
  isDisabled = false,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [],
  );

  const placementStyles = {
    'bottom-start': 'top-full left-0 mt-1',
    'bottom-end': 'top-full right-0 mt-1',
    'top-start': 'bottom-full left-0 mb-1',
    'top-end': 'bottom-full right-0 mb-1',
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <div
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(isDisabled && 'cursor-not-allowed opacity-50')}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          onKeyDown={handleKeyDown}
          className={cn(
            'absolute z-50 min-w-[12rem] overflow-hidden rounded-[20px] border border-white/10 bg-[#0B1728] py-1.5 shadow-[0_20px_50px_rgba(15,36,64,0.2)] animate-scale-in',
            placementStyles[placement],
          )}
          role="menu"
        >
          {items.map((item, index) => {
            if (item.isDivider) {
              return (
                <div
                  key={`divider-${index}`}
                  className="my-1 border-t border-white/10"
                  role="separator"
                />
              );
            }

            return (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                disabled={item.isDisabled}
                role="menuitem"
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm text-lotus-white transition-colors hover:bg-white/5',
                  item.isDisabled && 'cursor-not-allowed opacity-40',
                  item.isDanger && 'text-rose-300 hover:bg-rose-500/10',
                )}
              >
                {item.icon && (
                  <span className="h-4 w-4 flex-shrink-0" aria-hidden="true">{item.icon}</span>
                )}
                <span className="flex-1 text-left">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-slate-400">{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dropdown;

