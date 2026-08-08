import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollToTop from '@/components/common/ScrollToTop';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import MobileSidebarDrawer from './MobileSidebarDrawer';
import { FiChevronLeft, FiChevronRight, FiGrid, FiShield } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#f4efe7_100%)] font-display text-slate-800 antialiased selection:bg-temple-gold/25 selection:text-dark-charcoal">
      <header className="fixed left-0 right-0 top-0 z-30 flex h-14 sm:h-16 items-center border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <AdminTopbar onMenuToggle={() => setIsMobileDrawerOpen((v) => !v)} />
      </header>

      <MobileSidebarDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      <aside
        className={cn(
          'fixed bottom-0 left-0 top-14 sm:top-16 z-20 hidden lg:flex flex-col border-r border-slate-200/80 bg-white/90 transition-all duration-300 ease-in-out shadow-2xs backdrop-blur-xl',
          isSidebarCollapsed ? 'w-16' : 'w-64',
        )}
      >
        <div className="flex h-12 items-center justify-between border-b border-slate-100 px-3.5">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600">
                <FiShield className="h-3.5 w-3.5" />
              </div>
              <span className="font-serif text-[11px] font-bold uppercase tracking-wider text-slate-800">
                Admin Console
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((v) => !v)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/60 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/30',
              isSidebarCollapsed && 'mx-auto',
            )}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <FiChevronRight className="h-4 w-4" />
            ) : (
              <FiChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          <AdminSidebar
            collapsed={isSidebarCollapsed}
            onNavigate={() => setIsMobileDrawerOpen(false)}
          />
        </div>
      </aside>

      <div
        className={cn(
          'flex min-h-screen flex-1 flex-col pt-14 sm:pt-16 transition-all duration-300 ease-in-out w-full min-w-0',
          isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64',
        )}
      >
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="min-w-0"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
