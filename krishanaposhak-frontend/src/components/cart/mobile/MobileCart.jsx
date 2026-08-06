import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiShoppingBag,
  FiTrash2,
  FiHeart,
  FiLock,
  FiShield,
  FiTruck,
  FiTag,
  FiCheck,
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiArrowRight,
} from 'react-icons/fi';
import RecommendedProducts from '@/components/cart/RecommendedProducts';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { FREE_SHIPPING_THRESHOLD } from '@/utils/shippingCalculator';
import { ROUTE_PATHS } from '@/routes/routePaths';
import toast from 'react-hot-toast';

const resolveCartImage = (item) => {
  if (item?.imageUrl) return item.imageUrl;
  if (item?.image) return item.image;
  if (item?.productImageUrl) return item.productImageUrl;
  if (Array.isArray(item?.images) && item.images.length > 0) {
    const first = item.images[0];
    return typeof first === 'string' ? first : first?.imageUrl || first?.url;
  }
  if (item?.product) {
    if (item.product.imageUrl) return item.product.imageUrl;
    if (Array.isArray(item.product.images) && item.product.images.length > 0) {
      const first = item.product.images[0];
      return typeof first === 'string' ? first : first?.imageUrl || first?.url;
    }
  }
  return '/placeholder.png';
};

