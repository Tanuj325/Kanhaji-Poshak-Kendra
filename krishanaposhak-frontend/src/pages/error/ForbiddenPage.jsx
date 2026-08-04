import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/common/SEO';
import Button from '@/components/ui/Button';
import { FiLock, FiHome, FiShoppingBag } from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';

export default function ForbiddenPage() {
  return (
    <>
      <SEO title="403 - Access Forbidden" description="You do not have permission to access this page." />

      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-[#FAF7F2] font-display">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl mx-auto space-y-6 px-6 py-12 sm:py-16 rounded-3xl bg-gradient-to-b from-amber-50/90 via-white to-amber-50/40 border border-amber-900/10 shadow-[0_8px_30px_rgba(212,175,55,0.08)] relative overflow-hidden"
        >
          <div className="mx-auto h-20 w-20 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shadow-md border border-rose-200">
            <FiLock className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold text-rose-800 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              ✦ 403 Forbidden Access ✦
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-amber-950 pt-2">
              Access Restricted
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-body">
              You do not have permission to view this page. Please log in with appropriate credentials or return to the main store.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to={ROUTE_PATHS.HOME} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<FiHome className="h-5 w-5 text-amber-200" />}
                className="w-full sm:w-auto font-bold px-7 rounded-2xl min-h-[48px] bg-amber-900 text-white"
              >
                Return to Home
              </Button>
            </Link>
            <Link to={ROUTE_PATHS.SHOP} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<FiShoppingBag className="h-5 w-5 text-amber-800" />}
                className="w-full sm:w-auto font-bold px-6 rounded-2xl border-amber-900/20 text-amber-950 hover:bg-amber-50 min-h-[48px]"
              >
                Explore Collection
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
