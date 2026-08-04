import { memo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/formatPrice';
import Badge from '@/components/ui/Badge';

const statusVariantMap = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  PROCESSING: 'info',
  SHIPPED: 'purple',
  DELIVERED: 'success',
  CANCELLED: 'danger',
  REFUNDED: 'default',
};

const OrderCard = memo(function OrderCard({
  order,
  className,
}) {
  if (!order) return null;

  const {
    id,
    orderNumber,
    status,
    items,
    totalAmount,
    createdAt,
    itemCount,
  } = order;

  const displayItems = items?.slice(0, 3) || [];
  const remainingCount = (itemCount || items?.length || 0) - displayItems.length;

  return (
    <Link to={`/account/orders/${id || orderNumber}`} className="block font-display min-h-[44px]">
      <div className={cn('p-5 rounded-3xl bg-white border border-amber-900/10 shadow-[0_4px_20px_rgba(44,40,36,0.03)] hover:border-amber-700/30 hover:shadow-md transition-all duration-200 space-y-3', className)}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-extrabold font-heading text-amber-950">
              Order #{orderNumber || id}
            </p>
            <p className="text-xs text-stone-500 font-body">
              {createdAt ? new Date(createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
            </p>
          </div>
          <Badge variant={statusVariantMap[status] || 'default'} size="sm" className="font-bold">
            {status}
          </Badge>
        </div>

        {displayItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {displayItems.map((item, i) => (
              <div key={i} className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-amber-900/10 bg-amber-50/40">
                {item.image ? (
                  <img
                    src={item.image?.imageUrl || item.image?.url || item.image}
                    alt={item.name || 'Product'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-amber-900/30">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {remainingCount > 0 && (
              <span className="text-xs font-bold text-stone-500 font-body">+{remainingCount} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-amber-900/10 pt-3">
          <span className="text-xs font-medium text-stone-500 font-body">{itemCount || items?.length || 0} items</span>
          <span className="text-sm font-extrabold font-heading text-amber-950 font-mono">{formatPrice(totalAmount)}</span>
        </div>
      </div>
    </Link>
  );
});

export default OrderCard;
