import { useState } from 'react';
import { motion } from 'framer-motion';
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
  return (
    <div className="min-h-screen bg-[#FAF7F2] font-display flex flex-col justify-between">
      {/* ---------------------------------------------------- */}
      {/* STICKY HEADER (54px height) */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 w-full h-[54px] bg-white/95 backdrop-blur-md border-b border-amber-900/10 px-4 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={onBack || onChangeAddress}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-50 text-amber-950 hover:bg-amber-100 transition-colors border border-amber-900/10 active:scale-95 min-h-[36px] min-w-[36px]"
          aria-label="Go back to address selection"
        >
          <FiChevronLeft className="w-5 h-5 text-amber-900" />
        </button>

        <div className="text-center min-w-0 px-2">
          <h1 className="font-heading text-base font-extrabold text-amber-950 truncate leading-tight">
            Checkout Summary
          </h1>
          <p className="text-[11px] font-bold text-amber-800 tracking-tight">
            Review & Pay
          </p>
        </div>

        <div className="w-9 flex items-center justify-end">
          <FiShield className="w-5 h-5 text-emerald-700" />
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT (16px outer padding, 12px card spacing) */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 px-4 py-4 space-y-3.5 pb-28">
        {/* Error Alert if any */}
        {orderError && (
          <div className="rounded-[18px] bg-rose-50 border border-rose-200 p-3.5 text-xs font-bold text-rose-700 flex items-center gap-2 shadow-xs">
            <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{orderError}</span>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 1. SHIPPING ADDRESS CARD */}
        {/* ---------------------------------------------------- */}
        {selectedAddress && (
          <div className="rounded-[18px] bg-white border border-amber-900/10 p-4 shadow-xs space-y-2.5 font-display">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-100/80 text-amber-900 flex items-center justify-center">
                  <FiMapPin className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-amber-900">
                  Deliver To
                </h3>
              </div>
              <button
                type="button"
                onClick={onChangeAddress}
                className="text-xs font-extrabold text-amber-900 hover:underline min-h-[32px] px-2 flex items-center"
              >
                Change Address
              </button>
            </div>

            <div className="pt-1 border-t border-amber-900/10 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm text-amber-950">
                  {selectedAddress.fullName}
                </span>
                <span className="text-xs text-stone-600 font-mono font-medium">
                  • {selectedAddress.phoneNumber}
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
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 2. ORDER ITEMS SECTION */}
        {/* ---------------------------------------------------- */}
        <div className="rounded-[18px] bg-white border border-amber-900/10 p-4 shadow-xs space-y-3 font-display">
          <div className="flex items-center justify-between pb-2 border-b border-amber-900/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-100/80 text-amber-900 flex items-center justify-center">
                <FiShoppingBag className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-amber-900">
                Order Items ({cartItems.length})
              </h3>
            </div>
          </div>

          <div className="divide-y divide-amber-900/10 space-y-2.5">
            {cartItems.map((item, idx) => (
              <div key={item.id || idx} className="pt-2.5 first:pt-0 flex items-center gap-3">
                <div className="w-14 h-14 rounded-[12px] bg-stone-100 border border-amber-900/10 overflow-hidden shrink-0">
                  <img
                    src={item.imageUrl || item.image || item.product?.imageUrl || '/placeholder.png'}
                    alt={item.title || item.productName || 'Product'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-heading text-xs font-extrabold text-amber-950 truncate">
                    {item.title || item.productName || 'Divine Item'}
                  </h4>
                  {item.variantName && (
                    <p className="text-[11px] text-stone-500 font-body">Option: {item.variantName}</p>
                  )}
                  <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                    Qty: <strong className="text-amber-950">{item.quantity}</strong> × {formatPrice(item.price || item.unitPrice)}
                  </p>
                </div>
                <div className="text-right font-heading font-extrabold text-xs text-amber-950 shrink-0">
                  {formatPrice((item.price || item.unitPrice || 0) * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 3. COUPON SECTION */}
        {/* ---------------------------------------------------- */}
        <div className="rounded-[18px] bg-white border border-amber-900/10 p-4 shadow-xs font-display">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-amber-100/80 text-amber-900 flex items-center justify-center">
              <FiTag className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-amber-900">
              Apply Promo Code / Coupon
            </h3>
          </div>

          <CouponInput
            orderAmount={subtotal}
            appliedCoupon={appliedCoupon}
            onApply={onApplyCoupon}
            onRemove={onRemoveCoupon}
            isEmbedded={true}
          />
        </div>

        {/* ---------------------------------------------------- */}
        {/* 4. PAYMENT METHOD SECTION */}
        {/* ---------------------------------------------------- */}
        <div className="rounded-[18px] bg-white border border-amber-900/10 p-4 shadow-xs space-y-3 font-display">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-900/10">
            <div className="w-7 h-7 rounded-full bg-amber-100/80 text-amber-900 flex items-center justify-center">
              <FiCreditCard className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-amber-900">
              Payment Option
            </h3>
          </div>

          <div className="space-y-2.5">
            {/* Razorpay Online Payment */}
            <div
              onClick={() => onSelectPaymentMethod?.('RAZORPAY')}
              className={cn(
                'rounded-xl border p-3 cursor-pointer transition-all flex items-center justify-between gap-3',
                paymentMethod === 'RAZORPAY'
                  ? 'border-[#D4AF37] bg-[#FAF4E8] ring-2 ring-[#D4AF37]/20 shadow-2xs'
                  : 'border-amber-900/10 bg-white hover:border-amber-700/30',
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0',
                    paymentMethod === 'RAZORPAY' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-stone-300',
                  )}
                >
                  {paymentMethod === 'RAZORPAY' && <FiCheck className="h-2.5 w-2.5 text-amber-950 stroke-[3]" />}
                </div>
                <div>
                  <p className="font-heading font-extrabold text-xs text-amber-950">
                    Online Payment (UPI, Cards, NetBanking, Wallets)
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold">⚡ Instant & 100% Secure via Razorpay</p>
                </div>
              </div>
            </div>

            {/* Cash on Delivery */}
            <div
              onClick={() => onSelectPaymentMethod?.('COD')}
              className={cn(
                'rounded-xl border p-3 cursor-pointer transition-all flex items-center justify-between gap-3',
                paymentMethod === 'COD'
                  ? 'border-[#D4AF37] bg-[#FAF4E8] ring-2 ring-[#D4AF37]/20 shadow-2xs'
                  : 'border-amber-900/10 bg-white hover:border-amber-700/30',
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0',
                    paymentMethod === 'COD' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-stone-300',
                  )}
                >
                  {paymentMethod === 'COD' && <FiCheck className="h-2.5 w-2.5 text-amber-950 stroke-[3]" />}
                </div>
                <div>
                  <p className="font-heading font-extrabold text-xs text-amber-950">
                    Cash on Delivery (COD)
                  </p>
                  <p className="text-[10px] text-stone-500 font-medium">Pay via Cash / UPI upon doorstep delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 5. PRICE BREAKDOWN SECTION */}
        {/* ---------------------------------------------------- */}
        <div className="rounded-[18px] bg-white border border-amber-900/10 p-4 shadow-xs space-y-2.5 font-display">
          <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-amber-900 pb-2 border-b border-amber-900/10">
            Price Details & Breakdown
          </h3>

          {/* Subtotal */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-600 font-medium">Items Subtotal</span>
            <span className="font-bold text-amber-950">{formatPrice(subtotal)}</span>
          </div>

          {/* Coupon / Discount */}
          {discount > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-700 font-semibold">Promo Discount</span>
              <span className="font-bold text-emerald-700">- {formatPrice(discount)}</span>
            </div>
          )}

          {/* Delivery Charges */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-600 font-medium">Delivery Charges</span>
            {shippingCharge === 0 ? (
              <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 uppercase text-[10px]">
                FREE
              </span>
            ) : (
              <span className="font-bold text-amber-950">{formatPrice(shippingCharge)}</span>
            )}
          </div>

          {/* GST / Taxes */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-600 font-medium">Estimated GST & Taxes</span>
            <span className="text-[11px] text-stone-500 font-bold">Included in Price</span>
          </div>

          <div className="pt-2 border-t border-amber-900/10 flex justify-between items-center">
            <div>
              <span className="font-heading font-extrabold text-sm text-amber-950 block">Grand Total</span>
              <span className="text-[10px] text-stone-500 font-medium">Inclusive of all taxes</span>
            </div>
            <span className="font-heading font-extrabold text-lg text-amber-950">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>
      </main>

      {/* ---------------------------------------------------- */}
      {/* STICKY BOTTOM BAR (72px height, Total Price & Button) */}
      {/* ---------------------------------------------------- */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 h-[72px] bg-white/95 backdrop-blur-md border-t border-amber-900/10 px-4 flex items-center justify-between gap-3 shadow-lg font-display">
        <div className="min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block">
            Grand Total
          </span>
          <span className="font-heading font-extrabold text-lg text-amber-950 truncate block leading-tight">
            {formatPrice(grandTotal)}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          disabled={!isOrderValid || isProcessing}
          onClick={onPlaceOrder}
          className="h-[52px] px-6 rounded-[16px] bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 hover:from-amber-800 hover:to-stone-950 text-white font-extrabold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 border border-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FiLock className="w-4 h-4 text-amber-200" />
          <span>{paymentMethod === 'COD' ? 'Place COD Order' : 'Pay & Complete'}</span>
        </motion.button>
      </footer>
    </div>
  );
}
