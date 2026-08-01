import { Outlet, useLocation } from 'react-router-dom';
import { lazy, Suspense, memo } from 'react';
import ScrollToTop from '@/components/common/ScrollToTop';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const LoadingSection = memo(function LoadingSection() {
  return <div className="min-h-[60vh] animate-pulse bg-lotus-white" aria-hidden="true" />;
});

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-lotus-white text-dark-charcoal selection:bg-amber-400/30 selection:text-amber-900">
      <ScrollToTop />
      <Header />
      <main className="flex-1 w-full min-w-0 overflow-x-hidden">
        <Suspense fallback={<LoadingSection />}>
          <Outlet key={location.pathname} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

