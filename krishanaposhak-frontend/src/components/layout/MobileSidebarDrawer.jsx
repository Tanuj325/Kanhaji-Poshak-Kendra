import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarContent from './SidebarContent';
import { useAuth } from '@/context/AuthContext';
import { FiX, FiLogOut, FiGrid } from 'react-icons/fi';

export default function MobileSidebarDrawer({ isOpen = true, onClose }) {
  const { logout } = useAuth();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex font-display lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative ml-auto h-full w-[min(20rem,calc(100vw-1rem))] bg-white/96 border-l border-white/70 shadow-[0_20px_50px_rgba(44,40,36,0.16)] flex flex-col z-10 overflow-hidden backdrop-blur-xl"
          >
            <div className="flex h-16 items-center border-b border-muted-sand/20 px-5 justify-between bg-warm-cream/30">
              <span className="font-display text-sm font-semibold uppercase tracking-wider text-temple-gold flex items-center gap-2">
                <FiGrid className="h-4 w-4" /> Admin Navigation
              </span>
              <button
                type="button"
                onClick={onClose}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-muted-sand/20 text-natural-wood hover:text-dark-charcoal transition-colors"
                aria-label="Close admin drawer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
              <SidebarContent onCloseMobile={onClose} />
            </div>

            <div className="p-4 border-t border-muted-sand/20 bg-warm-cream/20">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="w-full flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-error hover:bg-error/10 transition-colors min-h-[44px]"
              >
                <FiLogOut className="h-4 w-4 text-error" />
                <span>Logout Admin</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
