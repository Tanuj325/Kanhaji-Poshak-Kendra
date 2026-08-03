import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/navigation/Pagination';
import Select from '@/components/forms/Select';
import Input from '@/components/forms/Input';
import { formatPrice } from '@/utils/formatPrice';
import { formatDate } from '@/utils/formatDate';
import { useOrders } from '@/hooks/useOrders';
import { useAddToCart } from '@/hooks/useCart';
import { paymentService } from '@/services';
import { siteConfig } from '@/config/siteConfig';
import { getErrorMessage } from '@/utils/apiErrorParser';
import toast from 'react-hot-toast';
import {
  FiShoppingBag,
  FiSearch,
  FiChevronRight,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiRefreshCw,
  FiFilter,
} from 'react-icons/fi';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'My Account', href: '/account/profile' },
  { label: 'Order History' },
];

const statusColors = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  PACKING: 'info',
  PROCESSING: 'info',
  PACKED: 'info',
  SHIPPED: 'purple',
  OUT_FOR_DELIVERY: 'purple',
  DELIVERED: 'success',
  CANCELLED: 'danger',
  RETURNED: 'warning',
};

const statusIcons = {
  PENDING: FiClock,
  CONFIRMED: FiCheckCircle,
  PACKING: FiPackage,
  PROCESSING: FiPackage,
  SHIPPED: FiTruck,
  OUT_FOR_DELIVERY: FiTruck,
  DELIVERED: FiCheckCircle,
  CANCELLED: FiXCircle,
  RETURNED: FiXCircle,
};

