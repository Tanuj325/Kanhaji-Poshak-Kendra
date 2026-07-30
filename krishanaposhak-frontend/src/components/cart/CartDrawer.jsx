import { memo, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartContext } from '@/context/CartContext';
import CartItem from './CartItem';
import CouponInput from './CouponInput';
import CartSummary from './CartSummary';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatPrice';
import { FiX, FiShoppingBag, FiArrowRight, FiLock, FiTrash2 } from 'react-icons/fi';

export const CartDrawer = memo(function CartDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    cartItems,
    cartCount,
    subtotal,
    discount,
    shippingCharge,
    grandTotal,
    updateQuantity,
    removeItem,
    clearCart,
    isUpdating,
    isClearing,
    moveToWishlist,
  } = useCartContext();

  const navigate = useNavigate();

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleCheckout = useCallback(() => {
    closeDrawer();
    navigate('/checkout');
  }, [closeDrawer, navigate]);

  const handleViewCart = useCallback(() => {
    closeDrawer();
    navigate('/cart');
  }, [closeDrawer, navigate]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-display">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm"
          />

          {/* Sliding Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-stone-50 border-l border-amber-900/10 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0B1728] to-[#12243e] text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                    <FiShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white leading-tight">
                      Your Shopping Cart
                    </h2>
                    <span className="text-xs text-amber-300/80 font-medium">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cartItems.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      disabled={isClearing}
                      className="p-2 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-white/10 transition-colors"
                      title="Clear Cart"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                    aria-label="Close cart drawer"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-amber-100/70 text-amber-800 flex items-center justify-center">
                      <FiShoppingBag className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading text-lg font-bold text-stone-900">Your Cart is Empty</h3>
                      <p className="text-xs text-stone-500 max-w-xs mx-auto">
                        Add handcrafted poshaks and spiritual attire to begin.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={closeDrawer}
                      className="rounded-xl font-bold px-5"
                    >
                      Browse Shop
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {cartItems.map((item) => (
                        <CartItem
                          key={`drawer-item-${item.cartItemId || item.id || item.variantId}`}
                          item={item}
                          compact
                          onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
                          onRemove={(id) => removeItem(id)}
                          onMoveToWishlist={moveToWishlist}
                          isUpdating={isUpdating}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Drawer Footer Summary & Actions */}
              {cartItems.length > 0 && (
                <div className="p-4 sm:p-5 bg-white border-t border-amber-900/10 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-stone-600 font-medium">
                      <span>Subtotal</span>
                      <span className="font-bold text-stone-900">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline pt-1 border-t border-amber-900/10">
                      <span className="font-heading font-extrabold text-sm text-stone-950">Grand Total</span>
                      <span className="font-heading font-extrabold text-xl text-amber-950">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleViewCart}
                      className="w-full py-3 px-4 rounded-xl border border-amber-900/20 text-stone-900 font-bold text-xs hover:bg-amber-50 transition-colors min-h-[44px] flex items-center justify-center gap-1.5"
                    >
                      <FiShoppingBag className="h-4 w-4 text-amber-800" />
                      <span>View Full Cart</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white font-bold text-xs shadow-md hover:from-amber-950 hover:to-stone-950 transition-all min-h-[44px] flex items-center justify-center gap-1.5"
                    >
                      <FiLock className="h-3.5 w-3.5 text-amber-200" />
                      <span>Checkout</span>
                      <FiArrowRight className="h-3.5 w-3.5 text-amber-200" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default CartDrawer;
