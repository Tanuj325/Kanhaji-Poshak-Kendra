import { motion } from 'framer-motion';
import { siteConfig } from '@/config/siteConfig';
import { FiCheckCircle, FiSun, FiHeart } from 'react-icons/fi';

export default function OurStory() {
  return (
    <section className="py-20 bg-warm-cream/30 font-display border-b border-temple-gold/15">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Visual Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl border border-temple-gold/30 p-2.5 bg-white shadow-xl">
              <img
                src="/logo2.jpeg"
                alt="Sacred Craftsmanship Story"
                className="aspect-[4/5] w-full rounded-2xl object-cover sm:aspect-[4/3] lg:aspect-[5/6]"
              />
              <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 rounded-2xl bg-royal-blue text-white p-4 shadow-xl border border-white/20">
                <div className="h-12 w-12 rounded-xl bg-temple-gold/20 flex items-center justify-center text-temple-gold font-bold text-lg">
                  🙏
                </div>
                <div>
                  <p className="font-serif font-bold text-sm text-temple-gold">Authentic Vrindavan Heritage</p>
                  <p className="text-xs text-white/80">Pure Devotional Craft</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Story Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-temple-gold/15 border border-temple-gold/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-dark-charcoal">
              <FiSun className="h-3.5 w-3.5 text-temple-gold" />
              <span>Our Sacred Journey</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dark-charcoal tracking-tight leading-tight">
              Rooted in Faith, Crafted for <span className="text-royal-blue">Thakurji&apos;s Divine Grace</span>
            </h2>

            <p className="text-sm sm:text-base text-natural-wood leading-relaxed font-light">
              <strong className="text-dark-charcoal font-semibold">{siteConfig.name}</strong> was born out of a deep spiritual desire to provide devotees across India and the globe with authentic, hand-tailored, and divine attire for their home deities.
            </p>

            <p className="text-sm sm:text-base text-natural-wood leading-relaxed font-light">
              Our journey began with a simple mission: to preserve traditional Indian embroidery techniques—such as Zardozi, Gota Patti, Resham, and Pearl embellishments—while ensuring every garment fits Little Kanha with perfect comfort and majesty.
            </p>

            {/* Core Values Bullet List */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-temple-gold/20 shadow-xs">
                <FiCheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-dark-charcoal">Pure Fabric Selection</h4>
                  <p className="text-xs text-natural-wood mt-0.5">Velvet, pure silk, brocade & organic cottons</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-temple-gold/20 shadow-xs">
                <FiCheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-dark-charcoal">Artisan Tailoring</h4>
                  <p className="text-xs text-natural-wood mt-0.5">Hand-sewn with precision for sizes 0 to 12+</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-temple-gold/20 shadow-xs">
                <FiCheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-dark-charcoal">Seasonal Specialities</h4>
                  <p className="text-xs text-natural-wood mt-0.5">Janmashtami, Holi, Winter woollens & Daily Seva</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-temple-gold/20 shadow-xs">
                <FiCheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-dark-charcoal">Global Devotee Seva</h4>
                  <p className="text-xs text-natural-wood mt-0.5">Delivering sacred joy straight to your home doorstep</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
