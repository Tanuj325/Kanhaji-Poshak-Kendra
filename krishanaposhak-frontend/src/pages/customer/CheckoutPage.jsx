import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { AddressSelector, CheckoutOrderSummary, PaymentSection, PaymentFailureModal } from '@/components/checkout';
import CouponInput from '@/components/cart/CouponInput';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTE_PATHS, buildPath } from '@/routes/routePaths';
import { formatPrice } from '@/utils/formatPrice';

import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from '@/hooks/useAddresses';
import { usePlaceOrder } from '@/hooks/useOrders';
import { usePlaceRazorpayOrder } from '@/hooks/usePlaceRazorpayOrder';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { paymentService } from '@/services';
import { siteConfig } from '@/config/siteConfig';
import { calculateShipping } from '@/utils/shippingCalculator';
import { FiMapPin, FiCreditCard, FiCheckCircle, FiShield, FiLock, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const breadcrumbItems = [
  { label: 'Home', href: ROUTE_PATHS.HOME },
  { label: 'Cart', href: ROUTE_PATHS.CART },
  { label: 'Checkout' },
];

const STEPS = [
  { id: 'address', label: 'Shipping Address', icon: FiMapPin },
  { id: 'payment', label: 'Payment & Promo', icon: FiCreditCard },
  { id: 'review', label: 'Review & Place Order', icon: FiCheckCircle },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { cartItems, cartCount, subtotal, discount, shippingCharge, isLoading: cartLoading, isError: cartError, loadCart } = useCartContext();

  const [currentStep, setCurrentStep] = useState('address');
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      if (location.state?.appliedCoupon) return location.state.appliedCoupon;
      const saved = sessionStorage.getItem('kp_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponCode, setCouponCode] = useState(() => appliedCoupon?.code || location.state?.couponCode || null);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderError, setOrderError] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [failureModalOpen, setFailureModalOpen] = useState(false);
  const [failureReason, setFailureReason] = useState('');

  const paymentLockRef = useRef(false);

  const { data: addresses, isLoading: addrLoading, isError: addrError, refetch: refetchAddresses } = useAddresses();
  const createAddr = useCreateAddress();
  const updateAddr = useUpdateAddress();
  const deleteAddr = useDeleteAddress();
  const setDefaultAddr = useSetDefaultAddress();
  const placeOrderMutation = usePlaceOrder();
  const razorpayOrderMutation = usePlaceRazorpayOrder();
  const { loadRazorpayScript, initiatePayment, verifyPayment, isVerifying, resetPaymentLock } = useRazorpayPayment();

  const addrList = useMemo(() => (Array.isArray(addresses) ? addresses : []), [addresses]);

  const selectedAddress = useMemo(() => {
    return addrList.find((a) => a.id === selectedAddressId) || null;
  }, [addrList, selectedAddressId]);

  useEffect(() => {
    if (!addrLoading && addrList.length > 0 && !selectedAddressId) {
      const defaultAddr = addrList.find((a) => a.defaultAddress);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else {
        setSelectedAddressId(addrList[0].id);
      }
    }
  }, [addrLoading, addrList, selectedAddressId]);

  const isOrderValid = useMemo(() => {
    if (cartCount === 0) return false;
    if (!selectedAddressId) return false;
    return true;
  }, [cartCount, selectedAddressId]);

  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const finalDiscount = (discount || 0) + couponDiscount;
  const { shipping: activeShippingCharge } = calculateShipping(subtotal);
  const finalGrandTotal = Math.max(0, (subtotal + activeShippingCharge) - finalDiscount);

  const handleCouponApply = useCallback((code, discountAmount) => {
    const couponData = { code, discountAmount };
    setAppliedCoupon(couponData);
    setCouponCode(code);
    try {
      sessionStorage.setItem('kp_applied_coupon', JSON.stringify(couponData));
    } catch {
      // Ignore
    }
  }, []);

  const handleCouponRemove = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode(null);
    try {
      sessionStorage.removeItem('kp_applied_coupon');
    } catch {
      // Ignore
    }
  }, []);

  const handlePlaceCODOrder = useCallback(async () => {
    if (!isOrderValid || paymentLockRef.current) return;
    paymentLockRef.current = true;
    setOrderError(null);
    setIsProcessingOrder(true);

    try {
      const payload = {
        shippingAddressId: selectedAddressId,
        paymentMethod: 'COD',
        ...(couponCode && { couponCode }),
        ...(orderNotes && { orderNotes }),
      };

      const response = await placeOrderMutation.mutateAsync(payload);
      const placedOrder = response?.data || response;
      const orderId = placedOrder?.id;

      try {
        sessionStorage.removeItem('kp_applied_coupon');
      } catch {
        // Ignore
      }

      if (orderId) {
        try {
          await paymentService.initiate({ orderId, paymentMethod: 'COD' });
        } catch {
          // Non-blocking
        }
        await loadCart();
        toast.success('Order placed successfully!');
        navigate(buildPath.orderConfirmation(orderId));
      } else {
        await loadCart();
        toast.success('Order placed successfully');
        navigate(ROUTE_PATHS.ORDERS);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to place order. Please try again.';
      setOrderError(msg);
      toast.error(msg);
    } finally {
      paymentLockRef.current = false;
      setIsProcessingOrder(false);
    }
  }, [isOrderValid, selectedAddressId, couponCode, orderNotes, placeOrderMutation, loadCart, navigate]);

  const handleRazorpayOrder = useCallback(async () => {
    if (!isOrderValid || paymentLockRef.current) return;
    paymentLockRef.current = true;
    setOrderError(null);
    setIsProcessingOrder(true);

    try {
      await loadRazorpayScript();

      const payload = {
        shippingAddressId: selectedAddressId,
        paymentMethod: 'RAZORPAY',
        ...(couponCode && { couponCode }),
        ...(orderNotes && { orderNotes }),
      };

      const razorpayResponse = await razorpayOrderMutation.mutateAsync(payload);
      const razorpayData = razorpayResponse?.data || razorpayResponse;

      if (!razorpayData?.id) {
        throw new Error('Razorpay order creation failed: No order ID returned');
      }

      initiatePayment({
        razorpayOrder: razorpayData,
        prefill: {
          name: selectedAddress?.fullName || user?.fullName || '',
          email: user?.email || '',
          contact: selectedAddress?.phoneNumber || user?.phoneNumber || '',
        },
        onSuccess: async (verifyPayload) => {
          try {
            const verificationResult = await verifyPayment(verifyPayload);
            const verifiedPayment = verificationResult?.data || verificationResult;
            const orderId = verifiedPayment?.orderId || razorpayData.receipt;

            try {
              sessionStorage.removeItem('kp_applied_coupon');
            } catch {
              // Ignore
            }

            await loadCart();
            toast.success('Payment verified! Order placed successfully.');
            if (orderId) {
              navigate(buildPath.orderConfirmation(orderId));
            } else {
              navigate(ROUTE_PATHS.ORDERS);
            }
          } catch (verifyErr) {
            const msg = verifyErr?.response?.data?.message || verifyErr?.message || 'Payment verification failed. Please contact support.';
            setFailureReason(msg);
            setFailureModalOpen(true);
            toast.error(msg);
          } finally {
            paymentLockRef.current = false;
            setIsProcessingOrder(false);
          }
        },
        onError: (err) => {
          paymentLockRef.current = false;
          setIsProcessingOrder(false);
          resetPaymentLock();
          const msg = err?.message || 'Payment was cancelled or could not be processed.';
          setFailureReason(msg);
          setFailureModalOpen(true);
        },
      });
    } catch (err) {
      paymentLockRef.current = false;
      setIsProcessingOrder(false);
      const msg = err?.response?.data?.message || err?.message || 'Failed to initialize online payment.';
      setOrderError(msg);
      setFailureReason(msg);
      setFailureModalOpen(true);
    }
  }, [isOrderValid, loadRazorpayScript, selectedAddressId, couponCode, orderNotes, razorpayOrderMutation, initiatePayment, selectedAddress, user, verifyPayment, loadCart, navigate, resetPaymentLock]);

  const handlePlaceOrder = useCallback(() => {
    if (paymentMethod === 'COD') {
      handlePlaceCODOrder();
    } else {
      handleRazorpayOrder();
    }
  }, [paymentMethod, handlePlaceCODOrder, handleRazorpayOrder]);

  if (cartLoading) {
    return (
      <div className="container-page py-12 flex items-center justify-center min-h-[60vh]">
        <Spinner isFullPage label="Loading secure checkout..." />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="container-page py-12">
        <div className="text-center py-12 bg-white rounded-2xl p-8 border border-amber-900/10 shadow-xs max-w-md mx-auto">
          <p className="text-rose-700 font-bold mb-4">Unable to load your cart items.</p>
          <Button onClick={loadCart} variant="primary">Retry Checkout</Button>
        </div>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          title="Your cart is currently empty"
          message="Add items to your cart before proceeding to checkout."
          action={
            <Button variant="primary" onClick={() => navigate(ROUTE_PATHS.SHOP)}>
              Browse Divine Collection
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Checkout | ${siteConfig.name}`}</title>
        <meta name="description" content="Complete your order securely at Krishana Poshak." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${siteConfig.url}/checkout`} />
      </Helmet>

      <div className="container-page py-6 sm:py-8 bg-[#FAF7F2] min-h-screen font-display">
        <Breadcrumb items={breadcrumbItems} className="mb-6 text-xs" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-amber-900/10">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-amber-950">
              Secure Checkout
            </h1>
            <p className="text-xs text-stone-600 mt-1 font-body">
              Encrypted SSL & Official Bank Razorpay Integration
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-800/20">
            <FiShield className="h-4 w-4 text-amber-800" /> 100% Safe & Verified Purchase
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 bg-white rounded-2xl p-4 sm:p-5 border border-amber-900/10 shadow-xs">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {STEPS.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isPast = (currentStep === 'payment' && idx === 0) || (currentStep === 'review' && idx < 2);

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (isPast) setCurrentStep(step.id);
                  }}
                  disabled={!isPast && !isActive}
                  className={`flex min-h-[52px] flex-col items-center gap-1 p-2 sm:flex-row sm:gap-2 sm:p-3.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-amber-900 text-amber-50 shadow-md font-bold'
                      : isPast
                        ? 'bg-amber-100/70 text-amber-950 hover:bg-amber-100 cursor-pointer font-bold'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed text-xs'
                  }`}
                >
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    isActive ? 'bg-amber-50 text-amber-950 font-bold' : isPast ? 'bg-amber-900 text-amber-50' : 'bg-stone-200 text-stone-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="text-[10px] sm:text-sm truncate">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 'address' && (
                <motion.div
                  key="step-address"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <AddressSelector
                    addresses={addresses}
                    isLoading={addrLoading}
                    isError={addrError}
                    onRetry={refetchAddresses}
                    selectedId={selectedAddressId}
                    onSelect={setSelectedAddressId}
                    onCreate={(data) => createAddr.mutateAsync(data)}
                    onUpdate={(id, data) => updateAddr.mutateAsync({ addressId: id, data })}
                    onDelete={(id) => deleteAddr.mutateAsync(id)}
                    onSetDefault={(id) => setDefaultAddr.mutateAsync(id)}
                  />

                  <div className="flex justify-stretch sm:justify-end pt-2">
                    <button
                      type="button"
                      disabled={!selectedAddressId}
                      onClick={() => setCurrentStep('payment')}
                      className="w-full sm:w-auto rounded-xl bg-amber-900 text-white font-bold py-3.5 px-6 sm:px-8 text-sm shadow-md hover:bg-amber-950 disabled:opacity-50 min-h-[48px] flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Payment & Promo</span>
                      <FiChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'payment' && (
                <motion.div
                  key="step-payment"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Coupon Section */}
                  <div className="rounded-2xl bg-white border border-amber-900/10 p-5 shadow-xs">
                    <h3 className="font-heading text-base font-bold text-amber-950 mb-3">Apply Promotional Coupon</h3>
                    <CouponInput
                      orderAmount={subtotal}
                      appliedCoupon={couponCode ? { code: couponCode } : null}
                      onApply={handleCouponApply}
                      onRemove={handleCouponRemove}
                    />
                  </div>

                  {/* Payment Method Section */}
                  <PaymentSection
                    selectedMethod={paymentMethod}
                    onSelectMethod={setPaymentMethod}
                    onPlaceOrder={() => setCurrentStep('review')}
                    isPlacingOrder={false}
                    isCreatingRazorpay={false}
                    isValid={isOrderValid}
                    error={orderError}
                    grandTotal={finalGrandTotal}
                  />

                  <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('address')}
                      className="text-xs font-bold text-stone-600 hover:text-amber-950 py-2.5 px-4 min-h-[44px]"
                    >
                      ← Back to Address
                    </button>
                    <button
                      type="button"
                      disabled={!isOrderValid}
                      onClick={() => setCurrentStep('review')}
                      className="w-full sm:w-auto rounded-xl bg-amber-900 text-white font-bold py-3.5 px-6 sm:px-8 text-sm shadow-md hover:bg-amber-950 disabled:opacity-50 min-h-[48px] flex items-center justify-center gap-2"
                    >
                      <span>Review Order Details</span>
                      <FiChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 'review' && (
                <motion.div
                  key="step-review"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Address Summary */}
                  {selectedAddress && (
                    <div className="rounded-2xl bg-white border border-amber-900/10 p-5 shadow-xs">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">Deliver To</h4>
                        <button
                          type="button"
                          onClick={() => setCurrentStep('address')}
                          className="text-xs font-bold text-amber-800 hover:underline min-h-[44px] flex items-center"
                        >
                          Change
                        </button>
                      </div>
                      <p className="text-sm font-bold text-amber-950">{selectedAddress.fullName}</p>
                      <p className="text-xs text-stone-600 mt-0.5">{selectedAddress.phoneNumber}</p>
                      <p className="text-xs text-stone-600 mt-1 font-body">
                        {selectedAddress.addressLine1}{selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}<br />
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode}
                      </p>
                    </div>
                  )}

                  {/* Payment Method Summary */}
                  <div className="rounded-2xl bg-white border border-amber-900/10 p-5 shadow-xs">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">Payment Option</h4>
                      <button
                        type="button"
                        onClick={() => setCurrentStep('payment')}
                        className="text-xs font-bold text-amber-800 hover:underline min-h-[44px] flex items-center"
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-sm font-bold text-amber-950">
                      {paymentMethod === 'COD' ? 'Cash on Delivery (Pay upon delivery)' : 'Online Payment via Razorpay (UPI, Cards, Netbanking)'}
                    </p>
                  </div>

                  {/* Order Notes */}
                  <div className="rounded-2xl bg-white border border-amber-900/10 p-5 shadow-xs">
                    <label htmlFor="order-notes" className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
                      Delivery Instructions / Order Notes (Optional)
                    </label>
                    <textarea
                      id="order-notes"
                      rows={2}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Leave with security, call before delivery..."
                      className="w-full rounded-xl border border-amber-900/15 p-3 text-xs text-amber-950 focus:border-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-700/30 font-body"
                    />
                  </div>

                  {orderError && (
                    <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-700">
                      {orderError}
                    </div>
                  )}

                  {/* Final Place Order Action */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('payment')}
                      className="text-xs font-bold text-stone-600 hover:text-amber-950 py-2.5 px-4 min-h-[44px]"
                    >
                      ← Back to Payment
                    </button>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={!isOrderValid || isProcessingOrder || placeOrderMutation.isPending || razorpayOrderMutation.isPending || isVerifying}
                      className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 hover:from-amber-950 hover:to-stone-950 text-white font-bold py-3.5 px-10 text-sm shadow-md flex items-center justify-center gap-2 min-h-[48px]"
                    >
                      <FiLock className="h-4 w-4 text-amber-200" />
                      <span>{paymentMethod === 'COD' ? 'Confirm & Place COD Order' : `Pay ${formatPrice(finalGrandTotal)}`}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="space-y-4 lg:sticky lg:top-24">
              <CheckoutOrderSummary
                items={cartItems}
                subtotal={subtotal}
                discount={finalDiscount}
                shippingCharge={activeShippingCharge}
                grandTotal={finalGrandTotal}
                couponCode={couponCode}
                onRemoveCoupon={handleCouponRemove}
              />

              <div className="rounded-2xl bg-amber-100/50 border border-amber-900/10 p-4 text-center">
                <p className="text-xs font-bold text-amber-950 font-body">
                  ✨ Guaranteed Authentic Meerut Deity Attire & Safe Shipping across India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Failure Modal */}
      <PaymentFailureModal
        isOpen={failureModalOpen}
        onClose={() => setFailureModalOpen(false)}
        errorReason={failureReason}
        onRetryRazorpay={() => {
          setFailureModalOpen(false);
          handleRazorpayOrder();
        }}
        onSwitchToCOD={() => {
          setFailureModalOpen(false);
          setPaymentMethod('COD');
          setCurrentStep('review');
        }}
        isRetrying={isProcessingOrder}
      />
    </>
  );
}

export default CheckoutPage;
