import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <div className="space-y-3 font-display pt-4 border-t border-amber-900/10">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-center">
          <p className="font-bold text-rose-800 text-sm sm:text-base">This size variant is currently out of stock</p>
          <p className="mt-1 text-xs sm:text-sm text-stone-600">
            Add to your wishlist to receive instant restock alerts
          </p>
        </div>
        <Button
          variant="outline"
          isFullWidth
          onClick={handleWishlist}
          className="rounded-2xl py-3.5 sm:py-4 border-amber-800 text-amber-950 hover:bg-amber-50 font-bold min-h-[44px]"
        >
          {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist for Restock Alert'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 font-display pt-6 border-t border-amber-900/10 w-full">
      {/* Horizontal Action Bar: Quantity + Add to Cart + Buy Now + Wishlist & Share */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 xl:gap-4 w-full">
        {/* Quantity Stepper */}
        <div className="flex items-center justify-between sm:justify-start gap-3 p-2.5 sm:p-3 rounded-2xl bg-amber-50/60 border border-amber-900/10 shrink-0 min-h-[48px]">
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

        {/* Primary CTA: Add to Cart */}
        <Button
          variant="primary"
          size="lg"
          isLoading={isAddingItem}
          onClick={handleAddToCart}
          className="flex-1 rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 hover:from-amber-950 hover:to-stone-950 text-white font-bold py-4 text-sm sm:text-base xl:text-lg shadow-lg shadow-amber-950/15 border border-amber-500/20 active:scale-[0.99] transition-all min-h-[48px]"
          leftIcon={<FiShoppingBag className="h-5 w-5 text-amber-200" />}
        >
          Add to Cart
        </Button>

        {/* Secondary CTA: Buy Now */}
        <Button
          variant="secondary"
          size="lg"
          onClick={handleBuyNow}
          className="flex-1 rounded-2xl bg-amber-100/50 border-2 border-amber-800/80 text-amber-950 font-bold hover:bg-amber-100/80 py-4 text-sm sm:text-base xl:text-lg active:scale-[0.99] transition-all min-h-[48px]"
          leftIcon={<FiZap className="h-5 w-5 text-amber-800" />}
        >
          Buy Now
        </Button>

        {/* Wishlist & Share Pill Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleWishlist}
            className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all shadow-2xs min-h-[48px] ${
              wishlisted
                ? 'border-rose-300 bg-rose-50 text-rose-700'
                : 'border-amber-900/15 bg-white text-stone-800 hover:border-amber-700/40 hover:bg-amber-50/50'
            }`}
            title="Add to Wishlist"
          >
            <FiHeart className={`h-4.5 w-4.5 ${wishlisted ? 'fill-current text-rose-600' : 'text-amber-800'}`} />
            <span className="hidden md:inline">{wishlisted ? 'Wishlisted' : 'Wishlist'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border border-amber-900/15 bg-white text-xs sm:text-sm font-bold text-stone-800 hover:border-amber-700/40 hover:bg-amber-50/50 transition-all shadow-2xs min-h-[48px]"
            title="Share Product"
          >
            <FiShare2 className="h-4.5 w-4.5 text-amber-800" />
            <span className="hidden md:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Wholesale Bulk Hint */}
      <div className="flex items-center gap-1.5 text-xs text-amber-950 font-medium font-body pt-1">
        <FiInfo className="h-3.5 w-3.5 shrink-0 text-amber-800" />
        <span>Type quantity directly in stepper for wholesale bulk orders. Free express shipping applied automatically.</span>
      </div>
    </div>
  );
}

export default ActionsBar;
