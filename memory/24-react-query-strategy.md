# REACT QUERY STRATEGY

## Query Configuration (queryConfig.js)

```javascript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes - data fresh
      gcTime: 30 * 60 * 1000,           // 30 minutes - garbage collection
      retry: 1,                          // Retry once on failure
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,        // Don't refetch on tab switch
      refetchOnReconnect: true,           // Refetch when back online
    },
    mutations: {
      retry: 0,                          // Don't retry mutations
    },
  },
});
```

## Query Keys Structure (constants/queryKeys.js)

```javascript
export const QUERY_KEYS = {
  // Auth
  AUTH: {
    ME: ['auth', 'me'],
    USER: (id) => ['auth', 'user', id],
  },
  
  // Products
  PRODUCTS: {
    ALL: ['products'],
    LIST: (params) => ['products', 'list', params],
    DETAIL: (slug) => ['products', 'detail', slug],
    FEATURED: ['products', 'featured'],
    NEW_ARRIVALS: ['products', 'new-arrivals'],
    ADMIN_LIST: (params) => ['products', 'admin', 'list', params],
    VARIANTS: (productId) => ['products', productId, 'variants'],
    IMAGES: (productId) => ['products', productId, 'images'],
  },
  
  // Categories
  CATEGORIES: {
    ALL: ['categories'],
    LIST: (params) => ['categories', 'list', params],
    DROPDOWN: ['categories', 'dropdown'],
    ROOT: ['categories', 'root'],
    SUBCATEGORIES: (parentId) => ['categories', parentId, 'subcategories'],
    DETAIL: (id) => ['categories', 'detail', id],
  },
  
  // Cart
  CART: {
    DETAIL: ['cart', 'detail'],
  },
  
  // Wishlist
  WISHLIST: {
    ALL: ['wishlist'],
    CHECK: (variantId) => ['wishlist', 'check', variantId],
  },
  
  // Orders
  ORDERS: {
    USER_LIST: (params) => ['orders', 'user', 'list', params],
    DETAIL: (id) => ['orders', 'detail', id],
    BY_NUMBER: (number) => ['orders', 'number', number],
    ADMIN_LIST: (params) => ['orders', 'admin', 'list', params],
  },
  
  // Addresses
  ADDRESSES: {
    ALL: ['addresses'],
    DETAIL: (id) => ['addresses', 'detail', id],
  },
  
  // Reviews
  REVIEWS: {
    PRODUCT: (productId, params) => ['reviews', 'product', productId, params],
    AVERAGE_RATING: (productId) => ['reviews', 'average-rating', productId],
  },
  
  // Banners
  BANNERS: {
    ACTIVE: ['banners', 'active'],
    ADMIN_LIST: (params) => ['banners', 'admin', 'list', params],
  },
  
  // Coupons
  COUPONS: {
    ACTIVE: ['coupons', 'active'],
    ADMIN_LIST: (params) => ['coupons', 'admin', 'list', params],
    DETAIL: (id) => ['coupons', 'detail', id],
    CODE: (code) => ['coupons', 'code', code],
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: (params) => ['notifications', 'list', params],
    UNREAD: ['notifications', 'unread'],
    UNREAD_COUNT: ['notifications', 'unread-count'],
  },
  
  // Contact
  CONTACT: {
    ALL: ['contact', 'messages'],
    UNRESOLVED: ['contact', 'unresolved'],
  },
  
  // Users (Admin)
  USERS: {
    ALL: ['users', 'all'],
    DETAIL: (id) => ['users', 'detail', id],
  },
  
  // Analytics (Admin)
  ANALYTICS: {
    DASHBOARD: ['analytics', 'dashboard'],
    PRODUCTS: {
      TOP_SELLING: (limit) => ['analytics', 'products', 'top-selling', limit],
      TOP_RATED: (limit) => ['analytics', 'products', 'top-rated', limit],
      LOW_STOCK: (threshold) => ['analytics', 'products', 'low-stock', threshold],
      OUT_OF_STOCK: ['analytics', 'products', 'out-of-stock'],
    },
    SALES: {
      DAILY: ['analytics', 'sales', 'daily'],
      WEEKLY: ['analytics', 'sales', 'weekly'],
      MONTHLY: ['analytics', 'sales', 'monthly'],
      YEARLY: ['analytics', 'sales', 'yearly'],
      CUSTOM: (start, end) => ['analytics', 'sales', 'custom', start, end],
    },
    CUSTOMERS: {
      OVERVIEW: ['analytics', 'customers', 'overview'],
      NEW: (pageable) => ['analytics', 'customers', 'new', pageable],
      REPEAT: (pageable) => ['analytics', 'customers', 'repeat', pageable],
      TOP_SPENDERS: (pageable) => ['analytics', 'customers', 'top-spenders', pageable],
    },
    ACTIVITY: ['analytics', 'activity'],
  },
  
  // Payment
  PAYMENT: {
    BY_ORDER: (orderId) => ['payment', 'order', orderId],
    DETAIL: (id) => ['payment', 'detail', id],
  },
};
```