export default function MobileCart({
  items = [],
  subtotal = 0,
  discount = 0,
  shippingCharge = 0,
  grandTotal = 0,
  appliedCoupon,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  onClearCart,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
  isUpdating = false,
}) {
  const navigate = useNavigate();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isCouponOpen, setIsCouponOpen] = useState(false);

  // Total savings calculation
  const totalSavings = useMemo(() => {
    let itemSavings = 0;
    items.forEach((item) => {
      if (item.price && item.discountPrice && item.price > item.discountPrice) {
        itemSavings += (item.price - item.discountPrice) * (item.quantity || 1);
      }
    });
    return itemSavings + (discount || 0);
  }, [items, discount]);

  const handleApplyCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    onApplyCoupon(couponCodeInput.trim().toUpperCase(), 100);
    setCouponCodeInput('');
  };

  // EMPTY CART VIEW
  if (items.length === 0) {
    return (
      <div className="min-h-dvh w-full bg-[#FAF8F5] text-slate-800 font-sans antialiased pb-28">
        {/* Sticky Header (56px) */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 h-[56px] flex items-center justify-between shadow-2xs">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-[36px] w-[36px] rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs"
            aria-label="Back"
          >
            <FiArrowLeft className="h-4 w-4 text-slate-800" />
          </button>

          <span className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">
            Shopping Bag
          </span>

          <div className="w-[36px]" />
        </header>

        {/* Empty Cart Content */}
        <main className="px-4 py-12 text-center max-w-[767px] mx-auto space-y-6 flex flex-col items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#C99A3B]">
            <FiShoppingBag className="h-10 w-10 text-[#C99A3B]" />
          </div>

          <div className="space-y-1.5 max-w-xs">
            <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">
              Your Cart is Waiting
            </h1>
            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
              Looks like you haven't added any sacred poshak creations to your bag yet.
            </p>
          </div>

          <Link to={ROUTE_PATHS.SHOP}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              className="h-[48px] px-6 rounded-[14px] bg-gradient-to-r from-[#D4AF37] via-[#C99A3B] to-[#B3832B] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <FiArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-[#FAF8F5] text-slate-800 font-sans antialiased pb-44 md:pb-32">
      {/* ─── 1. STICKY HEADER (56px Height, Glass Effect) ─── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 h-[56px] flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-[36px] w-[36px] rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs"
          aria-label="Back"
        >
          <FiArrowLeft className="h-4 w-4 text-slate-800" />
        </button>

        <div className="flex items-center gap-1.5">
          <FiShoppingBag className="h-4 w-4 text-[#C99A3B]" />
          <span className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">
            Shopping Bag ({items.length})
          </span>
        </div>

        <button
          type="button"
          onClick={onClearCart}
          className="h-[36px] px-2.5 rounded-full border border-rose-200 bg-rose-50/80 text-rose-700 text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
          aria-label="Clear Cart"
        >
          <FiTrash2 className="h-3 w-3" />
          <span>Clear</span>
        </button>
      </header>

      {/* ─── MAIN CONTENT CONTAINER (16px outer padding, 12px gap) ─── */}
      <main className="px-4 py-4 space-y-3 w-full max-w-[767px] mx-auto">

        {/* ─── 2. CART SUMMARY ROW ─── */}
        <section className="bg-white rounded-[14px] p-3 border border-slate-100 shadow-2xs flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">
              Shopping Bag
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Review your items before proceeding
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200/60 rounded-full px-3 py-1">
            <span>{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
            {totalSavings > 0 && (
              <>
                <span>•</span>
                <span className="text-emerald-600 font-bold">Saved ₹{totalSavings.toLocaleString('en-IN')}</span>
              </>
            )}
            <span>•</span>
            <span className="text-emerald-600">Free Delivery</span>
          </div>
        </section>

        {/* ─── 3. CART ITEM CARDS ─── */}
        <section className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => {
              const {
                cartItemId,
                id,
                productId,
                variantId,
                productName,
                slug,
                size,
                color,
                price,
                discountPrice,
                quantity,
                stock,
              } = item;

              const targetId = cartItemId || id;
              const discountPercent = calculateDiscount(price, discountPrice);
              const activeUnitPrice = discountPrice && discountPrice < price ? discountPrice : price;
              const strikeUnitPrice = discountPrice && discountPrice < price ? price : null;
              const imgSrc = resolveCartImage(item);
              const maxStock = stock ?? 10;

              return (
                <motion.div
                  key={`mobile-cart-item-${targetId}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-[14px] border border-slate-100 p-3.5 shadow-2xs space-y-3"
                >
                  {/* Top Item Info Grid (Left Image + Right Details) */}
                  <div className="flex gap-3 items-start">
                    {/* Left: 96x96 Product Image */}
                    <Link
                      to={`/product/${slug || productId || id}`}
                      className="h-[96px] w-[96px] shrink-0 rounded-[10px] bg-slate-50 border border-slate-100 overflow-hidden relative block"
                    >
                      <OptimizedImage
                        src={imgSrc}
                        alt={productName || 'Product Image'}
                        className="h-full w-full object-contain p-1 object-center"
                      />
                    </Link>

                    {/* Right Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Brand Line */}
                      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 font-sans block">
                        Kanhaji Poshak Kendra
                      </span>

                      {/* Product Name (14px, 2 line clamp) */}
                      <Link
                        to={`/product/${slug || productId || id}`}
                        className="text-[14px] font-semibold text-slate-900 line-clamp-2 leading-snug hover:text-[#C99A3B] transition-colors"
                      >
                        {productName || item.product?.name || 'Handcrafted Sacred Poshak'}
                      </Link>

                      {/* Variant (Size / Color) */}
                      {(size || color || item.variantName) && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                          {size && <span>Size: {size}</span>}
                          {size && color && <span>•</span>}
                          {color && <span>Color: {color}</span>}
                        </div>
                      )}

                      {/* Price Row (₹799 bold, ₹999 strike, 20% OFF green) */}
                      <div className="flex items-baseline gap-1.5 flex-wrap pt-0.5">
                        <span className="text-base font-bold text-slate-900">
                          ₹{activeUnitPrice.toLocaleString('en-IN')}
                        </span>

                        {strikeUnitPrice && (
                          <span className="text-xs font-medium text-slate-400 line-through">
                            ₹{strikeUnitPrice.toLocaleString('en-IN')}
                          </span>
                        )}

                        {discountPercent > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      {/* Delivery badge */}
                      <div className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                        <FiTruck className="h-3 w-3" />
                        <span>Free Express Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Control Row (Compact Stepper 36px + Small Buttons Right) */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    {/* Compact Stepper (36px Height) */}
                    <div className="h-[36px] inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-[10px] px-1">
                      <button
                        type="button"
                        disabled={quantity <= 1 || isUpdating}
                        onClick={() => onUpdateQuantity(targetId, Math.max(1, quantity - 1))}
                        className="h-[28px] w-[28px] rounded-[8px] bg-white text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shadow-2xs disabled:opacity-40 active:scale-90 transition-all"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus className="h-3 w-3" />
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={maxStock}
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            onUpdateQuantity(targetId, Math.max(1, Math.min(maxStock, val)));
                          }
                        }}
                        className="w-8 text-center text-xs font-bold text-slate-900 bg-transparent focus:outline-none font-mono p-0"
                      />

                      <button
                        type="button"
                        disabled={quantity >= maxStock || isUpdating}
                        onClick={() => onUpdateQuantity(targetId, Math.min(maxStock, quantity + 1))}
                        className="h-[28px] w-[28px] rounded-[8px] bg-white text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shadow-2xs disabled:opacity-40 active:scale-90 transition-all"
                        aria-label="Increase quantity"
                      >
                        <FiPlus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Right Side Buttons (Small text buttons - NOT giant) */}
                    <div className="flex items-center gap-3">
                      {onMoveToWishlist && (
                        <button
                          type="button"
                          onClick={() => onMoveToWishlist(item)}
                          className="text-[11px] font-semibold text-slate-500 hover:text-amber-800 flex items-center gap-1 min-h-[36px]"
                        >
                          <FiHeart className="h-3.5 w-3.5 text-amber-800/80" />
                          <span>Move to Wishlist</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onRemoveItem(targetId)}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 min-h-[36px]"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </section>

        {/* ─── 4. COUPON SECTION ─── */}
        <section className="bg-white rounded-[14px] border border-slate-100 p-3.5 shadow-2xs space-y-2.5">
          <div
            onClick={() => setIsCouponOpen((prev) => !prev)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FiTag className="h-4 w-4 text-[#C99A3B]" />
              <span className="text-xs font-bold text-slate-800">
                {appliedCoupon ? `Applied Coupon: ${appliedCoupon.code}` : 'Apply Coupon'}
              </span>
            </div>

            <button
              type="button"
              className="text-xs font-bold text-[#C99A3B] flex items-center gap-0.5"
            >
              <span>{appliedCoupon ? 'Change' : isCouponOpen ? 'Close' : 'Select'}</span>
              <FiChevronRight className={`h-3.5 w-3.5 transition-transform ${isCouponOpen ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <FiCheck className="h-4 w-4 text-emerald-600" />
                <div>
                  <span className="font-bold text-emerald-900">{appliedCoupon.code}</span>
                  <p className="text-[10px] text-emerald-700 font-medium">
                    You saved ₹{appliedCoupon.discountAmount} with this code!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            isCouponOpen && (
              <form onSubmit={handleApplyCouponSubmit} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  placeholder="Enter Coupon Code (e.g. KRISHNA10)"
                  className="flex-1 h-9 rounded-xl border border-slate-200 px-3 text-xs uppercase text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#C99A3B]"
                />
                <button
                  type="submit"
                  disabled={!couponCodeInput.trim()}
                  className="h-9 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-50"
                >
                  Apply
                </button>
              </form>
            )
          )}
        </section>

        {/* ─── 5. ESTIMATED DELIVERY SECTION ─── */}
        <section className="bg-white rounded-[14px] border border-slate-100 p-3.5 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
              <FiTruck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Estimated Delivery</p>
              <p className="text-xs font-bold text-slate-800">Dispatch in 24 Hours • Free Delivery</p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Express
          </span>
        </section>

        {/* ─── 6. TRUST BADGES (Compact Horizontal Row) ─── */}
        <section className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-[12px] p-2.5 border border-slate-100 shadow-2xs text-center flex flex-col items-center justify-center space-y-1">
            <FiShield className="h-4 w-4 text-emerald-600" />
            <span className="text-[10px] font-semibold text-slate-700 leading-tight">100% Safe Checkout</span>
          </div>

          <div className="bg-white rounded-[12px] p-2.5 border border-slate-100 shadow-2xs text-center flex flex-col items-center justify-center space-y-1">
            <FiRefreshCw className="h-4 w-4 text-[#C99A3B]" />
            <span className="text-[10px] font-semibold text-slate-700 leading-tight">7-Day Easy Returns</span>
          </div>

          <div className="bg-white rounded-[12px] p-2.5 border border-slate-100 shadow-2xs text-center flex flex-col items-center justify-center space-y-1">
            <FiTruck className="h-4 w-4 text-amber-700" />
            <span className="text-[10px] font-semibold text-slate-700 leading-tight">Fast Express Shipping</span>
          </div>
        </section>

        {/* ─── 7. RECOMMENDED PRODUCTS ─── */}
        <section className="bg-white rounded-[14px] p-3.5 border border-slate-100 shadow-2xs space-y-3">
          <RecommendedProducts title="You May Also Like" limit={6} />
        </section>

      </main>

      {/* ─── 8. STICKY PRICE SUMMARY & CHECKOUT BAR (Fixed Bottom) ─── */}
      <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-3 shadow-[0_-6px_25px_rgba(0,0,0,0.08)] rounded-t-[18px]">
        <div className="max-w-[767px] mx-auto space-y-2">

          {/* Price Breakdown Preview */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Subtotal: ₹{subtotal.toLocaleString('en-IN')}</span>
            {discount > 0 && <span className="text-emerald-600 font-bold">Saved: -₹{discount.toLocaleString('en-IN')}</span>}
            <span className="text-emerald-600 font-bold">Delivery: Free</span>
          </div>

          {/* Bottom Bar Content */}
          <div className="flex items-center justify-between gap-3">
            {/* Left: Total Price (24px Bold) */}
            <div className="flex flex-col shrink-0 min-w-0">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Grand Total</span>
              <span className="text-[24px] font-bold text-slate-900 tracking-tight leading-none">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Right: Checkout Button (52px Height, Gold Gradient) */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onProceedToCheckout}
              className="h-[52px] flex-1 rounded-[14px] bg-gradient-to-r from-[#D4AF37] via-[#C99A3B] to-[#B3832B] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#C99A3B]/25 flex items-center justify-center gap-2 transition-all min-h-[52px]"
            >
              <FiLock className="h-4 w-4 text-amber-100" />
              <span>Proceed to Checkout</span>
              <FiArrowRight className="h-4 w-4 text-amber-100" />
            </motion.button>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-400">
            <FiShield className="h-3 w-3 text-emerald-600" />
            <span>100% Safe & Secure Payment Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
