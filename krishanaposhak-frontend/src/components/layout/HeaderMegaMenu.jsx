import { useRef, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiGrid,
  FiTag,
  FiTruck,
  FiShield,
  FiStar,
  FiChevronRight,
  FiShoppingBag,
  FiGift,
  FiEye,
  FiLayers,
  FiBox,
} from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useActiveBanners } from '@/hooks/useBanners';
import OptimizedImage from '@/components/ui/OptimizedImage';

const CATEGORY_ICONS = [FiGift, FiEye, FiLayers, FiBox, FiShoppingBag, FiStar, FiTag, FiGrid];

const FALLBACK_BANNER = '/ogImage.jpeg';

/**
 * Premium mega menu.
 * Left: vertical category rail with icons.
 * Right: dynamic 4-column panel built from real backend root categories.
 * Bottom: promotional banner (real backend active banner) + trust strip.
 */
export default function HeaderMegaMenu({ categories = [], isOpen, onToggle, onClose }) {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [bannerIndex, setBannerIndex] = useState(0);

  const { data: banners } = useActiveBanners();
  const bannerList = useMemo(() => {
    const raw = Array.isArray(banners) ? banners : banners?.data || banners?.content || [];
    return raw.length ? raw : [{ imageUrl: FALLBACK_BANNER, title: 'Divine Collection', redirectUrl: ROUTE_PATHS.SHOP }];
  }, [banners]);

  const categoryList = useMemo(() => {
    const raw = Array.isArray(categories) ? categories : categories?.data || categories?.content || [];
    return raw.filter((c) => c.active !== false);
  }, [categories]);

  // Auto-cycle promo banner when mega menu is open
  useEffect(() => {
    if (!isOpen || bannerList.length <= 1) return;
    const t = setInterval(() => setBannerIndex((i) => (i + 1) % bannerList.length), 4000);
    return () => clearInterval(t);
  }, [isOpen, bannerList.length]);

  // Reset active category on open/close
  useEffect(() => {
    if (!isOpen) setActiveCategoryId(null);
  }, [isOpen]);

  // Close on outside click / Escape
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

  // Build 4 columns from categories (real data). If fewer than 4 categories,
  // fall back to a curated set aligned with the brand.
  const columns = useMemo(() => {
    if (categoryList.length >= 4) {
      return categoryList.slice(0, 4).map((cat, idx) => ({
        title: cat.name,
        slug: cat.slug,
        items: categoryList
          .slice(idx * 3, idx * 3 + 3)
          .map((c) => ({ label: c.name, slug: c.slug, id: c.id })),
        viewAllTo: cat.slug ? `/category/${cat.slug}` : `${ROUTE_PATHS.SHOP}?categoryId=${cat.id}`,
        icon: CATEGORY_ICONS[idx % CATEGORY_ICONS.length],
      }));
    }

    const curated = [
      {
        title: 'Laddu Gopal Dresses',
        items: [
          { label: 'Summer Collection', slug: null },
          { label: 'Winter Collection', slug: null },
          { label: 'Designer Collection', slug: null },
          { label: 'Daily Wear', slug: null },
        ],
        viewAllTo: ROUTE_PATHS.SHOP,
        icon: FiShoppingBag,
      },
      {
        title: 'Mukut',
        items: [
          { label: 'Designer Mukut', slug: null },
          { label: 'Stone Mukut', slug: null },
          { label: 'Traditional Mukut', slug: null },
          { label: 'Premium Mukut', slug: null },
        ],
        viewAllTo: ROUTE_PATHS.SHOP,
        icon: FiTag,
      },
      {
        title: 'Jewellery',
        items: [
          { label: 'Necklace', slug: null },
          { label: 'Payal', slug: null },
          { label: 'Bangles', slug: null },
          { label: 'Earrings', slug: null },
        ],
        viewAllTo: ROUTE_PATHS.SHOP,
        icon: FiGrid,
      },
      {
        title: 'Accessories',
        items: [
          { label: 'Pooja Items', slug: null },
          { label: 'Decoration', slug: null },
          { label: 'Chowki', slug: null },
          { label: 'Jhula', slug: null },
        ],
        viewAllTo: ROUTE_PATHS.SHOP,
        icon: FiStar,
      },
    ];
    return curated;
  }, [categoryList]);

  // Rail = real categories (or curated labels)
  const railItems = useMemo(() => {
    if (categoryList.length > 0) {
      return categoryList.slice(0, 8).map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        to: cat.slug ? `/category/${cat.slug}` : `${ROUTE_PATHS.SHOP}?categoryId=${cat.id}`,
        icon: CATEGORY_ICONS[Math.abs(cat.id || 0) % CATEGORY_ICONS.length],
      }));
    }
    return columns.map((c, i) => ({
      id: i,
      name: c.title,
      slug: null,
      to: c.viewAllTo,
      icon: c.icon,
    }));
  }, [categoryList, columns]);

  const activeRail = railItems.find((r) => r.id === activeCategoryId) || railItems[0];
  const activeColumn = columns.find((c) => c.title === activeRail?.name) || columns[0];

  const handleRailClick = (item) => {
    setActiveCategoryId(item.id);
    if (item.slug) {
      // If it's a real leaf category, navigate directly (keeps behavior snappy)
      navigate(item.to);
      onClose();
    }
  };

  const promoBanner = bannerList[bannerIndex % bannerList.length];

  return (
    <div className="relative" ref={containerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute left-0 top-full z-50 mt-2 w-[min(70rem,calc(100vw-1.5rem))] max-w-[calc(100vw-24px)] origin-top-left overflow-hidden rounded-[28px] border border-temple-gold/25 bg-white shadow-[0_28px_80px_rgba(15,36,64,0.3)]"
            role="dialog"
            aria-modal="false"
            aria-label="All categories mega menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-[linear-gradient(90deg,#0F2440,#1B3A5C)] px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-temple-gold/20 text-temple-gold-light">
                  <FiGrid className="h-4 w-4" />
                </span>
                <h3 className="font-display text-sm font-semibold text-lotus-white">
                  Divine Collections
                </h3>
                <span className="hidden rounded-full bg-temple-gold/20 px-2 py-0.5 text-[10px] font-bold text-temple-gold-light sm:inline">
                  {categoryList.length || columns.length} Categories
                </span>
              </div>
              <Link
                to={ROUTE_PATHS.SHOP}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-xs font-bold text-temple-gold-light transition-colors hover:text-white"
              >
                View Full Catalog <FiArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Body: rail + panel */}
            <div className="flex">
              {/* Left rail */}
              <div className="w-[15.5rem] shrink-0 border-r border-slate-100 bg-warm-cream/40 p-2">
                {railItems.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = item.id === activeRail?.id;
                  return (
                    <button
                      key={item.id ?? i}
                      type="button"
                      onClick={() => handleRailClick(item)}
                      className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-temple-gold/15 text-temple-gold-dark shadow-sm'
                          : 'text-dark-charcoal hover:bg-white hover:text-royal-blue'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                          isActive
                            ? 'border-temple-gold/40 bg-temple-gold/20 text-temple-gold-dark'
                            : 'border-slate-200 bg-white text-natural-wood group-hover:border-temple-gold/30 group-hover:text-temple-gold'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1 truncate">{item.name}</span>
                      <FiChevronRight
                        className={`h-3.5 w-3.5 transition-all ${
                          isActive ? 'text-temple-gold' : 'text-slate-300 group-hover:translate-x-0.5'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right panel */}
              <div className="relative min-w-0 flex-1 p-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeColumn?.title || 'panel'}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="grid grid-cols-2 gap-x-6 gap-y-5 xl:grid-cols-4"
                  >
                    {columns.map((col, ci) => (
                      <div key={ci}>
                        <div className="mb-2.5 flex items-center justify-between">
                          <h4 className="font-display text-[13px] font-bold text-deep-navy">
                            {col.title}
                          </h4>
                          <col.icon className="h-4 w-4 text-temple-gold" />
                        </div>
                        <ul className="space-y-1">
                          {col.items.map((item) => (
                            <li key={item.label}>
                              <Link
                                to={item.slug ? `/category/${item.slug}` : `${ROUTE_PATHS.SHOP}?categoryId=${col.id ?? ''}`}
                                onClick={onClose}
                                className="group flex items-center gap-1.5 py-1 text-xs text-natural-wood transition-colors hover:text-temple-gold-dark"
                              >
                                <span className="h-1 w-1 rounded-full bg-temple-gold/50 transition-all group-hover:w-2" />
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          to={col.viewAllTo}
                          onClick={onClose}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-temple-gold-dark transition-colors hover:text-royal-blue"
                        >
                          View All <FiArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Promo banner */}
                {promoBanner && (
                  <div className="relative mt-4 overflow-hidden rounded-2xl border border-temple-gold/20">
                    <div className="relative h-24 sm:h-28">
                      <OptimizedImage
                        src={promoBanner.imageUrl}
                        alt={promoBanner.title || 'Krishana Poshak promo'}
                        className="h-full w-full object-cover"
                        aspectRatio=""
                        loading="lazy"
                        width={800}
                        height={220}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,36,64,0.92),rgba(15,36,64,0.35),transparent)]" />
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <div className="max-w-[70%]">
                          {promoBanner.title && (
                            <p className="font-display text-sm font-bold text-lotus-white sm:text-base">
                              {promoBanner.title}
                            </p>
                          )}
                          {promoBanner.subtitle && (
                            <p className="mt-0.5 hidden text-[11px] text-temple-gold-light sm:block">
                              {promoBanner.subtitle}
                            </p>
                          )}
                          <Link
                            to={promoBanner.redirectUrl || ROUTE_PATHS.SHOP}
                            onClick={onClose}
                            className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-temple-gold px-3 py-1 text-[10px] font-bold text-white transition-colors hover:brightness-105"
                          >
                            Shop Now <FiArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 bg-warm-cream/30 px-5 py-3 sm:grid-cols-4">
              {[
                { icon: FiTruck, label: 'Free Shipping ₹999+' },
                { icon: FiShield, label: 'Secure Payments' },
                { icon: FiTag, label: 'Easy Returns' },
                { icon: FiStar, label: 'Premium Quality' },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-natural-wood">
                  <t.icon className="h-3.5 w-3.5 text-temple-gold" /> {t.label}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

