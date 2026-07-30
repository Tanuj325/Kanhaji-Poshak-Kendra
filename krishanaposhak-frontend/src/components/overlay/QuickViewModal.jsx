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

  const wishlistVariantIds = new Set(
    (Array.isArray(wishlist) ? wishlist : wishlist?.items || wishlist?.data || []).map(
      (item) => item.productVariantId || item.variantId || item.id,
    ),
  );

  const targetVariantId = selectedVariant?.id || product.id;
  const isInWishlist = wishlistVariantIds.has(targetVariantId);

  const handleAddToCart = () => {
    if (!targetVariantId) return;
    addToCartMutation.mutate({ productVariantId: targetVariantId, quantity });
    onClose();
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save wishlist items');
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-1 font-display">
        {/* Left: Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-warm-cream/30 border border-muted-sand/30 shadow-inner">
            <img
              src={activeImage}
              alt={product.name || 'Product'}
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
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImageIndex === i
                      ? 'border-royal-blue ring-2 ring-royal-blue/30 scale-105'
                      : 'border-muted-sand/30 opacity-70 hover:opacity-100'
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
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 inline-block mb-2">
              {product.categoryName || product.category?.name || 'Meerut Sacred Collection'}
            </span>

            <h2 className="text-lg sm:text-xl font-bold text-dark-charcoal leading-snug">
              {product.name}
            </h2>

            <div className="mt-2.5 flex items-center gap-3">
              <Rating rating={product.averageRating || 5} size="sm" count={product.reviewCount || 12} />
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <FiCheckCircle className="h-3 w-3" /> In Stock
              </span>
            </div>

            <div className="mt-3.5 pt-3 border-t border-muted-sand/20">
              <PriceDisplay
                price={discountPrice || price}
                originalPrice={discountPrice ? price : undefined}
                size="lg"
              />
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mt-4 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-dark-charcoal">
                  Select Size / Size Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const isVarOutOfStock = variant.stock === 0;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        disabled={isVarOutOfStock}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition-all ${
                          isSelected
                            ? 'border-royal-blue bg-royal-blue text-white shadow-soft shadow-royal-blue/20 scale-105'
                            : isVarOutOfStock
                            ? 'border-muted-sand/30 bg-muted-sand/10 text-natural-wood/40 line-through cursor-not-allowed'
                            : 'border-muted-sand/40 bg-white text-dark-charcoal hover:border-royal-blue'
                        }`}
                      >
                        {variant.size || variant.color || `Variant ${variant.id}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-dark-charcoal">
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

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-muted-sand/20">
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-royal-blue to-deep-navy py-3 text-xs sm:text-sm font-bold text-white shadow-soft"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                isLoading={addToCartMutation.isPending}
              >
                <FiShoppingBag className="h-4 w-4" /> Add to Cart
              </Button>

              <button
                type="button"
                onClick={handleWishlistToggle}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${
                  isInWishlist
                    ? 'border-rose-500 bg-rose-500/10 text-rose-600 shadow-xs'
                    : 'border-muted-sand/40 bg-white text-dark-charcoal hover:border-rose-500 hover:text-rose-600'
                }`}
                aria-label="Wishlist"
              >
                <FiHeart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {product.slug && (
              <Link
                to={buildPath.product(product.slug)}
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 text-xs font-bold text-royal-blue hover:text-deep-navy transition-colors pt-1"
              >
                View Full Product Details <FiExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
