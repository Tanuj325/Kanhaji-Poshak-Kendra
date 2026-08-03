import { useRef, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronRight } from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';

export default function HeaderMegaMenu({ categories = [], isOpen, onClose }) {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Normalize real category list from database
  const categoryList = useMemo(() => {
    const raw = Array.isArray(categories)
      ? categories
      : categories?.data || categories?.content || categories?.items || [];
    return raw.filter((c) => c.active !== false);
  }, [categories]);

  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // Set default active category to first category in real list
  useEffect(() => {
    if (categoryList.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categoryList[0].id);
    }
  }, [categoryList, activeCategoryId]);

  // Close on outside click or Escape key
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

  // Active category selected on left rail
  const activeCategory = useMemo(() => {
    return categoryList.find((c) => c.id === activeCategoryId) || categoryList[0] || null;
  }, [categoryList, activeCategoryId]);

  // Dynamic subcategories / columns for active category or root categories
  const activeColumns = useMemo(() => {
    if (!categoryList || categoryList.length === 0) return [];

    // If active category has children, display children in sub-group columns
    if (activeCategory && Array.isArray(activeCategory.children) && activeCategory.children.length > 0) {
      const children = activeCategory.children;
      const chunkSize = Math.max(1, Math.ceil(children.length / 4));
      const cols = [];
      for (let i = 0; i < children.length; i += chunkSize) {
        cols.push({
          title: i === 0 ? activeCategory.name : 'More Items',
          items: children.slice(i, i + chunkSize),
        });
      }
      return cols.slice(0, 4);
    }

    // Otherwise show up to 4 top-level real categories in columns
    return categoryList.slice(0, 4).map((cat) => ({
      title: cat.name,
      slug: cat.slug,
      id: cat.id,
      items: Array.isArray(cat.children) ? cat.children : [],
      viewAllTo: cat.slug ? `/category/${cat.slug}` : `${ROUTE_PATHS.SHOP}?categoryId=${cat.id}`,
    }));
  }, [categoryList, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="relative" ref={containerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute left-4 sm:left-8 lg:left-12 xl:left-16 top-full z-50 mt-2 w-[min(68rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
            role="dialog"
            aria-label="All Categories Mega Menu"
          >
            {categoryList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium">
                No categories found in database.
              </div>
            ) : (
              <div className="flex">
                {/* Left Category Rail (Real database categories) */}
                <div className="w-56 shrink-0 bg-slate-50 border-r border-slate-200/80 p-3 space-y-1">
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Categories
                  </p>
                  {categoryList.map((cat) => {
                    const isActive = cat.id === activeCategory?.id;
                    const catPath = cat.slug
                      ? `/category/${cat.slug}`
                      : `${ROUTE_PATHS.SHOP}?categoryId=${cat.id}`;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setActiveCategoryId(cat.id);
                          navigate(catPath);
                          onClose();
                        }}
                        onMouseEnter={() => setActiveCategoryId(cat.id)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-amber-400/15 text-amber-900 border border-amber-400/30'
                            : 'text-slate-700 hover:bg-white hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <FiChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    );
                  })}
                </div>

                {/* Right Columns (Real database subcategories) */}
                <div className="flex-1 p-6">
                  {activeCategory && (
                    <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#0F2440]">
                          {activeCategory.name}
                        </h3>
                        {activeCategory.description && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {activeCategory.description}
                          </p>
                        )}
                      </div>
                      <Link
                        to={
                          activeCategory.slug
                            ? `/category/${activeCategory.slug}`
                            : `${ROUTE_PATHS.SHOP}?categoryId=${activeCategory.id}`
                        }
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors"
                      >
                        <span>Explore All {activeCategory.name}</span>
                        <FiArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {activeColumns.map((col, idx) => (
                      <div key={idx} className="space-y-3">
                        <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#0F2440] border-b border-slate-100 pb-1.5">
                          {col.title}
                        </h4>
                        <ul className="space-y-2">
                          {col.items.map((subItem) => {
                            const subPath = subItem.slug
                              ? `/category/${subItem.slug}`
                              : `${ROUTE_PATHS.SHOP}?categoryId=${subItem.id}`;

                            return (
                              <li key={subItem.id || subItem.name}>
                                <Link
                                  to={subPath}
                                  onClick={onClose}
                                  className="text-xs text-slate-600 hover:text-amber-700 font-medium transition-colors duration-150 block truncate"
                                >
                                  {subItem.name || subItem.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
