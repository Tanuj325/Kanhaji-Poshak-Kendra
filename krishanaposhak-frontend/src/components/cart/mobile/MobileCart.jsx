import { useState, useMemo, useEffect, useRef } from 'react';
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
  FiStar,
  FiArrowRight,
  FiGrid,
  FiAlertTriangle,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { siteConfig } from '@/config/siteConfig';
import CouponInput from '@/components/cart/CouponInput';

// Helper function to extract image URL safely
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

/**
 * CartQuantityInput
 * Standalone top-level input component.
 * Uses local state + debounced parent update to maintain cursor position,
 * keep mobile keyboard open, and provide instant typing feedback.
 */
function CartQuantityInput({ quantity, maxStock, isUpdating, onUpdate }) {
  const [localValue, setLocalValue] = useState(() => String(quantity ?? 1));
  const debounceTimerRef = useRef(null);

  // Synchronize local state when parent quantity prop changes externally (e.g. plus/minus click)
  useEffect(() => {
    setLocalValue((prev) => {
      const parsedPrev = parseInt(prev, 10);
      if (parsedPrev === quantity) return prev;
      return String(quantity ?? 0);
    });
  }, [quantity]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const raw = e.target.value;
    setLocalValue(raw);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce parent update by 300ms so soft keyboard stays focused and open
    debounceTimerRef.current = setTimeout(() => {
      if (raw === '') {
        onUpdate(0);
        return;
      }
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed)) {
        onUpdate(Math.max(0, parsed));
      }
    }, 300);
  };

  const handleBlur = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (localValue === '' || isNaN(parseInt(localValue, 10))) {
      setLocalValue('0');
      onUpdate(0);
    } else {
      const parsed = Math.max(0, parseInt(localValue, 10));
      setLocalValue(String(parsed));
      onUpdate(parsed);
    }
  };

  const isExceeded = (parseInt(localValue, 10) || 0) > maxStock;
  const isZero = localValue === '0' || localValue === '';

  return (
    <input
      type="number"
      min={0}
      disabled={isUpdating}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`w-10 text-center text-[13px] font-bold bg-transparent focus:outline-none focus:ring-0 font-mono p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
        isZero || isExceeded ? 'text-rose-600 font-extrabold' : 'text-stone-900'
      }`}
      aria-label="Item quantity"
    />
  );
}

/**
 * MobileHorizontalProductCard
 * Luxury horizontal product card for Myntra-style recommended/trending scroll.
 */
