import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '@/components/common/ScrollToTop';
import AccountSidebar from '@/components/customer/AccountSidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileTopBar from '@/components/layout/mobile/MobileTopBar';
import MobileBottomNav from '@/components/layout/mobile/MobileBottomNav';
import MobileAppDrawer from '@/components/layout/mobile/MobileAppDrawer';

export default function CustomerLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,rgba(201,154,59,0.08),transparent_28%),linear-gradient(180deg,#faf7f2_0%,#f7f2ea_50%,#f8f6f3_100%)] text-dark-charcoal selection:bg-temple-gold/30 selection:text-dark-charcoal pb-bottom-nav md:pb-0">
      <ScrollToTop />

      {/* Desktop & Tablet Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile Top Header */}
      <MobileTopBar onOpenDrawer={() => setDrawerOpen(true)} />

      {/* Mobile App Navigation Drawer */}
      <MobileAppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col md:flex-row gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-8 lg:py-10 font-display">
        {/* Account Sidebar Section (Hidden on mobile app view or collapsible) */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0">
          <AccountSidebar />
        </aside>

        {/* Account Main Content Area */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      {/* Desktop & Tablet Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav onOpenDrawer={() => setDrawerOpen(true)} />
    </div>
  );
}
