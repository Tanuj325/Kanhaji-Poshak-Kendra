import { useState, memo } from 'react';
import { FiFileText, FiGift, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const OrderNotesSection = memo(function OrderNotesSection({ notes = '', onChange }) {
  const [isExpanded, setIsExpanded] = useState(Boolean(notes));

  return (
    <div className="rounded-2xl bg-white border border-amber-900/10 p-4 sm:p-5 shadow-xs font-display space-y-3">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-950 min-h-[36px]"
      >
        <span className="flex items-center gap-2">
          <FiGift className="h-4 w-4 text-amber-800" /> Special Delivery Instructions / Gift Message
        </span>
        {isExpanded ? <FiChevronUp className="h-4 w-4 text-stone-500" /> : <FiChevronDown className="h-4 w-4 text-stone-500" />}
      </button>

      {isExpanded && (
        <div className="space-y-2 pt-1">
          <textarea
            id="checkout-order-notes"
            rows={2}
            value={notes}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="e.g. Please wrap with extra care for Janmashtami puja, or leave at front desk..."
            className="w-full rounded-xl border border-amber-900/20 bg-amber-50/20 p-3 text-xs font-bold text-amber-950 focus:border-amber-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 font-body transition-all"
          />
          <p className="text-[11px] text-stone-500 font-body">
            Instructions will be printed on the dispatch label for our courier team.
          </p>
        </div>
      )}
    </div>
  );
});

export default OrderNotesSection;
