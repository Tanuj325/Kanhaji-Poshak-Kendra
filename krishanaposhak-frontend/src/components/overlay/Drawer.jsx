import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

const placementStyles = {
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
};

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

const animationStyles = {
  left: 'animate-slide-in-left',
  right: 'animate-slide-in-right',
  top: '-translate-y-full',
  bottom: 'translate-y-full',
};

function Drawer({
  isOpen = false,
  onClose,
  title,
  placement = 'right',
  size = 'md',
  children,
  footer,
  className,
}) {
  const drawerRef = useRef(null);
  const previousActiveElement = useRef(null);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      drawerRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape' && isOpen) handleClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab' || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) return null;

  const isHorizontal = placement === 'left' || placement === 'right';

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-dark-charcoal/40 animate-fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Drawer'}
        className={cn(
          'fixed flex flex-col bg-white shadow-modal animate-slide-in-right',
          placementStyles[placement],
          isHorizontal ? sizeStyles[size] : `max-h-[85vh]`,
          isHorizontal ? '' : placement === 'top' ? '' : '',
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-muted-sand/30 px-4 py-3">
          {title && (
            <h2 className="text-lg font-semibold text-dark-charcoal">{title}</h2>
          )}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close drawer"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-natural-wood hover:text-dark-charcoal hover:bg-muted-sand/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-muted-sand/30 px-4 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default Drawer;

