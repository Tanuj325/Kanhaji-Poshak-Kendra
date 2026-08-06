import { useState, useCallback } from 'react';
import { useApplyCoupon } from '@/hooks/useApplyCoupon';
import { useRemoveCoupon } from '@/hooks/useRemoveCoupon';
import { useActiveCoupons } from '@/hooks/useCoupons';
import { FiTag, FiTrash2, FiGift, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

function CouponInput({ orderAmount = 0, appliedCoupon, onApply, onRemove, className, isEmbedded = false }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const { data: activeCoupons } = useActiveCoupons();

  const handleApply = useCallback(
    async (codeToApply) => {
      setError('');
      const formattedCode = (codeToApply || code).trim().toUpperCase();
      if (!formattedCode) {
        setError('Please enter a valid promo code');
        return;
      }

      try {
        const result = await applyCoupon.mutateAsync({ code: formattedCode, orderAmount });
        if (result?.valid) {
          onApply(formattedCode, result.discount || 0);
          setCode('');
          toast.success(result.message || `Promo code ${formattedCode} applied! Saved ₹${result.discount}`);
        } else {
          const errMsg = result?.message || 'Invalid or expired promo code';
          setError(errMsg);
          toast.error(errMsg);
        }
      } catch (err) {
        const errMsg = err?.response?.data?.message || err?.message || 'Failed to apply coupon';
        setError(errMsg);
        toast.error(errMsg);
      }
    },
    [code, orderAmount, applyCoupon, onApply],
  );

  const handleRemove = useCallback(async () => {
    try {
      await removeCoupon.mutateAsync();
      onRemove();
      setError('');
      toast.success('Promo code removed');
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'Failed to remove promo code';
      setError(errMsg);
      toast.error(errMsg);
    }
  }, [removeCoupon, onRemove]);

  if (appliedCoupon) {
    return (
      <div
        className={`rounded-[14px] bg-gradient-to-r from-emerald-50 via-emerald-100/40 to-emerald-50 border border-emerald-300/80 p-3 shadow-2xs font-display ${className || ''}`}
      >
        <div className="flex flex-col items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FiCheck className="h-4 w-4 stroke-[3]" />
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-extrabold text-amber-950 font-mono tracking-wider truncate">
                  {appliedCoupon.code}
                </span>
                {appliedCoupon.discountAmount > 0 && (
                  <span className="bg-emerald-200/90 text-emerald-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                    Saved ₹{appliedCoupon.discountAmount}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                Promo Code Applied
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={removeCoupon.isPending}
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 bg-white hover:bg-rose-50 transition-all px-2.5 h-[34px] rounded-xl border border-rose-200/80 shadow-2xs disabled:opacity-50 shrink-0"
          >
            <FiTrash2 className="h-3.5 w-3.5 text-rose-600 shrink-0" />
            <span>{removeCoupon.isPending ? '...' : 'Remove'}</span>
          </button>
        </div>
      </div>
    );
  }

  const containerClasses = isEmbedded
    ? `space-y-2.5 font-display ${className || ''}`
    : `rounded-[18px] bg-white border border-amber-900/10 p-4 shadow-xs space-y-3 font-display ${className || ''}`;

  return (
    <div className={containerClasses}>
      {!isEmbedded && (
        <div className="flex items-center gap-2 pb-2 border-b border-amber-900/10">
          <FiTag className="h-4 w-4 text-amber-800 shrink-0" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
            Have a Promo Code?
          </span>
        </div>
      )}

      {/* Sleek Input + Apply button row (44px height) */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1 min-w-0">
          <input
            id="coupon-code-input"
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApply();
              }
            }}
            placeholder="Enter Promo Code"
            className="w-full h-[44px] rounded-[12px] border border-amber-900/20 bg-amber-50/20 px-3.5 text-xs font-extrabold uppercase tracking-wider text-amber-950 placeholder:text-stone-400 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 font-mono transition-all"
          />
        </div>

        <button
          type="button"
          onClick={() => handleApply()}
          disabled={!code.trim() || applyCoupon.isPending}
          className="h-[44px] px-5 rounded-[12px] bg-amber-900 hover:bg-amber-950 text-white font-extrabold text-xs shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 flex items-center justify-center"
        >
          {applyCoupon.isPending ? 'Applying...' : 'Apply'}
        </button>
      </div>

      {error && <p className="text-[11px] font-bold text-rose-600 px-1">{error}</p>}

      {/* Available Offers Chips */}
      {Array.isArray(activeCoupons) && activeCoupons.length > 0 && (
        <div className="pt-2 border-t border-amber-900/10 space-y-1.5">
          <span className="text-[10px] font-extrabold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
            <FiGift className="h-3.5 w-3.5 text-amber-800 shrink-0" /> Tap to Apply Offer
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {activeCoupons.slice(0, 3).map((coupon) => (
              <button
                key={coupon.id || coupon.code}
                type="button"
                onClick={() => {
                  setCode(coupon.code);
                  handleApply(coupon.code);
                }}
                className="group flex-shrink-0 flex items-center gap-1.5 px-3 h-[34px] rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-300/60 text-amber-950 transition-all text-xs font-mono font-bold active:scale-95 shadow-2xs"
              >
                <span>{coupon.code}</span>
                {coupon.discountValue && (
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded font-sans font-extrabold">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CouponInput;