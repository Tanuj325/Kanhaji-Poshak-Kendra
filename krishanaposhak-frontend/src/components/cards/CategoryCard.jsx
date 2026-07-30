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
          'group relative flex flex-col h-full overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-xs hover:shadow-[0_4px_20px_rgba(44,40,36,0.06)] hover:border-amber-700/40 transition-all duration-300',
          className,
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-amber-50/40">
          {imageUrl ? (
            <OptimizedImage
              src={imageUrl}
              alt={name || 'Category'}
              loading="lazy"
              aspectRatio="aspect-[4/3]"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100/60 to-amber-50/40">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-900 group-hover:scale-110 transition-transform">
                {name ? name.charAt(0).toUpperCase() : 'C'}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

          {productCount !== undefined && (
            <span className="absolute top-2.5 right-2.5 rounded-full bg-amber-950/80 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-amber-100 border border-amber-500/20 backdrop-blur-md font-mono shadow-xs">
              {productCount} Items
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 p-3.5 sm:p-4 text-center justify-between font-display">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-amber-950 group-hover:text-amber-800 transition-colors line-clamp-1">
              {name}
            </h3>
            {description && (
              <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed font-body">
                {description}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 group-hover:text-amber-700 transition-colors pt-2.5 border-t border-amber-900/10">
            <span>Explore Collection</span>
            <FiArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1 text-amber-700" />
          </div>
        </div>
      </Card>
    </Link>
  );
});

export default CategoryCard;
