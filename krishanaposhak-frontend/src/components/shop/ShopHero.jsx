import { memo } from 'react';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { FiStar, FiCheckCircle, FiAward } from 'react-icons/fi';

const ShopHero = memo(function ShopHero({
  breadcrumbItems,
  categoryName,
  totalElements,
  isLoading,
}) {
  return (
    <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-royal-blue-700 via-deep-navy to-royal-blue-950 text-lotus-white py-8 sm:py-12 md:py-16 px-4 shadow-elevated border-b border-temple-gold/20">
      {/* Decorative subtle background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C99A3B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Decorative Gold Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-temple-gold/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-peacock-blue/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container-page relative z-10">
        <Breadcrumb items={breadcrumbItems} className="mb-4 sm:mb-6 text-temple-gold-light/90" />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-temple-gold/15 px-3.5 py-1 text-xs font-bold text-temple-gold-light border border-temple-gold/30 backdrop-blur-md">
              <FiStar className="h-3.5 w-3.5 text-temple-gold fill-temple-gold shrink-0" />
              <span className="tracking-wide uppercase text-[11px] font-display">Authentic Meerut Sacred Handcrafts</span>
            </div>

            <h1 className="text-2xl min-[390px]:text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-lotus-white tracking-tight leading-tight">
              {categoryName ? categoryName : 'Devotional Attire & Sacred Ornaments Catalog'}
            </h1>

            <p className="text-xs sm:text-sm text-muted-sand/90 leading-relaxed font-body max-w-2xl">
              Immerse yourself in our handcrafted collection of Laddoo Gopal Poshak, Radha Krishna attire, custom Mukut crowns, and temple adornments built with pure devotion.
            </p>
          </div>

          {!isLoading && totalElements !== undefined && (
            <div className="self-start lg:self-end shrink-0">
              <div className="inline-flex items-center gap-2.5 rounded-2xl bg-white/10 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-temple-gold-light border border-temple-gold/25 shadow-gold">
                <FiCheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{totalElements} {totalElements === 1 ? 'Sacred Creation' : 'Sacred Creations'}</span>
                <FiAward className="h-3.5 w-3.5 text-temple-gold shrink-0 ml-0.5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ShopHero;
