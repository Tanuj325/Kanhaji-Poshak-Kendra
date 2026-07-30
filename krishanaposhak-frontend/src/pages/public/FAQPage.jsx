import { useState, useMemo } from 'react';
import SEO from '@/components/common/SEO';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Input from '@/components/forms/Input';
import Button from '@/components/ui/Button';
import { siteConfig } from '@/config/siteConfig';
import {
  FiHelpCircle,
  FiSearch,
  FiChevronDown,
  FiTruck,
  FiCreditCard,
  FiShield,
  FiRefreshCw,
  FiMail,
} from 'react-icons/fi';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Help Center & FAQs' },
];

const faqCategories = [
  { id: 'all', label: 'All Questions', icon: FiHelpCircle },
  { id: 'shipping', label: 'Shipping & Delivery', icon: FiTruck },
  { id: 'payments', label: 'Payments & Razorpay', icon: FiCreditCard },
  { id: 'attire', label: 'Poshak Care & Sizing', icon: FiShield },
  { id: 'returns', label: 'Exchanges & Returns', icon: FiRefreshCw },
];

const faqData = [
  {
    category: 'shipping',
    question: 'How long does shipping take within India?',
    answer: 'Standard shipping takes 3-5 business days across major metros. Express shipping options deliver within 48-72 hours. All orders include live tracking via SMS and email notifications.',
  },
  {
    category: 'shipping',
    question: 'Are shipping charges extra?',
    answer: 'We offer FREE delivery across India on all orders exceeding ₹8,000. For orders under ₹8,000, shipping charges are calculated as follows: ₹120 for orders under ₹2,000; ₹240 for orders between ₹2,000–₹3,999.99; and ₹400 for orders between ₹4,000–₹7,999.99.',
  },
  {
    category: 'payments',
    question: 'What payment methods are accepted on Krishna Poshak?',
    answer: 'We accept Credit/Debit Cards, Net Banking, UPI (Google Pay, PhonePe, Paytm), and Razorpay secure checkout. Cash on Delivery (COD) is available for select pincodes.',
  },
  {
    category: 'payments',
    question: 'Is my online payment safe and encrypted?',
    answer: 'Yes! All online payments are securely processed through Razorpay using PCI-DSS Level 1 256-bit SSL encryption. We never store your full card numbers or banking passwords.',
  },
  {
    category: 'attire',
    question: 'How do I select the right size for Laddu Gopal / Deity Poshak?',
    answer: 'Each product detail page contains an explicit Deity Size Guide (Size 0 to Size 6+). Measure your idol from shoulder to feet in inches or centimeters and refer to our chart before adding to cart.',
  },
  {
    category: 'attire',
    question: 'How should I wash and care for handcrafted embroidery attire?',
    answer: 'We recommend dry cleaning or gentle hand wash using mild silk shampoo in cold water. Do not wring or tumble dry. Dry flat in shade to preserve gold zari and threadwork vibrancy.',
  },
  {
    category: 'returns',
    question: 'Can I exchange a product if the size does not fit?',
    answer: 'Yes! We offer a 7-day hassle-free size exchange policy. Ensure the attire remains unused with original tags intact. Reach out to support@krishanaposhak.com to initiate an exchange.',
  },
  {
    category: 'returns',
    question: 'How do I cancel my order?',
    answer: 'You can cancel any order directly from your Account Dashboard under My Orders as long as the status is Pending or Confirmed before dispatch.',
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const toggleAccordion = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const canonicalUrl = `${siteConfig.url}/faq`;

  const faqSchemas = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
        { '@type': 'ListItem', position: 2, name: 'Help Center & FAQs', item: canonicalUrl },
      ],
    },
  ], [canonicalUrl]);

  return (
    <>
      <SEO
        title="Help Center & Frequently Asked Questions"
        description="Find answers to common questions about Krishna Poshak attire sizing, shipping times, payment methods, and exchange policies."
        canonicalUrl={canonicalUrl}
        jsonLd={faqSchemas}
      />

      <section className="container-page section-padding space-y-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-temple-gold">Knowledge Base</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-dark-charcoal">
            Help Center & Frequently Asked Questions
          </h1>
          <p className="text-sm text-natural-wood leading-relaxed">
            Everything you need to know about our handcrafted traditional attire, shipping times, and order support.
          </p>

          <div className="pt-2 max-w-md mx-auto">
            <Input
              leftIcon={<FiSearch className="h-4 w-4 text-natural-wood" />}
              placeholder="Search questions (e.g. shipping, sizing, payments)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {faqCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndex(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-royal-blue text-white border-royal-blue shadow-xs'
                    : 'bg-white text-natural-wood hover:text-dark-charcoal border-muted-sand/20'
                }`}
              >
                <Icon className="h-4 w-4" /> {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-3xl mx-auto space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-2xl border border-muted-sand/20 space-y-3">
              <FiHelpCircle className="h-10 w-10 text-natural-wood mx-auto" />
              <h3 className="font-display text-lg font-bold text-dark-charcoal">No answers found</h3>
              <p className="text-xs text-natural-wood">Try refining your search keyword or browse all categories.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-muted-sand/20 overflow-hidden transition-shadow hover:shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-sm text-dark-charcoal hover:text-royal-blue transition-colors"
                  >
                    <span>{faq.question}</span>
                    <FiChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 text-royal-blue ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-5 pt-0 text-xs leading-relaxed text-natural-wood border-t border-muted-sand/10">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Still Need Help Box */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-warm-cream/40 p-6 md:p-8 border border-temple-gold/30 text-center space-y-3">
          <h3 className="font-display text-xl font-bold text-dark-charcoal">
            Still Have Questions?
          </h3>
          <p className="text-xs text-natural-wood max-w-md mx-auto">
            Can't find the answer you're looking for? Reach out to our customer care team and we will assist you right away.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact">
              <Button variant="primary" size="sm" leftIcon={<FiMail className="h-4 w-4" />}>
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
