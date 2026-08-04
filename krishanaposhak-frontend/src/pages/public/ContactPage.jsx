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
  FiExternalLink,
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
        title="Contact Us - Devotee Support & Inquiries"
        description="Get in touch with Krishna Poshak Kendra Meerut. Contact us via phone, email, WhatsApp, or send a message for custom deity poshak orders."
        canonicalUrl={canonicalUrl}
        jsonLd={contactSchemas}
      />

      <div className="min-h-screen bg-[#FAF7F2] font-display">
        <div className="container-page py-6 sm:py-8 space-y-6 sm:space-y-8">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header Banner */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300/40">
              ✦ Devotee Care & Support ✦
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-950">
              We Are Here to Assist Your Seva
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-body">
              Have questions regarding poshak sizes, custom order requirements, or delivery status? Reach out to our Meerut team anytime.
            </p>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-5 space-y-4">
              {/* Store Address Card */}
              <div className="rounded-3xl bg-white border border-amber-900/10 p-5 sm:p-6 shadow-[0_4px_20px_rgba(44,40,36,0.03)] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0">
                    <FiMapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-amber-950">Main Store & Workshop</h3>
                    <p className="text-xs text-stone-500 font-body">Heritage Handcraft Center</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 font-body leading-relaxed pl-1">
                  {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} — {siteConfig.address.country}
                </p>
                <a
                  href="https://maps.google.com/?q=Meerut+Uttar+Pradesh+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:underline pt-1"
                >
                  <span>View on Google Maps</span>
                  <FiExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Phone & Email Card */}
              <div className="rounded-3xl bg-white border border-amber-900/10 p-5 sm:p-6 shadow-[0_4px_20px_rgba(44,40,36,0.03)] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0">
                    <FiPhone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-amber-950">Direct Contact</h3>
                    <p className="text-xs text-stone-500 font-body">Call or Email our Helpline</p>
                  </div>
                </div>

                <div className="space-y-2 pt-1 font-body text-xs sm:text-sm">
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex items-center gap-2 text-amber-950 font-bold hover:text-amber-800 font-mono min-h-[38px]"
                  >
                    <FiPhone className="h-4 w-4 text-amber-800" />
                    <span>{siteConfig.phone}</span>
                  </a>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-center gap-2 text-stone-700 font-semibold hover:text-amber-800 min-h-[38px]"
                  >
                    <FiMail className="h-4 w-4 text-amber-800" />
                    <span>{siteConfig.email}</span>
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="rounded-3xl bg-white border border-amber-900/10 p-5 sm:p-6 shadow-[0_4px_20px_rgba(44,40,36,0.03)] space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0">
                    <FiClock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-amber-950">Store Hours</h3>
                    <p className="text-xs text-stone-600 font-body">Monday - Saturday: 10:00 AM - 8:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white border border-amber-900/10 p-6 sm:p-8 shadow-[0_4px_24px_rgba(44,40,36,0.04)] space-y-6">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-amber-950 flex items-center gap-2">
                    <FiMessageSquare className="h-5 w-5 text-amber-800" />
                    <span>Send Us a Direct Message</span>
                  </h2>
                  <p className="text-xs text-stone-500 font-body">
                    Fill in your details below and our team will get back to you within 24 business hours.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3"
                    >
                      <div className="h-12 w-12 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                        <FiCheckCircle className="h-6 w-6" />
                      </div>
                      <h3 className="font-heading font-extrabold text-lg text-emerald-950">
                        Thank You! Your Message Has Been Sent
                      </h3>
                      <p className="text-xs sm:text-sm text-emerald-800 font-body max-w-sm mx-auto">
                        Our devotional care executive will review your message and reply via email or phone shortly.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSubmitted(false)}
                        className="rounded-xl border-emerald-300 text-emerald-900 min-h-[40px] font-bold"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Your Full Name *"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Priyanshu Sharma"
                          required
                          className="rounded-xl"
                        />
                        <Input
                          label="Email Address *"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@domain.com"
                          required
                          className="rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Mobile Phone Number"
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                          className="rounded-xl"
                        />
                        <Input
                          label="Subject / Order Ref *"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="e.g. Size advice or Order Inquiry"
                          required
                          className="rounded-xl"
                        />
                      </div>

                      <Textarea
                        label="Your Message or Inquiry *"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please write your questions or custom order details here..."
                        rows={4}
                        required
                        className="rounded-xl"
                      />

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={submitContact.isPending}
                        leftIcon={<FiSend className="h-4 w-4 text-amber-200" />}
                        className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white font-bold py-4 px-8 text-sm shadow-md min-h-[48px] border border-amber-500/20"
                      >
                        Submit Message
                      </Button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
