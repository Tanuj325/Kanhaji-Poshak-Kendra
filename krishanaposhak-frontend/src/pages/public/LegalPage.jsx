import { useState, useEffect, useMemo } from 'react';
import SEO from '@/components/common/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Button from '@/components/ui/Button';
import { siteConfig } from '@/config/siteConfig';
import { ROUTE_PATHS } from '@/routes/routePaths';
import {
  FiShield,
  FiFileText,
  FiTruck,
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSearch,
  FiCheckCircle,
  FiLock,
  FiCreditCard,
  FiGlobe,
  FiCopy,
  FiCheck,
  FiUserCheck,
  FiTrash2,
  FiDollarSign,
  FiPackage,
  FiXCircle,
  FiHelpCircle,
  FiCalendar,
  FiPrinter,
  FiArrowUp,
  FiChevronRight,
  FiChevronDown,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const legalSections = [
  {
    id: 'privacy',
    title: '1. Privacy Policy',
    shortTitle: 'Privacy Policy',
    icon: FiShield,
    badge: 'Data Safeguards',
    description: 'Guidelines on data collection, session tracking, and user data rights.',
  },
  {
    id: 'terms',
    title: '2. Terms & Conditions',
    shortTitle: 'Terms & Conditions',
    icon: FiFileText,
    badge: 'Agreement',
    description: 'Terms governing orders, pricing, copyright, and jurisdiction.',
  },
  {
    id: 'shipping',
    title: '3. Shipping & Delivery Policy',
    shortTitle: 'Shipping & Delivery',
    icon: FiTruck,
    badge: 'Free ₹8,000+',
    description: 'Dispatch timelines, shipping rates, and pincode estimator.',
  },
  {
    id: 'returns',
    title: '4. Return, Refund & Cancellation',
    shortTitle: 'Returns & Refunds',
    icon: FiRefreshCw,
    badge: '7-Day Return',
    description: 'Return eligibility, refund timelines, and cancellation rules.',
  },
  {
    id: 'contact',
    title: '5. Contact & Support Info',
    shortTitle: 'Customer Support',
    icon: FiMail,
    badge: 'Support Desk',
    description: 'Direct email, helpline, WhatsApp, and studio address.',
  },
];

const shippingZoneRates = [
  {
    zone: 'Metro Cities',
    regions: 'Delhi NCR, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Ahmedabad',
    deliveryTime: '2 - 3 Business Days',
  },
  {
    zone: 'Tier 1 & Tier 2 Cities',
    regions: 'Jaipur, Lucknow, Chandigarh, Pune, Indore, Surat, Patna, Bhopal, etc.',
    deliveryTime: '3 - 5 Business Days',
  },
  {
    zone: 'Tier 3 & Regional Towns',
    regions: 'District headquarters, interior towns, and semi-urban pincodes',
    deliveryTime: '4 - 6 Business Days',
  },
  {
    zone: 'Special & Remote Regions',
    regions: 'Jammu & Kashmir, North-East States, Himachal Pradesh, Island Territories',
    deliveryTime: '5 - 8 Business Days',
  },
  {
    zone: 'Worldwide International',
    regions: 'USA, UK, Canada, Australia, UAE, Singapore, Europe, Japan, etc.',
    deliveryTime: '5 - 9 Business Days',
  },
];

const returnTimelineSteps = [
  {
    step: '01',
    title: 'Initiate Request',
    desc: 'Submit return request within 7 days of delivery via account dashboard or email.',
    icon: FiRefreshCw,
  },
  {
    step: '02',
    title: 'Courier Pickup',
    desc: 'Package is collected by our courier agent in original unused condition.',
    icon: FiPackage,
  },
  {
    step: '03',
    title: 'Studio Quality QC',
    desc: 'Artisans inspect fabric, embroidery, and sacred accessories.',
    icon: HiSparkles,
  },
  {
    step: '04',
    title: 'Instant Refund',
    desc: '100% refund processed within 5-7 business days to original payment method.',
    icon: FiDollarSign,
  },
];

const legalFaqs = [
  {
    q: 'How do I request a return or exchange for a deity dress?',
    a: 'You can initiate a return or size exchange within 7 days of delivery through My Account > Orders or by emailing support@krishanaposhak.com. Items must be unwashed, unused, and in original sacred packaging.',
  },
  {
    q: 'How long does a refund take to reflect in my bank account?',
    a: 'Once the returned item passes quality inspection at our Meerut studio, refunds are processed within 24 hours. Depending on your bank or card issuer, it will reflect in 5 to 7 business days.',
  },
  {
    q: 'What is the shipping processing time for custom-sized poshak?',
    a: 'Standard readymade poshak orders dispatch within 24 to 48 business hours. Custom deity dress tailoring or bespoke embroidery work requires 3 to 5 business days of dedicated artisan handwork.',
  },
  {
    q: 'Is my personal & payment data secure on Kanhaji Poshak Kendra?',
    a: 'Yes, absolutely. We use 256-bit SSL encryption and PCI-DSS compliant payment gateways (Razorpay / UPI). We never store raw credit card credentials or sensitive financial data on our servers.',
  },
  {
    q: 'Can I cancel an order after placement?',
    a: 'Orders can be cancelled free of charge anytime prior to courier dispatch. Once handed to the courier partner, the standard return procedure applies upon delivery.',
  },
];

export default function LegalPage() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [activeSection, setActiveSection] = useState('privacy');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  // Dynamic Breadcrumbs based on route
  const breadcrumbItems = useMemo(() => {
    if (currentPath === ROUTE_PATHS.PRIVACY) {
      return [{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }];
    }
    if (currentPath === ROUTE_PATHS.TERMS) {
      return [{ label: 'Home', href: '/' }, { label: 'Terms & Conditions' }];
    }
    if (currentPath === ROUTE_PATHS.SHIPPING) {
      return [{ label: 'Home', href: '/' }, { label: 'Shipping & Delivery' }];
    }
    return [{ label: 'Home', href: '/' }, { label: 'Legal & Policies' }];
  }, [currentPath]);

  // Dynamic Page Title
  const pageMeta = useMemo(() => {
    if (currentPath === ROUTE_PATHS.PRIVACY) {
      return {
        title: 'Privacy Policy',
        subtitle: 'Guidelines on data collection, session tracking, and user data safeguards.',
        badge: 'Official Data Protection Policy',
      };
    }
    if (currentPath === ROUTE_PATHS.TERMS) {
      return {
        title: 'Terms & Conditions',
        subtitle: 'Terms governing orders, pricing, intellectual property, and jurisdiction.',
        badge: 'Official Terms of Use Agreement',
      };
    }
    if (currentPath === ROUTE_PATHS.SHIPPING) {
      return {
        title: 'Shipping & Delivery Policy',
        subtitle: 'Dispatch timelines, pincode estimates, and delivery zones.',
        badge: 'Official Shipping & Fulfillment Rules',
      };
    }
    return {
      title: 'Legal Information & Policies',
      subtitle: 'Transparent, comprehensive guidelines governing privacy, terms, shipping, and returns.',
      badge: 'Official Customer Protection & Policy Center',
    };
  }, [currentPath]);

  // Route & Hash scroll handling
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    let targetSection = 'privacy';

    if (currentPath === ROUTE_PATHS.PRIVACY || hash === 'privacy') {
      targetSection = 'privacy';
    } else if (currentPath === ROUTE_PATHS.TERMS || hash === 'terms') {
      targetSection = 'terms';
    } else if (currentPath === ROUTE_PATHS.SHIPPING || hash === 'shipping') {
      targetSection = 'shipping';
    } else if (hash && legalSections.some((s) => s.id === hash)) {
      targetSection = hash;
    }

    setActiveSection(targetSection);
    setTimeout(() => scrollToSection(targetSection), 150);
  }, [currentPath]);

  // Scroll listener for section activation
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sectionElements = legalSections.map((s) => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 180;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(legalSections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 110;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copySectionLink = (id) => {
    const url = `${window.location.origin}${ROUTE_PATHS.LEGAL}#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const printPolicy = () => {
    window.print();
  };

  // Quick Pincode Estimator
  const checkPincodeEstimator = (e) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPincodeResult({
        success: false,
        message: 'Please enter a valid 6-digit Indian Pincode.',
      });
      return;
    }

    const firstChar = cleanPin[0];
    let zoneName = 'Standard Tier 2/3 Zone';
    let estDays = '3 - 5 Business Days';
    let freeShip = 'Free on ₹8,000+';

    if (['1', '2', '4'].includes(firstChar) && ['110', '400', '560', '700', '600', '500', '380'].some(p => cleanPin.startsWith(p))) {
      zoneName = 'Metro Zone';
      estDays = '2 - 3 Business Days';
    } else if (['1', '2', '3'].includes(firstChar)) {
      zoneName = 'North & Central India Hub';
      estDays = '2 - 4 Business Days';
    } else if (['7', '8', '9'].includes(firstChar)) {
      zoneName = 'East & Remote Regional Corridor';
      estDays = '4 - 7 Business Days';
    }

    setPincodeResult({
      success: true,
      pincode: cleanPin,
      zone: zoneName,
      estimate: estDays,
      freeThreshold: freeShip,
      carrier: 'BlueDart / Delhivery / DTDC',
    });
  };

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return legalSections;
    const q = searchQuery.toLowerCase();
    return legalSections.filter(
      (s) => s.title.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const canonicalUrl = `${siteConfig.url}/legal`;

  const legalSchemas = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageMeta.title,
      description: pageMeta.subtitle,
      url: canonicalUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
        { '@type': 'ListItem', position: 2, name: pageMeta.title, item: canonicalUrl },
      ],
    },
  ], [canonicalUrl, pageMeta]);

  return (
    <>
      <SEO
        title={pageMeta.title}
        description={pageMeta.subtitle}
        canonicalUrl={canonicalUrl}
        jsonLd={legalSchemas}
      />

      <div className="min-h-screen bg-[#060E1A] text-slate-200 font-display selection:bg-amber-400 selection:text-black">
        {/* Ambient Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[450px] w-full max-w-7xl -translate-x-1/2 overflow-hidden blur-3xl opacity-25">
          <div className="h-full w-full bg-gradient-to-b from-amber-500/20 via-blue-600/10 to-transparent" />
        </div>

        {/* Premium Header */}
        <header className="relative border-b border-white/10 bg-gradient-to-b from-[#081427] via-[#071120] to-[#060E1A] pt-6 sm:pt-8 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Breadcrumb items={breadcrumbItems} className="mb-4 sm:mb-6" />

            <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 sm:px-4 py-1 text-[11px] sm:text-xs font-semibold text-amber-300 backdrop-blur-md"
              >
                <FiLock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{pageMeta.badge}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-wide leading-tight"
              >
                {pageMeta.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xs sm:text-sm lg:text-base text-slate-300/90 leading-relaxed font-light max-w-2xl mx-auto"
              >
                {pageMeta.subtitle} Welcome to the official policy portal of{' '}
                <strong className="text-white font-semibold">{siteConfig.name}</strong>.
              </motion.p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-[11px] sm:text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="text-amber-400 h-3.5 w-3.5" /> Last Updated:{' '}
                  <strong className="text-white">July 29, 2026</strong>
                </span>
                <span className="hidden sm:inline">&bull;</span>
                <button
                  type="button"
                  onClick={printPolicy}
                  className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors font-medium rounded-md px-2.5 py-1 bg-amber-400/10 border border-amber-400/20 cursor-pointer"
                >
                  <FiPrinter className="h-3.5 w-3.5" /> Print / Save Document
                </button>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 backdrop-blur-md hover:border-amber-400/30 transition-all min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
                  <FiShield className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">256-Bit SSL</div>
                  <div className="text-xs font-bold text-white truncate">Encrypted Data</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 backdrop-blur-md hover:border-amber-400/30 transition-all min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
                  <FiTruck className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">Pan-India Delivery</div>
                  <div className="text-xs font-bold text-white truncate">Free Over ₹8,000</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 backdrop-blur-md hover:border-amber-400/30 transition-all min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
                  <FiRefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">Hassle-Free</div>
                  <div className="text-xs font-bold text-white truncate">7-Day Returns</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 backdrop-blur-md hover:border-amber-400/30 transition-all min-w-0">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
                  <FiCreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">PCI-DSS Gateway</div>
                  <div className="text-xs font-bold text-white truncate">Secure Payments</div>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Search & Navigation Toolbar */}
        <div className="sticky top-[60px] sm:top-[68px] z-30 border-b border-white/10 bg-[#0B1728]/95 backdrop-blur-xl py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-2.5">
            {/* Search input */}
            <div className="relative w-full md:w-72">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                id="legal-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search legal policies"
                placeholder="Search clauses (privacy, terms, refund)..."
                className="w-full rounded-lg border border-white/15 bg-black/50 pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Horizontal Nav Tabs */}
            <div className="flex w-full md:w-auto items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5 min-w-0">
              {filteredSections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold transition-all shrink-0 cursor-pointer ${isActive
                        ? 'bg-amber-400 text-black shadow-xs font-bold'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{sec.shortTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reading Content Area */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <main className="space-y-8 sm:space-y-10">

            {/* SECTION 1: PRIVACY POLICY */}
            <section
              id="privacy"
              role="region"
              aria-label="Privacy Policy"
              className="scroll-mt-36 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7 backdrop-blur-xl space-y-5 hover:border-white/20 transition-all min-w-0"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                    <FiShield className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-serif font-bold text-white truncate">
                      1. Privacy Policy &amp; Data Safeguards
                    </h2>
                    <p className="text-[11px] text-slate-400 font-light truncate">
                      Standards governing information collection, session tracking, and user data rights.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copySectionLink('privacy')}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 shrink-0 cursor-pointer"
                  title="Copy section link"
                >
                  {copiedId === 'privacy' ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed font-light min-w-0">
                <p>
                  At <strong className="text-white font-semibold">Kanhaji Poshak Kendra</strong>, we respect the sacred trust of every devotee. This policy explains how we gather, utilize, and protect your personal information across all touchpoints.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 min-w-0">
                  {/* Information Collection */}
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs truncate">
                      <FiUserCheck className="text-amber-400 shrink-0" /> Information We Collect
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                      Personal details provided during registration or checkout, including full name, delivery address, phone number, email, and deity dress size preferences.
                    </p>
                  </div>

                  {/* Cookies */}
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs truncate">
                      <FiLock className="text-amber-400 shrink-0" /> Cookies &amp; Session Tracking
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                      Essential session cookies retain your shopping cart items, login credentials, and search filters. We do not employ third-party ad brokers or cross-site tracking pixels.
                    </p>
                  </div>

                  {/* Payment Info */}
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs truncate">
                      <FiCreditCard className="text-amber-400 shrink-0" /> Payment &amp; Gateway Security
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                      Transactions are processed via PCI-DSS certified gateways (Razorpay / UPI / Cards). Financial credentials are never stored on our local servers.
                    </p>
                  </div>

                  {/* Third Party Services */}
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs truncate">
                      <FiGlobe className="text-amber-400 shrink-0" /> Third-Party Logistics Partners
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                      Shipping details are transmitted securely to courier partners (BlueDart, Delhivery, DTDC) strictly for delivery fulfillment and SMS tracking updates.
                    </p>
                  </div>
                </div>

                {/* Data Rights & Account Deletion */}
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3.5 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-300 gap-2 min-w-0">
                    <span className="flex items-center gap-1.5 truncate">
                      <FiTrash2 className="text-amber-400 shrink-0" /> Devotee Rights &amp; Account Deletion
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono shrink-0">30-Day SLA</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    You retain full control over your personal records. You may request a complete export of your stored personal data or submit a permanent account deletion request by emailing <a href={`mailto:${siteConfig.email}`} className="text-amber-400 hover:underline font-medium break-all">{siteConfig.email}</a>.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 2: TERMS & CONDITIONS */}
            <section
              id="terms"
              role="region"
              aria-label="Terms and Conditions"
              className="scroll-mt-36 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7 backdrop-blur-xl space-y-5 hover:border-white/20 transition-all min-w-0"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                    <FiFileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-serif font-bold text-white truncate">
                      2. Terms &amp; Conditions of Sale
                    </h2>
                    <p className="text-[11px] text-slate-400 font-light truncate">
                      General terms governing website usage, orders, pricing, and jurisdiction.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copySectionLink('terms')}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 shrink-0 cursor-pointer"
                  title="Copy section link"
                >
                  {copiedId === 'terms' ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-light min-w-0">
                <div className="grid grid-cols-1 gap-3 min-w-0">
                  <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1 min-w-0">
                    <div className="font-semibold text-white text-xs">A. Acceptance of Agreement</div>
                    <p className="text-[11px] sm:text-xs text-slate-400">
                      By visiting <span className="text-white font-medium">{siteConfig.name}</span>, creating an account, or placing an order for handcrafted deity dresses, you agree to comply with these terms and all applicable statutory regulations of India.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1 min-w-0">
                    <div className="font-semibold text-white text-xs">B. Handcrafted Product Authenticity</div>
                    <p className="text-[11px] sm:text-xs text-slate-400">
                      All garments and mukut sets are individually handcrafted by traditional artisans in Meerut. Subtle variations in embroidery, thread tone, or stone placement reflect genuine handmade art and do not constitute defects.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1 min-w-0">
                    <div className="font-semibold text-white text-xs">C. Pricing, GST &amp; Invoicing</div>
                    <p className="text-[11px] sm:text-xs text-slate-400">
                      Prices are listed in <strong className="text-white">Indian Rupees (INR ₹)</strong> inclusive of GST. Tax invoices are automatically generated and dispatched alongside every shipment.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1 min-w-0">
                    <div className="font-semibold text-white text-xs">D. Intellectual Property Copyright</div>
                    <p className="text-[11px] sm:text-xs text-slate-400">
                      All photography, dress patterns, logos, and web assets belong to Kanhaji Poshak Kendra. Commercial reproduction or unauthorized distribution is prohibited.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1 min-w-0">
                    <div className="font-semibold text-white text-xs">E. Applicable Law &amp; Jurisdiction</div>
                    <p className="text-[11px] sm:text-xs text-slate-400">
                      These terms are governed by the laws of India. Legal proceedings shall fall under the exclusive jurisdiction of the competent courts in <strong className="text-white">Meerut, Uttar Pradesh, India</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: SHIPPING POLICY */}
            <section
              id="shipping"
              role="region"
              aria-label="Shipping Policy"
              className="scroll-mt-36 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7 backdrop-blur-xl space-y-5 hover:border-white/20 transition-all min-w-0"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                    <FiTruck className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-serif font-bold text-white truncate">
                      3. Shipping &amp; Delivery Policy
                    </h2>
                    <p className="text-[11px] text-slate-400 font-light truncate">
                      Order preparation times, shipping charges, tracking, and transit schedules.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copySectionLink('shipping')}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 shrink-0 cursor-pointer"
                  title="Copy section link"
                >
                  {copiedId === 'shipping' ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed font-light min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 min-w-0">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center space-y-1 min-w-0">
                    <div className="text-emerald-400 font-bold text-[10px] sm:text-xs uppercase truncate">Pan-India Free Shipping</div>
                    <div className="text-lg sm:text-xl font-bold text-white font-serif">FREE</div>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">Orders ₹8,000 &amp; above</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 text-center space-y-1 min-w-0">
                    <div className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase truncate">Standard Shipping</div>
                    <div className="text-lg sm:text-xl font-bold text-white font-serif">₹120 - ₹400</div>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">Based on Order Total</p>
                  </div>
                  <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3.5 text-center space-y-1 min-w-0">
                    <div className="text-amber-300 font-bold text-[10px] sm:text-xs uppercase truncate">Dispatch Window</div>
                    <div className="text-lg sm:text-xl font-bold text-white font-serif">24 - 48 Hrs</div>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">Readymade items</p>
                  </div>
                </div>

                {/* Pincode Estimator Tool */}
                <div className="rounded-xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-white/[0.02] to-transparent p-3.5 space-y-2.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 truncate">
                    <FiTruck className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="truncate">Check Delivery Estimate for Your Pincode</span>
                  </div>
                  <form onSubmit={checkPincodeEstimator} className="flex flex-col sm:flex-row gap-2 min-w-0">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit Pincode (e.g. 110001)"
                      className="flex-1 rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none min-w-0"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-amber-400 font-bold text-black hover:bg-amber-300 shrink-0 cursor-pointer min-h-[34px]"
                    >
                      Calculate
                    </Button>
                  </form>

                  {pincodeResult && (
                    <div className="rounded-lg border border-white/10 bg-black/50 p-2.5 text-xs min-w-0">
                      {pincodeResult.success ? (
                        <div className="flex items-center justify-between text-amber-300 font-semibold text-[11px] sm:text-xs min-w-0">
                          <span className="truncate">Pincode {pincodeResult.pincode} &bull; {pincodeResult.zone}</span>
                          <span className="text-emerald-400 font-bold shrink-0">{pincodeResult.estimate}</span>
                        </div>
                      ) : (
                        <span className="text-rose-400 text-[11px]">{pincodeResult.message}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Delivery Timeline Matrix Table (Single Delivery Standard Column) */}
                <div className="overflow-x-auto custom-scrollbar rounded-xl border border-white/10 bg-black/40 min-w-0">
                  <table className="w-full text-left text-xs text-slate-300 min-w-[450px]">
                    <thead className="bg-white/5 text-amber-300 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2.5">Destination Zone</th>
                        <th className="p-2.5">Regions Covered</th>
                        <th className="p-2.5">Estimated Delivery Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[11px]">
                      {shippingZoneRates.map((z, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-2.5 font-bold text-white whitespace-nowrap">{z.zone}</td>
                          <td className="p-2.5 text-slate-400">{z.regions}</td>
                          <td className="p-2.5 text-emerald-400 font-medium whitespace-nowrap">{z.deliveryTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <ul className="space-y-1.5 pt-1 text-xs min-w-0">
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Live AWB Tracking:</strong> Automated SMS and WhatsApp tracking links are dispatched immediately upon courier handover.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Damaged Box Protocol:</strong> Report transit damage within 48 hours with unboxing video proof for an immediate free replacement.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* SECTION 4: RETURN / REFUND / CANCELLATION */}
            <section
              id="returns"
              role="region"
              aria-label="Return Refund and Cancellation Policy"
              className="scroll-mt-36 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7 backdrop-blur-xl space-y-5 hover:border-white/20 transition-all min-w-0"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                    <FiRefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-serif font-bold text-white truncate">
                      4. Return, Refund &amp; Cancellation Policy
                    </h2>
                    <p className="text-[11px] text-slate-400 font-light truncate">
                      7-day return window, cancellation rules, exchange steps, and refund processing.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copySectionLink('returns')}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 shrink-0 cursor-pointer"
                  title="Copy section link"
                >
                  {copiedId === 'returns' ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed font-light min-w-0">
                {/* Process Timeline Card */}
                <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3 min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 truncate">
                    Step-by-Step Return Workflow
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 min-w-0">
                    {returnTimelineSteps.map((step) => {
                      const StepIcon = step.icon;
                      return (
                        <div key={step.step} className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5 space-y-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-amber-400">{step.step}</span>
                            <StepIcon className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                          </div>
                          <div className="font-bold text-white text-xs truncate">{step.title}</div>
                          <p className="text-[10px] text-slate-400 leading-tight">{step.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 min-w-0">
                  {/* Eligibility */}
                  <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1.5 min-w-0">
                    <div className="font-semibold text-white text-xs flex items-center gap-1.5 truncate">
                      <FiCheckCircle className="text-emerald-400 shrink-0" /> Return &amp; Exchange Eligibility
                    </div>
                    <ul className="space-y-1 text-[11px] sm:text-xs text-slate-400 list-disc list-inside">
                      <li>Initiated within 7 days of package delivery.</li>
                      <li>Items must be unused, unwashed, and in original packaging.</li>
                      <li>Size exchange available free of cost for deity dresses.</li>
                    </ul>
                  </div>

                  {/* Non-Returnable */}
                  <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1.5 min-w-0">
                    <div className="font-semibold text-white text-xs flex items-center gap-1.5 truncate">
                      <FiXCircle className="text-rose-400 shrink-0" /> Non-Returnable Items
                    </div>
                    <ul className="space-y-1 text-[11px] sm:text-xs text-slate-400 list-disc list-inside">
                      <li>Custom-tailored deity dresses made to specific measurements.</li>
                      <li>Opened sacred attar, perfume, or dhoop items.</li>
                      <li>Items showing signs of wear or altar use.</li>
                    </ul>
                  </div>
                </div>

                {/* Cancellation */}
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3.5 text-xs text-amber-200/90 space-y-1 min-w-0">
                  <strong className="text-amber-300 font-semibold block">Order Cancellation Rules:</strong>
                  <p className="text-[11px] sm:text-xs">
                    Orders can be cancelled with a 100% full refund before courier dispatch. If cancelled post-dispatch, standard return courier fees will apply upon delivery return.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 5: CONTACT INFORMATION */}
            <section
              id="contact"
              role="region"
              aria-label="Contact Information"
              className="scroll-mt-36 rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-white/[0.02] to-transparent p-5 sm:p-7 backdrop-blur-xl space-y-5 min-w-0"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                    <FiMail className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-serif font-bold text-white truncate">
                      5. Contact Information &amp; Support Hours
                    </h2>
                    <p className="text-[11px] text-slate-400 font-light truncate">
                      Reach out directly to our dedicated customer support desk.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copySectionLink('contact')}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 shrink-0 cursor-pointer"
                  title="Copy section link"
                >
                  {copiedId === 'contact' ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed font-light min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 min-w-0">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex flex-col items-center justify-center text-center rounded-xl border border-white/10 bg-black/40 p-3.5 hover:border-amber-400/50 transition-all space-y-1.5 group min-w-0"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                      <FiMail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 w-full">
                      <div className="font-bold text-white text-xs truncate">Support Email</div>
                      <div className="text-slate-400 text-[10px] sm:text-[11px] truncate">{siteConfig.email}</div>
                    </div>
                  </a>

                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex flex-col items-center justify-center text-center rounded-xl border border-white/10 bg-black/40 p-3.5 hover:border-amber-400/50 transition-all space-y-1.5 group min-w-0"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                      <FiPhone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 w-full">
                      <div className="font-bold text-white text-xs truncate">Helpline Phone</div>
                      <div className="text-slate-400 text-[10px] sm:text-[11px] truncate">{siteConfig.phone}</div>
                    </div>
                  </a>

                  <a
                    href={siteConfig.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center text-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 hover:border-emerald-400/60 transition-all space-y-1.5 group min-w-0"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                      <FaWhatsapp className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 w-full">
                      <div className="font-bold text-emerald-300 text-xs truncate">WhatsApp Helpdesk</div>
                      <div className="text-slate-300 text-[10px] sm:text-[11px] truncate">Instant Assistance</div>
                    </div>
                  </a>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 space-y-2 text-center sm:text-left sm:flex sm:items-center sm:justify-between min-w-0">
                  <div className="min-w-0">
                    <div className="font-bold text-white text-xs flex items-center justify-center sm:justify-start gap-1.5 truncate">
                      <FiClock className="text-amber-400 shrink-0" /> Operational Support Hours
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Monday – Saturday: 9:00 AM – 7:00 PM IST (Closed Sundays &amp; National Holidays)</p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-center sm:text-right shrink-0">
                    <div className="font-bold text-white text-xs flex items-center justify-center sm:justify-end gap-1.5 truncate">
                      <FiMapPin className="text-amber-400 shrink-0" /> Store &amp; Studio Address
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQs Accordion */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7 backdrop-blur-xl space-y-5 min-w-0">
              <div className="border-b border-white/10 pb-3.5 min-w-0">
                <h2 className="text-base sm:text-lg font-serif font-bold text-white flex items-center gap-2 truncate">
                  <FiHelpCircle className="h-4 w-4 text-amber-400 shrink-0" />
                  Frequently Asked Legal &amp; Policy Questions
                </h2>
                <p className="text-[11px] text-slate-400 font-light mt-0.5 truncate">
                  Quick answers to common questions about your rights, orders, and data.
                </p>
              </div>

              <div className="space-y-2.5 min-w-0">
                {legalFaqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-black/30 overflow-hidden transition-colors min-w-0"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-white hover:text-amber-300 transition-colors focus:outline-none cursor-pointer min-w-0"
                      >
                        <span className="pr-3 truncate">{faq.q}</span>
                        <FiChevronDown
                          className={`h-4 w-4 shrink-0 text-amber-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                            }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-3.5 pb-3.5 text-[11px] sm:text-xs text-slate-300 leading-relaxed border-t border-white/5 font-light"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Bottom CTA Card */}
            <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent p-5 text-center space-y-2.5 min-w-0">
              <h3 className="text-base sm:text-lg font-serif font-bold text-white truncate">
                Have Any Custom Policy Questions?
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
                Our devotee helpdesk is always ready to assist you with order inquiries, custom sizing support, or return assistance.
              </p>
              <div className="pt-1.5 flex flex-wrap items-center justify-center gap-2.5">
                <Link to={ROUTE_PATHS.CONTACT}>
                  <Button size="sm" className="bg-amber-400 text-black font-bold hover:bg-amber-300 cursor-pointer min-h-[36px]">
                    Contact Support <FiChevronRight className="ml-1" />
                  </Button>
                </Link>
                <Link to={ROUTE_PATHS.SHOP}>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 cursor-pointer min-h-[36px]">
                    Explore Shop Catalog
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>

        {/* Floating Scroll To Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/20 hover:bg-amber-300 focus:outline-none transition-all cursor-pointer"
              aria-label="Scroll back to top"
            >
              <FiArrowUp className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
