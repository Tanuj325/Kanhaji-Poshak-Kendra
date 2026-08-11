import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@/components/overlay/Modal';
import Button from '@/components/ui/Button';
import PriceDisplay from '@/components/ui/PriceDisplay';
import Rating from '@/components/ui/Rating';
import DiscountBadge from '@/components/ui/DiscountBadge';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { buildPath } from '@/routes/routePaths';
import { useAuth } from '@/context/AuthContext';
import { useAddToCart } from '@/hooks/useCart';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import toast from 'react-hot-toast';
import { FiHeart, FiShoppingBag, FiExternalLink, FiCheckCircle } from 'react-icons/fi';

export default function QuickViewModal({ isOpen, onClose, product }) {
  const { isAuthenticated } = useAuth();
  const addToCartMutation = useAddToCart();
  const { data: wishlist } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const variants = useMemo(() => {
    if (!product) return [];
    return product.variants || product.productVariants || [];
  }, [product]);

  useEffect(() => {
    if (!variants.length) {
      setSelectedVariant(null);
      return;
    }
    const firstActive = variants.find((v) => v.active !== false && v.stock > 0) || variants[0];
    setSelectedVariant(firstActive);
  }, [variants]);

  useEffect(() => {
    setQuantity(1);
    setSelectedImageIndex(0);
  }, [product]);

  if (!product) return null;

  const images = product.images || (product.imageUrl ? [{ imageUrl: product.imageUrl }] : []);
  const activeImage = images[selectedImageIndex]?.imageUrl || images[selectedImageIndex]?.url || product.imageUrl || '/placeholder.svg';

  const price = selectedVariant?.price || product.price || product.discountPrice;
  const discountPrice = selectedVariant?.discountPrice || product.discountPrice;

  const stock = selectedVariant ? selectedVariant.stock : product.stock ?? 10;
  const isOutOfStock = stock === 0;

  const wishlistVariantIds = useMemo(() => {
    const set = new Set();
    const items = Array.isArray(wishlist) ? wishlist : wishlist?.items || wishlist?.data || [];
    items.forEach((item) => {
      if (item.productId) set.add(Number(item.productId));
      if (item.variantId) set.add(Number(item.variantId));
      if (item.productVariantId) set.add(Number(item.productVariantId));
      if (item.id) set.add(Number(item.id));
    });
    return set;
  }, [wishlist]);

  const targetVariantId = selectedVariant?.id || product.id;
  const isInWishlist = wishlistVariantIds.has(Number(targetVariantId)) || wishlistVariantIds.has(Number(product.id));

  const handleAddToCart = () => {
    if (!targetVariantId) return;
    addToCartMutation.mutate({ productVariantId: targetVariantId, quantity });
    onClose();
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save items to your wishlist');
      return;
    }
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(targetVariantId);
    } else {
      addToWishlistMutation.mutate({ productId: targetVariantId });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pt-1 font-display">
        {/* Left: Gallery */}
        <div className="space-y-2.5">
          <div className="relative aspect-[4/5] max-h-[40vh] md:max-h-none overflow-hidden rounded-2xl bg-amber-50/40 border border-amber-900/10 shadow-inner">
            <img
              src={activeImage}
              alt={product.name || 'Product creation'}
              className="h-full w-full object-cover transition-all duration-300"
            />
            {discountPrice && price && (
              <DiscountBadge
                originalPrice={price}
                discountPrice={discountPrice}
                size="sm"
                className="absolute left-3 top-3 z-10"
              />
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-amber-200">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all min-h-[44px] min-w-[44px] ${selectedImageIndex === i
                      ? 'border-amber-800 ring-2 ring-amber-700/30 scale-105'
                      : 'border-amber-900/15 opacity-70 hover:opacity-100'
                    }`}
                >
                  <img
                    src={img.imageUrl || img.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Form */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-md border border-amber-800/20 inline-block mb-1.5">
              {product.categoryName || product.category?.name || 'Meerut Sacred Collection'}
            </span>

            <h2 className="text-base sm:text-xl font-bold text-amber-950 leading-snug">
              {product.name}
            </h2>

            <div className="mt-2 flex items-center gap-3">
              <Rating rating={product.averageRating || 5} size="xs" count={product.reviewCount || 12} />
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <FiCheckCircle className="h-3.5 w-3.5" /> In Stock
              </span>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-amber-900/10">
              <PriceDisplay
                price={discountPrice || price}
                originalPrice={discountPrice ? price : undefined}
                size="md"
              />
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-950">
                  Select Size Variant
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const isVarOutOfStock = variant.stock === 0;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        disabled={isVarOutOfStock}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition-all min-h-[44px] ${isSelected
                            ? 'border-amber-900 bg-[linear-gradient(135deg,#0f2440,#1b3a5c)] text-white shadow-gold scale-102'
                            : isVarOutOfStock
                              ? 'border-stone-200 bg-stone-100 text-stone-400 line-through cursor-not-allowed'
                              : 'border-amber-900/20 bg-white text-amber-950 hover:border-amber-800'
                          }`}
                      >
                        {variant.size || variant.color || `Variant ${variant.id}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-3 space-y-1.5">
              <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-950">
                Quantity
              </label>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={stock || 10}
                disabled={isOutOfStock}
              />
            </div>
          </div>

          {/* Sticky Actions */}
          <div className="space-y-2.5 pt-3 border-t border-amber-900/10 sticky bottom-0 bg-white/95 backdrop-blur-md">
            <div className="flex gap-2.5">
              <Button
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f2440,#1b3a5c_55%,#0d4f5e)] py-3 text-xs sm:text-sm font-bold text-white shadow-gold min-h-[48px]"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                isLoading={addToCartMutation.isPending}
              >
                <FiShoppingBag className="h-4 w-4 text-amber-300" /> Add to Cart
              </Button>

              <button
                type="button"
                onClick={handleWishlistToggle}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all min-h-[48px] min-w-[48px] ${isInWishlist
                    ? 'border-rose-300 bg-rose-50 text-rose-600 shadow-xs'
                    : 'border-amber-900/20 bg-white text-stone-700 hover:border-rose-300 hover:text-rose-600'
                  }`}
                aria-label="Toggle wishlist"
              >
                <FiHeart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {product.slug && (
              <Link
                to={buildPath.product(product.slug)}
                onClick={onClose}
                className="flex items-center justify-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-950 transition-colors pt-0.5"
              >
                View Complete Details <FiExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
