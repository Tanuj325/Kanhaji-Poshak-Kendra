import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiShield, FiTruck, FiUsers, FiAward } from 'react-icons/fi';

const features = [
  {
    icon: <FiAward className="h-6 w-6 text-temple-gold" />,
    title: '100% Handcrafted Perfection',
    description: 'Every poshak is meticulously stitched and detailed by skilled Indian artisans using Zardozi, Gota & Resham work.',
  },
  {
    icon: <FiShield className="h-6 w-6 text-royal-blue" />,
    title: 'Pure & Skin-Safe Fabrics',
    description: 'We use ultra-soft, premium silks, velvet, and cotton that gentle touch the deity without causing fraying.',
  },
  {
    icon: <FiPackage className="h-6 w-6 text-emerald-600" />,
    title: 'Sacred Protective Packaging',
    description: 'All items are carefully sanitized and wrapped in protective eco-friendly box packaging before shipping.',
  },
  {
    icon: <FiTruck className="h-6 w-6 text-sky-600" />,
    title: 'Express Worldwide Shipping',
    description: 'Fast, trackable delivery to all pin codes across India and international devotee destinations.',
  },
  {
    icon: <FiUsers className="h-6 w-6 text-purple-600" />,
    title: 'Trusted Devotee Seva',
    description: 'Thousands of happy families trust Kanhaji Poshak Kendra for daily seva and festival celebrations.',
  },
  {
    icon: <FiCheckCircle className="h-6 w-6 text-amber-600" />,
    title: 'Secure Online Payments',
    description: '100% encrypted Razorpay gateway supporting UPI, Credit/Debit Cards, NetBanking, and Cash on Delivery.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-warm-cream/20 via-white to-warm-cream/20 font-display">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="inline-block bg-royal-blue/10 text-royal-blue border border-royal-blue/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dark-charcoal tracking-tight">
            The Kanhaji Poshak Kendra Standard
          </h2>
          <p className="text-sm text-natural-wood font-light">
            Craftsmanship, purity, and sacred dedication that sets our divine garments apart.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="rounded-3xl bg-white p-6 border border-temple-gold/20 shadow-xs hover:shadow-lg hover:border-temple-gold/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-dark-charcoal">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-natural-wood leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
