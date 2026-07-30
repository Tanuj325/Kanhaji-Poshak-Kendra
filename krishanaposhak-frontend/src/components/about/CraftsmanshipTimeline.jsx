import { motion } from 'framer-motion';
import { FiEdit3, FiScissors, FiCheckSquare, FiBox, FiSend } from 'react-icons/fi';

const steps = [
  {
    step: '01',
    title: 'Divine Design & Drape Sketching',
    subtitle: 'Conceptualizing Patterns & Colors',
    description: 'Our traditional designers sketch vibrant motifs inspired by Vrindavan flora, peacocks, and sacred temple iconography.',
    icon: <FiEdit3 className="h-5 w-5 text-temple-gold" />,
  },
  {
    step: '02',
    title: 'Hand Embroidery & Embellishment',
    subtitle: 'Zardozi, Gota Patti & Moti Work',
    description: 'Master artisans meticulously weave zari threads, sequins, pearls, and laces onto rich silk, velvet, and organza fabrics.',
    icon: <FiScissors className="h-5 w-5 text-royal-blue" />,
  },
  {
    step: '03',
    title: 'Precision Sizing & Tailoring',
    subtitle: 'Tailored for Size 0 to Size 12+',
    description: 'Every dress is custom cut and stitched with soft inner lining to ensure effortless draping on Thakurji.',
    icon: <FiCheckSquare className="h-5 w-5 text-emerald-600" />,
  },
  {
    step: '04',
    title: 'Quality Inspection & Finishing',
    subtitle: 'Zero Defects & Thread Trimming',
    description: 'A 10-point quality check ensures perfect hemlines, sturdy Velcro/thread ties, and flaw-free embroidery.',
    icon: <FiBox className="h-5 w-5 text-purple-600" />,
  },
  {
    step: '05',
    title: 'Sanitised Packaging & Delivery',
    subtitle: 'Wrapped in Love & Dispatched',
    description: 'Your sacred poshak is lovingly placed in protective eco-friendly boxes and shipped via express courier.',
    icon: <FiSend className="h-5 w-5 text-amber-600" />,
  },
];

export default function CraftsmanshipTimeline() {
  return (
    <section className="py-20 bg-white font-display border-t border-b border-temple-gold/15">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-block bg-temple-gold/15 text-dark-charcoal border border-temple-gold/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Our Craftsmanship
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dark-charcoal tracking-tight">
            5 Stages of Artisan Creation
          </h2>
          <p className="text-sm text-natural-wood font-light">
            From sketch to sacred delivery, discover how every dress is handcrafted with devotion.
          </p>
        </div>

        {/* Timeline Desktop Grid / Mobile Stack */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-temple-gold via-royal-blue to-temple-gold -translate-x-1/2 hidden sm:block" />

          <div className="space-y-12">
            {steps.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex flex-col sm:flex-row items-center gap-8 ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Step Card Content */}
                  <div className="w-full sm:w-1/2">
                    <div className="rounded-3xl bg-gradient-to-b from-white to-warm-cream/20 p-6 border border-temple-gold/25 shadow-md hover:shadow-lg transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-temple-gold px-2.5 py-1 rounded-lg bg-temple-gold/15 border border-temple-gold/30">
                          STAGE {item.step}
                        </span>
                        <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                          {item.icon}
                        </div>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-dark-charcoal pt-1">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-royal-blue">{item.subtitle}</p>

                      <p className="text-xs sm:text-sm text-natural-wood leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node Indicator */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white border-2 border-temple-gold shadow-md flex items-center justify-center font-bold text-xs text-amber-900 z-10 hidden sm:flex">
                    {item.step}
                  </div>

                  {/* Empty Spacer Column for Alignment */}
                  <div className="hidden sm:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
