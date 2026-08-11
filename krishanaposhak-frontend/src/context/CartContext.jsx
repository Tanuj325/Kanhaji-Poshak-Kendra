import { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/hooks/useCart';
import { useAddToWishlist } from '@/hooks/useWishlist';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/context/AuthContext';
import { QUERY_KEYS } from '@/constants/queryKeys';
import toast from 'react-hot-toast';

import { calculateShipping } from '@/utils/shippingCalculator';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: cart, isLoading, isError, error, refetch } = useCart();
  const { data: productsData } = useProducts({ page: 0, size: 100 });
  const addToCartMutation = useAddToCart();
  const updateQuantityMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();
  const addToWishlistMutation = useAddToWishlist();

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

  const productsList = useMemo(() => {
    if (!productsData) return [];
    if (Array.isArray(productsData)) return productsData;
    return productsData.content || productsData.items || productsData.data || [];
  }, [productsData]);

  const cartData = cart?.data || cart || {};
  const rawCartItems = !isAuthenticated ? [] : (cartData?.items ?? []);

  const cartItems = useMemo(() => {
    return rawCartItems.map((item) => {
      let resolvedImage = item.imageUrl || item.image || item.productImageUrl;

      if (!resolvedImage && productsList.length > 0) {
        const matchingProduct = productsList.find((p) => {
          if (item.productId && p.id === item.productId) return true;
          if (item.slug && p.slug === item.slug) return true;
          if (p.variants && Array.isArray(p.variants)) {
            return p.variants.some((v) => v.id === item.variantId);
          }
          return false;
        });

        if (matchingProduct) {
          resolvedImage = matchingProduct.imageUrl;
        }
      }

      return {
        ...item,
        imageUrl: resolvedImage || null,
      };
    });
  }, [rawCartItems, productsList]);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const calculatedSubtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.totalPrice || (item.price || item.unitPrice || 0) * (item.quantity || 0)) || 0),
    0
  );
  const subtotal = cartData?.subTotal && cartData.subTotal > 0 ? cartData.subTotal : calculatedSubtotal;
  const discount = cartData?.discount ?? 0;

  const {
    shipping: shippingCharge,
    isFreeShipping,
    freeShippingThreshold,
    remainingForFreeShipping,
    freeShippingMessage,
  } = calculateShipping(subtotal);

  const grandTotal = Math.max(0, (subtotal + shippingCharge) - discount);

  const addItem = useCallback(
    async (variantId, quantity = 1, color = null) => {
      if (!isAuthenticated) {
        toast.error('Please log in to add items to cart');
        return;
      }
      const targetVariantId = typeof variantId === 'object' ? (variantId.productVariantId || variantId.variantId || variantId.id) : variantId;
      if (!targetVariantId) {
        toast.error('Invalid product variant');
        return;
      }
      await addToCartMutation.mutateAsync({ productVariantId: targetVariantId, quantity, color });
      openDrawer();
    },
    [isAuthenticated, addToCartMutation, openDrawer],
  );

  const updateQuantity = useCallback(
    async (cartItemId, quantity) => {
      await updateQuantityMutation.mutateAsync({ cartItemId, data: { quantity } });
    },
    [updateQuantityMutation],
  );

  const removeItem = useCallback(
    async (cartItemId) => {
      await removeItemMutation.mutateAsync(cartItemId);
    },
    [removeItemMutation],
  );

  const clearCart = useCallback(async () => {
    await clearCartMutation.mutateAsync();
    queryClient.setQueryData([QUERY_KEYS.CART], { items: [], totalItems: 0, subTotal: 0, discount: 0, shippingCharge: 0, grandTotal: 0 });
  }, [clearCartMutation, queryClient]);

  const moveToWishlist = useCallback(
    async (item) => {
      const targetVariantId = item.variantId || item.productVariantId || item.id;
      const targetCartItemId = item.cartItemId || item.id;
      if (!targetVariantId) {
        toast.error('Invalid variant for wishlist');
        return;
      }
      try {
        await addToWishlistMutation.mutateAsync({ productVariantId: targetVariantId });
        await removeItemMutation.mutateAsync(targetCartItemId);
        toast.success('Moved item to wishlist');
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to move to wishlist');
      }
    },
    [addToWishlistMutation, removeItemMutation],
  );

  const loadCart = useCallback(() => {
    refetch();
  }, [refetch]);

  const value = {
    cart: cartData,
    cartItems,
    cartCount,
    subtotal,
    discount,
    shippingCharge,
    grandTotal,
    isFreeShipping,
    freeShippingThreshold,
    remainingForFreeShipping,
    freeShippingMessage,
    isLoading,
    isError,
    error,
    refetch,
    loadCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    moveToWishlist,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    isAddingItem: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return ctx;
}

export default CartContext;
