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
          'group relative flex flex-col h-full overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_14px_36px_rgba(44,40,36,0.08)] hover:shadow-[0_20px_48px_rgba(44,40,36,0.12)] hover:border-temple-gold/25 transition-all duration-300 backdrop-blur-sm',
          className,
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[linear-gradient(180deg,rgba(248,246,243,0.96),rgba(240,234,225,0.9))]">
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,36,64,0.05),rgba(15,36,64,0.42))] opacity-70 group-hover:opacity-90 transition-opacity" />

          {productCount !== undefined && (
            <span className="absolute top-2.5 right-2.5 rounded-full bg-deep-navy/90 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-temple-gold-light border border-temple-gold/20 backdrop-blur-md font-mono shadow-[0_10px_24px_rgba(15,36,64,0.18)]">
              {productCount} Items
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 p-3.5 sm:p-4 text-center justify-between font-display">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-semibold text-dark-charcoal group-hover:text-royal-blue transition-colors line-clamp-1">
              {name}
            </h3>
            {description && (
              <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed font-body">
                {description}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-royal-blue group-hover:text-peacock-blue transition-colors pt-2.5 border-t border-muted-sand/20">
            <span>Explore Collection</span>
            <FiArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1 text-amber-700" />
          </div>
        </div>
      </Card>
    </Link>
  );
});

export default CategoryCard;
