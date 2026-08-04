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
    <div className="w-full bg-white border border-amber-900/10 rounded-3xl shadow-[0_4px_20px_rgba(44,40,36,0.04)] font-display overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0">
        {/* LEFT: Overall Score */}
        <div className="md:col-span-4 p-6 sm:p-8 flex flex-col items-center md:items-start justify-center bg-gradient-to-br from-amber-50/80 to-stone-50/60 border-b md:border-b-0 md:border-r border-amber-900/10">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl sm:text-6xl font-extrabold text-amber-950 tracking-tight font-heading">
              {Number(avgRating).toFixed(1)}
            </span>
            <span className="text-base text-stone-400 font-semibold font-mono">/ 5.0</span>
          </div>

          <Rating rating={Math.round(avgRating)} size="md" />

          <div className="space-y-1.5 pt-3 font-body">
            <p className="text-xs sm:text-sm font-bold text-emerald-800 flex items-center gap-1.5">
              <FiCheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> {recommendedPct}% Recommended
            </p>
            <p className="text-xs text-stone-500 font-medium">
              {totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>

        {/* CENTER: Rating Bars */}
        <div className="md:col-span-5 p-6 sm:p-8 space-y-2.5 flex flex-col justify-center border-b md:border-b-0 md:border-r border-amber-900/10">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
                <span className="w-10 text-stone-800 font-bold flex items-center gap-0.5 shrink-0 font-display">
                  {star} <FiStar className="h-3 w-3 text-amber-500 fill-amber-500" />
                </span>

                <div className="flex-1 h-2.5 rounded-full bg-stone-200/80 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-14 sm:w-16 text-right text-stone-500 font-mono text-xs font-bold shrink-0">
                  {pct}% ({count})
                </span>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Stat Cards */}
        <div className="md:col-span-3 p-6 sm:p-8 space-y-4 flex flex-col justify-center font-body">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
              <FiCheckCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-stone-500 font-medium">Verified Buyers</p>
              <p className="text-xs sm:text-sm font-bold text-amber-950">100% Authentic</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
              <FiStar className="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <p className="text-[11px] text-stone-500 font-medium">Average Rating</p>
              <p className="text-xs sm:text-sm font-bold text-amber-950">{Number(avgRating).toFixed(1)} / 5.0</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-900/10 text-amber-900 flex items-center justify-center shrink-0">
              <FiAward className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-stone-500 font-medium">Satisfaction</p>
              <p className="text-xs sm:text-sm font-bold text-amber-950">{recommendedPct}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReviewSummary;
