import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/utils/cn';

function Popover({
  trigger,
  content,
  placement = 'bottom',
  isOpen: controlledOpen,
  onOpenChange,
  className,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const containerRef = useRef(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    },
    [setIsOpen],
  );

  const placementStyles = {
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block', className)}
      onKeyDown={handleEscape}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-64 rounded-lg border border-muted-sand/30 bg-white p-4 shadow-elevated animate-scale-in',
            placementStyles[placement],
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Popover;

