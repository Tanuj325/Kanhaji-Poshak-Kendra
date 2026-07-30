# PERFORMANCE STRATEGY

## 1. Lazy Loading (Route-Based Code Splitting)

```javascript
// Using React.lazy for all page components
const HomePage = lazy(() => import('../pages/public/HomePage'));
const ShopPage = lazy(() => import('../pages/public/ShopPage'));
const ProductDetailPage = lazy(() => import('../pages/public/ProductDetailPage'));
const CheckoutPage = lazy(() => import('../pages/customer/CheckoutPage'));
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
```

### Splitting Boundaries
| Group | Pages Included | Chunk Name |
|---|---|---|
| Public | HomePage, ShopPage, ProductDetail, CategoryPage, About, Contact, FAQ, Terms, Privacy | `public` |
| Auth | Login, Register, VerifyEmail, ForgotPassword, ResetPassword | `auth` |
| Customer | Profile, Orders, OrderDetail, Wishlist, Addresses, Notifications, Settings | `customer` |
| Cart/Checkout | CartPage, CheckoutPage, OrderConfirmation | `checkout` |
| Admin | Dashboard, all CRUD pages, Analytics pages | `admin` |
| Vendor | React, ReactDOM, React Router | `vendor` |
| UI | All UI components grouped | `ui` |

## 2. Image Optimization

### Strategy
```javascript
// Image component with automatic optimization
<OptimizedImage
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={500}
  loading="lazy"           // Native lazy loading
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  placeholder="blur"       // Blur-up placeholder
/>
```

### Image Guidelines
| Image Type | Max Width | Format | Quality | Loading |
|---|---|---|---|---|
| Product card | 400px | WebP (with JPEG fallback) | 80% | Lazy |
| Product detail | 800px | WebP | 85% | Eager (above fold) |
| Banner | 1920px | WebP | 75% | Lazy |
| Thumbnail | 100px | WebP | 70% | Lazy |
| Profile avatar | 200px | WebP | 80% | Lazy |
| Logo | 200px | SVG | - | Eager |

### Cloudinary Transformations
- Append Cloudinary transformation params: `w_400,c_fill,q_auto,f_auto`
- Example: `https://res.cloudinary.com/.../w_400,c_fill,q_auto,f_auto/image.jpg`

## 3. React Query Caching (already covered in strategy doc)

| Data | staleTime | Behavior |
|---|---|---|
| Static data (categories, banners) | 30-60 min | Rarely changes |
| Product list | 5 min | Fresh enough for browsing |
| Product detail | 10 min | Stable data |
| Cart | 0 (instant stale) | Always fetch latest |
| Admin lists | 30 sec | Need fresh data |

## 4. Memoization Strategy

### What to Memoize
```javascript
// useMemo: Expensive computations
const totalPrice = useMemo(() => 
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  [items]
);

// useMemo: Derived data
const sortedProducts = useMemo(() => 
  [...products].sort((a, b) => sortFn(a, b, sortBy)),
  [products, sortBy]
);

// useCallback: Stable callback references
const handleAddToCart = useCallback((variantId) => {
  addToCart({ productVariantId: variantId, quantity: 1 });
}, [addToCart]);

// React.memo: Pure components that render often
const ProductCard = React.memo(({ product, onAddToCart }) => {
  // Component renders only when props change
});
```

### What NOT to Memoize
- ❌ Primitive values (strings, numbers, booleans)
- ❌ Simple JSX (small components that always re-render)
- ❌ Components that always receive different props (lists with inline functions)
- ❌ Premature optimization — memoize only when profiling shows issues

## 5. Virtualization

When to use (list length > 100 items):
- Admin data tables (products, orders, users)
- Product grids on mobile
- Notification list
- Review list

Not needed for:
- Cart items (usually < 10)
- Addresses (usually < 5)
- Wishlist (usually < 50)

## 6. Bundle Optimization

### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          form: ['react-hook-form', 'zod'],
          animation: ['framer-motion'],
          charts: ['recharts'],
          swiper: ['swiper'],
        },
      },
    },
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.log in production
      },
    },
  },
});
```

### Avoid
- ❌ Importing entire libraries (tree-shake when possible)
- ❌ Importing from wrong paths (e.g., `lodash` vs `lodash/get`)
- ❌ Large dependencies for small features
- ✅ Use dynamic imports for heavy components (charts, carousels)

## 7. Network Optimization

| Technique | Implementation |
|---|---|
| Request batching | Avoid multiple sequential requests |
| Debounced search | 300ms delay on search input |
| Prefetching | Prefetch product detail on hover |
| Keep-alive | Axios keep-alive enabled |
| Compression | Vite enables gzip by default |
| HTTP/2 | Use on production |

### Prefetching Strategy
```javascript
// Prefetch product detail on card hover
<ProductCard
  onMouseEnter={() => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.PRODUCTS.DETAIL(product.slug),
      queryFn: () => productApi.getBySlug(product.slug),
      staleTime: 10 * 60 * 1000,
    });
  }}
/>
```

## 8. Rendering Performance

| Technique | Where |
|---|---|
| `React.memo` | ProductCard, CartItemCard, CategoryCard |
| `useMemo` | Filtered/sorted lists, computed totals |
| `useCallback` | Event handlers passed to child components |
| `key` props | Always use stable, unique keys in lists |
| Avoid inline objects | Don't create new objects in render |
| Avoid anonymous functions | Define handlers outside JSX |

## 9. Loading States

| Data Type | Loading UI | Priority |
|---|---|---|
| Product grid | Skeleton grid (6-8 cards) | Critical |
| Product detail | Skeleton layout | Critical |
| Cart | Skeleton list | High |
| Orders | Skeleton list | High |
| Admin tables | Skeleton rows | High |
| Analytics charts | Skeleton chart | Medium |
| Reviews | Skeleton list | Medium |
| Static pages (about, faq) | None (instant) | Low |

## 10. Performance Budget

| Metric | Target |
|---|---|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| Bundle size (initial) | < 200KB gzipped |
| Bundle size (total) | < 500KB gzipped |
| API response time | < 500ms (p95) |
| Lighthouse score | > 90 |
</content>

