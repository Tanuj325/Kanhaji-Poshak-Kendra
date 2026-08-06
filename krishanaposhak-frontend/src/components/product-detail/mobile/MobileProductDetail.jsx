import { useState, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiHeart,
  FiShare2,
  FiStar,
  FiShoppingBag,
  FiZap,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiMaximize2,
  FiX,
  FiMinus,
  FiPlus,
  FiAward,
} from 'react-icons/fi';
import PriceDisplay from '@/components/ui/PriceDisplay';
import OptimizedImage from '@/components/ui/OptimizedImage';
import ProductReviewsSection from '@/components/product-detail/ProductReviewsSection';
import RelatedProductsSection from '@/components/product-detail/RelatedProductsSection';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTE_PATHS, buildPath } from '@/routes/routePaths';
import { FREE_SHIPPING_THRESHOLD } from '@/utils/shippingCalculator';
import toast from 'react-hot-toast';

export default function MobileProductDetail({
  product,
  variants = [],
  selectedVariant,
  setSelectedVariant,
  breadcrumbItems = [],
  canonicalUrl,
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem, isAddingItem } = useCartContext();
  const { toggleWishlist, isInWishlist } = useWishlistContext();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('specs'); // 'specs' | 'care' | 'shipping'

  const touchStartRef = useRef(null);

  // Images setup
  const sortedImages = useMemo(() => {
    if (!product?.images?.length) {
      const fallbackUrl = product?.imageUrl || '/placeholder.png';
      return [{ imageUrl: fallbackUrl, altText: product?.name || 'Product Image' }];
    }
    return [...product.images].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [product]);

  const currentImage = sortedImages[selectedImageIndex] || sortedImages[0];

  // Pricing calculations
  const activePrice = selectedVariant?.price || product?.price || 0;
  const activeDiscountPrice = selectedVariant?.discountPrice || product?.discountPrice || 0;
  const hasDiscount = activeDiscountPrice > 0 && activeDiscountPrice < activePrice;
  const currentDisplayPrice = hasDiscount ? activeDiscountPrice : activePrice;
  const strikePrice = hasDiscount ? activePrice : null;

  const discountPercent = useMemo(() => {
    if (!hasDiscount || !activePrice) return 0;
    return Math.round(((activePrice - activeDiscountPrice) / activePrice) * 100);
  }, [hasDiscount, activePrice, activeDiscountPrice]);

  const stock = selectedVariant?.stock ?? product?.stock ?? 10;
  const isOutOfStock = stock <= 0;

  const isWishlisted = selectedVariant ? isInWishlist(selectedVariant.id) : false;

  // Actual product rating & reviews (no hardcoding)
  const averageRating = product?.averageRating != null ? Number(product.averageRating).toFixed(1) : null;
  const reviewCount = product?.reviewCount ?? 0;

  // Swipe gesture handling for image carousel
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setSelectedImageIndex((prev) => (prev < sortedImages.length - 1 ? prev + 1 : 0));
      } else {
        setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : sortedImages.length - 1));
      }
    }
    touchStartRef.current = null;
  };

  // Handlers
  const numericQuantity = Math.max(1, Number(quantity) || 1);

  const handleAddToCart = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      navigate(buildPath.loginWithRedirect(window.location.pathname));
      return;
    }
    if (!selectedVariant) {
      toast.error('Please select a size first');
      return;
    }
    await addItem(selectedVariant.id, numericQuantity);
  }, [isAuthenticated, selectedVariant, numericQuantity, addItem, navigate]);

  const handleBuyNow = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to purchase');
      navigate(buildPath.loginWithRedirect(window.location.pathname));
      return;
    }
    if (!selectedVariant) {
      toast.error('Please select a size first');
      return;
    }
    await addItem(selectedVariant.id, numericQuantity);
    navigate(ROUTE_PATHS.CHECKOUT);
  }, [isAuthenticated, selectedVariant, numericQuantity, addItem, navigate]);

  const handleWishlistToggle = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to manage wishlist');
      navigate(buildPath.loginWithRedirect(window.location.pathname));
      return;
    }
    if (!selectedVariant) {
      toast.error('Please select a size first');
      return;
    }
    await toggleWishlist(selectedVariant.id);
  }, [isAuthenticated, selectedVariant, toggleWishlist, navigate]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'Kanhaji Poshak',
          url: canonicalUrl || window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(canonicalUrl || window.location.href);
      toast.success('Link copied to clipboard!');
    }
  }, [product, canonicalUrl]);

  const toggleAccordion = (name) => {
    setOpenAccordion((prev) => (prev === name ? null : name));
  };

  const freeShippingThresholdFormatted = FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN');

  return (
    <div className="min-h-dvh w-full bg-[#FAF8F5] text-slate-800 font-sans antialiased pb-36 md:pb-28">
      {/* ─── STICKY HEADER (52px Height, 36x36 Buttons, 10px Category) ─── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 h-[52px] flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-[36px] w-[36px] rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs"
          aria-label="Back"
        >
          <FiArrowLeft className="h-4 w-4 text-slate-800" />
        </button>

        <div className="flex flex-col items-center text-center max-w-[55%]">
          <span className="text-[10px] font-medium tracking-wider uppercase text-amber-800 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 truncate">
            {product?.categoryName || product?.category?.name || 'Devotional Attire'}
          </span>
          <span className="text-[11px] font-semibold text-slate-900 truncate mt-0.5 w-full">
            {product?.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            className="h-[36px] w-[36px] rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs"
            aria-label="Share product"
          >
            <FiShare2 className="h-3.5 w-3.5 text-slate-700" />
          </button>

          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`h-[36px] w-[36px] rounded-full border flex items-center justify-center active:scale-95 transition-all shadow-2xs ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200/80 text-slate-700'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-rose-600' : 'text-slate-700'}`} />
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER (16px Spacing Between Sections) ─── */}
      <main className="px-4 py-4 space-y-4 w-full max-w-[767px] mx-auto">

        {/* ─── 1. COMPACT IMAGE GALLERY (340px Mobile, 400px Tablet) ─── */}
        <section className="relative w-full">
          <div
            className="relative h-[340px] md:h-[400px] w-full overflow-hidden rounded-[18px] bg-white border border-slate-100 shadow-2xs cursor-zoom-in"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => setIsFullscreen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage?.imageUrl || selectedImageIndex}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full"
              >
                <OptimizedImage
                  src={currentImage?.imageUrl}
                  alt={currentImage?.altText || product?.name}
                  className="h-full w-full object-contain object-center p-2"
                  loading="eager"
                />
              </motion.div>
            </AnimatePresence>

            {/* Top Left Badge */}
            <div className="absolute top-2.5 left-0 z-20 flex items-center gap-1 bg-[#0A1628] text-[#F5E4B5] px-2.5 py-0.5 rounded-r-lg shadow-2xs border-y border-r border-[#D4AF37]/30 text-[9px] font-medium tracking-wider uppercase">
              <FiAward className="h-2.5 w-2.5 text-[#D4AF37] shrink-0" />
              <span>Handcrafted</span>
            </div>

            {/* Top Right Floating Action Button (30x30) */}
            <div className="absolute top-2.5 right-2.5 z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(true);
                }}
                className="h-[30px] w-[30px] rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs flex items-center justify-center text-slate-700 active:scale-90 transition-all"
                aria-label="Expand image fullscreen"
              >
                <FiMaximize2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Bottom Left Discount Badge (Small, Elegant) */}
            {hasDiscount && (
              <div className="absolute bottom-2.5 left-2.5 z-20 bg-emerald-600 text-white font-bold text-[10px] tracking-wide px-2 py-0.5 rounded-md shadow-2xs">
                {discountPercent}% OFF
              </div>
            )}

            {/* Bottom Center Pagination Dots (6px Dots) */}
            {sortedImages.length > 1 && (
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                {sortedImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      idx === selectedImageIndex
                        ? 'w-3 bg-[#C99A3B]'
                        : 'w-1.5 bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Horizontal Thumbnails Strip */}
          {sortedImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto w-full pt-2 pb-0.5 scrollbar-none">
              {sortedImages.map((img, idx) => {
                const isSelected = idx === selectedImageIndex;
                return (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative flex-shrink-0 h-12 w-12 overflow-hidden rounded-lg border transition-all duration-200 bg-white ${
                      isSelected
                        ? 'border-[#C99A3B] ring-1 ring-[#C99A3B]/40 scale-105 shadow-2xs'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover object-top"
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ─── 2. PRODUCT INFO CARD (12px Card Padding, Compact Typography, Real Rating Data) ─── */}
        <section className="bg-white rounded-[16px] p-3 sm:p-4 border border-slate-100 shadow-2xs space-y-2.5">
          
          {/* Brand + Rating Pill */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-slate-500 font-sans">
              Kanhaji Poshak Kendra
            </span>

            {/* Rating Glass Pill (Strictly dynamic from backend API - no fake fallbacks) */}
            <div className="h-6 px-2 rounded-full bg-amber-50 border border-amber-200/60 text-[11px] font-medium text-slate-800 inline-flex items-center gap-1">
              <FiStar className="h-3 w-3 fill-amber-400 text-amber-500" />
              <span>{averageRating !== null ? averageRating : (reviewCount > 0 ? '0.0' : 'New')}</span>
              <span className="text-slate-400 font-normal">
                ({reviewCount})
              </span>
            </div>
          </div>

          {/* Product Title (17px Semibold, Max 2 lines) */}
          <h1 className="text-[17px] font-semibold text-slate-900 leading-snug tracking-tight line-clamp-2">
            {product?.name}
          </h1>

          {/* Price Hierarchy (Price 26px, Old Price 14px, Green Discount) */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[26px] font-bold text-slate-900 tracking-tight leading-none">
                ₹{currentDisplayPrice.toLocaleString('en-IN')}
              </span>

              {strikePrice && (
                <span className="text-[14px] font-medium text-slate-400 line-through">
                  ₹{strikePrice.toLocaleString('en-IN')}
                </span>
              )}

              {hasDiscount && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
              <span>Inclusive of all taxes</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <FiTruck className="h-3 w-3" />
                Free Express Shipping over ₹{freeShippingThresholdFormatted}
              </span>
            </div>
          </div>

          {/* Stock Availability */}
          <div>
            {isOutOfStock ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50/80 p-2 text-center text-[11px] font-semibold text-rose-700">
                Currently Out of Stock. Wishlist for restock alert.
              </div>
            ) : stock <= 5 ? (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                <span>Only {stock} left in stock - Order soon</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <FiCheck className="h-3 w-3 text-emerald-600" />
                <span>In Stock & Ready to Dispatch</span>
              </div>
            )}
          </div>
        </section>

        {/* ─── 3. VARIANT SELECTION (Chips Height 36px, Rounded 12px) ─── */}
        {variants.length > 0 && (
          <section className="bg-white rounded-[16px] p-3 sm:p-4 border border-slate-100 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Select Size / Variant
              </h2>
              {selectedVariant && (
                <span className="text-[11px] font-bold text-[#C99A3B]">
                  {selectedVariant.size || selectedVariant.name || selectedVariant.color}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const isVOutOfStock = v.stock <= 0;
                const label = v.size || v.name || v.color || `Variant #${v.id}`;

                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={isVOutOfStock}
                    onClick={() => setSelectedVariant(v)}
                    className={`h-[36px] px-3 py-1.5 rounded-[12px] text-[11px] transition-all duration-150 flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#D4AF37] via-[#C99A3B] to-[#B3832B] text-white font-bold border-transparent shadow-2xs scale-[1.01]'
                        : isVOutOfStock
                        ? 'bg-slate-50 text-slate-400 border-slate-200 line-through opacity-60 cursor-not-allowed font-medium'
                        : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:border-[#C99A3B]/40 font-medium'
                    }`}
                  >
                    <span>{label}</span>
                    {v.price && (
                      <span className={`text-[10px] ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                        ₹{(v.discountPrice || v.price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── 4. QUANTITY SELECTOR (Editable Input + Stepper Buttons) ─── */}
        <section className="bg-white rounded-[16px] p-3 sm:p-4 border border-slate-100 shadow-2xs flex items-center justify-between">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Quantity
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Select or type quantity
            </p>
          </div>

          <div className="h-[38px] inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-[14px] px-1.5">
            <button
              type="button"
              disabled={numericQuantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, (Number(q) || 1) - 1))}
              className="h-[30px] w-[30px] rounded-[10px] bg-white text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-all shrink-0"
              aria-label="Decrease quantity"
            >
              <FiMinus className="h-3 w-3" />
            </button>

            <input
              type="number"
              min={1}
              max={stock}
              value={quantity}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setQuantity('');
                } else {
                  const parsed = parseInt(val, 10);
                  if (!isNaN(parsed)) {
                    setQuantity(Math.max(1, Math.min(stock, parsed)));
                  }
                }
              }}
              onBlur={() => {
                if (!quantity || Number(quantity) < 1) setQuantity(1);
              }}
              className="w-10 text-center text-xs font-bold text-slate-900 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#C99A3B] rounded font-mono p-0"
            />

            <button
              type="button"
              disabled={numericQuantity >= stock}
              onClick={() => setQuantity((q) => Math.min(stock, (Number(q) || 1) + 1))}
              className="h-[30px] w-[30px] rounded-[10px] bg-white text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-all shrink-0"
              aria-label="Increase quantity"
            >
              <FiPlus className="h-3 w-3" />
            </button>
          </div>
        </section>

        {/* ─── 5. EXPANDABLE DESCRIPTION (13px Body Typography) ─── */}
        <section className="bg-white rounded-[16px] p-3 sm:p-4 border border-slate-100 shadow-2xs space-y-2">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
            About This Creation
          </h2>

          <div>
            <p
              className={`text-[13px] text-slate-600 leading-relaxed transition-all duration-200 ${
                !isDescExpanded ? 'line-clamp-3' : ''
              }`}
            >
              {product?.description ||
                product?.shortDescription ||
                `Handcrafted devotional poshak meticulously designed for Lord Krishna idols. Features authentic Zardosi and Gota Patti embroidery from skilled artisans in Meerut.`}
            </p>

            <button
              type="button"
              onClick={() => setIsDescExpanded((prev) => !prev)}
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#C99A3B] hover:text-[#B3832B]"
            >
              <span>{isDescExpanded ? 'Read Less' : 'Read More'}</span>
              {isDescExpanded ? <FiChevronUp className="h-3.5 w-3.5" /> : <FiChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        </section>

        {/* ─── 6. APPLE-STYLE COMPACT ACCORDIONS ─── */}
        <section className="bg-white rounded-[16px] border border-slate-100 shadow-2xs overflow-hidden divide-y divide-slate-100">
          
          {/* Accordion 1: Specifications */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('specs')}
              className="w-full px-3.5 py-3 flex items-center justify-between text-left text-xs font-semibold text-slate-800"
            >
              <span>Product Specifications</span>
              {openAccordion === 'specs' ? (
                <FiChevronUp className="h-3.5 w-3.5 text-[#C99A3B]" />
              ) : (
                <FiChevronDown className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {openAccordion === 'specs' && (
              <div className="px-3.5 pb-3 pt-0 text-[11px] space-y-1.5 text-slate-600 border-t border-slate-50">
                <div className="flex justify-between py-0.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Material</span>
                  <span className="font-semibold text-slate-800">{product?.material || 'Silk & Brocade'}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Crafting Origin</span>
                  <span className="font-semibold text-slate-800">Meerut, Uttar Pradesh</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Embroidery</span>
                  <span className="font-semibold text-slate-800">Handcrafted Gota Patti</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500 font-medium">Package Includes</span>
                  <span className="font-semibold text-slate-800">Poshak + Dupatta Set</span>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2: Care Instructions */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('care')}
              className="w-full px-3.5 py-3 flex items-center justify-between text-left text-xs font-semibold text-slate-800"
            >
              <span>Care & Maintenance</span>
              {openAccordion === 'care' ? (
                <FiChevronUp className="h-3.5 w-3.5 text-[#C99A3B]" />
              ) : (
                <FiChevronDown className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {openAccordion === 'care' && (
              <div className="px-3.5 pb-3 pt-0 text-[11px] space-y-1 text-slate-600 border-t border-slate-50">
                <p className="leading-relaxed">
                  • Dry clean recommended to maintain gold embroidery brilliance.
                </p>
                <p className="leading-relaxed">
                  • Store flat wrapped in soft cotton or silk pouch away from direct moisture.
                </p>
              </div>
            )}
          </div>

          {/* Accordion 3: Shipping & Returns */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('shipping')}
              className="w-full px-3.5 py-3 flex items-center justify-between text-left text-xs font-semibold text-slate-800"
            >
              <span>Shipping & Returns</span>
              {openAccordion === 'shipping' ? (
                <FiChevronUp className="h-3.5 w-3.5 text-[#C99A3B]" />
              ) : (
                <FiChevronDown className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {openAccordion === 'shipping' && (
              <div className="px-3.5 pb-3 pt-0 text-[11px] space-y-1.5 text-slate-600 border-t border-slate-50">
                <div className="flex items-start gap-2">
                  <FiTruck className="h-3.5 w-3.5 text-[#C99A3B] shrink-0 mt-0.5" />
                  <span>Free Express Shipping across India on orders over ₹{freeShippingThresholdFormatted}.</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiShield className="h-3.5 w-3.5 text-[#C99A3B] shrink-0 mt-0.5" />
                  <span>100% Genuine Handcrafted Guarantee directly from Meerut artisans.</span>
                </div>
                <div className="flex items-start gap-2">
                  <FiRefreshCw className="h-3.5 w-3.5 text-[#C99A3B] shrink-0 mt-0.5" />
                  <span>7-day easy returns & exchanges for complete peace of mind.</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─── 7. REVIEWS SECTION (Card Padding 12px) ─── */}
        <section className="bg-white rounded-[16px] p-3 sm:p-4 border border-slate-100 shadow-2xs">
          <ProductReviewsSection
            productId={product?.id}
            productAverageRating={product?.averageRating}
          />
        </section>

        {/* ─── 8. RELATED PRODUCTS CAROUSEL ─── */}
        <section className="bg-white rounded-[16px] p-3 sm:p-4 border border-slate-100 shadow-2xs">
          <RelatedProductsSection
            categoryId={product?.categoryId || product?.category?.id}
            currentProductSlug={product?.slug}
            currentProductId={product?.id}
          />
        </section>
      </main>

      {/* ─── 9. STICKY BOTTOM BAR (Positioned above MobileBottomNav on mobile: bottom-[56px] md:bottom-0) ─── */}
      <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-2.5 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] rounded-t-[18px]">
        <div className="flex items-center justify-between gap-[10px] max-w-[767px] mx-auto w-full">
          
          {/* Price Summary */}
          <div className="flex flex-col shrink-0 min-w-0">
            <span className="text-[9px] uppercase font-semibold text-slate-400 tracking-wider">Total</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[17px] font-bold text-slate-900 tracking-tight leading-none">
                ₹{(currentDisplayPrice * numericQuantity).toLocaleString('en-IN')}
              </span>
              {strikePrice && (
                <span className="text-[11px] font-medium text-slate-400 line-through">
                  ₹{(strikePrice * numericQuantity).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons (Height 48px, Rounded 14px, Gap 10px) */}
          <div className="flex items-center gap-[10px] flex-1 min-w-0">
            {/* Add to Cart - Primary Gold */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              disabled={isOutOfStock || isAddingItem}
              onClick={handleAddToCart}
              className="h-[48px] flex-1 rounded-[14px] bg-gradient-to-r from-[#D4AF37] via-[#C99A3B] to-[#B3832B] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingBag className="h-3.5 w-3.5 shrink-0 text-amber-100" />
              <span className="truncate">Add to Cart</span>
            </motion.button>

            {/* Buy Now - Dark */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              disabled={isOutOfStock || isAddingItem}
              onClick={handleBuyNow}
              className="h-[48px] flex-1 rounded-[14px] bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiZap className="h-3.5 w-3.5 shrink-0 text-amber-300" />
              <span className="truncate">Buy Now</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ─── FULLSCREEN LIGHTBOX MODAL ─── */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-4"
            onClick={() => setIsFullscreen(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Modal Header */}
            <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between text-white">
              <span className="text-xs font-semibold truncate max-w-[80%]">
                {product?.name} ({selectedImageIndex + 1} / {sortedImages.length})
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white min-h-[36px] min-w-[36px]"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Lightbox Image */}
            <div className="relative max-h-[85vh] max-w-[95vw] flex items-center justify-center">
              <img
                src={currentImage?.imageUrl}
                alt={product?.name}
                className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
