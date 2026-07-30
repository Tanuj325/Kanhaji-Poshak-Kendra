import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';
import ConfirmDialog from '@/components/overlay/ConfirmDialog';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import CouponInput from '@/components/cart/CouponInput';
import EmptyCart from '@/components/cart/EmptyCart';
import CartPageSkeleton from '@/components/cart/CartSkeleton';
import RecommendedProducts from '@/components/cart/RecommendedProducts';
import { useCartContext } from '@/context/CartContext';
import { siteConfig } from '@/config/siteConfig';
import { formatPrice } from '@/utils/formatPrice';
import { FiShoppingBag, FiTrash2, FiArrowRight, FiLock, FiShield, FiRefreshCw } from 'react-icons/fi';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Shopping Cart' },
];

function CartPage() {
  const {
    isLoading,
    isError,
    error,
    cartItems,
    subtotal,
    discount,
    shippingCharge,
    grandTotal,
    updateQuantity,
    removeItem,
    clearCart,
    moveToWishlist,
    isUpdating,
    isClearing,
    refetch,
  } = useCartContext();

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = sessionStorage.getItem('kp_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  const items = cartItems || [];

  // Parse HTTP error status or message for professional retry UI
  const status = error?.response?.status;
  const getErrorMessageByStatus = (status) => {
    switch (status) {
      case 401:
        return 'Session expired. Please login to view your cart.';
      case 403:
        return 'You do not have permission to access this shopping cart.';
      case 404:
        return 'Shopping cart not found. Please try refreshing.';
      case 409:
        return 'Cart conflict detected. Please update your items.';
      case 422:
        return 'Invalid cart parameters provided.';
      case 429:
        return 'Too many requests. Please wait a moment and retry.';
      case 500:
      case 503:
        return 'Server is temporarily busy. Please try again shortly.';
      default:
        return error?.message || 'Unable to load shopping cart';
    }
  };

  const errorMessage = getErrorMessageByStatus(status);

  const handleUpdateQuantity = useCallback(
    (cartItemId, quantity) => {
      if (quantity < 1) return;
      updateQuantity(cartItemId, quantity);
    },
    [updateQuantity],
  );

  const handleRemoveItem = useCallback(
    (cartItemId) => {
      removeItem(cartItemId);
    },
    [removeItem],
  );

  const handleClearCart = useCallback(async () => {
    await clearCart();
    setAppliedCoupon(null);
    try {
      sessionStorage.removeItem('kp_applied_coupon');
    } catch {
      // Ignore
    }
    setShowClearConfirm(false);
  }, [clearCart]);

  const handleApplyCoupon = useCallback((code, discountAmount) => {
    const couponData = { code, discountAmount };
    setAppliedCoupon(couponData);
    try {
      sessionStorage.setItem('kp_applied_coupon', JSON.stringify(couponData));
    } catch {
      // Ignore
    }
  }, []);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    try {
      sessionStorage.removeItem('kp_applied_coupon');
    } catch {
      // Ignore
    }
  }, []);

  const handleProceedToCheckout = useCallback(() => {
    navigate('/checkout', { state: { appliedCoupon } });
  }, [navigate, appliedCoupon]);

  if (isLoading) {
    return <CartPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="container-page py-12 font-display">
        <ErrorState
          title="Cart Unavailable"
          message={errorMessage}
          onRetry={refetch}
          action={
            status === 401 ? (
              <Link to="/login">
                <Button variant="primary" size="md">
                  Log In to Account
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="md" onClick={refetch} leftIcon={<FiRefreshCw className="h-4 w-4" />}>
                Retry Loading Cart
              </Button>
            )
          }
        />
      </div>
    );
  }

  const finalDiscount = appliedCoupon ? discount + appliedCoupon.discountAmount : discount;
  const finalGrandTotal = appliedCoupon ? Math.max(0, grandTotal - appliedCoupon.discountAmount) : grandTotal;

  return (
    <>
      <Helmet>
        <title>{`Shopping Cart (${items.length}) | ${siteConfig.name}`}</title>
        <meta name="description" content="Review your Krishna Poshak items and proceed to secure luxury checkout" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="container-page py-6 sm:py-8 pb-32 lg:pb-16 space-y-6 sm:space-y-8 font-display"
      >
        <Breadcrumb items={breadcrumbItems} />

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-900/10">
              <div>
                <span className="text-xs font-bold text-amber-900 uppercase tracking-widest bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/40">
                  ✦ Sacred Shopping Cart ✦
                </span>
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-950 mt-1 flex items-center gap-3">
                  <FiShoppingBag className="h-7 w-7 text-amber-800 shrink-0" />
                  <span>Shopping Cart</span>
                  <span className="text-sm font-sans font-bold text-stone-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-rose-700 transition-colors px-3 py-2 rounded-xl hover:bg-rose-50 border border-amber-900/10 min-h-[40px]"
                >
                  <FiTrash2 className="h-4 w-4" />
                  <span>Clear Entire Cart</span>
                </button>
              </div>
            </div>

            {/* Main Cart Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-8 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem
                      key={`cart-page-item-${item.cartItemId || item.id || item.variantId || item.productId}`}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                      onMoveToWishlist={moveToWishlist}
                      isUpdating={isUpdating}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Right Column: Sticky Order Summary & Checkout */}
              <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
                <CouponInput
                  orderAmount={subtotal}
                  appliedCoupon={appliedCoupon}
                  onApply={handleApplyCoupon}
                  onRemove={handleRemoveCoupon}
                />

                <CartSummary
                  subTotal={subtotal}
                  discount={finalDiscount}
                  shippingCharge={shippingCharge}
                  grandTotal={finalGrandTotal}
                  totalItems={items.length}
                />

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 hover:from-amber-950 hover:to-stone-950 text-white font-bold py-4 px-6 text-base shadow-xl hover:shadow-2xl shadow-amber-900/20 flex items-center justify-center gap-2.5 transition-all duration-300 min-h-[52px] group"
                >
                  <FiLock className="h-5 w-5 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>Proceed to Checkout</span>
                  <FiArrowRight className="h-5 w-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-stone-500 pt-1">
                  <FiShield className="h-4 w-4 text-emerald-600" />
                  <span>Free Return & Refund Policy Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Recommended Products Carousel at Bottom */}
            <RecommendedProducts title="Complete Your Deity's Shringar" limit={4} />
          </div>
        )}
      </motion.div>

      {/* Sticky Mobile Purchase Footer Bar */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-amber-900/10 p-3.5 sm:p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">Grand Total</span>
            <p className="font-heading font-extrabold text-lg sm:text-xl text-stone-950 leading-tight">
              {formatPrice(finalGrandTotal)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="rounded-xl bg-gradient-to-r from-amber-900 to-stone-900 text-white font-bold py-3 px-6 text-sm shadow-md flex items-center justify-center gap-2 flex-1 max-w-[240px] min-h-[44px]"
          >
            <span>Checkout Now</span>
            <FiArrowRight className="h-4 w-4 text-amber-300" />
          </button>
        </div>
      )}

      {/* Clear Cart Confirmation Modal */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearCart}
        title="Clear Shopping Cart"
        message="Are you sure you want to remove all items from your shopping cart? This action cannot be undone."
        confirmText="Clear Entire Cart"
        type="danger"
        isLoading={isClearing}
      />
    </>
  );
}

export default CartPage;