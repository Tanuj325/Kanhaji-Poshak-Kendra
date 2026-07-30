import { createContext, useContext, useCallback, useMemo } from 'react';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { data: wishlist, isLoading, isError, error, refetch } = useWishlist();
  const { data: productsData } = useProducts({ page: 0, size: 100 });
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const productsList = useMemo(() => {
    if (!productsData) return [];
    if (Array.isArray(productsData)) return productsData;
    return productsData.content || productsData.items || productsData.data || [];
  }, [productsData]);

  const rawItems = useMemo(() => {
    if (!isAuthenticated || !wishlist) return [];
    return Array.isArray(wishlist) ? wishlist : wishlist?.items || wishlist?.data || [];
  }, [isAuthenticated, wishlist]);

  const wishlistItems = useMemo(() => {
    return rawItems.map((item) => {
      let resolvedImage = item.imageUrl || item.image || item.productImageUrl;

      if (!resolvedImage && productsList.length > 0) {
        const matchingProduct = productsList.find((p) => {
          if (item.productId && p.id === item.productId) return true;
          if (item.slug && p.slug === item.slug) return true;
          if (p.variants && Array.isArray(p.variants)) {
            return p.variants.some((v) => v.id === item.productId || v.id === item.variantId);
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
  }, [rawItems, productsList]);

  const wishlistCount = wishlistItems.length;

  const isInWishlist = useCallback(
    (variantId) => {
      if (!isAuthenticated || !wishlistItems.length || !variantId) return false;
      return wishlistItems.some((item) => item.productId === variantId || item.variantId === variantId);
    },
    [isAuthenticated, wishlistItems],
  );

  const toggleWishlist = useCallback(
    async (variantId) => {
      if (!isAuthenticated) {
        toast.error('Please log in to save items to your wishlist');
        return;
      }
      if (isInWishlist(variantId)) {
        await removeMutation.mutateAsync(variantId);
      } else {
        await addMutation.mutateAsync({ productId: variantId });
      }
    },
    [isAuthenticated, isInWishlist, addMutation, removeMutation],
  );

  const addItem = useCallback(
    async (variantId) => {
      if (!isAuthenticated) {
        toast.error('Please log in to save items to your wishlist');
        return;
      }
      await addMutation.mutateAsync({ productId: variantId });
    },
    [isAuthenticated, addMutation],
  );

  const removeItem = useCallback(
    async (variantId) => {
      await removeMutation.mutateAsync(variantId);
    },
    [removeMutation],
  );

  const loadWishlist = useCallback(() => {
    refetch();
  }, [refetch]);

  const value = {
    wishlist: wishlistItems,
    wishlistCount,
    isLoading,
    isError,
    error,
    refetch,
    loadWishlist,
    toggleWishlist,
    addItem,
    removeItem,
    removeFromWishlist: removeItem,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export default WishlistContext;

export function useWishlistContext() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlistContext must be used within WishlistProvider');
  }
  return ctx;
}
