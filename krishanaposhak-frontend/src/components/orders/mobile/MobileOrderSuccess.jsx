import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '@/utils/formatPrice';
import { buildPath, ROUTE_PATHS } from '@/routes/routePaths';
import { useFeaturedProducts } from '@/hooks/useProducts';
import {
  FiCheck,
  FiPackage,
  FiTruck,
  FiShoppingBag,
  FiChevronRight,
  FiCopy,
  FiGift,
  FiStar,
  FiMapPin,
  FiCheckCircle,
  FiArrowRight,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MobileOrderSuccess({ orderData }) {
  const navigate = useNavigate();
  const { data: featuredData } = useFeaturedProducts();
  const [copied, setCopied] = useState(false);

  const recommendedProducts = useMemo(() => {
    if (!featuredData) return [];
    return Array.isArray(featuredData)
      ? featuredData
      : featuredData?.data || featuredData?.content || [];
  }, [featuredData]);

  // Calculate estimated delivery dates (3 - 5 days from order date)
  const estimatedDeliveryText = useMemo(() => {
    const baseDate = orderData?.createdAt || orderData?.orderDate ? new Date(orderData.createdAt || orderData.orderDate) : new Date();
    const startDate = new Date(baseDate);
    startDate.setDate(startDate.getDate() + 3);
    const endDate = new Date(baseDate);
    endDate.setDate(endDate.getDate() + 5);

    const options = { month: 'short', day: 'numeric', weekday: 'short' };
    return `${startDate.toLocaleDateString('en-IN', options)} – ${endDate.toLocaleDateString('en-IN', options)}`;
  }, [orderData]);

  const handleCopyOrderNumber = () => {
    const numToCopy = orderData?.orderNumber || orderData?.id;
    if (numToCopy) {
      navigator.clipboard.writeText(String(numToCopy));
      setCopied(true);
      toast.success('Order number copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const orderId = orderData?.id || orderData?._id;
  const items = Array.isArray(orderData?.items) ? orderData.items : [];
  const itemCount = items.reduce((acc, curr) => acc + (curr.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-display flex flex-col justify-between selection:bg-amber-500/20">
      {/* Main Content Area (Mobile & Tablet Responsive Container) */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-5 pb-16">
        {/* ---------------------------------------------------- */}
        {/* 1. HERO SUCCESS CELEBRATION HEADER */}
        {/* ---------------------------------------------------- */}
        <section className="relative text-center pt-6 pb-7 px-4 rounded-3xl bg-gradient-to-b from-amber-900/10 via-amber-50/60 to-white border border-amber-900/10 shadow-sm overflow-hidden font-display">
          {/* Background Ambient Glow Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Large Animated Success Illustration & Badge */}
          <div className="relative inline-block mb-4 select-none">
            {/* Ripple Ring Effect */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.8, 1.25, 1], opacity: [0.4, 0.8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-emerald-500/20 border border-emerald-500/40"
            />

            {/* Main Icon Container */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-xl shadow-emerald-600/30 border-4 border-white"
            >
              {/* Divine Gift Package Illustration */}
              <div className="relative flex items-center justify-center">
                <FiGift className="w-12 h-12 sm:w-14 sm:h-14 text-white stroke-[1.5]" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md border-2 border-white"
                >
                  <FiCheck className="w-5 h-5 stroke-[3]" />
                </motion.div>
              </div>
            </motion.div>

            {/* Celebration Sparkle Badge */}
            <motion.div
              animate={{ y: [-2, 2, -2], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-3 bg-amber-400/90 text-amber-950 p-1.5 rounded-full shadow-xs text-xs font-bold"
            >
              ✨
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="space-y-1.5"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-950 text-xs font-extrabold border border-emerald-300/60 uppercase tracking-wider">
              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-700" /> Order Placed Successfully!
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-amber-950 tracking-tight pt-1">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-body max-w-md mx-auto leading-relaxed">
              Your order has been received and is being prepared with sacred care & devotion.
            </p>
          </motion.div>

          {/* Order Number Highlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mt-4 inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-900/10 shadow-xs"
          >
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Order ID:</span>
            <span className="font-heading font-black text-base sm:text-lg text-amber-950 font-mono tracking-wide">
              #{orderData?.orderNumber || (orderId ? 'KP-' + String(orderId).substring(0, 8) : 'CONFIRMED')}
            </span>
            <button
              type="button"
              onClick={handleCopyOrderNumber}
              className="p-1.5 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors border border-amber-300/40 active:scale-95 text-xs flex items-center gap-1 font-bold ml-1"
              title="Copy Order Number"
            >
              <FiCopy className="w-3.5 h-3.5 text-amber-800" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </motion.div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 2. ESTIMATED DELIVERY & TRACKING TIMELINE */}
        {/* ---------------------------------------------------- */}
        <section className="rounded-3xl bg-white border border-amber-900/10 p-4 sm:p-5 shadow-sm space-y-4 font-display">
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-100/90 text-amber-900 flex items-center justify-center shadow-2xs">
                <FiTruck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block">
                  Estimated Delivery
                </span>
                <h2 className="font-heading text-xs sm:text-sm font-extrabold text-amber-950">
                  {estimatedDeliveryText}
                </h2>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded-full border border-emerald-200">
              ⚡ On Schedule
            </span>
          </div>

          {/* Delivery Tracker Steps */}
          <div className="py-2">
            <div className="relative flex items-center justify-between text-center">
              {/* Connecting Line */}
              <div className="absolute top-4 left-6 right-6 h-1 bg-amber-100 -z-0">
                <div className="h-full w-1/4 bg-emerald-500 rounded-full transition-all duration-500" />
              </div>

              {/* Step 1: Confirmed */}
              <div className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md font-bold text-xs ring-4 ring-white">
                  <FiCheck className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-[10px] sm:text-xs font-extrabold text-amber-950">Confirmed</span>
              </div>

              {/* Step 2: Packing */}
              <div className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 border-2 border-amber-400 flex items-center justify-center shadow-xs font-bold text-xs">
                  <FiPackage className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-stone-600">Packing</span>
              </div>

              {/* Step 3: Shipped */}
              <div className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-400 border border-stone-200 flex items-center justify-center text-xs font-bold">
                  <FiTruck className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-stone-400">Shipped</span>
              </div>

              {/* Step 4: Delivered */}
              <div className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-400 border border-stone-200 flex items-center justify-center text-xs font-bold">
                  🏠
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-stone-400">Delivered</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 3. ORDER SUMMARY CARD */}
        {/* ---------------------------------------------------- */}
        {orderData && (
          <section className="rounded-3xl bg-white border border-amber-900/10 p-4 sm:p-5 shadow-sm space-y-3 font-display">
            <div className="flex items-center justify-between pb-2.5 border-b border-amber-900/10">
              <h3 className="font-heading text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-950">
                Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </h3>
              <span className="text-xs font-mono font-extrabold text-amber-950">
                {formatPrice(orderData.totalAmount || orderData.grandTotal || orderData.subTotal || 0)}
              </span>
            </div>

            {/* Item Thumbnails Row if present */}
            {items.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                {items.map((item, idx) => (
                  <div key={item.id || idx} className="relative w-12 h-12 rounded-xl bg-stone-100 border border-amber-900/10 overflow-hidden shrink-0">
                    <img
                      src={item.imageUrl || item.image || '/placeholder.png'}
                      alt={item.productName || item.title || 'Product'}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 bg-amber-950/80 text-amber-200 text-[9px] font-bold px-1 rounded-tl-md">
                      ×{item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Address snippet if available */}
            {(orderData.customerName || orderData.addressLine1) && (
              <div className="text-xs text-stone-600 space-y-0.5 pt-1 border-t border-amber-900/10">
                <p className="font-bold text-amber-950 flex items-center gap-1">
                  <FiMapPin className="w-3.5 h-3.5 text-amber-800" /> Deliver to: {orderData.customerName || 'Customer'}
                </p>
                <p className="text-[11px] text-stone-500 pl-4">
                  {orderData.addressLine1}{orderData.city ? `, ${orderData.city}` : ''}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ---------------------------------------------------- */}
        {/* 4. PRIMARY ACTION BUTTONS */}
        {/* ---------------------------------------------------- */}
        <section className="space-y-3 pt-1">
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => navigate(orderId ? `/account/orders/${orderId}` : ROUTE_PATHS.ORDERS)}
            className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 hover:from-amber-950 hover:to-stone-950 text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2.5 border border-amber-500/20 active:scale-98 transition-all min-h-[52px]"
          >
            <FiTruck className="w-4 h-4 text-amber-300" />
            <span>Track Order Status</span>
            <FiArrowRight className="w-4 h-4 text-amber-300 ml-1" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => navigate(ROUTE_PATHS.SHOP)}
            className="w-full h-[48px] rounded-2xl bg-white hover:bg-amber-50/50 text-amber-950 font-extrabold text-xs sm:text-sm shadow-xs border border-amber-900/20 flex items-center justify-center gap-2 active:scale-98 transition-all min-h-[48px]"
          >
            <FiShoppingBag className="w-4 h-4 text-amber-900" />
            <span>Continue Shopping</span>
          </motion.button>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 5. RECOMMENDED PRODUCTS CAROUSEL */}
        {/* ---------------------------------------------------- */}
        {recommendedProducts.length > 0 && (
          <section className="pt-4 space-y-3 font-display">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xs sm:text-sm font-extrabold text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
                  <FiStar className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>You Might Also Divine</span>
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">Handcrafted accessories & apparel</p>
              </div>
              <Link
                to={ROUTE_PATHS.SHOP}
                className="text-xs font-extrabold text-amber-900 hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Horizontal Scroll Carousel */}
            <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory">
              {recommendedProducts.slice(0, 6).map((product) => {
                const img = product.imageUrl || product.images?.[0]?.imageUrl || (typeof product.images?.[0] === 'string' ? product.images[0] : null) || '/placeholder.png';
                const pTitle = product.name || product.title || 'Divine Product';
                const pPrice = product.discountPrice || product.price || 0;

                return (
                  <div
                    key={product.id || product._id}
                    onClick={() => navigate(buildPath.product(product.slug || product.id))}
                    className="snap-start shrink-0 w-[145px] sm:w-[165px] bg-white border border-amber-900/10 rounded-2xl p-2.5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group select-none"
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-square w-full rounded-xl bg-stone-100 overflow-hidden border border-amber-900/5">
                        <img
                          src={img}
                          alt={pTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-heading text-xs font-bold text-amber-950 line-clamp-2 leading-snug">
                        {pTitle}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-amber-900/10 mt-2 flex items-center justify-between">
                      <span className="font-heading font-extrabold text-xs text-amber-950 font-mono">
                        {formatPrice(pPrice)}
                      </span>
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-950 flex items-center justify-center group-hover:bg-amber-900 group-hover:text-white transition-colors">
                        <FiChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
