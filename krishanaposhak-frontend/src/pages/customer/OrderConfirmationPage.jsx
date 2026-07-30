import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useOrder } from '@/hooks/useOrders';
import { formatPrice } from '@/utils/formatPrice';
import { formatDate } from '@/utils/formatDate';
import { siteConfig } from '@/config/siteConfig';
import { ROUTE_PATHS, buildPath } from '@/routes/routePaths';

const orderStatusColor = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  PACKING: 'info',
  SHIPPED: 'info',
  OUT_FOR_DELIVERY: 'info',
  DELIVERED: 'success',
  CANCELLED: 'danger',
  RETURNED: 'warning',
};

const paymentStatusColor = {
  PENDING: 'warning',
  PAID: 'success',
  FAILED: 'danger',
  REFUNDED: 'info',
  PARTIALLY_REFUNDED: 'info',
};

function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId);

  const orderData = useMemo(() => {
    if (!order) return null;
    return order?.data || order;
  }, [order]);

  if (!orderId) {
    return (
      <div className="container-page section-padding">
        <EmptyState
          title="No order specified"
          message="Please use a valid order link to view your confirmation."
          action={
            <Button variant="primary" onClick={() => navigate(ROUTE_PATHS.HOME)}>
              Go Home
            </Button>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-page section-padding">
        <Spinner isFullPage label="Loading order details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-page section-padding">
        <ErrorState
          title="Failed to load order"
          message={error?.message || 'Something went wrong'}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container-page section-padding">
        <EmptyState
          title="Order not found"
          message="The order you're looking for doesn't exist."
          action={
            <Button variant="primary" onClick={() => navigate(ROUTE_PATHS.ORDERS)}>
              View My Orders
            </Button>
          }
        />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: ROUTE_PATHS.HOME },
    { label: 'Cart', href: ROUTE_PATHS.CART },
    { label: 'Checkout', href: ROUTE_PATHS.CHECKOUT },
    { label: 'Order Confirmed' },
  ];

  const isPaymentOnline = orderData.paymentStatus !== 'PENDING' || orderData.paymentMethod === 'RAZORPAY';

  return (
    <>
      <Helmet>
        <title>Order Confirmed | {siteConfig.name}</title>
        <meta name="description" content={`Order ${orderData.orderNumber} confirmed successfully`} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${siteConfig.url}/order/confirmation/${orderId}`} />
        <meta property="og:title" content={`Order Confirmed | ${siteConfig.name}`} />
      </Helmet>

      <div className="container-page section-padding">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success/10 mb-4">
              <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-semibold text-dark-charcoal">
              Order Confirmed!
            </h1>
            <p className="text-natural-wood mt-2">
              Thank you for your order. Your order number is:
            </p>
            <p className="font-display text-xl font-semibold text-royal-blue mt-1">
              #{orderData.orderNumber}
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-white border border-muted-sand/30 p-4 sm:p-6">
              <h3 className="font-display text-lg font-semibold text-dark-charcoal mb-4">Order Status</h3>
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-xs text-natural-wood mb-1">Order Status</p>
                  <Badge variant={orderStatusColor[orderData.orderStatus] || 'default'}>
                    {orderData.orderStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-natural-wood mb-1">Payment Status</p>
                  <Badge variant={paymentStatusColor[orderData.paymentStatus] || 'default'}>
                    {orderData.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-natural-wood mb-1">Order Date</p>
                  <p className="text-sm font-medium text-dark-charcoal">
                    {formatDate(orderData.orderDate || orderData.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {Array.isArray(orderData.items) && orderData.items.length > 0 && (
              <div className="rounded-lg bg-white border border-muted-sand/30 p-4 sm:p-6">
                <h3 className="font-display text-lg font-semibold text-dark-charcoal mb-4">Items</h3>
                <div className="divide-y divide-muted-sand/20">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-warm-cream">
                        <img
                          src={item.imageUrl || '/placeholder.svg'}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-charcoal">{item.productName}</p>
                        {item.size && <p className="text-xs text-natural-wood">Size: {item.size}</p>}
                        <p className="text-xs text-natural-wood">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-dark-charcoal">{formatPrice(item.totalPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg bg-white border border-muted-sand/30 p-4 sm:p-6">
              <h3 className="font-display text-lg font-semibold text-dark-charcoal mb-4">Order Total</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-natural-wood">Subtotal</span>
                  <span className="text-dark-charcoal font-medium">{formatPrice(orderData.subTotal)}</span>
                </div>
                {orderData.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-success">Discount</span>
                    <span className="text-success font-medium">-{formatPrice(orderData.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-natural-wood">Shipping</span>
                  <span className="text-dark-charcoal font-medium">
                    {orderData.shippingCharge > 0 ? formatPrice(orderData.shippingCharge) : <span className="text-emerald-600 font-bold">✓ FREE DELIVERY</span>}
                  </span>
                </div>
              </div>
              <div className="border-t border-muted-sand/20 mt-3 pt-3 flex justify-between">
                <span className="font-semibold text-dark-charcoal">Total</span>
                <span className="font-bold text-xl text-royal-blue">{formatPrice(orderData.totalAmount)}</span>
              </div>
            </div>

            {(orderData.addressLine1 || orderData.customerName) && (
              <div className="rounded-lg bg-white border border-muted-sand/30 p-4 sm:p-6">
                <h3 className="font-display text-lg font-semibold text-dark-charcoal mb-4">Shipping Address</h3>
                <p className="text-sm font-medium text-dark-charcoal">{orderData.customerName}</p>
                <p className="text-xs text-natural-wood">{orderData.customerPhone}</p>
                <p className="text-xs text-natural-wood mt-1">
                  {orderData.addressLine1}{orderData.addressLine2 ? ", " + orderData.addressLine2 : ""}<br />
                  {orderData.city}, {orderData.state} - {orderData.postalCode}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link to={ROUTE_PATHS.SHOP}>
                <Button variant="outline">Continue Shopping</Button>
              </Link>
              <Link to={"/account/orders/" + orderData.id}>
                <Button variant="primary">View Order Details</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderConfirmationPage;