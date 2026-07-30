import { memo } from 'react';
import { FiStar } from 'react-icons/fi';

const ReviewFilterChips = memo(function ReviewFilterChips({
  selectedStarFilter = 'ALL',
  onSelectFilter,
  totalReviews = 0,
  ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
}) {
  const filterOptions = [
    { key: 'ALL', label: 'All Reviews', count: totalReviews },
    { key: '5', stars: 5, count: ratingCounts[5] || 0 },
    { key: '4', stars: 4, count: ratingCounts[4] || 0 },
    { key: '3', stars: 3, count: ratingCounts[3] || 0 },
    { key: '2', stars: 2, count: ratingCounts[2] || 0 },
    { key: '1', stars: 1, count: ratingCounts[1] || 0 },
  ];

  return (
    <div className="w-full flex items-center gap-2.5 overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
      {filterOptions.map((opt) => {
        const isActive = selectedStarFilter === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelectFilter(opt.key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all font-display ${
              isActive
                ? 'bg-amber-900 text-amber-50 shadow-md border border-amber-800 scale-[1.02]'
                : 'bg-white text-stone-800 hover:bg-amber-50/60 border border-amber-900/10'
            }`}
          >
            {opt.key === 'ALL' ? (
              <span>All Reviews</span>
            ) : (
              <span className="flex items-center gap-1">
                <span>{opt.stars}</span>
                <FiStar className={`h-3 w-3 ${isActive ? 'fill-amber-300 text-amber-300' : 'fill-amber-500 text-amber-500'}`} />
              </span>
            )}

            <span className={`text-[11px] font-mono ${isActive ? 'text-amber-200' : 'text-stone-500'}`}>
              ({opt.count})
            </span>
          </button>
        );
      })}
    </div>
  );
});

export default ReviewFilterChips;
