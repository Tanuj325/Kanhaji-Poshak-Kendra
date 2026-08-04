import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/common/SEO';
import Button from '@/components/ui/Button';
import { FiAlertTriangle, FiHome, FiRefreshCw } from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';

export default function ServerErrorPage() {
  return (
    <>
      <SEO title="500 - Server Error" description="An unexpected server error occurred. Please try again." />

      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-[#FAF7F2] font-display">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl mx-auto space-y-6 px-6 py-12 sm:py-16 rounded-3xl bg-gradient-to-b from-amber-50/90 via-white to-amber-50/40 border border-amber-900/10 shadow-[0_8px_30px_rgba(212,175,55,0.08)] relative overflow-hidden"
        >
          <div className="mx-auto h-20 w-20 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-md border border-amber-300">
            <FiAlertTriangle className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300/50">
              ✦ 500 Server Error ✦
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-amber-950 pt-2">
              Server Is Temporarily Busy
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-body">
              An unexpected issue occurred on our server while processing your request. Please try refreshing or return to the main store.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.location.reload()}
              leftIcon={<FiRefreshCw className="h-5 w-5 text-amber-200" />}
              className="w-full sm:w-auto font-bold px-7 rounded-2xl min-h-[48px] bg-amber-900 text-white"
            >
              Refresh Page
            </Button>
            <Link to={ROUTE_PATHS.HOME} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<FiHome className="h-5 w-5 text-amber-800" />}
                className="w-full sm:w-auto font-bold px-6 rounded-2xl border-amber-900/20 text-amber-950 hover:bg-amber-50 min-h-[48px]"
              >
                Return Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
