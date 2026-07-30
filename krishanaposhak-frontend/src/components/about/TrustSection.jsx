import { motion } from 'framer-motion';
import { FiCheckCircle, FiShield, FiHeart, FiSmile } from 'react-icons/fi';

export default function TrustSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-deep-navy via-royal-blue to-deep-navy text-white font-display relative overflow-hidden">
      <div className="container-page relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-4 space-y-1.5"
          >
            <div className="h-10 w-10 mx-auto rounded-full bg-temple-gold/20 flex items-center justify-center text-temple-gold mb-2">
              <FiCheckCircle className="h-5 w-5" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-temple-gold">100%</p>
            <p className="text-xs sm:text-sm font-semibold text-white">Authentic Vrindavan Heritage</p>
            <p className="text-[10px] text-white/60">Genuine Devotional Quality</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="px-4 space-y-1.5"
          >
            <div className="h-10 w-10 mx-auto rounded-full bg-temple-gold/20 flex items-center justify-center text-temple-gold mb-2">
              <FiShield className="h-5 w-5" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-temple-gold">Secure</p>
            <p className="text-xs sm:text-sm font-semibold text-white">Razorpay & COD Protected</p>
            <p className="text-[10px] text-white/60">100% Safe Payments</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="px-4 space-y-1.5"
          >
            <div className="h-10 w-10 mx-auto rounded-full bg-temple-gold/20 flex items-center justify-center text-temple-gold mb-2">
              <FiHeart className="h-5 w-5" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-temple-gold">Devotional</p>
            <p className="text-xs sm:text-sm font-semibold text-white">Skin-Safe & Pure Fabrics</p>
            <p className="text-[10px] text-white/60">Non-Fraying Silk & Velvet</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="px-4 space-y-1.5"
          >
            <div className="h-10 w-10 mx-auto rounded-full bg-temple-gold/20 flex items-center justify-center text-temple-gold mb-2">
              <FiSmile className="h-5 w-5" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-temple-gold">Pan-India</p>
            <p className="text-xs sm:text-sm font-semibold text-white">Doorstep Express Delivery</p>
            <p className="text-[10px] text-white/60">Fast Dispatch to All Pin Codes</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
