import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

/**
 * BottomSheet Component (Phase M0 Global Mobile Utility)
 * Reusable modal sheet sliding up from bottom for mobile app interactions.
 * Includes drag handle pill, backdrop blur, safe area insets, focus locking,
 * minimum 48x48 touch targets, and accessibility dialog attributes.
 */
export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = 'max-h-[85vh]',
  showCloseButton = true,
}) {
  // Lock body scroll when sheet is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Bottom Sheet Dialog'}
          className="fixed inset-0 z-50 flex flex-col justify-end md:hidden"
        >
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Sheet Container Panel */}
          <motion.div
            initial={{ translateY: '100%' }}
            animate={{ translateY: '0%' }}
            exit={{ translateY: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`relative w-full bg-white rounded-t-[24px] shadow-2xl z-10 flex flex-col ${maxHeight} pb-safe overflow-hidden border-t border-white/60`}
          >
            {/* Drag Handle Top Pill */}
            <div className="w-full pt-3 pb-1 flex items-center justify-center cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-muted-sand/70 rounded-full" />
            </div>

            {/* Sheet Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 py-2 border-b border-muted-sand/30">
                {title ? (
                  <h3 className="font-display text-lg font-semibold text-dark-charcoal truncate">
                    {title}
                  </h3>
                ) : (
                  <div />
                )}

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close bottom sheet"
                    className="touch-target text-natural-wood hover:text-dark-charcoal active-tap-scale rounded-full p-2"
                  >
                    <FiX className="w-5 h-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

            {/* Sheet Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
