import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiFeather, FiScissors, FiStar, FiCheckCircle } from 'react-icons/fi';

const steps = [
  {
    step: '01',
    title: 'Fabric Selection & Sizing',
    description: 'We source high-grade velvet, raw silk, and organza fabrics suited for holy rituals.',
    icon: FiFeather,
  },
  {
    step: '02',
    title: 'Precision Hand-Cutting',
    description: 'Artisans measure and cut fabric strictly according to deity sizes (Size 0 to Size 6+).',
    icon: FiScissors,
  },
  {
    step: '03',
    title: 'Gold Zari & Kundan Ornamentation',
    description: 'Gold thread, sequins, and Kundan stones are meticulously embroidered by hand.',
    icon: FiStar,
  },
  {
    step: '04',
    title: 'Sanctified Quality Check & Dispatch',
    description: 'Final inspection, protective steam pressing, and express packaging for safe delivery.',
    icon: FiCheckCircle,
  },
];

const CraftsmanshipTimeline = memo(function CraftsmanshipTimeline() {
  return (
    <section className="py-14 sm:py-20 bg-white font-display">
      <div className="container-page max-w-6xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/40">
            ✦ The Artisan Workflow ✦
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-amber-950">
            Our 4-Step Craftsmanship Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative p-6 rounded-3xl bg-amber-50/50 border border-amber-900/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-black text-amber-900/30 font-mono">
                    {item.step}
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-amber-900 text-amber-50 flex items-center justify-center shadow-md">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="font-heading font-extrabold text-base text-amber-950">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-body">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default CraftsmanshipTimeline;
