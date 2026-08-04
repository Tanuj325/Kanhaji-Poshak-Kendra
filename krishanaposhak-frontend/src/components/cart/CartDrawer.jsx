import { memo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartContext } from '@/context/CartContext';
import CartItem from './CartItem';
import FreeShippingBar from './FreeShippingBar';
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
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
          />

          {/* Sliding Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md flex flex-col border-l border-white/10 bg-[linear-gradient(180deg,#0b1728_0%,#081427_100%)] shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between bg-[#081427]/95 p-4 sm:p-5 text-white shadow-[0_14px_30px_rgba(15,36,64,0.2)] backdrop-blur-xl border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/15 text-temple-gold">
                    <FiShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold leading-tight text-white">
                      Your Shopping Cart
                    </h2>
                    <span className="text-xs font-medium text-amber-200/80">
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
                      className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-rose-400 min-h-[40px] min-w-[40px] flex items-center justify-center"
                      title="Clear Cart"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
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
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10 text-temple-gold">
                      <FiShoppingBag className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-lg font-bold text-white">Your Cart is Empty</h3>
                      <p className="mx-auto max-w-xs text-xs text-slate-400 font-body">
                        Add handcrafted poshaks and spiritual attire to begin.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={closeDrawer}
                      className="rounded-full px-6 font-bold bg-amber-400 text-stone-950 hover:bg-amber-300"
                    >
                      Browse Shop
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FreeShippingBar subTotal={subtotal} className="bg-white/5 border-white/10 text-white" />
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
                <div className="space-y-3 border-t border-white/10 bg-[#081427] p-4 sm:p-5 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-medium text-slate-300">
                      <span>Subtotal</span>
                      <span className="font-bold text-white font-mono">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between font-bold text-emerald-300 font-mono">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between border-t border-white/10 pt-2">
                      <span className="font-display text-sm font-extrabold text-white">Grand Total</span>
                      <span className="font-display text-xl font-extrabold text-temple-gold font-mono">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleViewCart}
                      className="flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-xl border border-white/15 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-white/10"
                    >
                      <FiShoppingBag className="h-4 w-4 text-temple-gold shrink-0" />
                      <span>View Full Cart</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] px-4 py-3 text-xs font-bold text-stone-950 shadow-[0_14px_30px_rgba(201,154,59,0.18)] transition-all hover:scale-[1.01]"
                    >
                      <FiLock className="h-3.5 w-3.5 text-stone-950/80 shrink-0" />
                      <span>Checkout</span>
                      <FiArrowRight className="h-3.5 w-3.5 text-stone-950/80 shrink-0" />
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
