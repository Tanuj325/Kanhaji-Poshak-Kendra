import { motion } from 'framer-motion';
import SEO from '@/components/common/SEO';
import { FiTool, FiClock, FiMail } from 'react-icons/fi';
import { siteConfig } from '@/config/siteConfig';

export default function MaintenancePage() {
  return (
    <>
      <SEO title="System Maintenance" description="We are currently undergoing scheduled maintenance to improve our service." />

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center bg-[#FAF7F2] font-display">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl mx-auto space-y-6 px-6 py-12 sm:py-16 rounded-3xl bg-gradient-to-b from-amber-50/90 via-white to-amber-50/40 border border-amber-900/10 shadow-[0_8px_30px_rgba(212,175,55,0.08)] relative overflow-hidden"
        >
          <div className="mx-auto h-20 w-20 rounded-2xl bg-amber-900 text-amber-50 flex items-center justify-center shadow-lg border border-amber-700/30">
            <FiTool className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300/50">
              ✦ Scheduled Seva Upgrades ✦
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-amber-950 pt-2">
              We Will Be Right Back
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-body">
              Our website is currently undergoing brief scheduled maintenance to bring you new artisanal collections and enhanced security.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-900/10 shadow-xs space-y-2 font-body text-xs text-stone-700">
            <div className="flex items-center justify-center gap-1.5 font-bold text-amber-950 font-display">
              <FiClock className="h-4 w-4 text-amber-800" />
              <span>Estimated Downtime: Under 30 Minutes</span>
            </div>
            <p>For urgent inquiries, email us at <a href={`mailto:${siteConfig.email}`} className="text-amber-900 font-bold hover:underline">{siteConfig.email}</a></p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
