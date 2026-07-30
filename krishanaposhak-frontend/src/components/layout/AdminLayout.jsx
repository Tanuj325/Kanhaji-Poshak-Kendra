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
    <div className="flex min-h-screen bg-[#F8FAFC] font-display text-slate-800 antialiased selection:bg-amber-500/20 selection:text-amber-900">
      {/* Fixed Header */}
      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs">
        <AdminTopbar onMenuToggle={() => setIsMobileDrawerOpen((v) => !v)} />
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileSidebarDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'fixed bottom-0 left-0 top-16 z-20 hidden lg:flex flex-col border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out shadow-xs',
          isSidebarCollapsed ? 'w-16' : 'w-64',
        )}
      >
        {/* Sidebar Header Pill */}
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
              isSidebarCollapsed && 'mx-auto'
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

        {/* Sidebar Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          <AdminSidebar
            collapsed={isSidebarCollapsed}
            onNavigate={() => setIsMobileDrawerOpen(false)}
          />
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div
        className={cn(
          'flex min-h-screen flex-1 flex-col pt-16 transition-all duration-300 ease-in-out w-full min-w-0',
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
