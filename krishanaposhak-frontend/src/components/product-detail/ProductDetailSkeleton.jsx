import { memo } from 'react';

const ProductDetailSkeleton = memo(function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="container-page section-padding py-6 sm:py-8 space-y-6 sm:space-y-8 animate-pulse font-display">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 h-4 w-52 bg-amber-100/60 rounded-md" />

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col lg:flex-row gap-3">
            {/* Desktop Thumbnails */}
            <div className="hidden lg:flex flex-col gap-2.5 w-20">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[4/5] w-full rounded-xl bg-amber-100/50" />
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 space-y-3">
              <div className="aspect-[4/5] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full rounded-3xl bg-amber-100/50 border border-amber-900/10" />
              {/* Mobile Thumbnails */}
              <div className="flex lg:hidden gap-2.5 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 w-16 sm:h-18 sm:w-18 rounded-xl bg-amber-100/50 shrink-0" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Purchase Panel */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white p-5 sm:p-6 lg:p-7 border border-amber-900/10 shadow-xs space-y-5">
              {/* Category & Stock */}
              <div className="flex justify-between items-center">
                <div className="h-6 w-28 bg-amber-100/70 rounded-full" />
                <div className="h-5 w-20 bg-emerald-100/60 rounded-full" />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <div className="h-7 w-3/4 bg-amber-100/80 rounded-lg" />
                <div className="h-7 w-1/2 bg-amber-100/80 rounded-lg" />
              </div>

              {/* Rating */}
              <div className="h-8 w-44 bg-amber-100/60 rounded-xl" />

              {/* Pricing */}
              <div className="h-20 w-full rounded-2xl bg-amber-100/40 border border-amber-900/10" />

              {/* Size Selector */}
              <div className="space-y-2.5">
                <div className="h-4 w-32 bg-amber-100/70 rounded-md" />
                <div className="flex gap-2.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 w-14 rounded-xl bg-amber-100/60" />
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-3 border-t border-amber-900/10">
                <div className="h-12 w-24 rounded-xl bg-amber-100/60" />
                <div className="h-13 w-full rounded-2xl bg-amber-900/20" />
                <div className="h-13 w-full rounded-2xl bg-amber-100/60" />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-amber-900/10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-amber-100/40" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductDetailSkeleton;
