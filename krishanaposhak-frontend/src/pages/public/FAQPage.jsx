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
  FiPhone,
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
    answer: 'Yes! We offer a 7-day hassle-free size exchange policy. Ensure the attire remains unused with original tags intact. Reach out to kanhajiposhak.support@gmail.com to initiate an exchange.',
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
        title="Help Center & FAQs - Frequently Asked Questions"
        description="Find answers to common questions about Laddu Gopal poshak sizes, shipping timelines, Razorpay payment security, and return policies at Krishna Poshak."
        canonicalUrl={canonicalUrl}
        jsonLd={faqSchemas}
      />

      <div className="min-h-screen bg-[#FAF7F2] font-display">
        <div className="container-page py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-5xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />

          {/* Banner Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300/40">
              ✦ Devotee Assistance Center ✦
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-950">
              Frequently Asked Questions
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-body">
              Everything you need to know about poshak sizes, ordering process, shipping timelines, and care instructions.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="max-w-xl mx-auto relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-800 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. shipping, sizes, returns, Razorpay)..."
              className="w-full rounded-2xl border border-amber-900/20 bg-white py-3.5 pl-12 pr-4 text-xs sm:text-sm font-bold text-amber-950 shadow-sm focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800/20 font-body transition-all"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide py-1 justify-start sm:justify-center">
            {faqCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 font-display min-h-[40px] ${isActive
                      ? 'bg-amber-900 text-amber-50 shadow-md border border-amber-800'
                      : 'bg-white text-stone-700 hover:bg-amber-50 border border-amber-900/10'
                    }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-amber-200' : 'text-amber-800'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Accordion Questions List */}
          <div className="space-y-3 pt-2">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl p-8 border border-amber-900/10 space-y-2">
                <p className="text-base font-bold text-amber-950">No matching questions found</p>
                <p className="text-xs text-stone-500 font-body">Try refining your search terms or selecting a different category.</p>
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className="rounded-2xl bg-white border border-amber-900/10 shadow-xs overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-amber-50/40 min-h-[52px]"
                    >
                      <span className="font-heading font-extrabold text-sm sm:text-base text-amber-950 pr-4">
                        {faq.question}
                      </span>
                      <FiChevronDown
                        className={`h-5 w-5 text-amber-800 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 text-xs sm:text-sm text-stone-700 font-body leading-relaxed border-t border-amber-900/10">
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

          {/* Need More Help Footer Card */}
          <div className="rounded-3xl bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 p-6 sm:p-8 text-white text-center space-y-4 shadow-xl">
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">Still Have Questions?</h3>
            <p className="text-xs sm:text-sm text-stone-300 font-body max-w-md mx-auto">
              Our devotional care team is available Monday to Saturday (10:00 AM - 8:00 PM IST) to assist with your order.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/contact">
                <Button variant="primary" size="md" leftIcon={<FiMail className="h-4 w-4 text-amber-200" />} className="rounded-xl bg-amber-600 text-amber-950 font-bold min-h-[44px]">
                  Contact Customer Care
                </Button>
              </Link>
              <a href={`tel:${siteConfig.phone}`}>
                <Button variant="outline" size="md" leftIcon={<FiPhone className="h-4 w-4 text-amber-300" />} className="rounded-xl border-white/20 text-white min-h-[44px] font-bold">
                  Call {siteConfig.phone}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
