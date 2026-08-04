import { memo } from 'react';
import Skeleton from '@/components/ui/Skeleton';

const CheckoutSkeleton = memo(function CheckoutSkeleton() {
  return (
    <div className="container-page py-6 sm:py-8 space-y-8 animate-pulse font-display">
      <Skeleton variant="text" className="h-5 w-48 bg-amber-100/40" />

      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-4 border-b border-amber-900/10">
        <Skeleton variant="text" className="h-8 w-60 bg-amber-100/60" />
        <Skeleton variant="card" className="h-8 w-44 rounded-full bg-amber-100/40" />
      </div>

      {/* Stepper Skeleton */}
      <div className="h-16 w-full rounded-2xl bg-amber-100/30 border border-amber-900/10" />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="h-48 w-full rounded-2xl bg-white border border-amber-900/10 p-6 space-y-3">
            <Skeleton variant="text" className="h-6 w-44 bg-amber-100/60" />
            <Skeleton variant="card" className="h-24 w-full rounded-xl bg-amber-100/40" />
          </div>
          <div className="h-48 w-full rounded-2xl bg-white border border-amber-900/10 p-6 space-y-3">
            <Skeleton variant="text" className="h-6 w-44 bg-amber-100/60" />
            <Skeleton variant="card" className="h-24 w-full rounded-xl bg-amber-100/40" />
          </div>
        </div>

        {/* Right Column Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="h-96 w-full rounded-2xl bg-white border border-amber-900/10 p-6 space-y-4">
            <Skeleton variant="text" className="h-6 w-36 bg-amber-100/60" />
            <Skeleton variant="card" className="h-12 w-full rounded-2xl bg-amber-100/40" />
            <Skeleton variant="text" className="h-24 w-full bg-amber-100/30 rounded-xl" />
            <Skeleton variant="card" className="h-12 w-full rounded-2xl bg-amber-900/20" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default CheckoutSkeleton;