function MobileHorizontalProductCard({ product }) {
  const navigate = useNavigate();
  const imgSrc = resolveCartImage(product);
  const discountPercent = calculateDiscount(product.price, product.discountPrice);
  const activePrice = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;
  const oldPrice = product.discountPrice && product.discountPrice < product.price ? product.price : null;
  const brandName = product.brand || product.brandName || siteConfig.name;

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/product/${product.slug || product.id}`)}
      className="w-[136px] shrink-0 snap-start bg-white rounded-[12px] border border-stone-200/80 p-2 shadow-2xs cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-1.5">
        <div className="h-[120px] w-full rounded-[10px] bg-stone-50 overflow-hidden relative border border-stone-100">
          <OptimizedImage
            src={imgSrc}
            alt={product.name || 'Product'}
            className="h-full w-full object-cover object-center"
          />
          {discountPercent > 0 && (
            <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block font-sans line-clamp-1">
          {brandName}
        </span>

        <h3 className="text-[12px] font-semibold text-stone-900 line-clamp-1 leading-tight">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-1">
          <span className="text-[13px] font-bold text-stone-900">
            ₹{activePrice?.toLocaleString('en-IN')}
          </span>
          {oldPrice && (
            <span className="text-[10px] text-stone-400 line-through">
              ₹{oldPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          className="w-full h-7 rounded-[8px] bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-200/70 flex items-center justify-center gap-1 active:scale-95 transition-transform"
        >
          <span>View</span>
          <FiChevronRight className="h-3 w-3 text-amber-700" />
        </button>
      </div>
    </motion.div>
  );
}

/**
 * MobileCart
 * App-style Mobile (<768px) and Tablet (768px-1023px) Cart UI Page Rebuild.
 * Inspiring E-Commerce App UI (Nike, Myntra, Zara, Apple Store).
 */
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
  const [couponInput, setCouponInput] = useState('');
  const [showCouponForm, setShowCouponForm] = useState(false);

  // Safe numerical conversions to strictly avoid NaN display
  const safeSubtotal = Number(subtotal) || 0;
  const safeDiscount = Number(discount) || 0;
  const safeShipping = Number(shippingCharge) || 0;
  const safeGrandTotal = typeof grandTotal === 'number' && !isNaN(grandTotal)
    ? Math.max(0, grandTotal)
    : Math.max(0, safeSubtotal - safeDiscount + safeShipping);

  // Check if any item has 0 quantity or exceeds available stock
  const invalidItemInfo = useMemo(() => {
    let zeroQty = false;
    let exceededStock = false;

    items.forEach((item) => {
      const q = item.quantity ?? 0;
      const stock = item.stock ?? 10;
      if (q <= 0) {
        zeroQty = true;
      }
      if (q > stock) {
        exceededStock = true;
      }
    });

    return { zeroQty, exceededStock };
  }, [items]);

  const hasInvalidQuantity = invalidItemInfo.zeroQty;

  const isCheckoutDisabled =
    items.length === 0 ||
    invalidItemInfo.zeroQty ||
    invalidItemInfo.exceededStock ||
    isUpdating;

  // Fetch featured products for Myntra style horizontal scroll
  const { data: featuredData } = useFeaturedProducts();
  const trendingProducts = useMemo(() => {
    const list = Array.isArray(featuredData)
      ? featuredData
      : featuredData?.data || featuredData?.content || [];
    return list;
  }, [featuredData]);

  // Total items count
  const itemCount = items.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    onApplyCoupon(couponInput.trim().toUpperCase());
    setCouponInput('');
  };

  // ══════════════════════════════════════════════════════════════
  // 9. EMPTY CART STATE (Full Page View)
  // ══════════════════════════════════════════════════════════════
  if (items.length === 0) {
    return (
      <div className="min-h-dvh w-full bg-[#FAF8F5] text-stone-800 font-sans antialiased pb-28 md:pb-16">
        {/* Sticky Header (52px) */}
        <header className="sticky top-0 z-40 h-[52px] bg-white/92 backdrop-blur-md border-b border-stone-200/80 px-3.5 flex items-center justify-between shadow-2xs">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 active:scale-95 transition-transform"
            aria-label="Back"
          >
            <FiArrowLeft className="h-4 w-4" />
          </button>

          <span className="text-[13px] font-bold text-stone-900 tracking-wide font-sans uppercase">
            Shopping Bag
          </span>

          <div className="w-8" />
        </header>

        <main className="px-4 py-8 max-w-md mx-auto space-y-8">
          {/* Centered Vector Illustration & Empty Cart Text */}
          <div className="text-center space-y-4 flex flex-col items-center justify-center pt-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-amber-50 border-2 border-amber-200/80 flex items-center justify-center shadow-inner">
                <FiShoppingBag className="h-11 w-11 text-amber-700" />
              </div>
              <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center text-xs shadow-md">
                ✨
              </span>
            </div>

            <div className="space-y-1.5 max-w-xs">
              <h1 className="text-[18px] font-bold text-stone-900 tracking-tight font-heading">
                Your Cart Feels Lonely
              </h1>
              <p className="text-[11px] text-stone-500 leading-relaxed font-body">
                Looks like you haven't added anything yet. Explore our handcrafted {siteConfig.name} collections!
              </p>
            </div>

            {/* Action Buttons: 44px Height */}
            <div className="w-full space-y-2.5 pt-2">
              <Link to={ROUTE_PATHS.SHOP || '/shop'} className="block w-full">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="w-full h-[44px] rounded-[12px] bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white font-bold text-[13px] shadow-md shadow-amber-900/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  <span>Continue Shopping</span>
                  <FiArrowRight className="h-4 w-4 text-amber-200" />
                </motion.button>
              </Link>

              <Link to={ROUTE_PATHS.CATEGORIES || '/categories'} className="block w-full">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="w-full h-[44px] rounded-[12px] bg-white border border-stone-300 text-stone-800 font-bold text-[13px] hover:bg-stone-50 flex items-center justify-center gap-2 transition-all"
                >
                  <FiGrid className="h-4 w-4 text-amber-800" />
                  <span>Browse Categories</span>
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Trending Products Horizontal Scroll (Myntra Style) */}
          {trendingProducts.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-stone-200/70">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[13px] font-bold text-stone-900 flex items-center gap-1.5">
                    <HiSparkles className="h-3.5 w-3.5 text-amber-700" />
                    <span>Trending Creations</span>
                  </h2>
                  <p className="text-[10px] text-stone-500">Popular items loved by devotees</p>
                </div>
                <Link to={ROUTE_PATHS.SHOP || '/shop'} className="text-[11px] font-bold text-amber-800 hover:underline">
                  View All →
                </Link>
              </div>

              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none snap-x -mx-4 px-4">
                {trendingProducts.map((prod) => (
                  <MobileHorizontalProductCard key={`trending-${prod.id}`} product={prod} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // CART WITH ITEMS (Full Page View)
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-dvh w-full bg-[#FAF8F5] text-stone-800 font-sans antialiased pb-48 md:pb-28">
      {/* ─── 1. MOBILE HEADER (52px Height, Sticky Glass) ─── */}
      <header className="sticky top-0 z-40 h-[52px] bg-white/92 backdrop-blur-md border-b border-stone-200/80 px-3.5 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 active:scale-95 transition-transform"
          aria-label="Back"
        >
          <FiArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-bold text-stone-900 tracking-wide font-sans">
            Shopping Bag
          </span>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
            ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
          </span>
        </div>

        <button
          type="button"
          onClick={onClearCart}
          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2.5 py-1 rounded-full border border-rose-200/60 active:scale-95 transition-all flex items-center gap-1"
          aria-label="Clear Cart"
        >
          <FiTrash2 className="h-3 w-3" />
          <span>Clear</span>
        </button>
      </header>

      {/* ─── MAIN CART CONTAINER (12px padding & gaps) ─── */}
      <main className="px-3 py-3 space-y-3 max-w-[767px] mx-auto">
        {/* Warning Banner if any item has 0 quantity */}
        {hasInvalidQuantity && (
          <section className="bg-rose-50 border border-rose-200 rounded-[12px] px-3 py-2 text-rose-800 text-[11px] flex items-center justify-between font-medium">
            <span>⚠️ Please set quantity above 0 or remove item to proceed.</span>
          </section>
        )}

        {/* ─── 7. COMPACT DELIVERY CHIP ─── */}
        <section className="bg-emerald-50/90 border border-emerald-200/70 rounded-[12px] px-3 py-2 flex items-center justify-between text-emerald-800 text-[11px]">
          <div className="flex items-center gap-2">
            <FiTruck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-emerald-900">
              {safeShipping === 0
                ? '🚚 Free Express Delivery • Dispatch in 24 hrs'
                : `🚚 Express Delivery • ₹${safeShipping} Shipping`}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase bg-emerald-100 px-2 py-0.5 rounded-full text-emerald-800">
            {safeShipping === 0 ? 'Free' : 'Standard'}
          </span>
        </section>

        {/* ─── 2. PRODUCT CARDS & 8. CART LIST (12px gap) ─── */}
        <section className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => {
              const {
                cartItemId,
                id,
                productId,
                productName,
                slug,
                size,
                color,
                price,
                discountPrice,
                quantity = 1,
                stock,
              } = item;

              const targetId = cartItemId || id;
              const discountPercent = calculateDiscount(price, discountPrice);
              const activeUnitPrice = discountPrice && discountPrice < price ? discountPrice : price;
              const strikeUnitPrice = discountPrice && discountPrice < price ? price : null;
              const imgSrc = resolveCartImage(item);
              const maxStock = stock ?? 10;
              const itemBrand = item.brand || item.product?.brand || item.product?.brandName || siteConfig.name;
              const itemRating = item.rating || item.product?.rating || item.product?.avgRating || 4.8;
              const isExceeded = quantity > maxStock;

              return (
                <motion.div
                  key={`mobile-cart-item-${targetId}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="bg-white rounded-[14px] border border-stone-200/80 p-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] relative space-y-2.5"
                >
                  {/* 4. REMOVE BUTTON (Small 30x30 circle top right) */}
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    type="button"
                    onClick={() => onRemoveItem(targetId)}
                    className="absolute top-2.5 right-2.5 h-[30px] w-[30px] rounded-full bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 flex items-center justify-center transition-colors z-10"
                    aria-label="Remove item"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </motion.button>

                  {/* Top Details Grid: Left 96x96 Image | Right Section */}
                  <div className="flex gap-3 items-start">
                    {/* Image: 96x96 rounded 12 cover */}
                    <Link
                      to={`/product/${slug || productId || id}`}
                      className="h-[96px] w-[96px] shrink-0 rounded-[12px] bg-stone-50 border border-stone-100 overflow-hidden relative block"
                    >
                      <OptimizedImage
                        src={imgSrc}
                        alt={productName || 'Product'}
                        className="h-full w-full object-cover object-center"
                      />
                    </Link>

                    {/* Right Section Details */}
                    <div className="flex-1 min-w-0 pr-7 space-y-0.5">
                      {/* Brand 10px uppercase gray */}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block font-sans line-clamp-1">
                        {itemBrand}
                      </span>

                      {/* Title 13px semibold 2 lines max */}
                      <Link
                        to={`/product/${slug || productId || id}`}
                        className="text-[13px] font-semibold text-stone-900 line-clamp-2 leading-snug hover:text-amber-800 transition-colors"
                      >
                        {productName || item.product?.name || 'Sacred Poshak Creation'}
                      </Link>

                      {/* Rating pill & Variant */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                          <span>{itemRating}</span>
                          <FiStar className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                        </div>

                        {(size || color || item.variantName) && (
                          <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded font-medium">
                            {[size && `Size: ${size}`, color && `Color: ${color}`].filter(Boolean).join(' • ')}
                          </span>
                        )}
                      </div>

                      {/* 6. PRICE SECTION: 18px bold price, 11px old price, 11px green discount, 10px tax note */}
                      <div className="flex items-baseline gap-1.5 flex-wrap pt-1">
                        <span className="text-[18px] font-bold text-stone-900 leading-none">
                          ₹{(activeUnitPrice || 0).toLocaleString('en-IN')}
                        </span>

                        {strikeUnitPrice && (
                          <span className="text-[11px] text-stone-400 line-through font-normal">
                            ₹{strikeUnitPrice.toLocaleString('en-IN')}
                          </span>
                        )}

                        {discountPercent > 0 && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-stone-400 leading-tight">Incl. of all taxes</p>

                      {/* Stock Chip */}
                      <div className="pt-0.5">
                        {maxStock <= 3 ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-200/60 inline-block">
                            Only {maxStock} left
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60 inline-block">
                            ✓ In Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: 3. QUANTITY CONTROL (32px height, TYPEABLE INPUT) + 5. SAVE FOR LATER ghost chip */}
                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      {/* 3. Quantity Control */}
                      <div className="h-[32px] inline-flex items-center bg-stone-100/90 border border-stone-200/70 rounded-full px-1 gap-0.5 shadow-inner">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          type="button"
                          disabled={quantity <= 0 || isUpdating}
                          onClick={() => onUpdateQuantity(targetId, Math.max(0, quantity - 1))}
                          className="h-[28px] w-[28px] rounded-full bg-white text-stone-800 shadow-2xs flex items-center justify-center font-bold text-xs disabled:opacity-40 transition-transform shrink-0"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus className="h-3 w-3" />
                        </motion.button>

                        {/* Fast & Non-blocking Typeable Input */}
                        <CartQuantityInput
                          quantity={quantity}
                          maxStock={maxStock}
                          isUpdating={isUpdating}
                          onUpdate={(val) => onUpdateQuantity(targetId, val)}
                        />

                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          type="button"
                          disabled={isUpdating}
                          onClick={() => onUpdateQuantity(targetId, quantity + 1)}
                          className="h-[28px] w-[28px] rounded-full bg-white text-stone-800 shadow-2xs flex items-center justify-center font-bold text-xs disabled:opacity-40 transition-transform shrink-0"
                          aria-label="Increase quantity"
                        >
                          <FiPlus className="h-3 w-3" />
                        </motion.button>
                      </div>

                      {/* 5. Save For Later (Small ghost chip) */}
                      {onMoveToWishlist && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => onMoveToWishlist(item)}
                          className="text-[11px] font-semibold text-stone-600 bg-stone-100/80 hover:bg-amber-50 hover:text-amber-800 px-2.5 py-1 rounded-full border border-stone-200/70 flex items-center gap-1 transition-all"
                        >
                          <FiHeart className="h-3 w-3 text-amber-700" />
                          <span>Save for Later</span>
                        </motion.button>
                      )}
                    </div>

                    {/* Out of Stock / Exceeds Stock Warning with WhatsApp Contact Link */}
                    {isExceeded && (
                      <div className="bg-amber-50/90 border border-amber-300/80 rounded-[10px] p-2.5 text-[11px] text-amber-950 space-y-1.5 mt-1">
                        <div className="flex items-start gap-1.5 font-bold">
                          <FiAlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                          <span>Currently only {maxStock} units available in stock.</span>
                        </div>
                        <p className="text-[10px] text-stone-600 leading-snug">
                          Need more quantities for festival or temple order? Contact our team directly on WhatsApp for bulk availability!
                        </p>
                        <a
                          href={`https://wa.me/${siteConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hari Om! I want to order ${quantity} units of "${productName || item.product?.name || 'Poshak'}" (Available stock: ${maxStock}). Please help me place this order.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                        >
                          <FaWhatsapp className="h-3.5 w-3.5" />
                          <span>Contact Us on WhatsApp for Bulk Order</span>
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </section>

        {/* ─── COUPON SECTION ─── */}
        <section className="bg-white rounded-[14px] border border-stone-200/80 p-3 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 pb-1.5 border-b border-stone-100">
            <FiTag className="h-4 w-4 text-amber-700 shrink-0" />
            <span className="text-[13px] font-bold text-stone-900">
              Apply Coupon Code
            </span>
          </div>

          <CouponInput
            orderAmount={subtotal}
            appliedCoupon={appliedCoupon}
            onApply={onApplyCoupon}
            onRemove={onRemoveCoupon}
            isEmbedded={true}
          />
        </section>

        {/* ─── 10. CART SUMMARY (PRICE DETAILS) ─── */}
        <section className="bg-white rounded-[14px] border border-stone-200/80 p-3.5 shadow-2xs space-y-3">
          <h2 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Price Details ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
          </h2>

          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between text-stone-600">
              <span>Item Total</span>
              <span className="font-semibold text-stone-900">₹{safeSubtotal.toLocaleString('en-IN')}</span>
            </div>

            {safeDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200/60 font-medium">
                <span className="flex items-center gap-1.5">
                  <FiTag className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Promo Discount {appliedCoupon?.code ? `(${appliedCoupon.code})` : ''}</span>
                </span>
                <span className="font-bold font-mono">-₹{safeDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee</span>
              {safeShipping === 0 ? (
                <span className="font-bold text-emerald-700">FREE</span>
              ) : (
                <span className="font-semibold text-stone-900">₹{safeShipping.toLocaleString('en-IN')}</span>
              )}
            </div>

            <div className="pt-2 border-t border-dashed border-stone-200 flex justify-between items-baseline">
              <span className="text-[14px] font-bold text-stone-900">Grand Total</span>
              <span className="text-[18px] font-bold text-stone-900">₹{safeGrandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Checkout Button ONLY (46px height, radius 12px, gold gradient) */}
          <motion.button
            whileTap={isCheckoutDisabled ? {} : { scale: 0.97 }}
            type="button"
            disabled={isCheckoutDisabled}
            onClick={onProceedToCheckout}
            className="w-full h-[46px] rounded-[12px] bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white font-bold text-[13px] shadow-md shadow-amber-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none"
          >
            <FiLock className="h-4 w-4 text-amber-200" />
            <span>
              {invalidItemInfo.zeroQty
                ? 'Invalid Quantity (0)'
                : invalidItemInfo.exceededStock
                ? 'Stock Exceeded'
                : 'Proceed to Checkout'}
            </span>
            <FiArrowRight className="h-4 w-4 text-amber-200" />
          </motion.button>

          {/* Below Button: Secure Checkout 100% Safe Payments tiny icons */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-stone-400 pt-1">
            <FiShield className="h-3.5 w-3.5 text-emerald-600" />
            <span>100% Safe & Secure Payments</span>
          </div>
        </section>

        {/* ─── 12. RECOMMENDED PRODUCTS (Luxury Horizontal Scroll - Myntra Style) ─── */}
        {trendingProducts.length > 0 && (
          <section className="bg-white rounded-[14px] border border-stone-200/80 p-3.5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[13px] font-bold text-stone-900 flex items-center gap-1.5">
                  <HiSparkles className="h-3.5 w-3.5 text-amber-700" />
                  <span>You May Also Like</span>
                </h2>
                <p className="text-[10px] text-stone-500">Handcrafted recommendations suited for your deity</p>
              </div>
            </div>

            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none snap-x -mx-3.5 px-3.5">
              {trendingProducts.slice(0, 8).map((prod) => (
                <MobileHorizontalProductCard key={`rec-${prod.id}`} product={prod} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ─── 11. STICKY CHECKOUT BAR (Positioned above MobileBottomNav on mobile: bottom-[56px] md:bottom-0) ─── */}
      <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-[767px] mx-auto flex items-center justify-between gap-3">
          {/* Left: Total Price 18px Bold */}
          <div className="flex flex-col shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 font-sans">
              Grand Total
            </span>
            <span className="text-[18px] font-bold text-stone-900 leading-none">
              ₹{safeGrandTotal.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Right: Checkout Button (46px height, gold gradient, disabled when quantity is invalid or exceeds stock) */}
          <motion.button
            whileTap={isCheckoutDisabled ? {} : { scale: 0.97 }}
            type="button"
            disabled={isCheckoutDisabled}
            onClick={onProceedToCheckout}
            className="flex-1 max-w-[240px] h-[46px] rounded-[12px] bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white font-bold text-[13px] shadow-md shadow-amber-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none"
          >
            <FiLock className="h-4 w-4 text-amber-200" />
            <span>
              {invalidItemInfo.zeroQty
                ? 'Invalid Qty'
                : invalidItemInfo.exceededStock
                ? 'Exceeds Stock'
                : 'Checkout'}
            </span>
            <FiArrowRight className="h-4 w-4 text-amber-200" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

