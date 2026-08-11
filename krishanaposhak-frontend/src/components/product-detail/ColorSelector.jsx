import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { FiCheck } from 'react-icons/fi';

const COLOR_MAP = {
  red: '#DC2626',
  blue: '#2563EB',
  yellow: '#EAB308',
  pink: '#EC4899',
  green: '#16A34A',
  white: '#FFFFFF',
  black: '#18181B',
  peach: '#FDBA74',
  orange: '#F97316',
  purple: '#9333EA',
  maroon: '#7F1D1D',
  gold: '#D4AF37',
  silver: '#C0C0C0',
  navy: '#1E3A8A',
  cyan: '#06B6D4',
  teal: '#0D9488',
  cream: '#FFFBEB',
  beige: '#F5F5DC',
  brown: '#78350F',
};

const ColorSelector = memo(function ColorSelector({ color, selectedColor, onSelect }) {
  const colors = useMemo(() => {
    if (!color || typeof color !== 'string') return [];
    return color
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
  }, [color]);

  if (colors.length === 0) return null;

  const activeSelected = selectedColor || colors[0];

  const getColorSwatch = (name) => {
    const key = name.toLowerCase();
    if (key.includes('multi')) {
      return {
        background: 'conic-gradient(from 0deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)',
      };
    }
    const hex = COLOR_MAP[key] || '#C99A3B';
    return { backgroundColor: hex };
  };

  return (
    <div className="space-y-3 font-display">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
          <span>Available Color{colors.length > 1 ? 's' : ''}</span>
          {activeSelected && (
            <span className="text-deep-navy font-extrabold normal-case">
              — {activeSelected}
            </span>
          )}
        </label>
      </div>

      {/* Color Options Grid */}
      <div
        className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-amber-200 sm:flex-wrap"
        role="radiogroup"
        aria-label="Select poshak color"
      >
        {colors.map((colorName) => {
          const isSelected = activeSelected.toLowerCase() === colorName.toLowerCase();
          const swatchStyle = getColorSwatch(colorName);
          const isWhite = colorName.toLowerCase() === 'white' || colorName.toLowerCase() === 'cream';

          return (
            <motion.button
              key={colorName}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Color ${colorName}`}
              onClick={() => onSelect && onSelect(colorName)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'relative flex-shrink-0 flex items-center gap-2 min-h-[42px] px-3.5 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/50 font-display cursor-pointer',
                isSelected
                  ? 'border-amber-800 bg-amber-900 text-amber-50 font-bold shadow-md ring-2 ring-amber-800/20'
                  : 'border-amber-900/15 bg-white text-stone-800 hover:border-amber-700/50 hover:bg-amber-50/50'
              )}
            >
              {/* Color Circle Swatch */}
              <span
                className={cn(
                  'h-4 w-4 rounded-full shadow-2xs shrink-0 flex items-center justify-center border',
                  isWhite ? 'border-slate-300' : 'border-black/10'
                )}
                style={swatchStyle}
              />

              <span className="text-xs sm:text-sm font-semibold capitalize whitespace-nowrap">
                {colorName}
              </span>

              {isSelected && <FiCheck className="h-3.5 w-3.5 text-amber-200 shrink-0 ml-0.5" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

export default ColorSelector;
