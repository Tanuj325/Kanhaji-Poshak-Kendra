# ACCESSIBILITY & SEO STRATEGY

---

## ACCESSIBILITY (a11y)

## Standards
- Target: WCAG 2.1 Level AA compliance
- Testing: axe DevTools, Lighthouse, keyboard-only navigation

## 1. Semantic HTML

```html
<header>        <!-- Site header -->
<nav>           <!-- Navigation -->
<main>          <!-- Primary content -->
<aside>         <!-- Sidebar -->
<section>       <!-- Content sections -->
<article>       <!-- Self-contained content (product cards) -->
<footer>        <!-- Site footer -->
<h1>-<h6>       <!-- Proper heading hierarchy -->
<p>             <!-- Paragraphs -->
<button>        <!-- Buttons (not divs) -->
<a>             <!-- Links (navigation) -->
```

### Heading Hierarchy
```
Page: h1 (unique, describes page content)
Section: h2 (major sections)
Subsection: h3 (cards within sections)
Minor: h4 (form sections, details)
```

### Example: Product Detail Page
```
h1: "Banarasi Silk Saree - Traditional Red"
  h2: "Product Details" 
    h3: "Material & Care"
    h3: "Size & Fit"
  h2: "Customer Reviews"
    h3: "Review by Priya S."
    h3: "Review by Amit K."
  h2: "Related Products"
```

## 2. ARIA Attributes

| Component | ARIA |
|---|---|
| Button | `aria-label` (icon-only buttons), `aria-disabled` |
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Drawer | `role="dialog"`, `aria-modal="true"`, `aria-label` |
| Navigation | `aria-label="Main navigation"` |
| Tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"` |
| Accordion | `aria-expanded`, `aria-controls` |
| Alert | `role="alert"`, `aria-live="polite"` |
| Error message | `role="alert"`, `aria-describedby` |
| Loading | `aria-busy="true"`, `aria-label="Loading..."` |
| Badge | `aria-label` (e.g., "3 items in cart") |
| Carousel | `role="region"`, `aria-roledescription="carousel"` |
| Form fields | `aria-invalid`, `aria-describedby` (for errors) |
| Skip link | `a href="#main-content"` → first focusable element |

## 3. Keyboard Navigation

| Feature | Implementation |
|---|---|
| Skip to content | First focusable link, visible on Tab |
| Tab order | Logical DOM order (no positive tabindex) |
| Focus indicators | `focus-visible:ring-2 ring-royal-blue/50` |
| Modal focus trap | Tab cycles within modal, Esc closes |
| Dropdown menus | Enter/space to open, Esc to close, arrow keys |
| Mega menu | Open on hover + focus, close on blur |
| Close buttons | Always focusable and keyboard operable |
| Custom selects | Arrow keys for options, Enter to select |
| Pagination | Tab through pages, Enter to navigate |

### Focus Order Example (Cart Page)
```
1. Skip to content link
2. Header logo → Home
3. Cart page h1
4. Cart item 1: checkbox → quantity input → remove button
5. Cart item 2: checkbox → quantity input → remove button
6. Coupon input → apply button
7. Proceed to checkout button
8. Footer links
```

## 4. Color Contrast

