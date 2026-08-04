import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiTarget, FiHeart } from 'react-icons/fi';

const OurVision = memo(function OurVision() {
  return (
    <section className="py-14 sm:py-20 bg-white font-display">
      <div className="container-page max-w-5xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/40">
            ✦ Purpose & Seva ✦
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-amber-950">
            Guided by Devotion, Driven by Artistry
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/80 to-stone-50 border border-amber-900/10 shadow-[0_4px_20px_rgba(44,40,36,0.03)] space-y-4"
          >
            <div className="h-12 w-12 rounded-2xl bg-amber-900 text-amber-50 flex items-center justify-center shadow-md">
              <FiTarget className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-amber-950">Our Mission</h3>
            <p className="text-stone-700 text-sm leading-relaxed font-body">
              To preserve authentic Indian handcrafting traditions and bring sacred deity poshaks directly from artisan looms to devotees across India with transparent pricing and uncompromised quality.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/80 to-stone-50 border border-amber-900/10 shadow-[0_4px_20px_rgba(44,40,36,0.03)] space-y-4"
          >
            <div className="h-12 w-12 rounded-2xl bg-amber-900 text-amber-50 flex items-center justify-center shadow-md">
              <FiEye className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-amber-950">Our Vision</h3>
            <p className="text-stone-700 text-sm leading-relaxed font-body">
              To be India's most trusted online destination for devotional seva garments, setting the luxury benchmark for traditional craftsmanship, customer satisfaction, and cultural preservation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default OurVision;
