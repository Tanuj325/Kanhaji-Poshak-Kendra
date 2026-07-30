import { memo, useRef, lazy, Suspense } from 'react';
import { siteConfig } from '@/config/siteConfig';
import SEO from '@/components/common/SEO';
import {
  HeroBanner,
  CategoriesSection,
  FeaturedProducts,
  NewArrivals,
  BestSellers,
} from '@/components/home';

const BrandStorySection = lazy(() => import('@/components/home/BrandStorySection'));
const FooterCTA = lazy(() => import('@/components/home/FooterCTA'));
const ShopByPrice = lazy(() => import('@/components/home/ShopByPrice'));

const SectionDivider = memo(function SectionDivider() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="border-t border-temple-gold/15" />
    </div>
  );
});

export default function HomePage() {
  const mainRef = useRef(null);

  const homeSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.ogImage}`,
      description: siteConfig.description,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        contactType: 'customer service',
        email: siteConfig.email,
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.state,
        addressCountry: siteConfig.address.country,
      },
      sameAs: Object.values(siteConfig.social).filter(Boolean),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteConfig.url}/shop?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];

  return (
    <>
      <SEO
        title="Authentic Laddu Gopal Poshak & Temple Attire from Meerut"
        description="Shop handcrafted Laddu Gopal poshaks, Radha Krishna dresses, mukuts & devotional jewellery directly from master artisans in Meerut. Fast delivery across India."
        jsonLd={homeSchemas}
      />

      <main ref={mainRef} id="main-content" className="bg-lotus-white font-body min-h-screen">
        {/* 1. Hero Banner Slider */}
        <HeroBanner />

        {/* 2. Featured Categories */}
        <CategoriesSection />

        {/* 3. Shop By Price */}
        <Suspense fallback={null}>
          <ShopByPrice />
        </Suspense>

        <SectionDivider />

        {/* 4. Featured Products */}
        <FeaturedProducts />

        {/* 5. New Arrivals */}
        <NewArrivals />

        {/* 6. Best Sellers */}
        <BestSellers />

        {/* 7. Brand Story & Trust Section */}
        <Suspense fallback={null}>
          <BrandStorySection />
          <FooterCTA />
        </Suspense>
      </main>
    </>
  );
}
