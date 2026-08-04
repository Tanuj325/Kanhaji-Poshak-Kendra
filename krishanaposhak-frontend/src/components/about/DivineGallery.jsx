import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiSun } from 'react-icons/fi';

const DivineGallery = memo(function DivineGallery() {
  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2] font-display border-t border-amber-900/10">
      <div className="container-page max-w-6xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/40">
            ✦ Sacred Gallery ✦
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-amber-950">
            Artisanal Grace in Every Stitch
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl overflow-hidden border border-amber-900/10 shadow-xs bg-white p-2"
          >
            <img src="/logo1.jpeg" alt="Deity Poshak Collection" className="w-full h-64 object-cover rounded-2xl" />
            <div className="p-3">
              <p className="font-bold text-amber-950 text-sm">Heavy Zari Velvet Poshaks</p>
              <p className="text-xs text-stone-500 font-body">Designed for Janmashtami & Festivals</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl overflow-hidden border border-amber-900/10 shadow-xs bg-white p-2"
          >
            <img src="/logo1.jpeg" alt="Mukut & Shringar Accessories" className="w-full h-64 object-cover rounded-2xl" />
            <div className="p-3">
              <p className="font-bold text-amber-950 text-sm">Regal Mukuts & Pearl Crowns</p>
              <p className="text-xs text-stone-500 font-body">Hand-set Kundan stones & pearls</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl overflow-hidden border border-amber-900/10 shadow-xs bg-white p-2 sm:col-span-2 lg:col-span-1"
          >
            <img src="/logo1.jpeg" alt="Sacred Seva Accessories" className="w-full h-64 object-cover rounded-2xl" />
            <div className="p-3">
              <p className="font-bold text-amber-950 text-sm">Daily Seva Cotton & Silk Wear</p>
              <p className="text-xs text-stone-500 font-body">Soft breathable fabrics for daily worship</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default DivineGallery;
