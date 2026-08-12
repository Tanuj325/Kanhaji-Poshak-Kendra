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
import ColorSelector from '@/components/product-detail/ColorSelector';
import ActionsBar from '@/components/product-detail/ActionsBar';
import TrustBadges from '@/components/product-detail/TrustBadges';
import ProductTabs from '@/components/product-detail/ProductTabs';
import ProductReviewsSection from '@/components/product-detail/ProductReviewsSection';
import RelatedProductsSection from '@/components/product-detail/RelatedProductsSection';
import MobileProductDetail from '@/components/product-detail/mobile/MobileProductDetail';

import { useProduct, useProductBySlug } from '@/hooks/useProducts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useCartContext } from '@/context/CartContext';
import { ROUTE_PATHS, buildPath } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';
import { getErrorMessage } from '@/utils/apiErrorParser';
import toast from 'react-hot-toast';
import { FiShoppingBag } from 'react-icons/fi';

export default function ProductDetailPage() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
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
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    if (!variants.length) {
      setSelectedVariant(null);
      return;
    }
    const firstAvailable = variants.find((v) => v.active !== false && v.stock > 0) || variants[0];
    setSelectedVariant(firstAvailable);
  }, [variants]);

  useEffect(() => {
    if (product?.color) {
      const firstColor = product.color.split(',')[0]?.trim();
      setSelectedColor(firstColor || null);
    } else {
      setSelectedColor(null);
    }
  }, [product?.color]);

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
    addItem(selectedVariant.id, 1, selectedColor);
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
    <>
      <SEO
        title={product.name}
        description={product.shortDescription || product.description || `Handcrafted ${product.name} from Kanhaji Poshak Kendra Meerut. Premium devotional wear.`}
        canonicalUrl={canonicalUrl}
        ogImage={productImage}
        ogType="product"
        jsonLd={productSchemas}
      />
      <MobileProductDetail
        product={product}
        variants={variants}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        breadcrumbItems={breadcrumbItems}
        canonicalUrl={canonicalUrl}
      />
    </>
  );
}

