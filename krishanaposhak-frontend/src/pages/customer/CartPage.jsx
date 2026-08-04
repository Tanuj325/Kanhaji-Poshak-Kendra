import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import CouponInput from '@/components/cart/CouponInput';
import EmptyCart from '@/components/cart/EmptyCart';
import CartPageSkeleton from '@/components/cart/CartSkeleton';
import RecommendedProducts from '@/components/cart/RecommendedProducts';
import CartHeader from '@/components/cart/CartHeader';
import CartTrustBadges from '@/components/cart/CartTrustBadges';
import CartStickyMobileBar from '@/components/cart/CartStickyMobileBar';
import CartClearModal from '@/components/cart/CartClearModal';

import { useCartContext } from '@/context/CartContext';
import { siteConfig } from '@/config/siteConfig';
import { FiTrash2, FiArrowRight, FiLock, FiShield, FiRefreshCw } from 'react-icons/fi';

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
        className="container-page py-4 sm:py-8 px-3.5 sm:px-6 lg:px-8 pb-36 lg:pb-16 space-y-5 sm:space-y-8 font-display"
      >
        <Breadcrumb items={breadcrumbItems} />

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Header Section with Stepper */}
            <CartHeader currentStep={1} itemCount={items.length} />

            {/* Clear Cart Button Bar */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-rose-700 transition-colors px-3.5 py-2 rounded-xl hover:bg-rose-50 border border-amber-900/10 min-h-[44px]"
              >
                <FiTrash2 className="h-4 w-4 text-rose-600 shrink-0" />
                <span>Clear Entire Cart</span>
              </button>
            </div>

            {/* Main Cart Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
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

                {/* Trust Badges under cart items on desktop */}
                <CartTrustBadges />
              </div>

              {/* Right Column: Sticky Order Summary */}
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

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 hover:from-amber-950 hover:to-stone-950 text-white font-bold py-4 px-6 text-base shadow-xl hover:shadow-2xl shadow-amber-900/20 flex items-center justify-center gap-2.5 transition-all duration-300 min-h-[52px] group border border-amber-500/20"
                >
                  <FiLock className="h-5 w-5 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>Proceed to Checkout</span>
                  <FiArrowRight className="h-5 w-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-stone-500 pt-1">
                  <FiShield className="h-4 w-4 text-emerald-600" />
                  <span>100% Safe & Secure Checkout Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Recommended Products Carousel at Bottom */}
            <RecommendedProducts title="Complete Your Deity's Shringar" limit={4} />
          </div>
        )}
      </motion.div>

      {/* Mobile Sticky Checkout Footer Bar */}
      {items.length > 0 && (
        <CartStickyMobileBar
          grandTotal={finalGrandTotal}
          subTotal={subtotal}
          discount={finalDiscount}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* Clear Cart Confirmation Modal */}
      <CartClearModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearCart}
        isLoading={isClearing}
      />
    </>
  );
}

export default CartPage;
