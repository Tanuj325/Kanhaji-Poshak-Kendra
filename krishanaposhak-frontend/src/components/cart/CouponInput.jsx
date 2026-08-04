import { useState, useCallback } from 'react';
import Button from '@/components/ui/Button';
import { useApplyCoupon } from '@/hooks/useApplyCoupon';
import { useRemoveCoupon } from '@/hooks/useRemoveCoupon';
import { useActiveCoupons } from '@/hooks/useCoupons';
import { FiTag, FiCheckCircle, FiTrash2, FiStar, FiGift, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

function CouponInput({ orderAmount = 0, appliedCoupon, onApply, onRemove, className }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const { data: activeCoupons } = useActiveCoupons();

  const handleApply = useCallback(
    async (codeToApply) => {
      setError('');
      const formattedCode = (codeToApply || code).trim().toUpperCase();
      if (!formattedCode) {
        setError('Please enter a valid coupon code');
        return;
      }

      try {
        const result = await applyCoupon.mutateAsync({ code: formattedCode, orderAmount });
        if (result?.valid) {
          onApply(formattedCode, result.discount || 0);
          setCode('');
          toast.success(result.message || `Coupon ${formattedCode} applied! Saved ₹${result.discount}`);
        } else {
          const errMsg = result?.message || 'Invalid or expired coupon code';
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
      toast.success('Coupon removed');
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'Failed to remove coupon';
      setError(errMsg);
      toast.error(errMsg);
    }
  }, [removeCoupon, onRemove]);

  if (appliedCoupon) {
    return (
      <div
        className={`rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-emerald-50 border border-emerald-300/60 p-4 shadow-xs relative overflow-hidden font-display ${className || ''}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <FiCheckCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <FiStar className="h-3 w-3 text-amber-500" /> Coupon Applied
              </span>
              <p className="text-base font-extrabold text-amber-950 font-mono tracking-wider">
                {appliedCoupon.code}
              </p>
              {appliedCoupon.discountAmount > 0 && (
                <p className="text-xs font-bold text-emerald-700 mt-0.5 font-mono">
                  Saving ₹{appliedCoupon.discountAmount} on this order
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={removeCoupon.isPending}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 bg-white hover:bg-rose-50 transition-colors px-3 py-2 rounded-xl border border-rose-200 shadow-2xs disabled:opacity-50 min-h-[38px]"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
            <span>{removeCoupon.isPending ? 'Removing...' : 'Remove'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-white border border-amber-900/10 p-4 sm:p-5 shadow-xs space-y-3 font-display ${className || ''}`}
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-950 min-h-[36px]"
      >
        <span className="flex items-center gap-2">
          <FiTag className="h-4 w-4 text-amber-800" /> Have a Promo Code?
        </span>
        {isExpanded ? <FiChevronUp className="h-4 w-4 text-stone-500" /> : <FiChevronDown className="h-4 w-4 text-stone-500" />}
      </button>

      {/* Input box */}
      <div className={`space-y-3 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
        <div className="flex gap-2">
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
            placeholder="ENTER CODE"
            className="flex-1 rounded-xl border border-amber-900/20 bg-amber-50/30 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-amber-950 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 font-mono transition-all"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleApply()}
            isLoading={applyCoupon.isPending}
            disabled={!code.trim()}
            className="font-bold min-h-[40px] px-4 rounded-xl bg-amber-900 text-amber-50"
          >
            Apply
          </Button>
        </div>

        {error && <p className="text-xs font-bold text-rose-600 animate-fadeIn">{error}</p>}

        {/* Available Offers Chips */}
        {Array.isArray(activeCoupons) && activeCoupons.length > 0 && (
          <div className="pt-2 border-t border-amber-900/10 space-y-2">
            <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
              <FiGift className="h-3.5 w-3.5 text-amber-800" /> Available Offers
            </span>
            <div className="flex flex-wrap gap-2">
              {activeCoupons.slice(0, 3).map((coupon) => (
                <button
                  key={coupon.id || coupon.code}
                  type="button"
                  onClick={() => {
                    setCode(coupon.code);
                    handleApply(coupon.code);
                  }}
                  className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300/60 text-amber-950 transition-all text-xs font-mono font-bold hover:scale-105 active:scale-95"
                >
                  <span>{coupon.code}</span>
                  {coupon.discountValue && (
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1 rounded font-sans">
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CouponInput;