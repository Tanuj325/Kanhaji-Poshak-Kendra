import { useState, useCallback, useEffect, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX, FiImage, FiAward } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import OptimizedImage from '@/components/ui/OptimizedImage';

const ImageGallery = memo(function ImageGallery({ images, productName }) {
  const sorted = [...(images || [])].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const mainImage = sorted.find((img) => img.isPrimary || img.thumbnail) || sorted[0];

  const [selectedIndex, setSelectedIndex] = useState(
    mainImage ? Math.max(0, sorted.indexOf(mainImage)) : 0,
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const touchStartRef = useRef(null);

  const current = sorted[selectedIndex] || sorted[0];
  const alt = current?.altText || productName || 'Sacred Poshak view';

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : sorted.length - 1));
  }, [sorted.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < sorted.length - 1 ? prev + 1 : 0));
  }, [sorted.length]);

  // Preload adjacent images
  useEffect(() => {
    if (sorted.length <= 1) return;
    const nextIdx = (selectedIndex + 1) % sorted.length;
    const prevIdx = (selectedIndex - 1 + sorted.length) % sorted.length;
    [sorted[nextIdx]?.imageUrl, sorted[prevIdx]?.imageUrl].forEach((url) => {
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, [selectedIndex, sorted]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, handleNext, handlePrev]);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  }, []);

  // Mobile swipe support
  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartRef.current = null;
  }, [handleNext, handlePrev]);

  if (!sorted.length) {
    return (
      <div className="flex aspect-[4/5] w-full flex-col items-center justify-center rounded-3xl bg-amber-50/40 border border-amber-900/10 p-6 text-center shadow-xs">
        <FiImage className="h-16 w-16 text-amber-800/30 mb-2" />
        <p className="text-xs font-bold text-amber-900/60 font-display">No product images available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-start w-full">
      {/* Desktop Vertical Thumbnails (Left Side) */}
      {sorted.length > 1 && (
        <div
          className="hidden lg:flex flex-col gap-2.5 w-16 xl:w-20 shrink-0 max-h-[380px] lg:max-h-[420px] overflow-y-auto scrollbar-none pr-1"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {sorted.map((img, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={img.id || index}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`View image ${index + 1}`}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'relative flex-shrink-0 aspect-square w-full overflow-hidden rounded-xl border-2 transition-all duration-200 bg-stone-50 focus:outline-none',
                  isSelected
                    ? 'border-[#C99A3B] ring-2 ring-[#C99A3B]/20 shadow-xs scale-[1.02]'
                    : 'border-slate-200/80 hover:border-slate-300 opacity-70 hover:opacity-100',
                )}
              >
                <img
                  src={img.imageUrl}
                  alt={img.altText || `Thumbnail ${index + 1}`}
                  className="h-full w-full object-contain object-center p-0.5"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="flex-1 flex flex-col gap-3 w-full min-w-0">
        <div
          className="group relative h-[320px] sm:h-[380px] lg:h-[440px] w-full cursor-pointer overflow-hidden rounded-2xl bg-stone-50 border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
          onClick={() => setIsFullscreen(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-label="Open fullscreen gallery"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsFullscreen(true);
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.imageUrl || selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full flex items-center justify-center p-3"
            >
              <OptimizedImage
                src={current?.imageUrl}
                alt={alt}
                objectFit="contain"
                fitMode="contain"
                width={800}
                height={800}
                className="h-full w-full object-contain object-center"
                loading="eager"
              />
            </motion.div>
          </AnimatePresence>

          {/* Handcrafted Ribbon */}
          <div className="absolute top-3 sm:top-4 left-0 z-20 flex items-center gap-1.5 bg-[linear-gradient(135deg,#0f2440,#1b3a5c_55%,#0d4f5e)] text-amber-100 px-3 sm:px-4 py-1 sm:py-1.5 rounded-r-xl shadow-md border-y border-r border-temple-gold/30 font-display text-[9px] min-[360px]:text-[10px] sm:text-xs font-bold tracking-wider uppercase">
            <FiAward className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-temple-gold shrink-0" />
            <span className="truncate">Handcrafted in Meerut</span>
          </div>

          {/* Lightbox Expand Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(true);
            }}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md text-amber-950 border border-amber-900/10 opacity-100 hover:scale-110 active:scale-95 transition-all min-h-[44px] min-w-[44px] md:opacity-0 md:group-hover:opacity-100"
            aria-label="Expand image fullscreen"
          >
            <FiMaximize2 className="h-4 w-4 text-amber-900" />
          </button>

          {/* Navigation Arrows */}
          {sorted.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 text-amber-950 shadow-md border border-amber-900/10 opacity-100 hover:scale-110 active:scale-95 transition-all min-h-[44px] min-w-[44px] md:opacity-0 md:group-hover:opacity-100"
                aria-label="Previous image"
              >
                <FiChevronLeft className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-amber-900" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 text-amber-950 shadow-md border border-amber-900/10 opacity-100 hover:scale-110 active:scale-95 transition-all min-h-[44px] min-w-[44px] md:opacity-0 md:group-hover:opacity-100"
                aria-label="Next image"
              >
                <FiChevronRight className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-amber-900" />
              </button>
            </>
          )}

          {/* Page Counter Badge */}
          {sorted.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-amber-950/80 backdrop-blur-md px-3.5 sm:px-4 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-amber-100 shadow-md font-mono border border-temple-gold/20">
              {selectedIndex + 1} / {sorted.length}
            </div>
          )}
        </div>

        {/* Mobile Horizontal Thumbnails Strip */}
        {sorted.length > 1 && (
          <div
            className="flex lg:hidden items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-thin scrollbar-thumb-amber-200"
            role="tablist"
            aria-label="Product image thumbnails"
          >
            {sorted.map((img, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={img.id || index}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`View image ${index + 1}`}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    'relative flex-shrink-0 h-14 w-14 min-[360px]:h-16 min-[360px]:w-16 sm:h-20 sm:w-20 overflow-hidden rounded-xl border-2 transition-all duration-200 bg-stone-100/50 focus:outline-none min-h-[44px] min-w-[44px]',
                    isSelected
                      ? 'border-amber-800 ring-2 ring-amber-700/30 scale-105 shadow-md'
                      : 'border-transparent hover:border-amber-600/40 opacity-60 hover:opacity-100',
                  )}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.altText || `Thumbnail ${index + 1}`}
                    className="h-full w-full object-contain object-center p-0.5"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-2xl p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen image viewer"
            onClick={() => setIsFullscreen(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Bar */}
            <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between text-amber-100">
              <span className="text-xs sm:text-sm font-bold text-amber-200 tracking-wide font-display truncate mr-4">
                {productName} ({selectedIndex + 1} / {sorted.length})
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all min-h-[44px] min-w-[44px] shrink-0"
                aria-label="Close fullscreen viewer"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Main Lightbox Image */}
            <div
              className="relative max-h-[85vh] max-w-[90vw] overflow-hidden flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={current?.imageUrl}
                alt={alt}
                className="max-h-[82vh] max-w-[88vw] object-contain rounded-2xl shadow-2xl border border-temple-gold/20"
              />
            </div>

            {/* Lightbox Nav Arrows */}
            {sorted.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md hover:bg-white/30 hover:scale-110 active:scale-95 transition-all min-h-[44px] min-w-[44px]"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="h-7 w-7 text-white" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md hover:bg-white/30 hover:scale-110 active:scale-95 transition-all min-h-[44px] min-w-[44px]"
                  aria-label="Next image"
                >
                  <FiChevronRight className="h-7 w-7 text-white" />
                </button>
              </>
            )}

            {/* Lightbox Thumbnail Strip */}
            {sorted.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-stone-900/60 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/10">
                {sorted.map((img, index) => (
                  <button
                    key={img.id || index}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(index);
                    }}
                    className={cn(
                      'h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden border-2 transition-all shrink-0',
                      index === selectedIndex
                        ? 'border-temple-gold scale-110 shadow-gold'
                        : 'border-transparent opacity-50 hover:opacity-100',
                    )}
                  >
                    <img src={img.imageUrl} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ImageGallery;