const statusOptions = [
  { value: '', label: 'All Order Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PACKING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'RETURNED', label: 'Returned' },
];

const paymentStatusOptions = [
  { value: '', label: 'All Payment Statuses' },
  { value: 'PENDING', label: 'Payment Pending' },
  { value: 'COMPLETED', label: 'Payment Completed' },
  { value: 'FAILED', label: 'Payment Failed' },
];

const sortOptions = [
  { value: 'createdAt,desc', label: 'Newest First' },
  { value: 'createdAt,asc', label: 'Oldest First' },
  { value: 'totalAmount,desc', label: 'Price: High to Low' },
  { value: 'totalAmount,asc', label: 'Price: Low to High' },
];

export default function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [buyingAgainId, setBuyingAgainId] = useState(null);
  const addToCart = useAddToCart();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const status = searchParams.get('status') || '';
  const paymentStatus = searchParams.get('paymentStatus') || '';
  const sort = searchParams.get('sort') || 'createdAt,desc';

  const handleBuyAgain = async (order) => {
    const items = order?.items || [];
    if (items.length === 0) return;
    setBuyingAgainId(order.id);
    try {
      for (const item of items) {
        if (item.variantId) {
          await addToCart.mutateAsync({ productVariantId: item.variantId, quantity: item.quantity || 1 });
        }
      }
      toast.success('Items re-added to your cart!');
    } catch {
      toast.error('Could not re-add some items to cart');
    } finally {
      setBuyingAgainId(null);
    }
  };

  const { data, isLoading, isError, error, refetch } = useOrders({
    page: page - 1,
    size: 10,
    status: status || undefined,
    paymentStatus: paymentStatus || undefined,
    sort,
  });

  useEffect(() => {
    paymentService.getRecoveryStatus()
      .then((res) => {
        const recoveryData = res?.data || res;
        if (recoveryData?.recoveredCount > 0) {
          toast.success(recoveryData.message || 'Payment recovered successfully!');
          refetch();
        }
      })
      .catch(() => {});
  }, [refetch]);

  const rawOrders = data?.content || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalOrders = data?.totalElements || 0;

  const orders = rawOrders.filter((order) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      order.orderNumber?.toLowerCase().includes(query) ||
      order.items?.some((item) => item.productName?.toLowerCase().includes(query))
    );
  });

  const updateParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    if (key !== 'page') p.set('page', '1');
    setSearchParams(p);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-5xl">
        <Breadcrumb items={breadcrumbItems} />
        <Skeleton variant="text" className="h-8 w-48 bg-temple-gold/20" />
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} variant="card" className="h-44 w-full rounded-3xl bg-temple-gold/15" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 w-full max-w-5xl">
        <ErrorState title="Failed to load orders" message={getErrorMessage(error)} onRetry={refetch} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`My Orders | ${siteConfig.name}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 w-full max-w-5xl font-display"
      >
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-muted-sand/20">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-dark-charcoal flex items-center gap-2.5">
              <FiShoppingBag className="h-6 w-6 text-temple-gold" /> Order History {totalOrders > 0 && `(${totalOrders})`}
            </h1>
            <p className="text-xs sm:text-sm text-natural-wood mt-0.5 font-normal">Track your orders, review items, and re-order with ease</p>
          </div>
          <Link to="/shop">
            <Button variant="outline" size="md" className="font-bold">
              Explore Collection
            </Button>
          </Link>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 bg-white p-4 rounded-3xl border border-temple-gold/20 shadow-md">
          <div className="sm:col-span-1">
            <Input
              leftIcon={<FiSearch className="h-4 w-4 text-natural-wood" />}
              placeholder="Search by Order # or Item"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs"
            />
          </div>
          <Select
            options={statusOptions}
            value={status}
            onChange={(e) => updateParam('status', e.target.value)}
            className="text-xs"
          />
          <Select
            options={paymentStatusOptions}
            value={paymentStatus}
            onChange={(e) => updateParam('paymentStatus', e.target.value)}
            className="text-xs"
          />
          <Select
            options={sortOptions}
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="text-xs"
          />
        </div>

        {orders.length === 0 ? (
          <EmptyState
            title="No orders found"
            message={
              status || paymentStatus || searchTerm
                ? 'No orders match your search criteria. Try clearing search filters.'
                : "You haven't placed any orders with Krishana Poshak yet."
            }
            action={
              <Link to="/shop">
                <Button variant="primary" className="font-bold">Explore Attire Collection</Button>
              </Link>
            }
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-5">
              {orders.map((order) => {
                const StatusIcon = statusIcons[order.orderStatus] || FiPackage;
                const itemsList = order.items || [];
                const previewItems = itemsList.slice(0, 4);

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-3xl bg-white border border-temple-gold/20 p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Order Card Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-muted-sand/20">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-display text-base font-bold text-dark-charcoal">
                            #{order.orderNumber}
                          </span>
                          <Badge variant={statusColors[order.orderStatus] || 'default'} size="sm" className="font-bold flex items-center gap-1 border border-black/5">
                            <StatusIcon className="h-3 w-3" /> {order.orderStatus}
                          </Badge>
                        </div>
                        <p className="text-xs text-natural-wood font-medium">
                          Placed on {order.orderDate ? formatDate(order.orderDate, { format: 'datetime' }) : ''}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-wider text-natural-wood font-bold">Total Amount</p>
                        <p className="font-display text-lg font-bold text-royal-blue">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Order Item Image Thumbnails & Buy Again */}
                    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1">
                        {previewItems.map((item, idx) => (
                          <div key={idx} className="relative group flex-shrink-0">
                            <img
                              src={item.imageUrl || '/placeholder.svg'}
                              alt={item.productName || 'Product'}
                              className="h-16 w-16 rounded-2xl object-cover bg-warm-cream/50 border border-muted-sand/20 shadow-xs"
                            />
                            {item.quantity > 1 && (
                              <span className="absolute -top-1.5 -right-1.5 rounded-full bg-royal-blue text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center border border-white shadow-xs">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                        ))}
                        {itemsList.length > 4 && (
                          <div className="h-16 w-16 rounded-2xl bg-warm-cream/50 border border-muted-sand/20 flex items-center justify-center text-xs font-bold text-dark-charcoal">
                            +{itemsList.length - 4} More
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {itemsList.length > 0 && itemsList[0]?.variantId && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleBuyAgain(order)}
                            disabled={buyingAgainId === order.id}
                            leftIcon={<FiRefreshCw className="h-3.5 w-3.5" />}
                          >
                            Buy Again
                          </Button>
                        )}
                        <Link to={`/account/orders/${order.id}`}>
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            className="font-bold shadow-md"
                          >
                            View Order <FiChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}

        {totalPages > 1 && (
          <div className="flex justify-end pt-4 border-t border-muted-sand/20">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => updateParam('page', p.toString())}
            />
          </div>
        )}
      </motion.div>
    </>
  );
}
