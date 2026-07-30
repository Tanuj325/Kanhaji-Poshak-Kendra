import { Outlet } from 'react-router-dom';
import ScrollToTop from '@/components/common/ScrollToTop';
import AccountSidebar from '@/components/customer/AccountSidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-warm-cream/40 via-[#FAF7F2] to-warm-cream/30 text-dark-charcoal selection:bg-temple-gold/30 selection:text-dark-charcoal">
      <ScrollToTop />
      <Header />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col md:flex-row gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-10 font-display">
        {/* Account Sidebar Section */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0">
          <AccountSidebar />
        </aside>

        {/* Account Main Content Area */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
