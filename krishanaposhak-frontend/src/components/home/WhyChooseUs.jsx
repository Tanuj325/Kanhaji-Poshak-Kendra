import { motion } from 'framer-motion';

const features = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: 'Handcrafted with Love',
    description:
      'Every piece is meticulously handcrafted by skilled artisans from Meerut, preserving centuries-old weaving traditions passed down through generations.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Timely Delivery',
    description:
      'We understand the importance of your special moments. Our dedicated team ensures your traditional wear reaches you on time, every time, anywhere in India.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0l4.5-4.5M3 16.5h18M16.5 3L21 7.5m0 0l-4.5 4.5M21 7.5H3" />
      </svg>
    ),
    title: 'Easy Exchanges',
    description:
      'Not the perfect fit? We offer hassle-free exchanges within 7 days. Your satisfaction is at the heart of everything we do at Krishana Poshak.',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Premium Quality',
    description:
      'We source the finest fabrics and materials, ensuring every garment meets our exacting standards of luxury, durability, and timeless beauty.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-[linear-gradient(180deg,#0f2440_0%,#081427_100%)]">
      <div className="container-page">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mb-10 text-center sm:mb-12"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-temple-gold">
            Why Krishana Poshak
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-lotus-white sm:text-4xl text-balance">
            Crafted with Tradition, <br />
            Worn with Pride
          </h2>
          <p className="mt-3 text-sm text-lotus-white/60 sm:text-base max-w-lg mx-auto">
            Every stitch tells a story of heritage, devotion, and the timeless beauty of Indian craftsmanship
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group rounded-[24px] border border-lotus-white/10 bg-lotus-white/5 p-6 text-center transition-all duration-300 hover:bg-lotus-white/10 hover:border-temple-gold/30"
            >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-temple-gold/10 text-temple-gold transition-colors group-hover:bg-temple-gold/20">
                {feature.icon}
              </div>
                <h3 className="font-display text-lg font-semibold text-lotus-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-lotus-white/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

