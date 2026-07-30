import { motion } from 'framer-motion';
import { FiEye, FiTarget, FiHeart } from 'react-icons/fi';

const visionCards = [
  {
    icon: <FiEye className="h-7 w-7 text-royal-blue" />,
    badge: 'Our Vision',
    title: 'Elevating Devotional Aesthetics',
    description:
      'To become the world’s most trusted sanctuary for authentic deity attire, combining timeless Indian heritage with modern elegance so every home mandir shines with divine grandeur.',
  },
  {
    icon: <FiTarget className="h-7 w-7 text-temple-gold" />,
    badge: 'Our Mission',
    title: 'Pure Craftsmanship & Seva',
    description:
      'To handcraft every poshak, mukut, and bansuri with non-toxic, skin-safe, high-grade sacred materials while supporting traditional Indian master weavers and artisans.',
  },
  {
    icon: <FiHeart className="h-7 w-7 text-rose-600" />,
    badge: 'Our Values',
    title: 'Devotion, Quality & Honesty',
    description:
      'Built upon complete transparency, ethical pricing, and unconditional devotion. We treat every order not as a commercial item, but as sacred prasad for Kanha Ji.',
  },
];

export default function OurVision() {
  return (
    <section className="py-20 bg-white font-display">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="inline-block bg-temple-gold/15 text-dark-charcoal border border-temple-gold/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Guiding Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dark-charcoal tracking-tight">
            Vision, Mission & Core Devotional Values
          </h2>
          <p className="text-sm text-natural-wood font-light">
            The spiritual pillars that inspire our craftsmanship and guide our daily service to devotees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visionCards.map((card, idx) => (
            <motion.div
              key={card.badge}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="rounded-3xl bg-gradient-to-b from-white to-warm-cream/20 p-8 border border-temple-gold/25 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Subtle Corner Accent */}
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-temple-gold/10 to-transparent rounded-bl-full group-hover:scale-110 transition-transform" />

              <div className="h-14 w-14 rounded-2xl bg-white shadow-xs border border-temple-gold/20 flex items-center justify-center mb-6">
                {card.icon}
              </div>

              <span className="text-xs font-bold text-temple-gold uppercase tracking-wider font-mono">
                {card.badge}
              </span>

              <h3 className="font-serif text-xl font-bold text-dark-charcoal mt-1 mb-3">
                {card.title}
              </h3>

              <p className="text-xs sm:text-sm text-natural-wood leading-relaxed font-light">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
