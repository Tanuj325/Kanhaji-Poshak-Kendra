import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTE_PATHS, buildPath } from '@/routes/routePaths';
import { FiChevronDown, FiArrowRight, FiTag, FiGrid, FiCompass } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

export default function HeaderMegaMenu({ categories = [], isOpen, onToggle, onClose }) {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const categoryList = Array.isArray(categories)
    ? categories
    : categories?.data || categories?.content || [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative shrink-0" ref={containerRef}>
      {/* Trigger — Navbar Menu Link */}
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={onToggle}
        className={`relative text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors duration-200 py-1 flex items-center gap-1.5 whitespace-nowrap focus:outline-none focus:text-amber-300 ${
          isOpen ? 'text-amber-300' : 'text-slate-300 hover:text-white'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Browse Collections Mega Menu"
      >
        <FiGrid className="h-3.5 w-3.5 text-amber-400" />
        <span>Categories</span>
        <FiChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-300' : 'text-amber-400/60'
          }`}
        />
        {isOpen && (
          <motion.span
            layoutId="activeNavIndicator"
            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-amber-400 rounded-full"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </button>

      {/* Mega Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 top-full z-50 mt-3 w-[560px] max-w-[calc(100vw-32px)] rounded-2xl bg-[#0B1728]/98 backdrop-blur-2xl border border-amber-400/30 p-5 shadow-2xl font-display space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
                  <FiCompass className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Divine Collections
                  </h3>
                  <p className="text-[10px] text-slate-400">Explore authentic deity attire & accessories</p>
                </div>
              </div>
              <span className="text-[10px] rounded-full bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 font-mono font-bold text-amber-300">
                {categoryList.length} Categories
              </span>
            </div>

            {/* Category Grid */}
            {categoryList.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <HiSparkles className="h-6 w-6 text-amber-400/40 mx-auto" />
                <p>Loading divine collections...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
                {categoryList.map((cat) => (
                  <Link
                    key={cat.id || cat.slug}
                    to={cat.slug ? buildPath.category(cat.slug) : `${ROUTE_PATHS.SHOP}?category=${cat.id}`}
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-xl p-2.5 bg-white/[0.02] border border-white/5 hover:bg-amber-400/10 hover:border-amber-400/30 transition-all"
                  >
                    <div className="h-9 w-9 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 text-xs font-bold group-hover:bg-amber-400 group-hover:text-black transition-all shrink-0">
                      {cat.name ? cat.name.charAt(0).toUpperCase() : 'P'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-amber-300 truncate transition-colors">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {cat.productCount !== undefined ? `${cat.productCount} items` : 'Explore Attire'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Footer Quick Links */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <Link
                to={ROUTE_PATHS.SHOP}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white transition-colors"
              >
                <span>Browse Full Catalog</span>
                <FiArrowRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-[10px] text-slate-400">100% Handcrafted Meerut Seva</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
