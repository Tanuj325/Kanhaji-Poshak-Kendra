import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[90vw]',
};

function Modal({
  isOpen = false,
  onClose,
  title,
  subtitle,
  size = 'md',
  children,
  footer,
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  className,
}) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
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
      if (e.key === 'Escape' && closeOnEsc && isOpen) {
        handleClose();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEsc, isOpen, handleClose]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      handleClose();
    }
  };

  /* Focus trap */
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,154,59,0.12),transparent_25%),rgba(15,36,64,0.62)] backdrop-blur-sm animate-fade-in" aria-hidden="true" />
      <div
        ref={modalRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative z-10 w-full max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,246,243,0.98))] shadow-[0_24px_60px_rgba(15,36,64,0.18)] border border-white/70 animate-scale-in sm:max-h-[calc(100dvh-2rem)]',
          sizeStyles[size],
          className,
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 border-b border-muted-sand/30 px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
            <div className="min-w-0">
              {title && (
                <h3 id="modal-title" className="text-lg font-semibold text-dark-charcoal font-display sm:text-xl">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-natural-wood">{subtitle}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close modal"
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-natural-wood hover:text-dark-charcoal hover:bg-muted-sand/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-4 py-4 max-h-[calc(100dvh-11rem)] overflow-y-auto sm:px-6 sm:max-h-[60vh]">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-muted-sand/30 px-4 py-3 sm:px-6 sm:py-4 bg-white/60">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;

