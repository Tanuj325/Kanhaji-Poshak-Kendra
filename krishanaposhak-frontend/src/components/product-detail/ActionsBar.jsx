import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTE_PATHS, buildPath } from '@/routes/routePaths';
import toast from 'react-hot-toast';
import { FiShoppingBag, FiHeart, FiShare2, FiZap, FiInfo } from 'react-icons/fi';
function ActionsBar({ selectedVariant, selectedColor, product }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuth();
  const { addItem, isAddingItem } = useCartContext();
  const { toggleWishlist, isInWishlist } = useWishlistContext();

  const maxQuantity = selectedVariant?.stock || 1;
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

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
    await addItem(selectedVariant.id, quantity, selectedColor);
  }, [isAuthenticated, selectedVariant, quantity, selectedColor, addItem, navigate]);

  const handleBuyNow = useCallback(() => {
    if (!selectedVariant) {
      toast.error('Please select a size first');
      return;
    }
    if (selectedVariant.stock <= 0) {
      toast.error('This size variant is currently out of stock');
      return;
    }
    if (quantity > selectedVariant.stock) {
      toast.error(`Only ${selectedVariant.stock} items available in stock`);
      return;
    }

    const buyNowPrice = selectedVariant.discountPrice || selectedVariant.price || product?.discountPrice || product?.price || 0;
    const buyNowItem = {
      isBuyNow: true,
      variantId: selectedVariant.id,
      quantity,
      color: selectedColor || null,
      productName: product?.name || selectedVariant.productName || 'Sacred Poshak',
      size: selectedVariant.size,
      sku: selectedVariant.sku,
      price: buyNowPrice,
      totalPrice: buyNowPrice * quantity,
      imageUrl: product?.imageUrl || product?.images?.[0]?.imageUrl || selectedVariant.imageUrl,
      product: {
        id: product?.id,
        name: product?.name,
        slug: product?.slug,
      },
      variant: selectedVariant,
    };

    try {
      sessionStorage.setItem('kp_buy_now_item', JSON.stringify(buyNowItem));
    } catch {
      // Ignore
    }

    if (!isAuthenticated) {
      toast.error('Please log in to purchase');
      navigate(buildPath.loginWithRedirect(ROUTE_PATHS.CHECKOUT), { state: { buyNowItem } });
      return;
    }

    navigate(ROUTE_PATHS.CHECKOUT, { state: { buyNowItem } });
  }, [isAuthenticated, selectedVariant, quantity, selectedColor, product, navigate]);

  const handleWishlist = useCallback(async () => {
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
          title: document.title,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  }, []);

  const wishlisted = selectedVariant ? isInWishlist(selectedVariant.id) : false;

  if (isOutOfStock) {
    return (
      <div className="space-y-3 font-display pt-5 border-t border-amber-900/10">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 sm:p-5 text-center">
          <p className="font-bold text-rose-800 text-sm sm:text-base">This size variant is currently out of stock</p>
          <p className="mt-1 text-xs sm:text-sm text-stone-600">
            Add to your wishlist to receive instant restock alerts
          </p>
        </div>
        <Button
          variant="outline"
          isFullWidth
          onClick={handleWishlist}
          className="rounded-2xl py-3.5 sm:py-4 border-amber-800 text-amber-950 hover:bg-amber-50 font-bold min-h-[48px]"
        >
          {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist for Restock Alert'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-display pt-4 border-t border-slate-200/80 w-full">
      {/* Quantity Stepper Row */}
      <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-stone-50 border border-slate-200/80 w-full">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-700 pl-1">
          Quantity
        </label>
        <QuantitySelector
          value={quantity}
          min={1}
          max={maxQuantity || 99999}
          onChange={setQuantity}
          size="md"
        />
      </div>

      {/* Primary CTA Buttons Row */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* Add to Cart */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            variant="primary"
            size="lg"
            isFullWidth
            isLoading={isAddingItem}
            onClick={handleAddToCart}
            className="rounded-xl bg-[#0F2440] hover:bg-[#1b3a5c] text-white font-bold py-3.5 text-xs sm:text-sm uppercase tracking-wider shadow-md border border-[#0F2440] transition-all min-h-[48px] h-12"
            leftIcon={<FiShoppingBag className="h-4 w-4 text-[#C99A3B]" />}
          >
            Add to Cart
          </Button>
        </motion.div>

        {/* Buy Now */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            variant="secondary"
            size="lg"
            isFullWidth
            onClick={handleBuyNow}
            className="rounded-xl bg-[#C99A3B] hover:bg-[#b58931] text-stone-950 font-bold py-3.5 text-xs sm:text-sm uppercase tracking-wider shadow-md border border-[#C99A3B] transition-all min-h-[48px] h-12"
            leftIcon={<FiZap className="h-4 w-4 text-stone-950" />}
          >
            Buy Now
          </Button>
        </motion.div>
      </div>

      {/* Wishlist & Share Row */}
      <div className="flex items-center gap-2.5 w-full">
        <button
          type="button"
          onClick={handleWishlist}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-2xs min-h-[42px] cursor-pointer ${
            wishlisted
              ? 'border-rose-300 bg-rose-50 text-rose-700'
              : 'border-slate-200/90 bg-white text-stone-700 hover:border-slate-300 hover:bg-stone-50'
          }`}
          title="Add to Wishlist"
        >
          <FiHeart className={`h-4 w-4 shrink-0 ${wishlisted ? 'fill-current text-rose-600' : 'text-[#C99A3B]'}`} />
          <span>{wishlisted ? 'Wishlisted' : 'Save to Wishlist'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200/90 bg-white text-xs font-bold text-stone-700 hover:border-slate-300 hover:bg-stone-50 transition-all shadow-2xs min-h-[42px] cursor-pointer"
          title="Share Product"
        >
          <FiShare2 className="h-4 w-4 shrink-0 text-[#C99A3B]" />
          <span>Share Product</span>
        </button>
      </div>

      {/* Bulk Order Note */}
      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium font-body pt-1">
        <FiInfo className="h-3.5 w-3.5 shrink-0 text-[#C99A3B]" />
        <span>Type quantity directly for wholesale bulk orders. Free shipping applied.</span>
      </div>
    </div>
  );
}

export default ActionsBar;
