import { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Header from './Header';
import Footer from './Footer';
import MobileTopBar from './mobile/MobileTopBar';
import MobileBottomNav from './mobile/MobileBottomNav';
import MobileAppDrawer from './mobile/MobileAppDrawer';

/**
 * AdaptiveLayout (Phase M0 Foundation)
 * Dynamically provides distinct layout structures for:
 * 1. Desktop (>= 1024px): 100% UNTOUCHED original desktop header, layout & footer.
 * 2. Tablet (768px - 1023px): Dedicated tablet container & spacing layout.
 * 3. Mobile (< 768px): Native App experience with MobileTopBar, MobileAppDrawer & MobileBottomNav.
 */
export default function AdaptiveLayout({ children, showFooter = true }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isMobile = useMediaQuery('(max-width: 767px)');

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Desktop View (>=1024px) - LOCKED & UNTOUCHED
  if (isDesktop) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-dark-charcoal font-display">
        <Header />
        <main className="flex-1 w-full min-w-0 container-desktop">
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    );
  }

  // Tablet View (768px - 1023px) - Dedicated Tablet Layout
  if (isTablet) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-dark-charcoal font-display">
        <Header />
        <main className="flex-1 w-full min-w-0 container-tablet py-6">
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    );
  }

  // Mobile View (<768px) - Native Mobile App Experience
  return (
    <div className="flex min-h-dvh flex-col bg-[#FAF7F2] text-dark-charcoal font-display pb-bottom-nav relative">
      {/* Mobile App Top Header */}
      <MobileTopBar
        onOpenDrawer={() => setDrawerOpen(true)}
      />

      {/* App Slide-Out Navigation Drawer */}
      <MobileAppDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main Content Area with Strict Mobile App Container */}
      <main className="flex-1 w-full min-w-0 container-mobile-app py-4">
        {children}
      </main>

      {/* Mobile App Bottom Navigation */}
      <MobileBottomNav
        onOpenDrawer={() => setDrawerOpen(true)}
      />
    </div>
  );
}