## Caching Strategy

| Data Type | staleTime | gcTime | Refetch Strategy |
|---|---|---|---|
| Product list (public) | 5 min | 30 min | On mount, on filter change |
| Product detail | 10 min | 1 hr | On mount |
| Categories | 30 min | 2 hr | On mount |
| Banners | 1 hr | 2 hr | On mount |
| Cart | 0 (instant stale) | 1 hr | On mount, after mutation |
| Wishlist | 0 | 1 hr | On mount, after mutation |
| Orders | 2 min | 30 min | On mount, after mutation |
| Notifications | 1 min | 10 min | On mount, periodic (unread count) |
| Admin product list | 30 sec | 10 min | On mount, after mutation |
| Analytics | 5 min | 30 min | On mount |
| Users (admin) | 5 min | 30 min | On mount |
| Addresses | 2 min | 30 min | On mount, after mutation |
| Reviews | 5 min | 30 min | On mount, after mutation |

## Invalidation Strategy

```javascript
// invalidationMap.js - Centralized invalidation rules
export const INVALIDATION_MAP = {
  // Product mutations invalidate
  productCreate: [[QUERY_KEYS.PRODUCTS.ALL]],
  productUpdate: [[QUERY_KEYS.PRODUCTS.ALL], (_, id) => [QUERY_KEYS.PRODUCTS.DETAIL(id)]],
  productDelete: [[QUERY_KEYS.PRODUCTS.ALL]],
  productToggleStatus: [[QUERY_KEYS.PRODUCTS.ALL], [QUERY_KEYS.PRODUCTS.ADMIN_LIST]],
  
  // Cart mutations invalidate cart + may invalidate products (stock)
  cartAdd: [[QUERY_KEYS.CART.DETAIL], [QUERY_KEYS.PRODUCTS.ALL]],
  cartUpdate: [[QUERY_KEYS.CART.DETAIL]],
  cartRemove: [[QUERY_KEYS.CART.DETAIL]],
  cartClear: [[QUERY_KEYS.CART.DETAIL]],
  
  // Order mutations
  orderPlace: [[QUERY_KEYS.ORDERS.USER_LIST], [QUERY_KEYS.CART.DETAIL], [QUERY_KEYS.PRODUCTS.ALL]],
  orderCancel: [[QUERY_KEYS.ORDERS.USER_LIST], [QUERY_KEYS.ORDERS.DETAIL]],
  orderStatusUpdate: [[QUERY_KEYS.ORDERS.ADMIN_LIST], [QUERY_KEYS.ORDERS.DETAIL]],
  
  // Wishlist mutations
  wishlistAdd: [[QUERY_KEYS.WISHLIST.ALL]],
  wishlistRemove: [[QUERY_KEYS.WISHLIST.ALL], [QUERY_KEYS.WISHLIST.CHECK]],
  
  // Address mutations
  addressCreate: [[QUERY_KEYS.ADDRESSES.ALL]],
  addressUpdate: [[QUERY_KEYS.ADDRESSES.ALL]],
  addressDelete: [[QUERY_KEYS.ADDRESSES.ALL]],
  
  // Review mutations
  reviewAdd: [[QUERY_KEYS.REVIEWS.PRODUCT], [QUERY_KEYS.REVIEWS.AVERAGE_RATING]],
  reviewUpdate: [[QUERY_KEYS.REVIEWS.PRODUCT]],
  reviewDelete: [[QUERY_KEYS.REVIEWS.PRODUCT], [QUERY_KEYS.REVIEWS.AVERAGE_RATING]],
  
  // Admin mutations
  categoryCreate: [[QUERY_KEYS.CATEGORIES.ALL], [QUERY_KEYS.CATEGORIES.DROPDOWN]],
  couponCreate: [[QUERY_KEYS.COUPONS.ADMIN_LIST]],
  bannerCreate: [[QUERY_KEYS.BANNERS.ADMIN_LIST], [QUERY_KEYS.BANNERS.ACTIVE]],
};
```

