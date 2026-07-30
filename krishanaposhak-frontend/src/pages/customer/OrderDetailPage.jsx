import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { OrderTimeline, WriteReviewModal } from '@/components/customer';
import PrintableInvoice from '@/components/invoice/PrintableInvoice';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Badge from '@/components/ui/Badge';
import Divider from '@/components/ui/Divider';
import ConfirmDialog from '@/components/overlay/ConfirmDialog';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { useOrder, useCancelOrder } from '@/hooks/useOrders';
import { useAddToCart } from '@/hooks/useCart';
import { siteConfig } from '@/config/siteConfig';
import toast from 'react-hot-toast';
import {
  FiPrinter,
  FiXCircle,
  FiMapPin,
  FiPhone,
  FiCreditCard,
  FiShoppingBag,
  FiStar,
  FiCheckCircle,
  FiRefreshCw,
  FiFileText,
  FiShield,
} from 'react-icons/fi';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId);
  const cancelOrder = useCancelOrder();
  const addToCart = useAddToCart();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedReviewProduct, setSelectedReviewProduct] = useState(null);
  const [isBuyingAgain, setIsBuyingAgain] = useState(false);

  const handleCancelOrder = async () => {
    try {
      await cancelOrder.mutateAsync(orderId);
      toast.success('Order cancelled successfully');
      setIsCancelModalOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleBuyAgain = async () => {
    const itemsList = order?.items || [];
    if (itemsList.length === 0) return;
    setIsBuyingAgain(true);
    try {
      for (const item of itemsList) {
        if (item.variantId) {
          await addToCart.mutateAsync({ productVariantId: item.variantId, quantity: item.quantity || 1 });
        }
      }
      toast.success('All items added to your shopping cart');
    } catch (err) {
      toast.error('Could not add some items to cart');
    } finally {
      setIsBuyingAgain(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'My Account', href: '/account/profile' },
            { label: 'Orders', href: '/account/orders' },
            { label: 'Loading...' },
          ]}
        />
        <Skeleton variant="text" className="h-8 w-48 bg-temple-gold/20" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton variant="card" className="h-64 w-full rounded-3xl bg-temple-gold/15" />
            <Skeleton variant="card" className="h-40 w-full rounded-3xl bg-temple-gold/15" />
          </div>
          <Skeleton variant="card" className="h-64 w-full rounded-3xl bg-temple-gold/15" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 max-w-4xl">
        <ErrorState
          title="Order Details Unavailable"
          message={getErrorMessage(error)}
          onRetry={refetch}
        />
      </div>
    );
  }

  const items = order?.items || [];
  const canCancel = ['PENDING', 'CONFIRMED', 'PROCESSING', 'PACKING'].includes(order?.orderStatus);
  const isDelivered = order?.orderStatus === 'DELIVERED';

  return (
    <>
      <Helmet>
        <title>{`Order #${order?.orderNumber || ''} | ${siteConfig.name}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 max-w-5xl font-display print:hidden"
      >
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'My Account', href: '/account/profile' },
            { label: 'Orders', href: '/account/orders' },
            { label: `#${order?.orderNumber || ''}` },
          ]}
        />

        {/* Luxury Order Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-warm-cream/30 to-temple-gold/10 p-6 sm:p-7 rounded-3xl border border-temple-gold/30 shadow-md print:shadow-none print:border-none">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-dark-charcoal">
                Order #{order?.orderNumber}
              </h1>
              <Badge variant={order?.orderStatus === 'DELIVERED' ? 'success' : order?.orderStatus === 'CANCELLED' ? 'danger' : 'warning'} className="font-bold border border-black/10">
                {order?.orderStatus}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-natural-wood mt-1 font-medium">
              Placed on {order?.orderDate ? formatDate(order.orderDate, { format: 'datetime' }) : 'N/A'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 print:hidden">
            {items.length > 0 && items[0]?.variantId && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBuyAgain}
                isLoading={isBuyingAgain}
                leftIcon={<FiRefreshCw className="h-4 w-4" />}
              >
                Buy Again
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={handlePrintInvoice} leftIcon={<FiPrinter className="h-4 w-4" />}>
              Invoice
            </Button>

            {canCancel && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsCancelModalOpen(true)}
                isLoading={cancelOrder.isPending}
                leftIcon={<FiXCircle className="h-4 w-4" />}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* Status Tracking Timeline Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-md border border-temple-gold/20 print:hidden">
          <h2 className="font-serif text-lg font-bold text-dark-charcoal mb-4">
            Order Status Tracking
          </h2>
          <OrderTimeline
            currentStatus={order?.orderStatus}
            orderDate={order?.orderDate}
            deliveredDate={order?.deliveredDate}
            cancelledAt={order?.cancelledAt}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Itemized List */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-md border border-temple-gold/20 space-y-4">
              <h2 className="font-serif text-lg font-bold text-dark-charcoal flex items-center gap-2 border-b border-muted-sand/20 pb-3">
                <FiShoppingBag className="h-5 w-5 text-temple-gold" /> Purchased Items ({items.length})
              </h2>

              <div className="divide-y divide-muted-sand/15">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.imageUrl || '/placeholder.svg'}
                        alt={item.productName}
                        className="h-16 w-16 rounded-2xl object-cover bg-warm-cream border border-muted-sand/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link to={`/product/${item.productId || item.id}`} className="font-bold text-dark-charcoal text-sm hover:text-royal-blue transition-colors leading-snug block truncate">
                          {item.productName}
                        </Link>
                        {item.size && <p className="text-xs text-natural-wood mt-0.5 font-medium">Size: {item.size}</p>}
                        <p className="text-xs text-natural-wood/80 mt-0.5 font-medium">Qty: {item.quantity} × {formatPrice(item.price || 0)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <p className="font-display font-bold text-royal-blue text-base">
                        {formatPrice(item.totalPrice || (item.price || 0) * (item.quantity || 1))}
                      </p>

                      {isDelivered && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setSelectedReviewProduct(item)}
                          leftIcon={<FiStar className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address Details */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-md border border-temple-gold/20 space-y-3">
              <h2 className="font-serif text-lg font-bold text-dark-charcoal flex items-center gap-2 border-b border-muted-sand/20 pb-3">
                <FiMapPin className="h-5 w-5 text-temple-gold" /> Delivery Address
              </h2>
              <div className="text-xs text-dark-charcoal/90 space-y-1.5 leading-relaxed pt-1">
                <p className="font-bold text-sm text-dark-charcoal">{order?.shippingAddress?.fullName || order?.customerName || 'Customer'}</p>
                {order?.shippingAddress?.phoneNumber && (
                  <p className="flex items-center gap-1.5 font-semibold text-royal-blue">
                    <FiPhone className="h-3.5 w-3.5 text-royal-blue" /> {order.shippingAddress.phoneNumber}
                  </p>
                )}
                {order?.shippingAddress?.addressLine1 && <p className="font-normal">{order.shippingAddress.addressLine1}</p>}
                {order?.shippingAddress?.addressLine2 && <p className="text-natural-wood">{order.shippingAddress.addressLine2}</p>}
                {(order?.shippingAddress?.city || order?.shippingAddress?.state) && (
                  <p className="font-semibold text-dark-charcoal">
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                  </p>
                )}
                {order?.shippingAddress?.country && <p className="text-natural-wood text-[11px] font-bold uppercase tracking-wider">{order.shippingAddress.country}</p>}
              </div>
            </div>
          </div>

          {/* Right Column Summary */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-md border border-temple-gold/20 space-y-3">
              <h2 className="font-serif text-lg font-bold text-dark-charcoal pb-3 border-b border-muted-sand/20 flex items-center gap-2">
                <FiFileText className="h-5 w-5 text-temple-gold" /> Invoice Summary
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-natural-wood">Items Subtotal</span>
                  <span className="font-bold text-dark-charcoal">{formatPrice(order?.subTotal || order?.totalAmount || 0)}</span>
                </div>
                {typeof order?.discount === 'number' && order.discount > 0 && (
                  <div className="flex justify-between font-medium">
                    <span className="text-emerald-600">Discount Coupon</span>
                    <span className="text-emerald-600 font-bold">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium">
                  <span className="text-natural-wood">Shipping Charge</span>
                  <span className="font-bold text-dark-charcoal">
                    {order?.shippingCharge === 0 ? <span className="text-emerald-600 font-bold">✓ FREE DELIVERY</span> : formatPrice(order?.shippingCharge || 0)}
                  </span>
                </div>
                <Divider />
                <div className="flex justify-between font-bold text-base pt-1">
                  <span>Grand Total</span>
                  <span className="text-royal-blue font-display">{formatPrice(order?.totalAmount || 0)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info Card */}
            <div className="rounded-3xl bg-white p-6 shadow-md border border-temple-gold/20 space-y-3">
              <h2 className="font-serif text-lg font-bold text-dark-charcoal pb-3 border-b border-muted-sand/20 flex items-center gap-2">
                <FiCreditCard className="h-5 w-5 text-temple-gold" /> Payment Status
              </h2>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-natural-wood font-medium">Status</span>
                  <Badge variant={order?.paymentStatus === 'COMPLETED' ? 'success' : 'warning'} size="sm" className="font-bold">
                    {order?.paymentStatus || 'PENDING'}
                  </Badge>
                </div>
                {order?.paymentMethod && (
                  <div className="flex justify-between font-medium">
                    <span className="text-natural-wood">Payment Method</span>
                    <span className="font-bold text-dark-charcoal">{order.paymentMethod}</span>
                  </div>
                )}
                {order?.razorpayPaymentId && (
                  <div className="flex justify-between font-medium">
                    <span className="text-natural-wood">Payment ID</span>
                    <span className="font-mono text-[11px] text-dark-charcoal">{order.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cancel Order Confirmation Modal */}
      <ConfirmDialog
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        title="Cancel Order Confirmation"
        message={`Are you sure you want to cancel Order #${order?.orderNumber}? This action cannot be undone.`}
        confirmText="Yes, Cancel Order"
        type="danger"
        isLoading={cancelOrder.isPending}
      />

      {/* Review Product Modal */}
      {selectedReviewProduct && (
        <WriteReviewModal
          isOpen={!!selectedReviewProduct}
          onClose={() => setSelectedReviewProduct(null)}
          product={selectedReviewProduct}
        />
      )}

      {/* Hidden PDF Printable Invoice Document */}
      <PrintableInvoice order={order} />
    </>
  );
}
