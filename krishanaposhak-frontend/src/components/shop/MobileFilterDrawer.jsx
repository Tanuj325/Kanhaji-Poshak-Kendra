import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSliders, FiX, FiCheck } from 'react-icons/fi';
import { FilterSidebarContent } from './FilterSidebar';

const MobileFilterDrawer = memo(function MobileFilterDrawer({
  isOpen,
  onClose,
  ...sidebarProps
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sliding Filter Sheet */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[min(23rem,calc(100vw-1.25rem))] flex-col justify-between overflow-hidden bg-white shadow-2xl rounded-r-3xl"
            role="dialog"
            aria-modal="true"
            aria-label="Refine product catalog filters"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-amber-900/10 bg-amber-50/50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900 shadow-2xs">
                  <FiSliders className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-base font-bold text-amber-950 font-display">Refine Collection</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="flex h-11 w-11 items-center justify-center rounded-full text-stone-500 hover:text-amber-950 hover:bg-amber-100/60 transition-colors min-h-[44px] min-w-[44px]"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin">
              <FilterSidebarContent {...sidebarProps} />
            </div>

            {/* Drawer Sticky Bottom Footer Actions with Safe Area support */}
            <div className="p-4 border-t border-amber-900/10 bg-white/95 backdrop-blur-md flex gap-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {sidebarProps.hasActiveFilters && (
                <button
                  type="button"
                  onClick={sidebarProps.onClearAll}
                  className="flex-1 rounded-2xl border border-stone-300 py-3 text-xs font-bold text-stone-700 hover:bg-stone-50 active:scale-95 transition-all min-h-[48px]"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f2440,#1b3a5c_55%,#0d4f5e)] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-gold active:scale-95 transition-all min-h-[48px]"
              >
                <FiCheck className="h-4 w-4 text-temple-gold shrink-0" />
                <span>Apply & View</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default MobileFilterDrawer;
