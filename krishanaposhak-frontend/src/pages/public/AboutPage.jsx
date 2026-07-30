import { useMemo } from 'react';
import SEO from '@/components/common/SEO';
import {
  AboutHero,
  OurStory,
  OurVision,
  WhyChooseUs,
  CraftsmanshipTimeline,
  DivineGallery,
  TrustSection,
  AboutCTA,
} from '@/components/about';
import { siteConfig } from '@/config/siteConfig';

export default function AboutPage() {
  const canonicalUrl = `${siteConfig.url}/about`;

  const aboutSchemas = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.ogImage}`,
      description: 'Handcrafted divine Laddu Gopal poshaks, mukut shringar, and sacred traditional attire from Meerut artisans.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.state,
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: siteConfig.name,
      image: `${siteConfig.url}${siteConfig.ogImage}`,
      url: canonicalUrl,
      telephone: siteConfig.phone,
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.state,
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '28.9845',
        longitude: '77.7064',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
        { '@type': 'ListItem', position: 2, name: 'About Us', item: canonicalUrl },
      ],
    },
  ], [canonicalUrl]);

  return (
    <>
      <SEO
        title="About Us - Sacred Heritage & Artisan Craftsmanship"
        description={`Discover ${siteConfig.name}. We handcraft divine poshaks, mukut shringars, and traditional seva garments for Laddu Gopal Ji with pure velvet, silk, and Meerut heritage.`}
        canonicalUrl={canonicalUrl}
        jsonLd={aboutSchemas}
      />

      <main className="w-full overflow-x-hidden bg-white">
        {/* Section 1: Hero Header */}
        <AboutHero />

        {/* Section 2: Our Story */}
        <OurStory />

        {/* Section 3: Our Vision & Mission */}
        <OurVision />

        {/* Section 4: Why Choose Us */}
        <WhyChooseUs />

        {/* Section 5: Craftsmanship Timeline */}
        <CraftsmanshipTimeline />

        {/* Section 6: Divine Gallery Showcase */}
        <DivineGallery />

        {/* Section 7: Trust Banner */}
        <TrustSection />

        {/* Section 8: Call to Action Banner */}
        <AboutCTA />
      </main>
    </>
  );
}
