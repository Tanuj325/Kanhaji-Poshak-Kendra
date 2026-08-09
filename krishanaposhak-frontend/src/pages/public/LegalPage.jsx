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

  // Generate clean pure-text printable document PDF for Mobile Storage & Desktop
  const printPolicy = () => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth < 768;

    if (isMobile) {
      // On mobile, trigger system print/save-as-PDF sheet directly into mobile storage
      window.print();
      return;
    }

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        window.print();
        return;
      }

      const documentHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${siteConfig.name} - Privacy Policy & Terms and Conditions</title>
            <style>
              body {
                font-family: 'Times New Roman', Times, Georgia, serif;
                color: #111827;
                line-height: 1.6;
                margin: 30px;
                font-size: 13px;
                background: #fff;
              }
              h1 { font-size: 22px; text-align: center; margin-bottom: 4px; text-transform: uppercase; color: #000; font-weight: bold; }
              .meta { text-align: center; font-size: 11px; color: #4b5563; margin-bottom: 25px; border-bottom: 1.5px solid #e5e7eb; padding-bottom: 12px; }
              h2 { font-size: 15px; border-bottom: 1.5px solid #111827; padding-bottom: 4px; margin-top: 24px; text-transform: uppercase; color: #000; font-weight: bold; page-break-after: avoid; }
              h3 { font-size: 13px; margin-top: 14px; margin-bottom: 4px; color: #1f2937; font-weight: bold; }
              p { margin: 6px 0 10px 0; text-align: justify; }
              ul { margin: 6px 0 10px 0; padding-left: 20px; }
              li { margin-bottom: 4px; }
              table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 12px; }
              th, td { border: 1px solid #d1d5db; padding: 6px 10px; text-align: left; }
              th { background-color: #f3f4f6; font-weight: bold; }
              .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 12px; text-align: center; font-size: 10px; color: #6b7280; }
            </style>
          </head>
          <body>
            <h1>${siteConfig.name}</h1>
            <div class="meta">
              <strong>OFFICIAL LEGAL DOCUMENTATION</strong> &bull; Privacy Policy & Terms and Conditions<br/>
              Last Updated: 09 August 2026 &bull; Website: ${siteConfig.url} &bull; Email: ${siteConfig.email}
            </div>

            <h2>1. Privacy Policy & Data Safeguards</h2>
            <p>At <strong>${siteConfig.name}</strong>, we respect the sacred trust of every devotee. This policy explains how we gather, utilize, and protect your personal information across all touchpoints.</p>
            <h3>Information We Collect</h3>
            <p>Personal details provided during registration or checkout, including full name, delivery address, phone number, email, and deity dress size preferences.</p>
            <h3>Cookies & Session Tracking</h3>
            <p>Essential session cookies retain your shopping cart items, login credentials, and search filters. We do not employ third-party ad brokers or cross-site tracking pixels.</p>
            <h3>Payment & Gateway Security</h3>
            <p>Transactions are processed via PCI-DSS certified gateways (Razorpay / UPI / Cards). Financial credentials are never stored on our local servers.</p>
            <h3>Devotee Data Rights & Account Deletion</h3>
            <p>You retain full control over your personal records. You may request a complete export of your stored personal data or submit a permanent account deletion request by emailing ${siteConfig.email}.</p>

            <h2>2. Terms & Conditions of Sale</h2>
            <h3>A. Acceptance of Agreement</h3>
            <p>By visiting ${siteConfig.name}, creating an account, or placing an order for handcrafted deity dresses, you agree to comply with these terms and all applicable statutory regulations of India.</p>
            <h3>B. Handcrafted Product Authenticity</h3>
            <p>All garments and mukut sets are individually handcrafted by traditional artisans in Meerut. Subtle variations in embroidery, thread tone, or stone placement reflect genuine handmade art and do not constitute defects.</p>
            <h3>C. Pricing, GST & Invoicing</h3>
            <p>Prices are listed in Indian Rupees (INR ₹) inclusive of GST. Tax invoices are automatically generated and dispatched alongside every shipment.</p>
            <h3>D. Intellectual Property Copyright</h3>
            <p>All photography, dress patterns, logos, and web assets belong to Kanhaji Poshak Kendra. Commercial reproduction or unauthorized distribution is prohibited.</p>
            <h3>E. Applicable Law & Jurisdiction</h3>
            <p>These terms are governed by the laws of India. Legal proceedings shall fall under the exclusive jurisdiction of the competent courts in Meerut, Uttar Pradesh, India.</p>

            <h2>3. Shipping & Delivery Policy</h2>
            <p>Order preparation times: Standard readymade poshak orders dispatch within 24 to 48 business hours. Pan-India Free Delivery applies on orders ₹8,000 and above.</p>
            <table>
              <thead>
                <tr>
                  <th>Destination Zone</th>
                  <th>Regions Covered</th>
                  <th>Estimated Delivery Time</th>
                </tr>
              </thead>
              <tbody>
                ${shippingZoneRates
                  .map(
                    (z) => `
                  <tr>
                    <td><strong>${z.zone}</strong></td>
                    <td>${z.regions}</td>
                    <td>${z.deliveryTime}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>

            <h2>4. Return, Refund & Cancellation Policy</h2>
            <p>We provide a 7-day hassle-free size exchange & return policy from the date of package delivery. Items must be unwashed, unused, and in original packaging.</p>
            <p>Orders can be cancelled with a 100% full refund before courier dispatch. Refunds are processed within 5-7 business days upon studio QC inspection.</p>

            <h2>5. Contact Information & Support Hours</h2>
            <p>Support Email: ${siteConfig.email}</p>
            <p>Helpline Phone: ${siteConfig.phone}</p>
            <p>Operational Support Hours: Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
            <p>Studio Address: ${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state}, ${siteConfig.address.country}</p>

            <div class="footer">
              &copy; ${new Date().getFullYear()} ${siteConfig.name}. All Rights Reserved. Official Legal Record.
            </div>

            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(documentHtml);
      printWindow.document.close();
    } catch {
      window.print();
    }
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

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; color: black !important; font-size: 11px !important; }
          main { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
          section { page-break-inside: avoid; border: 1px solid #e2e8f0 !important; background: white !important; box-shadow: none !important; margin-bottom: 16px !important; padding: 16px !important; }
          h1, h2, h3, h4, strong { color: black !important; }
          p, span, li, td, th { color: #1e293b !important; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-50/60 text-slate-800 font-display selection:bg-amber-400 selection:text-black print:bg-white print:text-black">
        {/* Premium Header */}
        <header className="relative border-b border-slate-200/80 bg-white pt-5 sm:pt-6 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 shadow-2xs print:border-b print:pb-4">
          <div className="mx-auto max-w-4xl">
            <Breadcrumb items={breadcrumbItems} className="mb-3 sm:mb-4 print:hidden" />

            <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-900 print:hidden"
              >
                <FiLock className="h-3 w-3 text-amber-700 shrink-0" />
                <span className="truncate">{pageMeta.badge}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="text-xl sm:text-2xl lg:text-3xl font-heading font-extrabold text-amber-950 tracking-tight leading-snug print:text-xl print:text-black"
              >
                {pageMeta.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body max-w-xl mx-auto print:text-xs print:text-slate-800"
              >
                {pageMeta.subtitle} Official policy portal of{' '}
                <strong className="text-slate-900 font-semibold">{siteConfig.name}</strong>.
              </motion.p>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-0.5 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <FiCalendar className="text-amber-700 h-3 w-3" /> Last Updated:{' '}
                  <strong className="text-slate-900">09 August 2026</strong>
                </span>
                <span className="hidden sm:inline print:hidden">&bull;</span>
                <button
                  type="button"
                  onClick={printPolicy}
                  className="inline-flex items-center gap-1.5 text-amber-900 hover:text-amber-950 transition-colors font-semibold rounded-lg px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 cursor-pointer shadow-2xs print:hidden"
                >
                  <FiPrinter className="h-3.5 w-3.5" /> Print / Save Document
                </button>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 max-w-3xl mx-auto print:hidden"
            >
              <div className="flex flex-col items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-1.5 min-w-0">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  <FiShield className="h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 truncate">256-Bit SSL</div>
                  <div className="text-[11px] font-bold text-slate-900 truncate">Encrypted Data</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-1.5 min-w-0">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  <FiTruck className="h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 truncate">Pan-India Delivery</div>
                  <div className="text-[11px] font-bold text-slate-900 truncate">Free Over ₹8,000</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-1.5 min-w-0">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  <FiRefreshCw className="h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 truncate">Hassle-Free</div>
                  <div className="text-[11px] font-bold text-slate-900 truncate">7-Day Returns</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-1.5 min-w-0">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  <FiCreditCard className="h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 truncate">PCI-DSS Gateway</div>
                  <div className="text-[11px] font-bold text-slate-900 truncate">Secure Payments</div>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Search & Navigation Toolbar */}
        <div className="sticky top-[60px] sm:top-[68px] z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md py-2 px-4 sm:px-6 lg:px-8 shadow-2xs print:hidden">
          <div className="mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-2">
            {/* Search input */}
            <div className="relative w-full md:w-64">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                id="legal-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search legal policies"
                placeholder="Search clauses (privacy, terms, refund)..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-7 py-1 text-xs text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Horizontal Nav Tabs */}
            <div className="flex w-full md:w-auto items-center gap-1 overflow-x-auto custom-scrollbar py-0.5 min-w-0">
              {filteredSections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${isActive
                      ? 'bg-amber-500 text-slate-950 shadow-2xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
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
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 print:p-0 print:max-w-none">
          <main className="space-y-6 sm:space-y-8 print:space-y-6">

            {/* SECTION 1: PRIVACY POLICY */}
            <section
              id="privacy"
              role="region"
              aria-label="Privacy Policy"
              className="scroll-mt-36 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4 min-w-0 print:border-slate-300 print:shadow-none print:p-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700">
                    <FiShield className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-serif font-bold text-slate-900 truncate print:text-black">
                      1. Privacy Policy &amp; Data Safeguards
                    </h2>
                    <p className="text-[11px] text-slate-500 font-body truncate print:text-slate-700">
                      Standards governing information collection, session tracking, and user data rights.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copySectionLink('privacy')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-800 shrink-0 cursor-pointer print:hidden"
                  title="Copy section link"
                >
                  {copiedId === 'privacy' ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-body min-w-0 print:text-black">
                <p>
                  At <strong className="text-slate-900 font-semibold">{siteConfig.name}</strong>, we respect the sacred trust of every devotee. This policy explains how we gather, utilize, and protect your personal information across all touchpoints.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-w-0">
                  {/* Information Collection */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] truncate">
                      <FiUserCheck className="text-amber-700 shrink-0" /> Information We Collect
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Personal details provided during registration or checkout, including full name, delivery address, phone number, email, and deity dress size preferences.
                    </p>
                  </div>

                  {/* Cookies */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] truncate">
                      <FiLock className="text-amber-700 shrink-0" /> Cookies &amp; Session Tracking
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Essential session cookies retain your shopping cart items, login credentials, and search filters. We do not employ third-party ad brokers or cross-site tracking pixels.
                    </p>
                  </div>

                  {/* Payment Info */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] truncate">
                      <FiCreditCard className="text-amber-700 shrink-0" /> Payment &amp; Gateway Security
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Transactions are processed via PCI-DSS certified gateways (Razorpay / UPI / Cards). Financial credentials are never stored on our local servers.
                    </p>
                  </div>

                  {/* Third Party Services */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] truncate">
                      <FiGlobe className="text-amber-700 shrink-0" /> Third-Party Logistics Partners
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Shipping details are transmitted securely to courier partners (BlueDart, Delhivery, DTDC) strictly for delivery fulfillment and SMS tracking updates.
                    </p>
                  </div>
                </div>

                {/* Data Rights & Account Deletion */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-50/60 p-3 space-y-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-950 gap-2 min-w-0">
                    <span className="flex items-center gap-1.5 truncate">
                      <FiTrash2 className="text-amber-700 shrink-0" /> Devotee Rights &amp; Account Deletion
                    </span>
                    <span className="text-[10px] text-amber-800 font-mono shrink-0">30-Day SLA</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    You retain full control over your personal records. You may request a complete export of your stored personal data or submit a permanent account deletion request by emailing <a href={`mailto:${siteConfig.email}`} className="text-amber-800 hover:underline font-semibold break-all">{siteConfig.email}</a>.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 2: TERMS & CONDITIONS */}
            <section
              id="terms"
              role="region"
              aria-label="Terms and Conditions"
              className="scroll-mt-36 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4 min-w-0 print:border-slate-300 print:shadow-none print:p-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700">
                    <FiFileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-serif font-bold text-slate-900 truncate print:text-black">
                      2. Terms &amp; Conditions of Sale
                    </h2>
                    <p className="text-[11px] text-slate-500 font-body truncate print:text-slate-700">
                      General terms governing website usage, orders, pricing, and jurisdiction.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copySectionLink('terms')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-800 shrink-0 cursor-pointer print:hidden"
                  title="Copy section link"
                >
                  {copiedId === 'terms' ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed font-body min-w-0 print:text-black">
                <div className="grid grid-cols-1 gap-2.5 min-w-0">
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 space-y-0.5 min-w-0">
                    <div className="font-bold text-slate-900 text-[11px]">A. Acceptance of Agreement</div>
                    <p className="text-[11px] text-slate-600">
                      By visiting <span className="text-slate-900 font-medium">{siteConfig.name}</span>, creating an account, or placing an order for handcrafted deity dresses, you agree to comply with these terms and all applicable statutory regulations of India.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 space-y-0.5 min-w-0">
                    <div className="font-bold text-slate-900 text-[11px]">B. Handcrafted Product Authenticity</div>
                    <p className="text-[11px] text-slate-600">
                      All garments and mukut sets are individually handcrafted by traditional artisans in Meerut. Subtle variations in embroidery, thread tone, or stone placement reflect genuine handmade art and do not constitute defects.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 space-y-0.5 min-w-0">
                    <div className="font-bold text-slate-900 text-[11px]">C. Pricing, GST &amp; Invoicing</div>
                    <p className="text-[11px] text-slate-600">
                      Prices are listed in <strong className="text-slate-900">Indian Rupees (INR ₹)</strong> inclusive of GST. Tax invoices are automatically generated and dispatched alongside every shipment.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 space-y-0.5 min-w-0">
                    <div className="font-bold text-slate-900 text-[11px]">D. Intellectual Property Copyright</div>
                    <p className="text-[11px] text-slate-600">
                      All photography, dress patterns, logos, and web assets belong to Kanhaji Poshak Kendra. Commercial reproduction or unauthorized distribution is prohibited.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 space-y-0.5 min-w-0">
                    <div className="font-bold text-slate-900 text-[11px]">E. Applicable Law &amp; Jurisdiction</div>
                    <p className="text-[11px] text-slate-600">
                      These terms are governed by the laws of India. Legal proceedings shall fall under the exclusive jurisdiction of the competent courts in <strong className="text-slate-900">Meerut, Uttar Pradesh, India</strong>.
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
              className="scroll-mt-36 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4 min-w-0 print:border-slate-300 print:shadow-none print:p-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700">
                    <FiTruck className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-serif font-bold text-slate-900 truncate print:text-black">
                      3. Shipping &amp; Delivery Policy
                    </h2>
                    <p className="text-[11px] text-slate-500 font-body truncate print:text-slate-700">
                      Order preparation times, shipping charges, tracking, and transit schedules.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copySectionLink('shipping')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-800 shrink-0 cursor-pointer print:hidden"
                  title="Copy section link"
                >
                  {copiedId === 'shipping' ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-body min-w-0 print:text-black">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 min-w-0">
                  <div className="rounded-lg border border-emerald-300/80 bg-emerald-50/70 p-3 text-center space-y-0.5 min-w-0">
                    <div className="text-emerald-800 font-bold text-[10px] uppercase truncate">Pan-India Free Shipping</div>
                    <div className="text-base font-bold text-emerald-950 font-serif">FREE</div>
                    <p className="text-[10px] text-stone-600 truncate">Orders ₹8,000 &amp; above</p>
                  </div>
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 text-center space-y-0.5 min-w-0">
                    <div className="text-slate-500 font-bold text-[10px] uppercase truncate">Standard Shipping</div>
                    <div className="text-base font-bold text-slate-900 font-serif">₹120 - ₹400</div>
                    <p className="text-[10px] text-slate-500 truncate">Based on Order Total</p>
                  </div>
                  <div className="rounded-lg border border-amber-300/80 bg-amber-50/70 p-3 text-center space-y-0.5 min-w-0">
                    <div className="text-amber-900 font-bold text-[10px] uppercase truncate">Dispatch Window</div>
                    <div className="text-base font-bold text-amber-950 font-serif">24 - 48 Hrs</div>
                    <p className="text-[10px] text-amber-800/80 truncate">Readymade items</p>
                  </div>
                </div>

                {/* Pincode Estimator Tool */}
                <div className="rounded-lg border border-amber-500/20 bg-amber-50/40 p-3 space-y-2 min-w-0 print:hidden">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-950 truncate">
                    <FiTruck className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                    <span className="truncate">Check Delivery Estimate for Your Pincode</span>
                  </div>
                  <form onSubmit={checkPincodeEstimator} className="flex flex-col sm:flex-row gap-2 min-w-0">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit Pincode (e.g. 110001)"
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-none min-w-0"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-amber-500 font-bold text-slate-950 hover:bg-amber-600 shrink-0 cursor-pointer min-h-[34px]"
                    >
                      Calculate
                    </Button>
                  </form>

                  {pincodeResult && (
                    <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs min-w-0">
                      {pincodeResult.success ? (
                        <div className="flex items-center justify-between text-slate-900 font-bold text-[11px] min-w-0">
                          <span className="truncate">Pincode {pincodeResult.pincode} &bull; {pincodeResult.zone}</span>
                          <span className="text-emerald-700 font-bold shrink-0">{pincodeResult.estimate}</span>
                        </div>
                      ) : (
                        <span className="text-rose-600 text-[11px]">{pincodeResult.message}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Delivery Matrix Table */}
                <div className="overflow-x-auto custom-scrollbar rounded-lg border border-slate-200/80 bg-white min-w-0 print:border-slate-300">
                  <table className="w-full text-left text-xs text-slate-800 min-w-[450px]">
                    <thead className="bg-slate-100/80 text-slate-900 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2.5">Destination Zone</th>
                        <th className="p-2.5">Regions Covered</th>
                        <th className="p-2.5">Estimated Delivery Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 text-[11px]">
                      {shippingZoneRates.map((z, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2.5 font-bold text-slate-900 whitespace-nowrap">{z.zone}</td>
                          <td className="p-2.5 text-slate-600">{z.regions}</td>
                          <td className="p-2.5 text-emerald-700 font-bold whitespace-nowrap">{z.deliveryTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <ul className="space-y-1.5 pt-1 text-[11px] min-w-0">
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="h-3.5 w-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Live AWB Tracking:</strong> Automated SMS and WhatsApp tracking links are dispatched immediately upon courier handover.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="h-3.5 w-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Damaged Box Protocol:</strong> Report transit damage within 48 hours with unboxing video proof for an immediate free replacement.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* SECTION 4: RETURN / REFUND / CANCELLATION */}
            <section
              id="returns"
              role="region"
              aria-label="Return Refund and Cancellation Policy"
              className="scroll-mt-36 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4 min-w-0 print:border-slate-300 print:shadow-none print:p-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700">
                    <FiRefreshCw className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-serif font-bold text-slate-900 truncate print:text-black">
                      4. Return, Refund &amp; Cancellation Policy
                    </h2>
                    <p className="text-[11px] text-slate-500 font-body truncate print:text-slate-700">
                      7-day return window, cancellation rules, exchange steps, and refund processing.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copySectionLink('returns')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-800 shrink-0 cursor-pointer print:hidden"
                  title="Copy section link"
                >
                  {copiedId === 'returns' ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-body min-w-0 print:text-black">
                {/* Process Timeline Card */}
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 space-y-2.5 min-w-0 print:bg-white print:border-slate-300">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-950 truncate">
                    Step-by-Step Return Workflow
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 min-w-0">
                    {returnTimelineSteps.map((step) => {
                      const StepIcon = step.icon;
                      return (
                        <div key={step.step} className="rounded-lg border border-slate-200/80 bg-white p-2.5 space-y-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-amber-700">{step.step}</span>
                            <StepIcon className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          </div>
                          <div className="font-bold text-slate-900 text-xs truncate">{step.title}</div>
                          <p className="text-[10px] text-slate-500 leading-tight">{step.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 min-w-0">
                  {/* Eligibility */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 space-y-1 min-w-0">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 truncate">
                      <FiCheckCircle className="text-emerald-600 shrink-0" /> Return &amp; Exchange Eligibility
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                      <li>Initiated within 7 days of package delivery.</li>
                      <li>Items must be unused, unwashed, and in original packaging.</li>
                      <li>Size exchange available free of cost for deity dresses.</li>
                    </ul>
                  </div>

                  {/* Non-Returnable */}
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 space-y-1 min-w-0">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 truncate">
                      <FiXCircle className="text-rose-600 shrink-0" /> Non-Returnable Items
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                      <li>Custom-tailored deity dresses made to specific measurements.</li>
                      <li>Opened sacred attar, perfume, or dhoop items.</li>
                      <li>Items showing signs of wear or altar use.</li>
                    </ul>
                  </div>
                </div>

                {/* Cancellation */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-50/60 p-3 text-xs text-slate-800 space-y-0.5 min-w-0">
                  <strong className="text-amber-950 font-bold block text-[11px]">Order Cancellation Rules:</strong>
                  <p className="text-[11px] text-slate-700">
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
              className="scroll-mt-36 rounded-xl border border-amber-500/30 bg-amber-50/30 p-4 sm:p-6 shadow-2xs space-y-4 min-w-0 print:border-slate-300 print:bg-white print:p-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700">
                    <FiMail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-serif font-bold text-slate-900 truncate print:text-black">
                      5. Contact Information &amp; Support Hours
                    </h2>
                    <p className="text-[11px] text-slate-500 font-body truncate print:text-slate-700">
                      Reach out directly to our dedicated customer support desk.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copySectionLink('contact')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-800 shrink-0 cursor-pointer print:hidden"
                  title="Copy section link"
                >
                  {copiedId === 'contact' ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-body min-w-0 print:text-black">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 min-w-0 print:grid-cols-3">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex flex-col items-center justify-center text-center rounded-lg border border-slate-200/80 bg-white p-3 hover:border-amber-500/50 transition-all space-y-1 group min-w-0 shadow-2xs"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 group-hover:scale-105 transition-transform shrink-0">
                      <FiMail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 w-full">
                      <div className="font-bold text-slate-900 text-xs truncate">Support Email</div>
                      <div className="text-slate-500 text-[10px] truncate">{siteConfig.email}</div>
                    </div>
                  </a>

                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex flex-col items-center justify-center text-center rounded-lg border border-slate-200/80 bg-white p-3 hover:border-amber-500/50 transition-all space-y-1 group min-w-0 shadow-2xs"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 group-hover:scale-105 transition-transform shrink-0">
                      <FiPhone className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 w-full">
                      <div className="font-bold text-slate-900 text-xs truncate">Helpline Phone</div>
                      <div className="text-slate-500 text-[10px] truncate">{siteConfig.phone}</div>
                    </div>
                  </a>

                  <a
                    href={siteConfig.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center text-center rounded-lg border border-emerald-300/80 bg-emerald-50/70 p-3 hover:border-emerald-400 transition-all space-y-1 group min-w-0 shadow-2xs"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform shrink-0">
                      <FaWhatsapp className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 w-full">
                      <div className="font-bold text-emerald-950 text-xs truncate">WhatsApp Helpdesk</div>
                      <div className="text-stone-600 text-[10px] truncate">Instant Assistance</div>
                    </div>
                  </a>
                </div>

                <div className="rounded-lg border border-slate-200/80 bg-white p-3 space-y-1.5 text-center sm:text-left sm:flex sm:items-center sm:justify-between min-w-0 shadow-2xs">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-xs flex items-center justify-center sm:justify-start gap-1.5 truncate">
                      <FiClock className="text-amber-700 shrink-0" /> Operational Support Hours
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Monday – Saturday: 9:00 AM – 7:00 PM IST (Closed Sundays &amp; National Holidays)</p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-center sm:text-right shrink-0">
                    <div className="font-bold text-slate-900 text-xs flex items-center justify-center sm:justify-end gap-1.5 truncate">
                      <FiMapPin className="text-amber-700 shrink-0" /> Store &amp; Studio Address
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQs Accordion */}
            <section className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4 min-w-0 print:border-slate-300 print:shadow-none print:p-4">
              <div className="border-b border-slate-100 pb-3 min-w-0">
                <h2 className="text-sm sm:text-base font-serif font-bold text-slate-900 flex items-center gap-2 truncate print:text-black">
                  <FiHelpCircle className="h-4 w-4 text-amber-700 shrink-0" />
                  Frequently Asked Legal &amp; Policy Questions
                </h2>
                <p className="text-[11px] text-slate-500 font-body mt-0.5 truncate print:text-slate-700">
                  Quick answers to common questions about your rights, orders, and data.
                </p>
              </div>

              <div className="space-y-2 min-w-0">
                {legalFaqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-200/80 bg-slate-50/70 overflow-hidden transition-colors min-w-0 print:bg-white print:border-slate-200"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between p-3 text-left text-xs font-semibold text-slate-900 hover:text-amber-900 transition-colors focus:outline-none cursor-pointer min-w-0 print:p-2"
                      >
                        <span className="pr-2 truncate print:whitespace-normal print:font-bold">{faq.q}</span>
                        <FiChevronDown
                          className={`h-4 w-4 shrink-0 text-amber-700 transition-transform duration-200 print:hidden ${isOpen ? 'rotate-180' : ''
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
                            className="px-3 pb-3 text-[11px] text-slate-600 leading-relaxed border-t border-slate-200/70 font-body print:p-2 print:text-black"
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
            <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-50 to-amber-100/50 p-4 text-center space-y-2 min-w-0 print:hidden">
              <h3 className="text-sm sm:text-base font-serif font-bold text-amber-950 truncate">
                Have Any Custom Policy Questions?
              </h3>
              <p className="text-xs text-slate-700 max-w-lg mx-auto font-body leading-relaxed">
                Our devotee helpdesk is always ready to assist you with order inquiries, custom sizing support, or return assistance.
              </p>
              <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
                <Link to={ROUTE_PATHS.CONTACT}>
                  <Button size="sm" className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 cursor-pointer min-h-[34px]">
                    Contact Support <FiChevronRight className="ml-1" />
                  </Button>
                </Link>
                <Link to={ROUTE_PATHS.SHOP}>
                  <Button size="sm" variant="outline" className="border-amber-900/20 text-amber-950 hover:bg-amber-100 cursor-pointer min-h-[34px]">
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
              className="fixed bottom-5 right-5 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 hover:bg-amber-600 focus:outline-none transition-all cursor-pointer print:hidden"
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
