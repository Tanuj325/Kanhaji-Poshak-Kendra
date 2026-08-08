import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { FiX, FiLogOut, FiShield } from 'react-icons/fi';

export default function MobileSidebarDrawer({ isOpen = false, onClose }) {
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
          {/* Subtle translucent dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Off-canvas Left Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="relative mr-auto h-full w-[min(18rem,calc(100vw-2.5rem))] sm:w-80 bg-white border-r border-slate-200 shadow-2xl flex flex-col z-10 overflow-hidden font-display"
          >
            {/* Drawer Header */}
            <div className="flex h-14 sm:h-16 items-center justify-between border-b border-slate-100 px-4 bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600">
                  <FiShield className="h-4 w-4" />
                </div>
                <span className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                  Admin Console
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
                aria-label="Close admin navigation drawer"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            {/* Navigation Body */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-1 custom-scrollbar">
              <AdminSidebar onNavigate={onClose} />
            </div>

            {/* Drawer Footer / Logout */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/80 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors min-h-[44px] border border-rose-200/60"
              >
                <FiLogOut className="h-4 w-4 text-rose-600" />
                <span>Logout Admin</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
