import { Outlet, useLocation } from 'react-router-dom';
import { Suspense, memo, useState } from 'react';
import ScrollToTop from '@/components/common/ScrollToTop';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileTopBar from '@/components/layout/mobile/MobileTopBar';
import MobileBottomNav from '@/components/layout/mobile/MobileBottomNav';
import MobileAppDrawer from '@/components/layout/mobile/MobileAppDrawer';

const LoadingSection = memo(function LoadingSection() {
  return <div className="min-h-[60vh] animate-pulse bg-[#FAF7F2]" aria-hidden="true" />;
});

export default function PublicLayout() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-amber-950 font-display selection:bg-amber-400/30 selection:text-amber-950">
      <ScrollToTop />

      {/* Desktop & Tablet Header (hidden on mobile <768px) */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile App Top Header (visible ONLY on mobile <768px) */}
      <MobileTopBar onOpenDrawer={() => setDrawerOpen(true)} />

      {/* Mobile App Navigation Drawer */}
      <MobileAppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Main Page Content Area */}
      <main className="flex-1 w-full min-w-0 overflow-x-hidden pt-[120px] md:pt-0 pb-bottom-nav md:pb-0">
        <Suspense fallback={<LoadingSection />}>
          <Outlet key={location.pathname} />
        </Suspense>
      </main>

      {/* Desktop & Tablet Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile App Bottom Navigation Bar (visible ONLY on mobile <768px) */}
      <MobileBottomNav onOpenDrawer={() => setDrawerOpen(true)} />
    </div>
  );
}
