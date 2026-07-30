import { useState, useMemo } from 'react';
import SEO from '@/components/common/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Input from '@/components/forms/Input';
import Textarea from '@/components/forms/Textarea';
import Button from '@/components/ui/Button';
import { useSubmitContact } from '@/hooks/useContact';
import { siteConfig } from '@/config/siteConfig';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiMessageSquare,
  FiInstagram,
  FiFacebook,
  FiYoutube,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Contact Us' },
];

export default function ContactPage() {
  const submitContact = useSubmitContact();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const canonicalUrl = `${siteConfig.url}/contact`;

  const contactSchemas = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.ogImage}`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        contactType: 'customer support',
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
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
        { '@type': 'ListItem', position: 2, name: 'Contact Us', item: canonicalUrl },
      ],
    },
  ], [canonicalUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      return;
    }

    try {
      await submitContact.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phoneNumber: '', subject: '', message: '' });
    } catch (err) {
      console.error('Failed to submit contact message:', err);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us & Customer Support"
        description={`Contact ${siteConfig.name} support team for order inquiries, sizing assistance, and product customization.`}
        canonicalUrl={canonicalUrl}
        jsonLd={contactSchemas}
      />

      <section className="container-page section-padding space-y-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-temple-gold">Customer Care</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-dark-charcoal">
            We are Here to Help You
          </h1>
          <p className="text-sm text-natural-wood leading-relaxed">
            Have questions regarding your sacred attire order, custom sizing, or shipping? Reach out to our dedicated support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-muted-sand/20 shadow-xs space-y-6">
              <h2 className="font-display text-xl font-bold text-dark-charcoal border-b border-muted-sand/15 pb-3">
                Store & Support Info
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-warm-cream text-royal-blue shrink-0">
                    <FiMapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-dark-charcoal">Store Address</h3>
                    <p className="text-natural-wood mt-0.5 leading-relaxed">
                      {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state}, {siteConfig.address.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-warm-cream text-temple-gold shrink-0">
                    <FiMail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-dark-charcoal">Email Assistance</h3>
                    <a href={`mailto:${siteConfig.email}`} className="text-royal-blue font-medium hover:underline mt-0.5 block">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-warm-cream text-emerald-600 shrink-0">
                    <FiPhone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-dark-charcoal">Phone & Support</h3>
                    <a href={`tel:${siteConfig.phone}`} className="text-royal-blue font-medium hover:underline mt-0.5 block">
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-warm-cream text-purple-600 shrink-0">
                    <FiClock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-dark-charcoal">Operating Hours</h3>
                    <p className="text-natural-wood mt-0.5">Monday - Saturday: 9:30 AM - 7:30 PM IST</p>
                    <p className="text-natural-wood/80 text-[11px]">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-muted-sand/15">
                <h3 className="text-xs font-bold text-dark-charcoal mb-3">Connect With Us</h3>
                <div className="flex items-center gap-3">
                  {siteConfig.social.instagram && (
                    <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-warm-cream text-natural-wood hover:text-royal-blue transition-colors">
                      <FiInstagram className="h-4 w-4" />
                    </a>
                  )}
                  {siteConfig.social.facebook && (
                    <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-warm-cream text-natural-wood hover:text-royal-blue transition-colors">
                      <FiFacebook className="h-4 w-4" />
                    </a>
                  )}
                  {siteConfig.social.whatsapp && (
                    <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-warm-cream text-natural-wood hover:text-royal-blue transition-colors">
                      <FaWhatsapp className="h-4 w-4" />
                    </a>
                  )}
                  {siteConfig.social.youtube && (
                    <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-warm-cream text-natural-wood hover:text-royal-blue transition-colors">
                      <FiYoutube className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-muted-sand/20 shadow-xs">
              <h2 className="font-display text-xl font-bold text-dark-charcoal flex items-center gap-2 mb-2">
                <FiMessageSquare className="h-5 w-5 text-royal-blue" /> Send Us a Message
              </h2>
              <p className="text-xs text-natural-wood mb-6">
                Fill in the form below and our customer experience manager will respond within 24 hours.
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 text-center bg-warm-cream/40 rounded-xl border border-temple-gold/30 space-y-4"
                  >
                    <FiCheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
                    <h3 className="font-display text-xl font-bold text-dark-charcoal">
                      Message Received!
                    </h3>
                    <p className="text-xs text-natural-wood max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Krishna Poshak. We have logged your request and sent a confirmation to your email.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Your Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Radhika Sharma"
                        required
                      />
                      <Input
                        label="Email Address *"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. radhika@example.com"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                      />
                      <Input
                        label="Subject *"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. Order Inquiry #KP-1002"
                        required
                      />
                    </div>

                    <Textarea
                      label="Your Message *"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please details your question or inquiry..."
                      rows={5}
                      required
                    />

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        className="w-full sm:w-auto font-bold px-8"
                        isLoading={submitContact.isPending}
                        leftIcon={<FiSend className="h-4 w-4" />}
                      >
                        Submit Message
                      </Button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
