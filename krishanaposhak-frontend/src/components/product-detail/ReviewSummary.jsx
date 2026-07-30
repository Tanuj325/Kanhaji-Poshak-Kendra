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
    <div className="w-full bg-gradient-to-br from-amber-50/70 via-stone-50/80 to-amber-50/40 border border-amber-900/10 rounded-3xl p-6 sm:p-8 xl:p-10 shadow-[0_4px_20px_rgba(44,40,36,0.04)] font-display">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 xl:gap-10 items-center">
        {/* LEFT COLUMN: Large Numerical Score & Rating */}
        <div className="lg:col-span-4 space-y-3 text-left">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-amber-950 tracking-tight font-heading">
              {Number(avgRating).toFixed(1)}
            </span>
            <span className="text-base sm:text-lg text-stone-400 font-semibold font-mono">/ 5.0</span>
          </div>

          <Rating rating={Math.round(avgRating)} size="md" />

          <div className="space-y-1.5 pt-1 font-body">
            <p className="text-xs sm:text-sm xl:text-base font-bold text-emerald-800 flex items-center gap-1.5">
              <FiCheckCircle className="h-4 w-4 xl:h-5 xl:w-5 text-emerald-600 shrink-0" /> {recommendedPct}% Recommended by buyers
            </p>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Based on {totalReviews} verified {totalReviews === 1 ? 'customer review' : 'customer reviews'}
            </p>
          </div>
        </div>

        {/* CENTER COLUMN: Rating Progress Distribution Bars */}
        <div className="lg:col-span-5 space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                <span className="w-12 text-stone-800 font-bold flex items-center gap-1 shrink-0 font-display">
                  {star} <FiStar className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                </span>

                <div className="flex-1 h-3 rounded-full bg-stone-200/80 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-16 sm:w-20 text-right text-stone-600 font-mono text-xs sm:text-sm font-bold shrink-0">
                  {pct}% ({count})
                </span>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Distinct Highlighted Stat Card */}
        <div className="lg:col-span-3 bg-white border border-amber-900/10 rounded-2xl p-5 xl:p-6 space-y-4 shadow-xs font-body">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
              <FiCheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Verified Buyers</p>
              <p className="text-sm xl:text-base font-bold text-amber-950">100% Authentic</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
              <FiStar className="h-5 w-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Average Rating</p>
              <p className="text-sm xl:text-base font-bold text-amber-950">{Number(avgRating).toFixed(1)} / 5.0 Stars</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-900/10 text-amber-900 flex items-center justify-center shrink-0">
              <FiAward className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Buyer Preference</p>
              <p className="text-sm xl:text-base font-bold text-amber-950">{recommendedPct}% Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReviewSummary;
