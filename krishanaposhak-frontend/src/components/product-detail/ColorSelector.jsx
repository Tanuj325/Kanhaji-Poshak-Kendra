import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { FiCheck } from 'react-icons/fi';

const COLOR_MAP = {
  // Reds
  red: '#DC2626',
  crimson: '#DC143C',
  scarlet: '#FF2400',
  ruby: '#E0115F',
  cherry: '#DE3163',
  rose: '#FF007F',
  raspberry: '#E30B5C',
  burgundy: '#800020',
  wine: '#722F37',
  maroon: '#7F1D1D',
  brickRed: '#CB4154',
  firebrick: '#B22222',
  tomato: '#FF6347',
  coralRed: '#FF4040',

  // Pinks
  pink: '#EC4899',
  hotPink: '#FF69B4',
  deepPink: '#FF1493',
  lightPink: '#FFB6C1',
  babyPink: '#F4C2C2',
  blush: '#DE5D83',
  dustyPink: '#DCAE96',
  bubblegum: '#FFC1CC',
  magenta: '#FF00FF',
  fuchsia: '#FF00FF',
  mauve: '#E0B0FF',

  // Oranges
  orange: '#F97316',
  darkOrange: '#FF8C00',
  burntOrange: '#CC5500',
  tangerine: '#F28500',
  pumpkin: '#FF7518',
  apricot: '#FBCEB1',
  peach: '#FDBA74',
  peachPuff: '#FFDAB9',
  salmon: '#FA8072',
  terracotta: '#E2725B',
  rust: '#B7410E',
  copper: '#B87333',

  // Yellows
  yellow: '#EAB308',
  lemon: '#FFF44F',
  brightYellow: '#FFFF00',
  mustard: '#FFDB58',
  goldenYellow: '#FFD700',
  amber: '#FFBF00',
  honey: '#EB9605',
  canary: '#FFEF00',
  saffron: '#F4C430',
  maize: '#FBEC5D',
  ochre: '#CC7722',

  // Gold
  gold: '#D4AF37',
  royalGold: '#F7C948',
  antiqueGold: '#CFB53B',
  champagneGold: '#F7E7CE',
  roseGold: '#B76E79',
  metallicGold: '#D4AF37',
  paleGold: '#E6BE8A',

  // Greens
  green: '#16A34A',
  lime: '#84CC16',
  limeGreen: '#32CD32',
  emerald: '#50C878',
  emeraldGreen: '#046A38',
  forestGreen: '#228B22',
  darkGreen: '#006400',
  olive: '#808000',
  oliveGreen: '#6B8E23',
  mint: '#98FF98',
  mintGreen: '#3EB489',
  sage: '#9CAF88',
  seaGreen: '#2E8B57',
  springGreen: '#00FF7F',
  hunterGreen: '#355E3B',
  jade: '#00A86B',
  pistachio: '#93C572',
  mossGreen: '#8A9A5B',

  // Blues
  blue: '#2563EB',
  royalBlue: '#4169E1',
  navy: '#1E3A8A',
  darkBlue: '#00008B',
  skyBlue: '#87CEEB',
  lightBlue: '#ADD8E6',
  babyBlue: '#89CFF0',
  powderBlue: '#B0E0E6',
  steelBlue: '#4682B4',
  cobalt: '#0047AB',
  sapphire: '#0F52BA',
  azure: '#007FFF',
  cerulean: '#007BA7',
  denim: '#1560BD',
  midnightBlue: '#191970',
  royalPurpleBlue: '#4169E1',
  cornflowerBlue: '#6495ED',
  tealBlue: '#367588',

  // Cyans / Teals
  cyan: '#06B6D4',
  aqua: '#00FFFF',
  turquoise: '#40E0D0',
  teal: '#0D9488',
  darkTeal: '#008080',
  lightCyan: '#E0FFFF',
  aquamarine: '#7FFFD4',
  turquoiseBlue: '#00CED1',
  seafoam: '#93E9BE',

  // Purples
  purple: '#9333EA',
  violet: '#8B5CF6',
  lavender: '#E6E6FA',
  lilac: '#C8A2C8',
  plum: '#8E4585',
  eggplant: '#614051',
  amethyst: '#9966CC',
  grape: '#6F2DA8',
  royalPurple: '#7851A9',
  indigo: '#4B0082',
  darkPurple: '#301934',
  orchid: '#DA70D6',
  periwinkle: '#CCCCFF',
  wisteria: '#C9A0DC',
  mulberry: '#C54B8C',

  // Browns
  brown: '#78350F',
  chocolate: '#7B3F00',
  darkBrown: '#5C4033',
  lightBrown: '#B5651D',
  tan: '#D2B48C',
  camel: '#C19A6B',
  caramel: '#AF6E4D',
  chestnut: '#954535',
  walnut: '#773F1A',
  mahogany: '#C04000',
  coffee: '#6F4E37',
  mocha: '#967969',
  espresso: '#4E312D',
  cinnamon: '#D2691E',
  hazelnut: '#D0A77D',

  // Beige / Cream
  beige: '#F5F5DC',
  cream: '#FFFBEB',
  ivory: '#FFFFF0',
  eggshell: '#F0EAD6',
  vanilla: '#F3E5AB',
  almond: '#EFDECD',
  ecru: '#C2B280',
  sand: '#C2B280',
  wheat: '#F5DEB3',
  linen: '#FAF0E6',
  parchment: '#F1E9D2',
  oatmeal: '#D3C0A5',

  // Whites
  white: '#FFFFFF',
  snow: '#FFFAFA',
  floralWhite: '#FFFAF0',
  ghostWhite: '#F8F8FF',
  ivoryWhite: '#FFFFF0',
  pearlWhite: '#F5F5F5',
  offWhite: '#FAF9F6',
  antiqueWhite: '#FAEBD7',
  milkWhite: '#FDFFF5',

  // Blacks
  black: '#18181B',
  pureBlack: '#000000',
  jetBlack: '#343434',
  charcoalBlack: '#36454F',
  onyx: '#353839',
  ebony: '#555D50',
  obsidian: '#0B0B0B',

  // Grays
  gray: '#6B7280',
  grey: '#808080',
  lightGray: '#D1D5DB',
  darkGray: '#374151',
  silverGray: '#A8A9AD',
  slateGray: '#708090',
  coolGray: '#8C92AC',
  warmGray: '#808069',
  ashGray: '#B2BEB5',
  graphite: '#41424C',
  smokeGray: '#848884',
  doveGray: '#6D6E71',

  // Silver
  silver: '#C0C0C0',
  brightSilver: '#D9D9D9',
  metallicSilver: '#AAA9AD',
  platinum: '#E5E4E2',
  pewter: '#899499',
  steel: '#71797E',

  // Special / Luxury
  royalBlue: '#4169E1',
  royalRed: '#9B111E',
  royalPurple: '#7851A9',
  royalGreen: '#006B3C',
  royalMaroon: '#800000',
  templeGold: '#D4AF37',
  antiqueBronze: '#665D1E',
  bronze: '#CD7F32',
  brass: '#B5A642',
  titanium: '#878681',
  platinumWhite: '#E5E4E2',

  // Earth / Natural
  clay: '#B66A50',
  earth: '#8B4513',
  sienna: '#A0522D',
  burntSienna: '#E97451',
  umber: '#635147',
  rawUmber: '#826644',
  ochreYellow: '#CC7722',
  desertSand: '#EDC9AF',
  sandstone: '#C2B280',

  // Pastels
  pastelBlue: '#AEC6CF',
  pastelPink: '#FFD1DC',
  pastelPurple: '#B39EB5',
  pastelGreen: '#77DD77',
  pastelYellow: '#FDFD96',
  pastelOrange: '#FFB347',
  pastelRed: '#FF6961',
  pastelPeach: '#FFDAB9',
  pastelMint: '#AAF0D1',
  pastelLavender: '#E6E6FA',

  // Neon
  neonRed: '#FF073A',
  neonPink: '#FF10F0',
  neonOrange: '#FF5F1F',
  neonYellow: '#FFFF33',
  neonGreen: '#39FF14',
  neonBlue: '#1B03A3',
  neonPurple: '#BC13FE',
  neonCyan: '#00FFFF',

  // Indian / Traditional
  sindoor: '#B31B1B',
  kumkum: '#D10000',
  bhagwa: '#FF9933',
  kesari: '#FF9933',
  kesar: '#FF9933',
  gerua: '#E25822',
  mehndi: '#6B8E23',
  haldi: '#FFC107',
  raniPink: '#FF1493',
  gulabi: '#E75480',
  morpankhi: '#007F7F',
  parrotGreen: '#8DB600',
  peacockBlue: '#005F73',
  deepMaroon: '#800000',
  kanjiRed: '#C1121F',
  sindoorRed: '#B22222',

  // Metallic
  metallicRed: '#A52A2A',
  metallicBlue: '#4682B4',
  metallicGreen: '#2E8B57',
  metallicPurple: '#800080',
  metallicPink: '#C71585',
  metallicOrange: '#CC5500',
  metallicBronze: '#CD7F32',
  metallicCopper: '#B87333',
  metallicRoseGold: '#B76E79',
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

      {/* Color Options Grid - Border highlights when selected without filled gold background */}
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
                'relative flex-shrink-0 flex items-center gap-1.5 h-[34px] sm:h-[38px] px-2.5 sm:px-3 py-1 rounded-[10px] sm:rounded-[12px] border-2 transition-all duration-150 font-display cursor-pointer text-[11px] sm:text-xs',
                isSelected
                  ? 'border-[#C99A3B] bg-amber-50/60 text-slate-900 font-bold shadow-xs ring-2 ring-[#C99A3B]/20 scale-[1.01]'
                  : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 font-medium'
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

              {isSelected && <FiCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#C99A3B] shrink-0 ml-0.5" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

export default ColorSelector;
