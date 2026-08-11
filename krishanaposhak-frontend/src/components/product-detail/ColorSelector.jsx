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

const ColorSelector = memo(function ColorSelector({ color, selectedColor, onSelect, isCompact = false }) {
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
    <div className="space-y-2 sm:space-y-2.5 font-display">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <span>Available Color{colors.length > 1 ? 's' : ''}</span>
          {activeSelected && (
            <span className="text-[#C99A3B] font-bold normal-case">
              — {activeSelected}
            </span>
          )}
        </label>
      </div>

      {/* Color Options Grid - Compact Mobile height (34px) */}
      <div
        className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-none flex-wrap"
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
              whileTap={{ scale: 0.96 }}
              className={cn(
                'relative flex-shrink-0 flex items-center gap-1.5 h-[34px] sm:h-[38px] px-2.5 sm:px-3 py-1 rounded-[10px] sm:rounded-[12px] border transition-all duration-150 font-display cursor-pointer text-[11px] sm:text-xs',
                isSelected
                  ? 'bg-gradient-to-r from-[#D4AF37] via-[#C99A3B] to-[#B3832B] text-white font-bold border-transparent shadow-2xs scale-[1.01]'
                  : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:border-[#C99A3B]/40 font-medium'
              )}
            >
              {/* Color Circle Swatch */}
              <span
                className={cn(
                  'h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full shadow-2xs shrink-0 border',
                  isWhite ? 'border-slate-300' : 'border-black/10'
                )}
                style={swatchStyle}
              />

              <span className="capitalize whitespace-nowrap">
                {colorName}
              </span>

              {isSelected && <FiCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-100 shrink-0 ml-0.5" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

export default ColorSelector;
