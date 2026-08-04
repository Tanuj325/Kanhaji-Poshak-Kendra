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

function ActionsBar({ selectedVariant }) {
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
    <div className="space-y-4 font-display pt-5 border-t border-amber-900/10 w-full">
      {/* Quantity Stepper Row */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-900/10 w-fit min-h-[48px]">
        <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-950 pl-1">
          Qty
        </label>
        <QuantitySelector
          value={quantity}
          min={1}
          max={maxQuantity || 99999}
          onChange={setQuantity}
          size="md"
        />
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full">
        {/* Add to Cart */}
        <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
          <Button
            variant="primary"
            size="lg"
            isFullWidth
            isLoading={isAddingItem}
            onClick={handleAddToCart}
            className="rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 hover:from-amber-950 hover:to-stone-950 text-white font-bold py-4 text-sm sm:text-base shadow-lg shadow-amber-950/15 border border-amber-500/20 transition-all min-h-[52px]"
            leftIcon={<FiShoppingBag className="h-5 w-5 text-amber-200" />}
          >
            Add to Cart
          </Button>
        </motion.div>

        {/* Buy Now */}
        <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
          <Button
            variant="secondary"
            size="lg"
            isFullWidth
            onClick={handleBuyNow}
            className="rounded-2xl bg-amber-100/50 border-2 border-amber-800/80 text-amber-950 font-bold hover:bg-amber-100/80 py-4 text-sm sm:text-base transition-all min-h-[52px]"
            leftIcon={<FiZap className="h-5 w-5 text-amber-800" />}
          >
            Buy Now
          </Button>
        </motion.div>
      </div>

      {/* Wishlist & Share Row */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleWishlist}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all shadow-2xs min-h-[48px] ${
            wishlisted
              ? 'border-rose-300 bg-rose-50 text-rose-700'
              : 'border-amber-900/15 bg-white text-stone-800 hover:border-amber-700/40 hover:bg-amber-50/50'
          }`}
          title="Add to Wishlist"
        >
          <FiHeart className={`h-4 w-4 ${wishlisted ? 'fill-current text-rose-600' : 'text-amber-800'}`} />
          <span>{wishlisted ? 'Wishlisted' : 'Wishlist'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-amber-900/15 bg-white text-xs sm:text-sm font-bold text-stone-800 hover:border-amber-700/40 hover:bg-amber-50/50 transition-all shadow-2xs min-h-[48px]"
          title="Share Product"
        >
          <FiShare2 className="h-4 w-4 text-amber-800" />
          <span>Share</span>
        </button>
      </div>

      {/* Bulk Order Note */}
      <div className="flex items-center gap-1.5 text-[11px] text-amber-950/70 font-medium font-body pt-0.5">
        <FiInfo className="h-3 w-3 shrink-0 text-amber-800/60" />
        <span>Type quantity directly for wholesale bulk orders. Free express shipping applied automatically.</span>
      </div>
    </div>
  );
}

export default ActionsBar;
