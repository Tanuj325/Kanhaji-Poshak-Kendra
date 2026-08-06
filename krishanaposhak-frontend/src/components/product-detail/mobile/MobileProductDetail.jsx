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

  // Swipe gesture handling for image carousel
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left -> next image
        setSelectedImageIndex((prev) => (prev < sortedImages.length - 1 ? prev + 1 : 0));
      } else {
        // Swipe right -> prev image
        setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : sortedImages.length - 1));
      }
    }
    touchStartRef.current = null;
  };

  // Handlers
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
    await addItem(selectedVariant.id, quantity);
  }, [isAuthenticated, selectedVariant, quantity, addItem, navigate]);

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
    await addItem(selectedVariant.id, quantity);
    navigate(ROUTE_PATHS.CHECKOUT);
  }, [isAuthenticated, selectedVariant, quantity, addItem, navigate]);

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

  return (
    <div className="min-h-dvh w-full bg-[#FAF8F5] text-slate-800 font-sans antialiased pb-32">
      {/* ─── STICKY TOP NAVIGATION HEADER ─── */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full border border-slate-200/80 bg-white/80 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-xs min-h-[44px] min-w-[44px]"
          aria-label="Back"
        >
          <FiArrowLeft className="h-5 w-5 text-slate-800" />
        </button>

        <div className="flex flex-col items-center text-center max-w-[55%]">
          <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 truncate">
            {product?.categoryName || product?.category?.name || 'Devotional Attire'}
          </span>
          <span className="text-xs font-bold text-slate-900 truncate mt-0.5 w-full">
            {product?.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="h-10 w-10 rounded-full border border-slate-200/80 bg-white/80 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-xs min-h-[44px] min-w-[44px]"
            aria-label="Share product"
          >
            <FiShare2 className="h-4 w-4 text-slate-700" />
          </button>

          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`h-10 w-10 rounded-full border flex items-center justify-center active:scale-95 transition-all shadow-xs min-h-[44px] min-w-[44px] ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white/80 border-slate-200/80 text-slate-700'
            }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-current text-rose-600' : 'text-slate-700'}`} />
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER (16px horizontal, 20px vertical spacing) ─── */}
      <main className="px-4 py-5 space-y-5 w-full max-w-[767px] mx-auto">

        {/* ─── 1. IMAGE GALLERY CAROUSEL ─── */}
        <section className="relative w-full">
          <div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.05)] cursor-zoom-in"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => setIsFullscreen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage?.imageUrl || selectedImageIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="h-full w-full"
              >
                <OptimizedImage
                  src={currentImage?.imageUrl}
                  alt={currentImage?.altText || product?.name}
                  aspectRatio="aspect-[4/5]"
                  className="h-full w-full object-contain object-center p-2"
                  loading="eager"
                />
              </motion.div>
            </AnimatePresence>

            {/* Top Left Badge */}
            <div className="absolute top-3 left-0 z-20 flex items-center gap-1.5 bg-[#0A1628] text-[#F5E4B5] px-3 py-1 rounded-r-xl shadow-md border-y border-r border-[#D4AF37]/30 text-[10px] font-bold tracking-wider uppercase font-sans">
              <FiAward className="h-3 w-3 text-[#D4AF37] shrink-0" />
              <span>Handcrafted in Meerut</span>
            </div>

            {/* Top Right Floating Action Buttons */}
            <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(true);
                }}
                className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-center text-slate-800 active:scale-90 transition-all min-h-[44px] min-w-[44px]"
                aria-label="Expand image fullscreen"
              >
                <FiMaximize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Bottom Left Discount Badge */}
            {hasDiscount && (
              <div className="absolute bottom-3 left-3 z-20 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold text-[11px] tracking-wide px-2.5 py-1 rounded-lg shadow-md border border-emerald-400/30">
                {discountPercent}% OFF
              </div>
            )}

            {/* Bottom Center Pagination Dots */}
            {sortedImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                {sortedImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === selectedImageIndex
                        ? 'w-4 bg-[#C99A3B] shadow-sm'
                        : 'w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Horizontal Thumbnails Strip below Gallery */}
          {sortedImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto w-full pt-3 pb-1 scrollbar-none">
              {sortedImages.map((img, idx) => {
                const isSelected = idx === selectedImageIndex;
                return (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative flex-shrink-0 h-16 w-16 overflow-hidden rounded-xl border-2 transition-all duration-200 bg-white min-h-[44px] min-w-[44px] ${
                      isSelected
                        ? 'border-[#C99A3B] ring-2 ring-[#C99A3B]/30 scale-105 shadow-sm'
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

        {/* ─── 2. PRODUCT INFORMATION CARD ─── */}
        <section className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
          
          {/* Brand + Rating Pill */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-amber-800/90 font-sans">
              Kanhaji Poshak Kendra
            </span>

            {/* Rating Glass Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-950">
              <FiStar className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
              <span>{product?.averageRating ? Number(product.averageRating).toFixed(1) : '4.9'}</span>
              <span className="text-amber-900/60 font-normal">
                ({product?.reviewCount || 128})
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h1 className="text-[20px] font-bold text-slate-900 leading-snug tracking-tight">
            {product?.name}
          </h1>

          {/* Price Hierarchy */}
          <div className="pt-1 border-t border-slate-100 space-y-1.5">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ₹{currentDisplayPrice.toLocaleString('en-IN')}
              </span>

              {strikePrice && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  ₹{strikePrice.toLocaleString('en-IN')}
                </span>
              )}

              {hasDiscount && (
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Inclusive of all taxes</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <FiTruck className="h-3.5 w-3.5" />
                Free Express Delivery
              </span>
            </div>
          </div>

          {/* Stock Availability */}
          <div className="pt-1">
            {isOutOfStock ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-center text-xs font-bold text-rose-700">
                Currently Out of Stock. Wishlist to get restock alert!
              </div>
            ) : stock <= 5 ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
                <span>Only {stock} left in stock - Order Soon!</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>In Stock & Ready to Dispatch</span>
              </div>
            )}
          </div>
        </section>

        {/* ─── 3. VARIANT SELECTION (PREMIUM CHIPS) ─── */}
        {variants.length > 0 && (
          <section className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Select Size / Variant
              </h2>
              {selectedVariant && (
                <span className="text-xs font-bold text-[#C99A3B]">
                  {selectedVariant.size || selectedVariant.name || selectedVariant.color}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
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
                    className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#D4AF37] via-[#C99A3B] to-[#B3832B] text-white border-transparent shadow-md shadow-[#C99A3B]/25 scale-[1.02]'
                        : isVOutOfStock
                        ? 'bg-slate-50 text-slate-400 border-slate-200 line-through opacity-60 cursor-not-allowed'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-[#C99A3B]/50 hover:bg-amber-50/30'
                    }`}
                  >
                    <span>{label}</span>
                    {v.price && (
                      <span className={`text-[11px] ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                        ₹{(v.discountPrice || v.price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── 4. QUANTITY SELECTOR ─── */}
        <section className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Quantity
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Select desired quantity
            </p>
          </div>

          <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 shadow-2xs">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-8 w-8 rounded-full bg-white text-slate-700 border border-slate-200/80 flex items-center justify-center font-bold text-sm shadow-xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-all min-h-[32px] min-w-[32px]"
              aria-label="Decrease quantity"
            >
              <FiMinus className="h-3.5 w-3.5" />
            </button>

            <span className="w-6 text-center text-sm font-bold text-slate-900 font-mono">
              {quantity}
            </span>

            <button
              type="button"
              disabled={quantity >= stock}
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              className="h-8 w-8 rounded-full bg-white text-slate-700 border border-slate-200/80 flex items-center justify-center font-bold text-sm shadow-xs disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-all min-h-[32px] min-w-[32px]"
              aria-label="Increase quantity"
            >
              <FiPlus className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        {/* ─── 5. EXPANDABLE DESCRIPTION ─── */}
        <section className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            About This Sacred Creation
          </h2>

          <div className="relative">
            <p
              className={`text-xs text-slate-600 leading-relaxed transition-all duration-300 ${
                !isDescExpanded ? 'line-clamp-4' : ''
              }`}
            >
              {product?.description ||
                product?.shortDescription ||
                `Handcrafted devotional poshak meticulously designed for Lord Krishna idols. Features authentic Zardosi and Gota Patti embroidery from skilled artisans in Meerut.`}
            </p>

            <button
              type="button"
              onClick={() => setIsDescExpanded((prev) => !prev)}
              className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-[#C99A3B] hover:text-[#B3832B] min-h-[36px]"
            >
              <span>{isDescExpanded ? 'Read Less' : 'Read More'}</span>
              {isDescExpanded ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </section>

        {/* ─── 6. SPECIFICATIONS & CARE ACCORDIONS ─── */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-slate-100">
          
          {/* Accordion 1: Specifications */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('specs')}
              className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-800 min-h-[48px]"
            >
              <span>Product Specifications</span>
              {openAccordion === 'specs' ? (
                <FiChevronUp className="h-4 w-4 text-[#C99A3B]" />
              ) : (
                <FiChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {openAccordion === 'specs' && (
              <div className="px-5 pb-5 pt-1 text-xs space-y-2 text-slate-600 border-t border-slate-50">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Material</span>
                  <span className="font-bold text-slate-800">{product?.material || 'Silk & Brocade'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Crafting Origin</span>
                  <span className="font-bold text-slate-800">Meerut, Uttar Pradesh</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">Embroidery</span>
                  <span className="font-bold text-slate-800">Handcrafted Gota Patti</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-slate-500">Package Includes</span>
                  <span className="font-bold text-slate-800">Poshak + Dupatta Set</span>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2: Care Instructions */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('care')}
              className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-800 min-h-[48px]"
            >
              <span>Care & Maintenance</span>
              {openAccordion === 'care' ? (
                <FiChevronUp className="h-4 w-4 text-[#C99A3B]" />
              ) : (
                <FiChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {openAccordion === 'care' && (
              <div className="px-5 pb-5 pt-1 text-xs space-y-2 text-slate-600 border-t border-slate-50">
                <p className="leading-relaxed font-medium">
                  • Dry clean recommended to maintain gold embroidery brilliance.
                </p>
                <p className="leading-relaxed font-medium">
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
              className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-800 min-h-[48px]"
            >
              <span>Shipping & Returns</span>
              {openAccordion === 'shipping' ? (
                <FiChevronUp className="h-4 w-4 text-[#C99A3B]" />
              ) : (
                <FiChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {openAccordion === 'shipping' && (
              <div className="px-5 pb-5 pt-1 text-xs space-y-2.5 text-slate-600 border-t border-slate-50">
                <div className="flex items-start gap-2.5">
                  <FiTruck className="h-4 w-4 text-[#C99A3B] shrink-0 mt-0.5" />
                  <span>Free Express Shipping across India on orders over ₹499.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FiShield className="h-4 w-4 text-[#C99A3B] shrink-0 mt-0.5" />
                  <span>100% Genuine Handcrafted Guarantee directly from Meerut artisans.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FiRefreshCw className="h-4 w-4 text-[#C99A3B] shrink-0 mt-0.5" />
                  <span>7-day easy returns & exchanges for complete peace of mind.</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─── 7. REVIEWS SECTION ─── */}
        <section className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <ProductReviewsSection
            productId={product?.id}
            productAverageRating={product?.averageRating}
          />
        </section>

        {/* ─── 8. RELATED PRODUCTS CAROUSEL ─── */}
        <section className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <RelatedProductsSection
            categoryId={product?.categoryId || product?.category?.id}
            currentProductSlug={product?.slug}
            currentProductId={product?.id}
          />
        </section>
      </main>

      {/* ─── 9. STICKY BOTTOM PURCHASE BAR (52px height buttons) ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 px-4 py-3 pb-[calc(0.85rem+env(safe-area-inset-bottom))] shadow-[0_-10px_35px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-3 max-w-[767px] mx-auto w-full">
          
          {/* Price Summary */}
          <div className="flex flex-col shrink-0 min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 tracking-tight">
                ₹{(currentDisplayPrice * quantity).toLocaleString('en-IN')}
              </span>
              {strikePrice && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  ₹{(strikePrice * quantity).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons (Height 52px, Rounded 16px) */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Add to Cart */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              disabled={isOutOfStock || isAddingItem}
              onClick={handleAddToCart}
              className="h-[52px] flex-1 rounded-[16px] border border-[#C99A3B] bg-amber-50/60 text-[#966d1f] hover:bg-amber-100/60 font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px]"
            >
              <FiShoppingBag className="h-4 w-4 shrink-0 text-[#C99A3B]" />
              <span className="truncate">Add to Cart</span>
            </motion.button>

            {/* Buy Now */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              disabled={isOutOfStock || isAddingItem}
              onClick={handleBuyNow}
              className="h-[52px] flex-1 rounded-[16px] bg-gradient-to-r from-[#D4AF37] via-[#C99A3B] to-[#B3832B] text-white font-bold text-xs shadow-md shadow-[#C99A3B]/25 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px]"
            >
              <FiZap className="h-4 w-4 shrink-0 text-amber-100" />
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
              <span className="text-xs font-bold truncate max-w-[80%]">
                {product?.name} ({selectedImageIndex + 1} / {sortedImages.length})
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white min-h-[44px] min-w-[44px]"
              >
                <FiX className="h-6 w-6" />
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