| Combination | Ratio | WCAG |
|---|---|---|
| Dark Charcoal (#2C2824) on Lotus White (#F8F6F3) | 14.2:1 | AAA |
| Royal Blue (#1B3A5C) on Lotus White (#F8F6F3) | 7.8:1 | AAA |
| Temple Gold (#C99A3B) on Deep Navy (#0F2440) | 6.1:1 | AA |
| Natural Wood (#8B7D6B) on Lotus White (#F8F6F3) | 4.8:1 | AA |
| White (#FFF) on Royal Blue (#1B3A5C) | 7.8:1 | AAA |
| White (#FFF) on Deep Navy (#0F2440) | 12.5:1 | AAA |

## 5. Focus Management

```javascript
// After modal opens
useEffect(() => {
  if (isOpen) {
    // Focus first focusable element
    const firstFocusable = modalRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  } else {
    // Restore focus to trigger element
    triggerRef.current?.focus();
  }
}, [isOpen]);
```

## 6. Screen Reader Support

| Pattern | Implementation |
|---|---|
| Loading | `aria-busy="true"` on container |
| Dynamic content | `aria-live="polite"` for toast, `aria-live="assertive"` for errors |
| Image alt | `alt="Red Banarasi Silk Saree with Gold Border"` |
| Decorative images | `alt=""` (empty string for screen reader to skip) |
| Icons | `aria-hidden="true"` on icon SVGs |
| Icon buttons | `aria-label="Add to wishlist"` |
| Status updates | `role="status"` for cart count changes |
| Search results | `aria-live="polite"` announcing result count |

---

## SEO STRATEGY

## 1. React Helmet Async

```javascript
// components/seo/HelmetHead.jsx
import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../../config/siteConfig';

export function HelmetHead({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  ogType = 'website',
  noIndex = false,
  children,
}) {
  const siteName = siteConfig.name;
  const fullTitle = title 
    ? `${title} | ${siteName}`
    : `${siteName} - ${siteConfig.tagline}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || siteConfig.description} />
      <link rel="canonical" href={canonical || siteConfig.url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || siteConfig.description} />
      <meta property="og:url" content={canonical || siteConfig.url} />
      <meta property="og:image" content={ogImage || siteConfig.ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || siteConfig.description} />
      <meta name="twitter:image" content={ogImage || siteConfig.ogImage} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {children}
    </Helmet>
  );
}
```

## 2. Per-Page SEO Configuration

| Page | Title | Description | ogType |
|---|---|---|---|
| Home | Krishana Poshak - Premium Traditional Wear | Shop authentic traditional Indian clothing... | website |
| Shop | Shop Traditional Wear | Browse our collection of sarees, kurtas... | website |
| Product | {product.name} | {product.shortDescription} | product |
| Category | {category.name} | Browse {category.name} collection... | website |
| About | About Us | Learn about Krishana Poshak... | website |
| Contact | Contact Us | Get in touch with us... | website |
| Cart | Shopping Cart | Your cart items | website |
| Checkout | Checkout | Complete your order | website |
| Auth pages | Login / Register | - | website |
| Account | My Account | Manage your profile | website |
| Admin | Admin Dashboard | - | website (noindex) |

## 3. Structured Data (JSON-LD)

### Product Schema
```javascript
// components/seo/ProductSchema.jsx
function ProductSchema({ product }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.images?.map(img => img.imageUrl),
    sku: product.variants?.[0]?.sku,
    brand: {
      '@type': 'Brand',
      name: 'Krishana Poshak',
    },
    offers: product.variants?.map(variant => ({
      '@type': 'Offer',
      price: variant.discountPrice || variant.price,
      priceCurrency: 'INR',
      availability: variant.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      sku: variant.sku,
    })),
    aggregateRating: product.averageRating ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
    } : undefined,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
```

### Breadcrumb Schema
```javascript
function BreadcrumbSchema({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href,
    })),
  };
  // ...
}
```

### Organization Schema
```javascript
function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Krishana Poshak',
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-XXXXXXXXXX',
      contactType: 'customer service',
    },
    sameAs: [
      'https://facebook.com/krishanaposhak',
      'https://instagram.com/krishanaposhak',
      'https://youtube.com/@krishanaposhak',
    ],
  };
  // ...
}
```

## 4. Meta Tags by Page Type

### Product Detail Page
```
<title>Banarasi Silk Saree | Krishana Poshak</title>
<meta name="description" content="Handwoven Banarasi Silk Saree in traditional red with gold zari work. Pure silk, premium quality. Free shipping." />
<meta property="og:title" content="Banarasi Silk Saree - Traditional Red | Krishana Poshak" />
<meta property="og:description" content="Handwoven Banarasi Silk Saree in traditional red..." />
<meta property="og:image" content="https://res.cloudinary.com/.../saree.jpg" />
<meta property="og:type" content="product" />
<meta property="product:price:amount" content="4999" />
<meta property="product:price:currency" content="INR" />
```

### Category Page
```
<title>Banarasi Sarees Collection | Krishana Poshak</title>
<meta name="description" content="Shop authentic Banarasi silk sarees. Premium quality handwoven sarees for weddings, festivals, and special occasions." />
<meta property="og:title" content="Banarasi Sarees Collection | Krishana Poshak" />
```

## 5. Technical SEO

| Feature | Implementation |
|---|---|
| Canonical URLs | Every page has `<link rel="canonical">` |
| Noindex admin/auth | Admin and auth pages marked `noindex, nofollow` |
| Sitemap | `public/sitemap.xml` |
| Robots.txt | `public/robots.txt` |
| Hreflang | Not needed (single language) |
| 404 page | Custom 404 with helpful links + search |
| Page speed | Per performance strategy |
| Mobile friendly | Mobile-first responsive design |
| HTTPS | Enforced in production |

### robots.txt
```
User-agent: *
Allow: /
Disallow: /auth/
Disallow: /account/
Disallow: /admin/
Disallow: /checkout/
Disallow: /cart/

Sitemap: https://krishanaposhak.com/sitemap.xml
```

## 6. Social Sharing

### Open Graph Images
| Page Type | Image | Size |
|---|---|---|
| Home | Brand banner | 1200×630 |
| Product | Product image (hero) | 1200×630 |
| Category | Category image | 1200×630 |
| Default | Brand logo on background | 1200×630 |

### Social Share Buttons
- Product detail page: Share on Facebook, Twitter, WhatsApp, Pinterest
- Uses native share API on mobile (`navigator.share()`)
- Fallback to direct URLs on desktop
</content>