## Custom Hook Pattern

```javascript
// hooks/useProducts.js
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import { QUERY_KEYS } from '../constants/queryKeys';

// Paginated product list with filters
export function useProducts(filters) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(filters),
    queryFn: () => productApi.getAll(filters),
    placeholderData: (previousData) => previousData,  // Keep previous data while loading
  });
}

// Single product detail
export function useProduct(slug) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.DETAIL(slug),
    queryFn: () => productApi.getBySlug(slug),
    enabled: !!slug,
  });
}

// Featured products (homepage)
export function useFeaturedProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.FEATURED,
    queryFn: () => productApi.getFeatured(),
    staleTime: 10 * 60 * 1000,  // 10 min for featured
  });
}

// Admin product list with full details
export function useAdminProducts(filters) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.ADMIN_LIST(filters),
    queryFn: () => productApi.getAllAdmin(filters),
  });
}

// Product variants
export function useProductVariants(productId) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.VARIANTS(productId),
    queryFn: () => productApi.getVariants(productId),
    enabled: !!productId,
  });
}
```

## Mutation Hook Pattern

```javascript
// hooks/useCart.js (React Query mutations portion)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';
import { QUERY_KEYS } from '../constants/queryKeys';

export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => cartApi.addItem(data),
    
    // Optimistic update
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CART.DETAIL });
      const previousCart = queryClient.getQueryData(QUERY_KEYS.CART.DETAIL);
      
      queryClient.setQueryData(QUERY_KEYS.CART.DETAIL, (old) => ({
        ...old,
        items: [...(old?.items || []), { ...newItem, quantity: 1 }],
        totalItems: (old?.totalItems || 0) + 1,
      }));
      
      return { previousCart };
    },
    
    onError: (err, newItem, context) => {
      // Rollback on error
      queryClient.setQueryData(QUERY_KEYS.CART.DETAIL, context.previousCart);
    },
    
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.DETAIL });
    },
  });
}
```

## Pagination Strategy

```javascript
// Backend returns PaginationResponse:
// { content: [...], page: 0, size: 10, totalElements: 100, totalPages: 10, first: true, last: false }

// Option 1: Standard pagination (for most lists)
export function usePaginatedQuery(queryKey, queryFn, params) {
  return useQuery({
    queryKey: queryKey,
    queryFn: () => queryFn(params),
    placeholderData: keepPreviousData,  // Smooth transition between pages
  });
}

// Option 2: Infinite scroll (for shop page)
export function useInfiniteProducts(filters) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(filters),
    queryFn: ({ pageParam = 0 }) => 
      productApi.getAll({ ...filters, page: pageParam, size: 12 }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.last) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    placeholderData: keepPreviousData,
  });
}
```

## Optimistic Update Rules

| Mutation | Optimistic? | Reason |
|---|---|---|
| Add to cart | Yes | Instant feedback, easy to rollback |
| Update cart quantity | Yes | Immediate UI update |
| Remove from cart | Yes | Instant removal |
| Toggle wishlist | Yes | Instant heart icon toggle |
| Update profile | No | Data safety > speed |
| Place order | No | Must verify stock/payment |
| Admin status toggle | Yes | Instant toggle, easy rollback |
| Address CRUD | No | Prevents lost addresses |
</content>

