import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiSun } from 'react-icons/fi';

const OurStory = memo(function OurStory() {
  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] font-display">
      <div className="container-page max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image Showcase Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-amber-900/10 shadow-[0_8px_30px_rgba(44,40,36,0.06)] bg-white p-2">
              <img
                src="/logo1.jpeg"
                alt="Krishana Poshak Craftsmanship"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-900/10 shadow-lg space-y-1">
                <p className="text-xs font-extrabold text-amber-950 font-heading flex items-center gap-1.5">
                  <FiSun className="h-4 w-4 text-amber-700" /> Authentic Meerut Artisan Hub
                </p>
                <p className="text-[11px] text-stone-600 font-body">Handcrafted with pure devotional dedication.</p>
              </div>
            </div>
          </motion.div>

          {/* Story Text Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-5"
          >
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/40">
                ✦ Our Heritage Story ✦
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-amber-950 leading-tight">
                From Meerut's Sacred Looms to Devotees Nationwide
              </h2>
            </div>

            <p className="text-stone-700 text-sm sm:text-base font-body leading-relaxed">
              Founded in the historic city of Meerut, Krishna Poshak Kendra began with a single sacred vision: to provide high-quality, handcrafted deity garments that evoke deep spiritual reverence and aesthetic elegance.
            </p>

            <p className="text-stone-700 text-sm sm:text-base font-body leading-relaxed">
              Every dress, mukut, and shringar piece is individually created by master artisans who carry forward generations of zari embroidery, stone placement, and fabric tailoring techniques.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-amber-900/10 shadow-2xs">
                <FiCheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-amber-950">Pure Velvet & Heavy Silk Fabrics</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-amber-900/10 shadow-2xs">
                <FiCheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-amber-950">Hand-embroidered Gold Zari Work</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-amber-900/10 shadow-2xs">
                <FiCheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-amber-950">Custom Fits for Size 0 to Size 6+</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-amber-900/10 shadow-2xs">
                <FiCheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-amber-950">Direct Shipping Across All States</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default OurStory;
