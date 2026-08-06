import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/formatPrice';
import CouponInput from '@/components/cart/CouponInput';
import {
  FiChevronLeft,
  FiMapPin,
  FiShoppingBag,
  FiTag,
  FiCreditCard,
  FiLock,
  FiAlertCircle,
  FiShield,
  FiCheck,
  FiTruck,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiGift,
  FiEdit3,
  FiFileText,
  FiBox,
  FiHelpCircle,
} from 'react-icons/fi';

export default function MobileCheckoutSummary({
  cartItems = [],
  subtotal = 0,
  discount = 0,
  shippingCharge = 0,
  grandTotal = 0,
  selectedAddress,
  onChangeAddress,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  paymentMethod = 'RAZORPAY',
  onSelectPaymentMethod,
  orderNotes = '',
  onChangeOrderNotes,
  onPlaceOrder,
  isProcessing = false,
  isOrderValid = true,
  orderError = null,
  onBack,
}) {
  const [deliveryMethod, setDeliveryMethod] = useState('STANDARD');
  const [isProductsExpanded, setIsProductsExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-display flex flex-col justify-between selection:bg-amber-500/20">
      {/* ---------------------------------------------------- */}
      {/* STICKY TOP HEADER (Apple / Shopify Minimal Header) */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-amber-900/10 px-4 py-3 shadow-2xs font-display">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBack || onChangeAddress}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 text-amber-950 hover:bg-amber-100/80 active:scale-95 transition-all border border-amber-900/10 min-h-[40px] min-w-[40px]"
            aria-label="Go back to address selection"
          >
            <FiChevronLeft className="w-5 h-5 text-amber-900" />
          </button>

          <div className="text-center min-w-0 px-2">
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="font-heading text-base sm:text-lg font-extrabold text-amber-950 truncate">
                Order Review
              </h1>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300/50">
                Step 2 of 2
              </span>
            </div>
            <p className="text-[11px] font-semibold text-stone-500 tracking-tight flex items-center justify-center gap-1 mt-0.5">
              <FiLock className="w-3 h-3 text-emerald-600" /> 256-bit Encrypted Checkout
            </p>
          </div>

          <div className="w-10 h-10 flex items-center justify-end">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
              <FiShield className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* PROGRESS STEPPER BAR */}
      {/* ---------------------------------------------------- */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 text-white px-4 py-2.5 font-display shadow-inner">
        <div className="max-w-2xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 opacity-80">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">1</div>
            <span className="font-medium text-amber-200">Cart</span>
          </div>
          <div className="h-0.5 w-6 bg-amber-500/30 rounded-full" />
          <div className="flex items-center gap-1.5 opacity-80">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">2</div>
            <span className="font-medium text-amber-200">Address</span>
          </div>
          <div className="h-0.5 w-6 bg-amber-400 rounded-full" />
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-[10px] font-extrabold shadow-xs">3</div>
            <span className="font-extrabold text-white">Review & Pay</span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTAINER (Mobile & Tablet Responsive Container) */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-4 space-y-4 pb-36">
        {/* Error Alert if any */}
        {orderError && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-700 flex items-center gap-2.5 shadow-sm">
            <FiAlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span className="leading-relaxed">{orderError}</span>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* SECTION 1: PRODUCTS */}
        {/* ---------------------------------------------------- */}
        <section className="rounded-2xl bg-white border border-amber-900/10 shadow-sm overflow-hidden transition-all">
          <div
            onClick={() => setIsProductsExpanded(!isProductsExpanded)}
            className="p-4 bg-gradient-to-r from-amber-50/60 via-white to-amber-50/40 border-b border-amber-900/10 flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-900 text-amber-100 flex items-center justify-center shadow-xs">
                <FiShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xs sm:text-sm font-extrabold text-amber-950 uppercase tracking-wider">
                    Products
                  </h2>
                  <span className="bg-amber-900/10 text-amber-900 text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full">
                    {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">Verified Divine Apparel & Accessories</p>
              </div>
            </div>
            <button
              type="button"
              className="text-amber-900 p-1.5 hover:bg-amber-100/50 rounded-lg transition-colors"
              aria-label={isProductsExpanded ? 'Collapse Products' : 'Expand Products'}
            >
              {isProductsExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isProductsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <div className="p-4 divide-y divide-amber-900/10 space-y-3">
                  {cartItems.map((item, idx) => {
                    const itemPrice = item.price || item.unitPrice || 0;
                    const itemTotal = itemPrice * item.quantity;
                    const imgUrl = item.imageUrl || item.image || item.product?.imageUrl || '/placeholder.png';
                    const title = item.title || item.productName || 'Divine Product';
                    const variant = item.variantName || item.variant || null;

                    return (
                      <div key={item.id || idx} className="pt-3 first:pt-0 flex items-start gap-3.5">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-stone-100 border border-amber-900/10 overflow-hidden shrink-0 shadow-2xs">
                          <img
                            src={imgUrl}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 bg-amber-950/90 backdrop-blur-xs text-amber-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded-tl-md font-mono">
                            ×{item.quantity}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <h3 className="font-heading text-xs sm:text-sm font-extrabold text-amber-950 truncate leading-snug">
                            {title}
                          </h3>
                          {variant && (
                            <span className="inline-block bg-amber-50 text-amber-900 border border-amber-300/60 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              Option: {variant}
                            </span>
                          )}
                          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                            <span>{formatPrice(itemPrice)} × {item.quantity}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-heading font-extrabold text-xs sm:text-sm text-amber-950 block">
                            {formatPrice(itemTotal)}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 inline-block mt-1">
                            In Stock
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 2: SHIPPING ADDRESS */}
        {/* ---------------------------------------------------- */}
        <section className="rounded-2xl bg-white border border-amber-900/10 p-4 shadow-sm space-y-3 font-display">
          <div className="flex items-center justify-between pb-2.5 border-b border-amber-900/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-2xs">
                <FiMapPin className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-heading text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-950">
                  Shipping Address
                </h2>
                <p className="text-[11px] text-stone-500 font-medium">Destination for delivery</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onChangeAddress}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300/60 px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-2xs min-h-[36px]"
            >
              <FiEdit3 className="w-3.5 h-3.5" />
              <span>Change</span>
            </button>
          </div>

          {selectedAddress ? (
            <div className="bg-amber-50/40 border border-amber-900/10 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-xs sm:text-sm text-amber-950">
                    {selectedAddress.fullName}
                  </span>
                  <span className="bg-amber-200/80 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {selectedAddress.addressType || 'Home'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-stone-700 bg-white px-2 py-0.5 rounded-md border border-amber-900/10">
                  📞 {selectedAddress.phoneNumber}
                </span>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-body">
                {selectedAddress.addressLine1}
                {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}
                <br />
                <strong className="text-amber-950 font-bold">
                  {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.postalCode}
                </strong>
              </p>

              {orderNotes && (
                <div className="pt-2 mt-2 border-t border-amber-900/10 flex items-start gap-1.5 text-xs text-amber-900 bg-white/80 p-2 rounded-lg italic">
                  <FiFileText className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>"{orderNotes}"</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
              No shipping address selected. Please click Change to select one.
            </div>
          )}
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 3: DELIVERY METHOD */}
        {/* ---------------------------------------------------- */}
        <section className="rounded-2xl bg-white border border-amber-900/10 p-4 shadow-sm space-y-3 font-display">
          <div className="flex items-center justify-between pb-2.5 border-b border-amber-900/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-2xs">
                <FiTruck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-heading text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-950">
                  Delivery Method
                </h2>
                <p className="text-[11px] text-stone-500 font-medium">Estimated timeline & transit care</p>
              </div>
            </div>

            {shippingCharge === 0 ? (
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                ✨ Free Shipping
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Express Delivery
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {/* Standard Express Delivery Option */}
            <div
              onClick={() => setDeliveryMethod('STANDARD')}
              className={cn(
                'rounded-xl border p-3.5 cursor-pointer transition-all flex items-center justify-between gap-3',
                deliveryMethod === 'STANDARD'
                  ? 'border-[#D4AF37] bg-gradient-to-r from-[#FAF4E8] to-amber-50/50 ring-2 ring-[#D4AF37]/20 shadow-xs'
                  : 'border-amber-900/10 bg-white hover:border-amber-700/30'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                    deliveryMethod === 'STANDARD' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-stone-300'
                  )}
                >
                  {deliveryMethod === 'STANDARD' && <FiCheck className="h-2.5 w-2.5 text-amber-950 stroke-[3]" />}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-amber-950">
                      Standard Express Delivery
                    </span>
                    <span className="text-[10px] bg-stone-100 text-stone-700 font-bold px-1.5 py-0.5 rounded">
                      3–5 Business Days
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-body leading-relaxed">
                    Insured divine transit packaging • Real-time SMS tracking & OTP delivery verification
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 font-heading font-extrabold text-xs sm:text-sm text-amber-950">
                {shippingCharge === 0 ? (
                  <span className="text-emerald-700 font-extrabold">FREE</span>
                ) : (
                  formatPrice(shippingCharge)
                )}
              </div>
            </div>

            {/* Priority Express Delivery Option */}
            <div
              onClick={() => setDeliveryMethod('PRIORITY')}
              className={cn(
                'rounded-xl border p-3.5 cursor-pointer transition-all flex items-center justify-between gap-3',
                deliveryMethod === 'PRIORITY'
                  ? 'border-[#D4AF37] bg-gradient-to-r from-[#FAF4E8] to-amber-50/50 ring-2 ring-[#D4AF37]/20 shadow-xs'
                  : 'border-amber-900/10 bg-white hover:border-amber-700/30'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                    deliveryMethod === 'PRIORITY' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-stone-300'
                  )}
                >
                  {deliveryMethod === 'PRIORITY' && <FiCheck className="h-2.5 w-2.5 text-amber-950 stroke-[3]" />}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-amber-950">
                      Priority Express Shipping
                    </span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-950 font-bold px-1.5 py-0.5 rounded">
                      ⚡ 1–2 Days
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-body leading-relaxed">
                    Fast-track dispatch & priority courier routing with live GPS tracking
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 font-heading font-extrabold text-xs sm:text-sm text-amber-950">
                {shippingCharge === 0 ? (
                  <span className="text-emerald-700 font-extrabold">FREE</span>
                ) : (
                  formatPrice(shippingCharge)
                )}
              </div>
            </div>
          </div>

          {/* Delivery Guarantee Perks */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-900/10 text-center">
            <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-900/5">
              <FiBox className="w-3.5 h-3.5 text-amber-800 mx-auto mb-1" />
              <span className="text-[10px] font-extrabold text-amber-950 block">Safe Packaging</span>
            </div>
            <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-900/5">
              <FiClock className="w-3.5 h-3.5 text-amber-800 mx-auto mb-1" />
              <span className="text-[10px] font-extrabold text-amber-950 block">On-Time Dispatch</span>
            </div>
            <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-900/5">
              <FiShield className="w-3.5 h-3.5 text-emerald-700 mx-auto mb-1" />
              <span className="text-[10px] font-extrabold text-amber-950 block">Transit Insured</span>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 4: PAYMENT METHOD */}
        {/* ---------------------------------------------------- */}
        <section className="rounded-2xl bg-white border border-amber-900/10 p-4 shadow-sm space-y-3 font-display">
          <div className="flex items-center justify-between pb-2.5 border-b border-amber-900/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-2xs">
                <FiCreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-heading text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-950">
                  Payment Method
                </h2>
                <p className="text-[11px] text-stone-500 font-medium">Choose your preferred payment option</p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <FiShield className="w-3 h-3" /> Secure
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Razorpay Online Payment Option */}
            <div
              onClick={() => onSelectPaymentMethod?.('RAZORPAY')}
              className={cn(
                'rounded-xl border p-3.5 cursor-pointer transition-all flex items-center justify-between gap-3 relative overflow-hidden',
                paymentMethod === 'RAZORPAY'
                  ? 'border-[#D4AF37] bg-gradient-to-r from-[#FAF4E8] via-amber-50/60 to-white ring-2 ring-[#D4AF37]/25 shadow-sm'
                  : 'border-amber-900/10 bg-white hover:border-amber-700/30'
              )}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={cn(
                    'mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                    paymentMethod === 'RAZORPAY' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-stone-300'
                  )}
                >
                  {paymentMethod === 'RAZORPAY' && <FiCheck className="h-2.5 w-2.5 text-amber-950 stroke-[3]" />}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-amber-950">
                      Online Payment (Razorpay)
                    </span>
                    <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                      ⚡ Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-body leading-relaxed">
                    UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, NetBanking & Wallets
                  </p>
                  <div className="flex items-center gap-1.5 pt-1 text-[10px] font-bold text-amber-900">
                    <span className="bg-amber-100/90 px-1.5 py-0.5 rounded text-amber-950 font-mono">GPay</span>
                    <span className="bg-amber-100/90 px-1.5 py-0.5 rounded text-amber-950 font-mono">PhonePe</span>
                    <span className="bg-amber-100/90 px-1.5 py-0.5 rounded text-amber-950 font-mono">Cards</span>
                    <span className="bg-amber-100/90 px-1.5 py-0.5 rounded text-amber-950 font-mono">NetBanking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cash on Delivery (COD) Option */}
            <div
              onClick={() => onSelectPaymentMethod?.('COD')}
              className={cn(
                'rounded-xl border p-3.5 cursor-pointer transition-all flex items-center justify-between gap-3 relative overflow-hidden',
                paymentMethod === 'COD'
                  ? 'border-[#D4AF37] bg-gradient-to-r from-[#FAF4E8] via-amber-50/60 to-white ring-2 ring-[#D4AF37]/25 shadow-sm'
                  : 'border-amber-900/10 bg-white hover:border-amber-700/30'
              )}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={cn(
                    'mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                    paymentMethod === 'COD' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-stone-300'
                  )}
                >
                  {paymentMethod === 'COD' && <FiCheck className="h-2.5 w-2.5 text-amber-950 stroke-[3]" />}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-amber-950">
                      Cash on Delivery (COD)
                    </span>
                    <span className="bg-stone-200 text-stone-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Doorstep Payment
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-body leading-relaxed">
                    Pay easily using Cash or UPI to delivery agent upon doorstep arrival.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 5: COUPON */}
        {/* ---------------------------------------------------- */}
        <section className="rounded-2xl bg-white border border-amber-900/10 p-4 shadow-sm font-display space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-amber-900/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-2xs">
                <FiTag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-heading text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-950">
                  Coupon / Promo Code
                </h2>
                <p className="text-[11px] text-stone-500 font-medium">Apply voucher code for extra discount</p>
              </div>
            </div>

            {appliedCoupon && (
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-300">
                Saved ₹{appliedCoupon.discountAmount}
              </span>
            )}
          </div>

          <CouponInput
            orderAmount={subtotal}
            appliedCoupon={appliedCoupon}
            onApply={onApplyCoupon}
            onRemove={onRemoveCoupon}
            isEmbedded={true}
          />
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 6: BILL SUMMARY */}
        {/* ---------------------------------------------------- */}
        <section className="rounded-2xl bg-white border border-amber-900/10 p-4 shadow-sm space-y-3 font-display">
          <div className="flex items-center justify-between pb-2.5 border-b border-amber-900/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-2xs">
                <FiFileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-heading text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-950">
                  Bill Summary
                </h2>
                <p className="text-[11px] text-stone-500 font-medium">Detailed item & delivery charges</p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-stone-500">
              INR (₹)
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-stone-600 font-medium">
              <span>Items Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
              <span className="font-bold text-amber-950 font-mono">{formatPrice(subtotal)}</span>
            </div>

            {/* Promo Discount */}
            {discount > 0 && (
              <div className="flex justify-between items-center text-emerald-700 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/60 font-semibold">
                <span className="flex items-center gap-1.5">
                  <FiGift className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Promo Code Savings</span>
                </span>
                <span className="font-extrabold text-emerald-700 font-mono">- {formatPrice(discount)}</span>
              </div>
            )}

            {/* Delivery Charges */}
            <div className="flex justify-between items-center text-stone-600 font-medium">
              <span className="flex items-center gap-1">
                <span>Delivery & Shipping Fee</span>
                <FiHelpCircle className="w-3 h-3 text-stone-400" />
              </span>
              {shippingCharge === 0 ? (
                <span className="font-extrabold text-emerald-700 bg-emerald-100/90 text-emerald-950 px-2 py-0.5 rounded-md border border-emerald-300 uppercase text-[10px]">
                  FREE DELIVERY
                </span>
              ) : (
                <span className="font-bold text-amber-950 font-mono">{formatPrice(shippingCharge)}</span>
              )}
            </div>

            {/* GST / Taxes */}
            <div className="flex justify-between items-center text-stone-500">
              <span>Estimated GST & Taxes</span>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Included in Price
              </span>
            </div>
          </div>

          {/* Total Savings Callout */}
          {discount > 0 && (
            <div className="pt-2 border-t border-amber-900/10">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl p-2.5 text-center shadow-2xs flex items-center justify-center gap-1.5">
                <FiGift className="w-4 h-4 text-emerald-200" />
                <span className="text-xs font-extrabold">
                  Congratulations! You save {formatPrice(discount)} on this order!
                </span>
              </div>
            </div>
          )}
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECTION 7: TOTAL */}
        {/* ---------------------------------------------------- */}
        <section className="rounded-2xl bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900 text-white p-4 sm:p-5 shadow-md font-display border border-amber-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300/90 block">
                Total Amount
              </span>
              <h3 className="font-heading text-base sm:text-lg font-extrabold text-white">
                Grand Total Payable
              </h3>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                Inclusive of all items, delivery & taxes
              </p>
            </div>

            <div className="text-right">
              <span className="font-heading font-black text-2xl sm:text-3xl text-amber-300 font-mono tracking-tight block">
                {formatPrice(grandTotal)}
              </span>
              <span className="text-[10px] font-bold text-emerald-300 flex items-center justify-end gap-1 mt-0.5">
                <FiShield className="w-3 h-3 text-emerald-400" /> Safe & Verified
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------- */}
      {/* SECTION 8: STICKY PLACE ORDER BUTTON */}
      {/* ---------------------------------------------------- */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-amber-900/10 p-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:p-4 shadow-[0_-10px_35px_rgba(0,0,0,0.12)] font-display">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider">
              Total to Pay
            </span>
            <span className="font-heading font-black text-lg sm:text-xl text-amber-950 truncate leading-tight font-mono">
              {formatPrice(grandTotal)}
            </span>
            <span className="text-[9px] text-emerald-700 font-extrabold flex items-center gap-1 font-body">
              <FiShield className="h-3 w-3 text-emerald-600" /> 100% Guaranteed
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            disabled={!isOrderValid || isProcessing}
            onClick={onPlaceOrder}
            className="flex-1 max-w-[280px] h-[52px] rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 hover:from-amber-950 hover:to-stone-950 text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 border border-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[52px]"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <FiLock className="w-4 h-4 text-amber-300" />
                <span className="truncate">
                  {paymentMethod === 'COD' ? 'Place COD Order' : `Pay ${formatPrice(grandTotal)}`}
                </span>
              </>
            )}
          </motion.button>
        </div>
      </footer>
    </div>
  );
}
