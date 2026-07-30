import { memo } from 'react';

const ProductDetailSkeleton = memo(function ProductDetailSkeleton() {
  return (
    <div className="container-page section-padding py-8 space-y-8 animate-pulse font-display">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 h-4 w-48 bg-amber-100/60 rounded-md" />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery Skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] sm:aspect-[3/4] w-full rounded-3xl bg-amber-100/50 border border-amber-900/10" />
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-20 rounded-2xl bg-amber-100/50 shrink-0" />
            ))}
          </div>
        </div>

        {/* Right Column: Info & Purchase Panel Skeleton */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl bg-white p-6 lg:p-7 border border-amber-900/10 shadow-xs space-y-6">
            {/* Header / Category */}
            <div className="flex justify-between items-center">
              <div className="h-6 w-28 bg-amber-100/70 rounded-full" />
              <div className="h-5 w-20 bg-emerald-100/60 rounded-full" />
            </div>

            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-8 w-3/4 bg-amber-100/80 rounded-lg" />
              <div className="h-8 w-1/2 bg-amber-100/80 rounded-lg" />
            </div>

            {/* Rating Skeleton */}
            <div className="h-7 w-40 bg-amber-100/60 rounded-xl" />

            {/* Pricing Section Skeleton */}
            <div className="h-20 w-full rounded-2xl bg-amber-100/40 border border-amber-900/10" />

            {/* Size Selector Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-32 bg-amber-100/70 rounded-md" />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-14 w-14 rounded-2xl bg-amber-100/60" />
                ))}
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="space-y-3 pt-2">
              <div className="h-14 w-full rounded-2xl bg-amber-900/20" />
              <div className="h-14 w-full rounded-2xl bg-amber-100/60" />
            </div>

            {/* Trust Badges Skeleton */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-amber-900/10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-amber-100/40" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductDetailSkeleton;
