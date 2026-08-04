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
    <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-royal-blue-700 via-deep-navy to-royal-blue-950 text-lotus-white py-5 sm:py-10 md:py-16 px-3.5 sm:px-6 shadow-elevated border-b border-temple-gold/20">
      {/* Decorative subtle background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C99A3B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Decorative Gold Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-temple-gold/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-peacock-blue/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container-page relative z-10">
        <Breadcrumb items={breadcrumbItems} className="mb-3 sm:mb-6 text-temple-gold-light/90" />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
          <div className="space-y-2.5 sm:space-y-3 max-w-3xl flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-temple-gold/15 px-3 sm:px-3.5 py-1 text-[10px] sm:text-xs font-bold text-temple-gold-light border border-temple-gold/30 backdrop-blur-md max-w-full truncate">
              <FiStar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-temple-gold fill-temple-gold shrink-0" />
              <span className="tracking-wide uppercase text-[10px] sm:text-[11px] font-display truncate">Authentic Meerut Sacred Handcrafts</span>
            </div>

            <h1 className="text-xl min-[360px]:text-2xl sm:text-4xl lg:text-5xl font-heading font-bold text-lotus-white tracking-tight leading-snug sm:leading-tight">
              {categoryName ? categoryName : 'Devotional Attire & Sacred Ornaments Catalog'}
            </h1>

            <p className="text-xs sm:text-sm text-muted-sand/90 leading-relaxed font-body max-w-2xl">
              Immerse yourself in our handcrafted collection of Laddoo Gopal Poshak, Radha Krishna attire, custom Mukut crowns, and temple adornments built with pure devotion.
            </p>
          </div>

          {!isLoading && totalElements !== undefined && (
            <div className="self-center sm:self-start lg:self-end shrink-0 pt-1 sm:pt-0">
              <div className="inline-flex items-center gap-2 sm:gap-2.5 rounded-2xl bg-white/10 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-temple-gold-light border border-temple-gold/25 shadow-gold">
                <FiCheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
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
