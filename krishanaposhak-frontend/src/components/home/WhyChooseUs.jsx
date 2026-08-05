import { motion } from 'framer-motion';

const features = [
  {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: 'Handcrafted with Love',
    description: 'Artisanal Meerut weaving traditions.',
  },
  {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Timely Delivery',
    description: 'Fast trackable Pan-India delivery.',
  },
  {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0l4.5-4.5M3 16.5h18M16.5 3L21 7.5m0 0l-4.5 4.5M21 7.5H3" />
      </svg>
    ),
    title: 'Easy Exchanges',
    description: 'Hassle-free 7-day exchanges.',
  },
  {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Premium Quality',
    description: 'Finest pure velvet, zari & fabrics.',
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
    <section className="py-4 lg:py-16 bg-[#0f2440] font-display">
      <div className="container-page">
        {/* ─── NEW MOBILE UI (<1024px) ─── */}
        <div className="block lg:hidden">
          <div className="mb-3 px-4">
            <span className="text-[9px] font-medium uppercase tracking-widest text-amber-300 block mb-0.5">
              Why Krishana Poshak
            </span>
            <h2 className="text-[16px] font-semibold text-white leading-tight">
              Crafted with Tradition, Worn with Pride
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5 px-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5 shadow-none transition-all duration-200 cursor-pointer hover:bg-white/10 active:bg-white/10"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300 shrink-0 border border-white/10 mt-0.5">
                  {feature.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[11px] font-semibold text-white leading-tight mb-0.5">
                    {feature.title}
                  </h3>
                  <p className="text-[10px] text-stone-300 font-normal leading-tight truncate group-hover:whitespace-normal group-hover:overflow-visible group-active:whitespace-normal group-active:overflow-visible font-body transition-all">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── OLD DESKTOP UI (>=1024px - 100% UNTOUCHED) ─── */}
        <div className="hidden lg:block">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="mb-5 text-center sm:mb-10 lg:mb-12 px-4 sm:px-0"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-amber-300 font-display">
              Why Krishana Poshak
            </span>
            <h2 className="mt-1 font-heading text-xl sm:text-3xl lg:text-4xl font-extrabold text-white text-balance">
              Crafted with Tradition, Worn with Pride
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-4 sm:px-0"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-6 text-left transition-all duration-300 hover:bg-white/15 hover:border-amber-400/30 shadow-md backdrop-blur-md active-tap-scale"
              >
                <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 shrink-0 border border-amber-400/30">
                  {feature.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xs sm:text-lg font-bold text-white leading-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-0.5 text-[10px] sm:text-sm leading-snug text-stone-300 line-clamp-1 sm:line-clamp-none font-body">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
