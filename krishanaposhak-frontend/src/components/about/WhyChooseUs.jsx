import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiShield, FiTruck, FiRefreshCw, FiHeart, FiStar } from 'react-icons/fi';

const features = [
  {
    icon: FiAward,
    title: 'Pure Zari & Silk Embroidery',
    description: 'Every dress is crafted using authentic gold thread, Kundan stones, and premium velvet.',
  },
  {
    icon: FiShield,
    title: '100% Quality Assured',
    description: 'Thorough multi-point quality inspection before every order is packaged and dispatched.',
  },
  {
    icon: FiTruck,
    title: 'Nationwide Express Shipping',
    description: 'Free shipping on orders above ₹8,000 with live SMS tracking across all Indian states.',
  },
  {
    icon: FiRefreshCw,
    title: '7-Day Easy Exchange',
    description: 'Hassle-free size exchange guarantee if your deity attire fit needs adjustment.',
  },
];

const WhyChooseUs = memo(function WhyChooseUs() {
  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] font-display border-t border-amber-900/10">
      <div className="container-page max-w-6xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/40">
            ✦ The Meerut Difference ✦
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-amber-950">
            Why Devotees Trust Krishna Poshak
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-amber-900/10 shadow-[0_4px_20px_rgba(44,40,36,0.03)] space-y-3 hover:border-amber-700/30 transition-all hover:-translate-y-1"
              >
                <div className="h-10 w-10 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-extrabold text-base text-amber-950 leading-snug">
                  {feat.title}
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-body">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default WhyChooseUs;
