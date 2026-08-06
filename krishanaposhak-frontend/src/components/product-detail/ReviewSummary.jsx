import { memo, useMemo } from 'react';
import Rating from '@/components/ui/Rating';
import { FiStar, FiCheckCircle, FiAward } from 'react-icons/fi';

const ReviewSummary = memo(function ReviewSummary({
  avgRating = 0,
  totalReviews = 0,
  ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
}) {
  const recommendedPct = useMemo(() => {
    if (!totalReviews) return 100;
    const positive = (ratingCounts[5] || 0) + (ratingCounts[4] || 0);
    return Math.round((positive / totalReviews) * 100);
  }, [totalReviews, ratingCounts]);

  return (
    <div className="w-full bg-white border border-slate-100 rounded-2xl shadow-2xs font-display overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* LEFT: Overall Score */}
        <div className="md:col-span-4 p-4 sm:p-6 flex flex-col items-center md:items-start justify-center bg-gradient-to-br from-amber-50/60 to-stone-50/40 border-b md:border-b-0 md:border-r border-slate-100">
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
              {totalReviews > 0 ? Number(avgRating).toFixed(1) : '0.0'}
            </span>
            <span className="text-xs text-slate-400 font-semibold font-mono">/ 5.0</span>
          </div>

          <Rating rating={totalReviews > 0 ? Math.round(avgRating) : 0} size="sm" />

          <div className="space-y-1 pt-2 font-body text-center md:text-left">
            {totalReviews > 0 ? (
              <>
                <p className="text-xs font-bold text-emerald-700 flex items-center justify-center md:justify-start gap-1">
                  <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> {recommendedPct}% Recommended
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Based on {totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </>
            ) : (
              <p className="text-[11px] text-slate-500 font-medium">
                No customer reviews yet
              </p>
            )}
          </div>
        </div>

        {/* CENTER: Rating Bars */}
        <div className="md:col-span-5 p-4 sm:p-6 space-y-2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs font-medium">
                <span className="w-8 text-slate-800 font-bold flex items-center gap-0.5 shrink-0 font-display text-[11px]">
                  {star} <FiStar className="h-3 w-3 text-amber-500 fill-amber-500" />
                </span>

                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C99A3B] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-12 text-right text-slate-500 font-mono text-[11px] font-semibold shrink-0">
                  {pct}% ({count})
                </span>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Stat Cards */}
        <div className="md:col-span-3 p-4 sm:p-6 space-y-3 flex flex-col justify-center font-body">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <FiCheckCircle className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Buyers</p>
              <p className="text-xs font-bold text-slate-900">100% Authentic</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
              <FiStar className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Rating</p>
              <p className="text-xs font-bold text-slate-900">{totalReviews > 0 ? Number(avgRating).toFixed(1) : '0.0'} / 5.0</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
              <FiAward className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Satisfaction</p>
              <p className="text-xs font-bold text-slate-900">{recommendedPct}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

});

export default ReviewSummary;
