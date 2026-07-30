import Skeleton from '@/components/ui/Skeleton';

export function CartItemSkeleton() {
  return (
    <div className="p-4 rounded-2xl bg-white border border-amber-900/10 shadow-xs flex flex-col md:flex-row md:items-center gap-4 animate-pulse">
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <Skeleton variant="card" className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-amber-100/40 shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton variant="text" className="h-5 w-3/4 bg-amber-100/50" />
          <div className="flex items-center gap-2">
            <Skeleton variant="text" className="h-4 w-16 bg-amber-100/40 rounded-full" />
            <Skeleton variant="text" className="h-4 w-20 bg-amber-100/40 rounded-full" />
          </div>
          <Skeleton variant="text" className="h-4 w-24 bg-amber-100/30" />
        </div>
      </div>
      <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-amber-900/10">
        <Skeleton variant="text" className="h-6 w-20 bg-amber-100/50" />
        <Skeleton variant="card" className="h-10 w-28 rounded-xl bg-amber-100/40" />
        <Skeleton variant="text" className="h-6 w-20 bg-amber-100/50" />
        <Skeleton variant="card" className="h-9 w-9 rounded-xl bg-amber-100/40" />
      </div>
    </div>
  );
}

export function CartSummarySkeleton() {
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-amber-900/10 p-6 shadow-sm space-y-5 animate-pulse">
      <Skeleton variant="text" className="h-6 w-36 bg-amber-100/60" />
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton variant="text" className="h-4 w-20 bg-amber-100/40" />
          <Skeleton variant="text" className="h-4 w-16 bg-amber-100/40" />
        </div>
        <div className="flex justify-between">
          <Skeleton variant="text" className="h-4 w-28 bg-amber-100/40" />
          <Skeleton variant="text" className="h-4 w-16 bg-amber-100/40" />
        </div>
        <div className="flex justify-between">
          <Skeleton variant="text" className="h-4 w-24 bg-amber-100/40" />
          <Skeleton variant="text" className="h-4 w-12 bg-amber-100/40" />
        </div>
      </div>
      <div className="pt-3 border-t border-amber-900/10 flex justify-between items-center">
        <Skeleton variant="text" className="h-6 w-28 bg-amber-100/60" />
        <Skeleton variant="text" className="h-7 w-24 bg-amber-100/70" />
      </div>
      <Skeleton variant="card" className="h-12 w-full rounded-xl bg-amber-200/50" />
    </div>
  );
}

export function CouponSkeleton() {
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-md border border-amber-900/10 p-5 shadow-xs space-y-3 animate-pulse">
      <Skeleton variant="text" className="h-4 w-40 bg-amber-100/50" />
      <div className="flex gap-2">
        <Skeleton variant="card" className="h-10 flex-1 rounded-xl bg-amber-100/40" />
        <Skeleton variant="card" className="h-10 w-20 rounded-xl bg-amber-100/60" />
      </div>
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div className="container-page py-8 space-y-8 animate-pulse">
      <Skeleton variant="text" className="h-5 w-48 bg-amber-100/40" />
      <div className="flex justify-between items-center pb-4 border-b border-amber-900/10">
        <Skeleton variant="text" className="h-8 w-60 bg-amber-100/60" />
        <Skeleton variant="card" className="h-9 w-28 rounded-xl bg-amber-100/40" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <CartItemSkeleton />
          <CartItemSkeleton />
          <CartItemSkeleton />
        </div>
        <div className="lg:col-span-4 space-y-4">
          <CouponSkeleton />
          <CartSummarySkeleton />
        </div>
      </div>
    </div>
  );
}

export default CartPageSkeleton;
