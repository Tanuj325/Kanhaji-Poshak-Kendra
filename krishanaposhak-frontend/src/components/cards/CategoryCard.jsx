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
    <Link to={`/category/${slug || ''}`} className="block h-full font-display active-tap-scale shrink-0">
      <Card
        variant="default"
        padding="none"
        isHoverable
        className={cn(
          'group relative flex flex-col h-full overflow-hidden rounded-2xl sm:rounded-[30px] border border-stone-200/80 bg-white shadow-md hover:shadow-xl transition-all duration-300',
          className,
        )}
      >
        {/* Aspect Square Image Stage */}
        <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-stone-100">
          {imageUrl ? (
            <OptimizedImage
              src={imageUrl}
              alt={name || 'Category'}
              loading="lazy"
              aspectRatio="aspect-square"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-amber-50">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-950">
                {name ? name.charAt(0).toUpperCase() : 'C'}
              </span>
            </div>
          )}
          {/* Dark Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/15 to-transparent" />

          {productCount !== undefined && (
            <span className="absolute top-2 right-2 rounded-full bg-stone-950/90 px-2 py-0.5 text-[9px] font-extrabold text-amber-300 border border-amber-400/30 backdrop-blur-xs font-mono shadow-xs z-20">
              {productCount} Items
            </span>
          )}

          {/* Mobile App Title Overlay */}
          <div className="absolute bottom-2.5 left-2 right-2 z-20 text-center sm:hidden">
            <h3 className="font-heading text-xs font-bold text-white drop-shadow-sm line-clamp-1">
              {name}
            </h3>
          </div>
        </div>

        {/* Desktop Body */}
        <div className="hidden sm:flex flex-col flex-1 p-4 text-center justify-between font-display bg-white relative">
          <div>
            <h3 className="font-heading text-base lg:text-lg font-extrabold text-amber-950 group-hover:text-amber-800 transition-colors line-clamp-1">
              {name}
            </h3>
          </div>

          <div className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold text-amber-950 group-hover:text-amber-900 transition-colors pt-1.5 border-t border-stone-100 font-display">
            <span>Explore</span>
            <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center group-hover:bg-amber-900 group-hover:text-amber-200 transition-colors">
              <FiArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
});

export default CategoryCard;
