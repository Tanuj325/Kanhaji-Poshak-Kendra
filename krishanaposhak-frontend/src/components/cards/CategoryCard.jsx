import { memo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import Card from '@/components/ui/Card';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { FiArrowRight } from 'react-icons/fi';

const CategoryCard = memo(function CategoryCard({
  category,
  className,
}) {
  if (!category) return null;

  const { name, slug, image, description, productCount } = category;
  const imageUrl = typeof image === 'string' ? image : image?.imageUrl || image?.url || null;

  return (
    <Link to={`/category/${slug || ''}`} className="block h-full font-display">
      <Card
        variant="default"
        padding="none"
        isHoverable
        className={cn(
          'group relative flex flex-col h-full overflow-hidden rounded-[20px] sm:rounded-[30px] border border-amber-900/15 bg-white shadow-[0_8px_30px_rgba(44,40,36,0.06)] hover:shadow-[0_20px_50px_rgba(44,40,36,0.16)] hover:border-amber-500/60 transition-all duration-500 backdrop-blur-sm',
          className,
        )}
      >
        {/* Luxury Gold Foil Top Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" />

        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[linear-gradient(180deg,rgba(250,247,242,0.9),rgba(242,235,223,0.7))]">
          {imageUrl ? (
            <OptimizedImage
              src={imageUrl}
              alt={name || 'Category'}
              loading="lazy"
              aspectRatio="aspect-[4/3]"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100/80 to-amber-50/50">
              <span className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-950 group-hover:scale-110 transition-transform">
                {name ? name.charAt(0).toUpperCase() : 'C'}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/70 via-amber-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

          {productCount !== undefined && (
            <span className="absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full bg-stone-950/90 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-xs font-extrabold text-amber-300 border border-amber-500/40 backdrop-blur-md font-mono shadow-md z-20">
              {productCount} Items
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 p-3 sm:p-4 lg:p-5 text-center justify-between font-display bg-white relative">
          <div>
            <h3 className="font-heading text-sm sm:text-base lg:text-lg font-extrabold text-amber-950 group-hover:text-amber-800 transition-colors line-clamp-1">
              {name}
            </h3>
            {description && (
              <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-stone-600 line-clamp-2 leading-relaxed font-body">
                {description}
              </p>
            )}
          </div>

          <div className="mt-2.5 sm:mt-3.5 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm font-extrabold text-amber-950 group-hover:text-amber-900 transition-colors pt-2 sm:pt-3 border-t border-amber-900/10 font-display">
            <span>Explore</span>
            <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center group-hover:bg-amber-900 group-hover:text-amber-200 transition-colors shadow-xs">
              <FiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
});

export default CategoryCard;
