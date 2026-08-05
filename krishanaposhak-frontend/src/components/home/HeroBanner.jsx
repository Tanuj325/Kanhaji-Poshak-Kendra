import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useActiveBanners } from '@/hooks/useBanners';
import { cn } from '@/utils/cn';
import Skeleton from '@/components/ui/Skeleton';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { FiChevronLeft, FiChevronRight, FiArrowDown, FiStar, FiShoppingBag } from 'react-icons/fi';
import { siteConfig } from '@/config/siteConfig';

const SLIDE_DURATION = 5000;

const slideVariants = {
  enter: { opacity: 0, scale: 1.08 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function HeroBanner() {
  const { data: banners, isLoading, isError } = useActiveBanners();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const bannerList = Array.isArray(banners) ? banners : banners?.data || banners?.content || [];

  const goTo = useCallback((index) => {
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  const goNext = useCallback(() => {
    if (!bannerList.length) return;
    setCurrentIndex((prev) => (prev + 1) % bannerList.length);
    setProgress(0);
  }, [bannerList.length]);

  const goPrev = useCallback(() => {
    if (!bannerList.length) return;
    setCurrentIndex((prev) => (prev - 1 + bannerList.length) % bannerList.length);
    setProgress(0);
  }, [bannerList.length]);

  // Progress Bar & Auto-slider Timer
  useEffect(() => {
    if (bannerList.length <= 1 || isPaused) return;

    const interval = 50;
    const step = (interval / SLIDE_DURATION) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(100, prev + step);
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, [bannerList.length, isPaused, currentIndex]);

  useEffect(() => {
    if (progress >= 100 && bannerList.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % bannerList.length);
      setProgress(0);
    }
  }, [progress, bannerList.length]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      goPrev();
    } else if (e.key === 'ArrowRight') {
      goNext();
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      goNext();
    } else if (diff < -40) {
      goPrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const scrollToContent = () => {
    const el = document.getElementById('featured-categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="relative h-[min(55svh,36rem)] min-h-[24rem] sm:h-[65svh] sm:min-h-[28rem] lg:h-[85vh] w-full bg-deep-navy overflow-hidden">
        <Skeleton className="h-full w-full bg-deep-navy/80" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-page space-y-4 max-w-xl">
            <Skeleton className="h-6 w-40 bg-temple-gold/20 rounded-full" />
            <Skeleton className="h-12 w-full bg-lotus-white/10 rounded-xl" />
            <Skeleton className="h-6 w-3/4 bg-lotus-white/10 rounded-lg" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-36 bg-temple-gold/30 rounded-xl" />
              <Skeleton className="h-12 w-36 bg-lotus-white/10 rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !bannerList.length) {
    return (
      <section className="relative flex h-[min(55svh,36rem)] min-h-[24rem] sm:h-[65svh] sm:min-h-[28rem] lg:h-[82vh] items-center justify-center bg-deep-navy overflow-hidden select-none">
        <img
          src="/ogImage.jpeg"
          alt="Krishana Poshak Divine Attire Banner"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40 scale-105"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,36,64,0.96),rgba(15,36,64,0.7),rgba(15,36,64,0.96))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,36,64,0.9),transparent_42%,rgba(15,36,64,0.9))]" />

        <div className="text-center text-lotus-white px-4 relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-temple-gold/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-temple-gold backdrop-blur-md border border-temple-gold/30">
            <FiStar className="h-3.5 w-3.5" /> Authentic Meerut Craftsmanship
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-lotus-white sm:text-4xl lg:text-7xl leading-[1.15] drop-shadow-md text-balance">
            {siteConfig.name}
          </h1>
          <p className="mt-2 sm:mt-4 text-sm text-lotus-white/80 sm:text-lg lg:text-xl font-light leading-relaxed max-w-2xl mx-auto drop-shadow-xs font-body text-balance">
            Sacred Designer Poshaks, Laddoo Gopal Attire & Devotional Jewellery Crafted with Love & Reverence
          </p>
          <div className="mt-5 sm:mt-8 flex w-full justify-center gap-3 sm:gap-4 sm:w-auto">
            <Link
              to="/shop"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] px-6 py-3.5 text-sm font-bold text-dark-charcoal transition-all duration-300 hover:scale-[1.02] shadow-[0_14px_30px_rgba(201,154,59,0.22)] sm:w-auto sm:px-8"
            >
              <FiShoppingBag className="h-4 w-4" /> Explore Divine Collection
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const banner = bannerList[currentIndex];

  return (
    <section className="relative overflow-hidden bg-deep-navy font-display select-none">
      {/* ─── NEW MOBILE UI (<1024px - Full-width Edge-to-Edge Premium Banner) ─── */}
      <div className="block lg:hidden w-full overflow-hidden relative bg-stone-950">
        <div
          className="relative h-[185px] w-full overflow-hidden group select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id || currentIndex}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <OptimizedImage
                src={banner.imageUrl}
                alt={banner.title || 'Krishana Poshak Banner'}
                className="h-full w-full object-cover object-center"
                loading="eager"
                fetchpriority="high"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent pointer-events-none" />

          {/* Banner Content: Badge, Full Title, CTA Button */}
          <div className="absolute bottom-5 left-4 right-4 flex items-end justify-between gap-3 z-10">
            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-[9px] font-bold text-stone-950 bg-amber-400 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider shadow-xs">
                {banner.subtitle || 'Special Collection'}
              </span>
              <h1 className="text-[14px] font-semibold text-white tracking-tight leading-snug line-clamp-2 drop-shadow-md">
                {banner.title || siteConfig.name}
              </h1>
            </div>

            <Link
              to={banner.redirectUrl || '/shop'}
              className="inline-flex items-center gap-1 h-[25px] px-2.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-semibold active-tap-scale shrink-0 shadow-none"
            >
              <span>Shop Now</span>
              <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Bottom Running Timeline Progress Dots */}
          {bannerList.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center items-center gap-1.5 pointer-events-auto">
              {bannerList.map((_, i) => {
                const isActive = i === currentIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="p-1 focus:outline-none"
                  >
                    {isActive ? (
                      <div className="h-1.5 w-6 rounded-full bg-white/30 overflow-hidden relative">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-75 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-white/40 hover:bg-white/70 transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Running Timeline Edge Bar at Very Bottom */}
          {bannerList.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/15 z-20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ─── OLD DESKTOP UI (>=1024px - 100% UNTOUCHED) ─── */}
      <div 
        className="hidden lg:block relative h-[85vh] overflow-hidden"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id || currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <OptimizedImage
              src={banner.imageUrl}
              alt={banner.title || 'Krishana Poshak Banner'}
              className="h-full w-full object-cover object-center"
              loading={currentIndex === 0 ? 'eager' : 'lazy'}
              fetchpriority={currentIndex === 0 ? 'high' : 'auto'}
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,36,64,0.95),rgba(15,36,64,0.58),transparent)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,36,64,0.85),transparent_55%,rgba(15,36,64,0.85))]" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center p-0">
          <div className="container-page w-full">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-300 border border-white/20 mb-3">
                <FiStar className="h-3.5 w-3.5" /> Authentic Meerut Handloom
              </span>
              <h1 className="font-display text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
                {banner.title || siteConfig.name}
              </h1>
              {banner.subtitle && (
                <p className="mt-4 text-xl text-white/80 max-w-xl font-light leading-relaxed drop-shadow-xs">
                  {banner.subtitle}
                </p>
              )}
              <div className="mt-8 flex gap-4">
                <Link
                  to={banner.redirectUrl || '/shop'}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-8 text-sm font-bold text-stone-950 shadow-md"
                >
                  <span>Shop Collection</span>
                  <FiChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-md"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </div>

        {bannerList.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-20 hidden md:flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-lotus-white backdrop-blur-md transition-all duration-200 hover:bg-temple-gold hover:text-dark-charcoal hover:border-temple-gold focus-visible:outline-none shadow-[0_18px_36px_rgba(0,0,0,0.2)] sm:left-4 sm:h-12 sm:w-12"
              aria-label="Previous banner"
            >
              <FiChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-20 hidden md:flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-lotus-white backdrop-blur-md transition-all duration-200 hover:bg-temple-gold hover:text-dark-charcoal hover:border-temple-gold focus-visible:outline-none shadow-[0_18px_36px_rgba(0,0,0,0.2)] sm:right-4 sm:h-12 sm:w-12"
              aria-label="Next banner"
            >
              <FiChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {bannerList.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {bannerList.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  'relative h-2 rounded-full overflow-hidden transition-all duration-300',
                  i === currentIndex ? 'w-8 bg-white/30' : 'w-2 bg-white/40 hover:bg-white/70',
                )}
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Go to slide ${i + 1}`}
              >
                {i === currentIndex && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-amber-400"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={scrollToContent}
          className="absolute bottom-6 right-6 hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-lotus-white/70 hover:text-temple-gold transition-colors bg-black/30 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md"
        >
          <span>Scroll</span>
          <FiArrowDown className="h-4 w-4 animate-bounce text-temple-gold" />
        </button>
      </div>
    </section>
  );
}
