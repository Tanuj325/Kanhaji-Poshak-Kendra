import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import RecommendedProducts from './RecommendedProducts';
import { FiShoppingBag, FiArrowRight, FiHeart } from 'react-icons/fi';

function EmptyCart() {
  return (
    <div className="space-y-10 py-6 font-display">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto text-center space-y-4 sm:space-y-5 px-4 sm:px-6 py-8 sm:py-14 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-50/90 via-white to-amber-50/50 border border-amber-900/10 shadow-[0_8px_30px_rgba(212,175,55,0.08)] relative overflow-hidden"
      >
        {/* Luxury Glow Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-300/20 to-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Custom Sacred Gold Shopping Bag SVG */}
        <div className="relative mx-auto w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-100 via-amber-200/60 to-amber-100 p-1 shadow-lg shadow-amber-500/10 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center border border-amber-300/50">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-amber-800 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        </div>

        <div className="space-y-2 relative z-10">
          <span className="text-[10px] sm:text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/80 px-2.5 sm:px-3 py-1 rounded-full border border-amber-300/50">
            ✦ Sacred Poshak Collection ✦
          </span>
          <h2 className="font-heading text-xl sm:text-3xl font-extrabold text-amber-950 pt-1 sm:pt-2">
            Your Cart is Waiting for Divine Attire
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-body">
            Discover handcrafted deity poshaks, regal mukuts, handcrafted jewelry, and spiritual accessories.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10 w-full">
          <Link to="/shop" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<FiShoppingBag className="h-5 w-5" />}
              rightIcon={<FiArrowRight className="h-5 w-5" />}
              className="w-full sm:w-auto flex justify-center items-center shadow-md hover:shadow-lg font-bold px-7 rounded-2xl min-h-[48px] bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white border border-amber-500/20"
            >
              Explore Collection
            </Button>
          </Link>
          <Link to="/account/wishlist" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<FiHeart className="h-5 w-5 text-amber-800" />}
              className="w-full sm:w-auto flex justify-center items-center font-bold px-6 rounded-2xl border-amber-900/20 text-amber-950 hover:bg-amber-50 min-h-[48px]"
            >
              View Saved Items
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Recommended Products Carousel */}
      <RecommendedProducts title="Recommended Divine Poshaks" limit={4} />
    </div>
  );
}

export default EmptyCart;
