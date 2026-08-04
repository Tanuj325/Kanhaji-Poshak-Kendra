import { useMemo, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '@/components/common/SEO';
import SocialShareButtons from '@/components/common/SocialShareButtons';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import PriceDisplay from '@/components/ui/PriceDisplay';

import ProductDetailSkeleton from '@/components/product-detail/ProductDetailSkeleton';
import ImageGallery from '@/components/product-detail/ImageGallery';
import ProductInfo from '@/components/product-detail/ProductInfo';
import PricingSection from '@/components/product-detail/PricingSection';
import VariantSelector from '@/components/product-detail/VariantSelector';
import ActionsBar from '@/components/product-detail/ActionsBar';
import TrustBadges from '@/components/product-detail/TrustBadges';
import ProductTabs from '@/components/product-detail/ProductTabs';
import ProductReviewsSection from '@/components/product-detail/ProductReviewsSection';
import RelatedProductsSection from '@/components/product-detail/RelatedProductsSection';

import { useProduct, useProductBySlug } from '@/hooks/useProducts';
import { useCartContext } from '@/context/CartContext';
import { ROUTE_PATHS, buildPath } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';
import { getErrorMessage } from '@/utils/apiErrorParser';
import toast from 'react-hot-toast';
import { FiShoppingBag } from 'react-icons/fi';

export default function ProductDetailPage() {
  const { slug } = useParams();

  const isNumericId = Boolean(slug && /^\d+$/.test(slug));
  const slugQuery = useProductBySlug(!isNumericId ? slug : null);
  const idQuery = useProduct(isNumericId ? slug : null);

  const activeQuery = isNumericId ? idQuery : slugQuery;
  const data = activeQuery.data;
  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;
  const error = activeQuery.error;
  const refetch = activeQuery.refetch;

  const product = data?.data || data;
  const { addItem, isAddingItem } = useCartContext();

  const variants = useMemo(() => {
    if (!product) return [];
    return product.variants || product.productVariants || [];
  }, [product]);

  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (!variants.length) {
      setSelectedVariant(null);
      return;
    }
    const firstAvailable = variants.find((v) => v.active !== false && v.stock > 0) || variants[0];
    setSelectedVariant(firstAvailable);
  }, [variants]);

  const categoryId = product?.categoryId || product?.category?.id;

  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: 'Home', href: ROUTE_PATHS.HOME },
      { label: 'Shop', href: ROUTE_PATHS.SHOP },
    ];
    const categoryName =
      product?.categoryName ||
      product?.category?.name ||
      (typeof product?.category === 'string' ? product?.category : null);
    const categorySlug = product?.categorySlug || product?.category?.slug;
    if (categoryName && categorySlug) {
      items.push({ label: categoryName, href: buildPath.category(categorySlug) });
    } else if (categoryName && categoryId) {
      items.push({ label: categoryName, href: buildPath.shopCategory(categoryId) });
    }
    items.push({ label: product?.name || 'Product Details' });
    return items;
  }, [product, categoryId]);

  const handleStickyAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a size first');
      return;
    }
    addItem(selectedVariant.id, 1);
  };

  const activePrice = selectedVariant?.price || product?.price;
  const activeDiscountPrice = selectedVariant?.discountPrice || product?.discountPrice;
  const canonicalUrl = `${siteConfig.url}/products/${product?.slug || slug}`;
  const productImage = product?.imageUrl || product?.images?.[0]?.imageUrl;
  const categoryName = product?.categoryName || product?.category?.name || 'Devotional Attire';

  const productSchemas = useMemo(() => {
    if (!product) return [];
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images?.map((img) => img.imageUrl || img) || [productImage],
        description: product.description || product.shortDescription || `Handcrafted ${product.name} from Kanhaji Poshak Kendra Meerut.`,
        sku: selectedVariant?.sku || `KP-${product.id}`,
        brand: {
          '@type': 'Brand',
          name: siteConfig.name,
        },
        category: categoryName,
        offers: {
          '@type': 'Offer',
          url: canonicalUrl,
          priceCurrency: 'INR',
          price: activeDiscountPrice || activePrice,
          availability: (selectedVariant?.stock > 0 || product.stock > 0)
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: siteConfig.name,
          },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.label,
          item: item.href ? (item.href.startsWith('http') ? item.href : `${siteConfig.url}${item.href}`) : canonicalUrl,
        })),
      },
    ];

    if (product.averageRating && product.reviewCount) {
      schemas[0].aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.averageRating,
        reviewCount: product.reviewCount,
        bestRating: '5',
        worstRating: '1',
      };
    }

    return schemas;
  }, [product, selectedVariant, activePrice, activeDiscountPrice, canonicalUrl, productImage, categoryName, breadcrumbItems]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="container-page section-padding py-16">
        <ErrorState
          title="Unable to load product details"
          message={getErrorMessage(error)}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page section-padding py-16">
        <EmptyState
          title="Sacred poshak not found"
          message="The requested creation could not be found or has been moved."
          action={
            <Link to={ROUTE_PATHS.SHOP}>
              <Button variant="primary" className="bg-amber-900 text-white rounded-2xl">Return to Shop</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <SEO
        title={product.name}
        description={product.shortDescription || product.description || `Handcrafted ${product.name} from Kanhaji Poshak Kendra Meerut. Premium devotional wear.`}
        canonicalUrl={canonicalUrl}
        ogImage={productImage}
        ogType="product"
        jsonLd={productSchemas}
      />

      <section className="container-page section-padding px-3 sm:px-6 lg:px-8 pb-32 lg:pb-16 font-display">
        {/* Breadcrumb */}
        <div className="py-3 sm:py-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            STAGE 1: Side-by-Side Hero Layout (Gallery + Purchase Card)
            On mobile: stacked (gallery → purchase card)
            On lg+: side-by-side (gallery left, purchase sticky right)
           ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 xl:gap-10 items-start">
          {/* LEFT: Image Gallery (7 columns on desktop) */}
          <div className="lg:col-span-7 w-full">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* RIGHT: Purchase Panel (5 columns on desktop, sticky) */}
          <div className="lg:col-span-5 w-full">
            <div className="lg:sticky lg:top-24 rounded-2xl sm:rounded-3xl bg-white p-3.5 sm:p-6 lg:p-6 xl:p-7 border border-amber-900/10 shadow-[0_4px_24px_rgba(44,40,36,0.04)] space-y-4 sm:space-y-5">
              {/* Product Info: Title, Category, Rating, Material */}
              <ProductInfo
                product={product}
                averageRating={product.averageRating || 0}
                reviewCount={product.reviewCount || 0}
              />

              {/* Pricing */}
              <PricingSection variant={selectedVariant} product={product} />

              {/* Size Selector */}
              <VariantSelector
                variants={variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />

              {/* Actions: Quantity + Add to Cart + Buy Now + Wishlist + Share */}
              <ActionsBar selectedVariant={selectedVariant} />

              {/* Trust Badges */}
              <TrustBadges />

              {/* Social Share */}
              <div className="pt-4 border-t border-amber-900/10 flex items-center justify-between flex-wrap gap-3">
                <SocialShareButtons
                  url={canonicalUrl}
                  title={`Handcrafted ${product.name} - ${siteConfig.name}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            STAGE 2: Full-Width Content Sections
           ══════════════════════════════════════════════════════════════ */}
        <div className="space-y-8 sm:space-y-14 mt-8 sm:mt-14 w-full">
          <ProductTabs product={product} />
          <ProductReviewsSection productId={product.id} productAverageRating={product.averageRating} />
          <RelatedProductsSection
            categoryId={categoryId}
            currentProductSlug={slug}
            currentProductId={product.id}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          Mobile Sticky Bottom Purchase Bar
         ══════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden bg-white/95 backdrop-blur-xl p-3 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] border-t border-amber-900/10 shadow-[0_-4px_20px_rgba(44,40,36,0.12)]">
        <div className="flex items-center justify-between gap-2.5 max-w-[1600px] mx-auto font-display min-w-0">
          <div className="flex min-w-0 flex-col shrink-0">
            <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider">Total Price</span>
            <PriceDisplay
              price={activeDiscountPrice || activePrice}
              originalPrice={activeDiscountPrice ? activePrice : undefined}
              size="sm"
            />
          </div>

          <Button
            variant="primary"
            size="md"
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-amber-50 font-bold py-3 text-xs sm:text-sm shadow-md border border-amber-500/20 min-h-[48px]"
            onClick={handleStickyAddToCart}
            isLoading={isAddingItem}
            disabled={!selectedVariant || selectedVariant.stock === 0}
          >
            <FiShoppingBag className="h-4 w-4 text-amber-200 shrink-0" />
            <span className="truncate">Add to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
