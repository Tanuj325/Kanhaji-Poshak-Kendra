import { memo } from 'react';
import { formatPrice } from '@/utils/formatPrice';
import { FiPackage } from 'react-icons/fi';

const CheckoutItemRow = memo(function CheckoutItemRow({ item }) {
  if (!item) return null;

  const imgSrc = item.imageUrl || item.image || item.productImageUrl || item.product?.imageUrl;
  const unitPrice = item.discountPrice || item.price;
  const total = item.totalPrice || unitPrice * item.quantity;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-amber-900/10 last:border-b-0 font-display">
      <div className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 rounded-xl overflow-hidden bg-amber-50/50 border border-amber-950/10 p-0.5">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={item.productName}
            className="h-full w-full object-cover rounded-lg"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full rounded-lg bg-amber-100/40 flex items-center justify-center text-amber-800/40">
            <FiPackage className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-xs sm:text-sm font-bold text-amber-950 truncate">{item.productName}</p>
        <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
          {item.size && (
            <span className="bg-amber-100/70 text-amber-950 font-bold px-2 py-0.2 rounded text-[10px] uppercase">
              Size: {item.size}
            </span>
          )}
          {item.color && (
            <span className="bg-amber-100/70 text-amber-950 font-bold px-2 py-0.2 rounded text-[10px] uppercase">
              Color: {item.color}
            </span>
          )}
          <span>Qty: {item.quantity}</span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-xs sm:text-sm font-extrabold text-amber-950 font-mono">
          {formatPrice(total)}
        </p>
        {item.discountPrice && item.discountPrice < item.price && (
          <p className="text-[10px] text-stone-400 line-through font-mono">
            {formatPrice(item.price * item.quantity)}
          </p>
        )}
      </div>
    </div>
  );
});

export default CheckoutItemRow;
