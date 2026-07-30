import { motion } from 'framer-motion';
import { FiInstagram, FiHeart, FiEye } from 'react-icons/fi';

const galleryItems = [
  {
    id: 1,
    title: 'Divine Royal Velvet Poshak',
    category: 'Heavy Embroidered Seva',
    image: '/logo1.jpeg',
  },
  {
    id: 2,
    title: 'Handcrafted Zardozi Mukut & Shringar',
    category: 'Sacred Accessories',
    image: '/logo2.jpeg',
  },
  {
    id: 3,
    title: 'Festival Special Silk Collection',
    category: 'Janmashtami Special',
    image: '/logo3.jpeg',
  },
  {
    id: 4,
    title: 'Authentic Traditional Attire Collection',
    category: 'Daily Seva Wear',
    image: '/ogImage.jpeg',
  },
];

export default function DivineGallery() {
  return (
    <section className="py-20 bg-warm-cream/20 font-display">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block bg-temple-gold/15 text-dark-charcoal border border-temple-gold/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              Devotional Showcase
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dark-charcoal tracking-tight">
              Divine Gallery & Creations
            </h2>
            <p className="text-xs sm:text-sm text-natural-wood mt-1 font-light">
              Explore our handcrafted poshaks and shringar adornments crafted for Lord Krishna.
            </p>
          </div>

          <a
            href="https://www.instagram.com/kanhajiposhakkendra?igsh=eHlod205czhxaXli"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-white border border-temple-gold/30 px-4 py-2 text-xs font-bold text-dark-charcoal hover:bg-temple-gold/10 transition-colors shadow-2xs self-start md:self-auto"
          >
            <FiInstagram className="h-4 w-4 text-rose-600" />
            <span>Follow Us on Instagram</span>
          </a>
        </div>

        {/* Responsive Masonry/Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-temple-gold/30 bg-deep-navy shadow-lg hover:shadow-gold transition-all duration-300 min-h-[320px] flex flex-col justify-end"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-deep-navy">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85"
                />
              </div>

              {/* Permanent Dark Gradient Overlay for Maximum Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/80 to-transparent pointer-events-none" />

              {/* Always-Visible Card Text Content */}
              <div className="relative z-10 flex flex-col justify-end p-5 text-lotus-white space-y-1.5 transition-transform duration-300 group-hover:-translate-y-1">
                <span className="inline-self-start text-[10px] font-bold uppercase tracking-widest text-temple-gold bg-temple-gold/20 px-2.5 py-1 rounded-full border border-temple-gold/30 backdrop-blur-md w-max">
                  {item.category}
                </span>
                <h4 className="font-heading text-lg font-bold leading-snug text-lotus-white group-hover:text-temple-gold-light transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 pt-2 border-t border-white/20 text-xs text-muted-sand font-body">
                  <FiHeart className="h-3.5 w-3.5 text-temple-gold fill-temple-gold" />
                  <span>Handcrafted for Thakurji</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
