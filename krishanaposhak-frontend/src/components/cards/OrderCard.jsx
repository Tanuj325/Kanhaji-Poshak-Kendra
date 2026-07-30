import { memo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/formatPrice';
import Card from '@/components/ui/Card';
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
    <Link to={`/account/orders/${id || orderNumber}`} className="block">
      <Card variant="default" padding="md" isHoverable className={cn('', className)}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-dark-charcoal">
              Order #{orderNumber || id}
            </p>
            <p className="text-xs text-natural-wood">
              {createdAt ? new Date(createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
            </p>
          </div>
          <Badge variant={statusVariantMap[status] || 'default'} size="sm">
            {status}
          </Badge>
        </div>

        {displayItems.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            {displayItems.map((item, i) => (
              <div key={i} className="h-14 w-14 flex-shrink-0 overflow-hidden rounded bg-muted-sand/10">
                {item.image ? (
                  <img
                    src={item.image?.imageUrl || item.image?.url || item.image}
                    alt={item.name || 'Product'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-natural-wood/40">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {remainingCount > 0 && (
              <span className="text-xs text-natural-wood">+{remainingCount} more</span>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-muted-sand/20 pt-2">
          <span className="text-xs text-natural-wood">{itemCount || items?.length || 0} items</span>
          <span className="text-sm font-semibold text-dark-charcoal">{formatPrice(totalAmount)}</span>
        </div>
      </Card>
    </Link>
  );
});

export default OrderCard;
