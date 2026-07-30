# THEME DESIGN

## Design Philosophy

"Handcrafted luxury for timeless traditions."

Every visual choice is inspired by the spiritual and cultural richness of Vrindavan, the elegance of royal Indian courts, and the warmth of handcrafted textiles. The theme feels premium, warm, and deeply cultural — never generic or AI-generated.

---

## Color Palette

### Primary Colors
```
Royal Blue        #1B3A5C    hsl(210, 55%, 23%)    ← Deep, regal primary
Deep Navy         #0F2440    hsl(215, 62%, 15%)    ← Darkest, for headers
Peacock Blue      #0D4F5E    hsl(190, 75%, 21%)    ← Accent, for hover states
```

### Neutral Colors
```
Lotus White       #F8F6F3    hsl(36, 20%, 96%)     ← Page background
Warm Cream        #F0EAE1    hsl(36, 28%, 91%)     ← Card background
Muted Sand        #D4C9B8    hsl(34, 22%, 78%)     ← Borders, dividers
Natural Wood      #8B7D6B    hsl(34, 14%, 48%)     ← Muted text, icons
Dark Charcoal     #2C2824    hsl(30, 10%, 16%)     ← Body text
```

### Accent Colors
```
Temple Gold       #C99A3B    hsl(42, 57%, 51%)     ← CTA, highlights, stars
Gold Light        #E8D5A3    hsl(45, 55%, 77%)     ← Subtle gold backgrounds
Gold Dark         #A87D2E    hsl(42, 57%, 42%)     ← Gold hover state
```

### Semantic Colors
```
Success           #2D6A4F    hsl(150, 40%, 30%)
Warning           #B8860B    hsl(43, 89%, 38%)
Error             #9B1D20    hsl(359, 68%, 36%)
Info              #2C5282    hsl(210, 50%, 34%)
```

### Usage Guidelines

| Element | Color | Token |
|---|---|---|
| Page background | Lotus White | `bg-lotus-white` |
| Card/panel background | Warm Cream | `bg-warm-cream` |
| Primary buttons | Royal Blue | `bg-royal-blue` |
| Primary hover | Deep Navy | `bg-deep-navy` |
| CTA buttons / Highlights | Temple Gold | `bg-temple-gold` |
| Body text | Dark Charcoal | `text-dark-charcoal` |
| Muted text | Natural Wood | `text-natural-wood` |
| Borders | Muted Sand | `border-muted-sand` |
| Links | Royal Blue | `text-royal-blue` |
| Link hover | Peacock Blue | `text-peacock-blue` |
| Error text | Semantic Error | `text-error` |
| Success badge | Semantic Success | `bg-success/10 text-success` |
| Header background | Deep Navy | `bg-deep-navy` |
| Footer background | Dark Charcoal | `bg-dark-charcoal` |
| Gold accents | Temple Gold | `text-temple-gold` |

### What NOT to use
- ❌ Bright red (#FF0000)
- ❌ Neon green (#00FF00)
- ❌ Electric blue (#0088FF)
- ❌ Gradient backgrounds (no `bg-gradient-to-r`)
- ❌ Oversaturated colors
- ❌ Material Design flat colors
- ❌ Vibrant oranges or pinks

---

## Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'royal-blue': { DEFAULT: '#1B3A5C', 50: '#EBF0F5', ...900: '#0A1522' },
        'deep-navy': '#0F2440',
        'peacock-blue': '#0D4F5E',
        'lotus-white': '#F8F6F3',
        'warm-cream': '#F0EAE1',
        'muted-sand': '#D4C9B8',
        'natural-wood': '#8B7D6B',
        'dark-charcoal': '#2C2824',
        'temple-gold': { DEFAULT: '#C99A3B', light: '#E8D5A3', dark: '#A87D2E' },
        success: '#2D6A4F',
        warning: '#B8860B',
        error: '#9B1D20',
        info: '#2C5282',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        // 8px design system scale
        'xs': ['0.75rem', { lineHeight: '1rem' }],       // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],    // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],     // 36px
        '5xl': ['3rem', { lineHeight: '1.1' }],           // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1' }],        // 60px
      },
      spacing: {
        // 8px base × 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16
        '0.5': '4px',
        '1': '8px',
        '1.5': '12px',
        '2': '16px',
        '2.5': '20px',
        '3': '24px',
        '3.5': '28px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '7': '56px',
        '8': '64px',
        '9': '72px',
        '10': '80px',
        '11': '88px',
        '12': '96px',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(44, 40, 36, 0.06)',
        'card': '0 4px 16px rgba(44, 40, 36, 0.08)',
        'elevated': '0 8px 32px rgba(44, 40, 36, 0.10)',
        'modal': '0 16px 48px rgba(44, 40, 36, 0.15)',
        'gold': '0 4px 14px rgba(201, 154, 59, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
};
```

---

## Typography

### Font Stack

| Usage | Font | Fallback | Weight |
|---|---|---|---|
| Headings (h1-h3) | Playfair Display | Georgia, serif | 400, 500, 600, 700 |
| Subheadings (h4-h6) | Cormorant Garamond | Georgia, serif | 300, 400, 500, 600 |
| Body text | Inter | system-ui, sans-serif | 300, 400, 500, 600 |
| Product names | Playfair Display | Georgia, serif | 500 |
| Prices | Inter | system-ui, sans-serif | 600 |
| Navigation | Inter | system-ui, sans-serif | 500 |
| Labels / small text | Inter | system-ui, sans-serif | 400 |
| Decorative / brand | Playfair Display italic | Georgia, serif | 400 italic |

### Type Scale Hierarchy

```
h1 - 48px (3rem)   - Playfair Display 600  - Page titles, hero headings
h2 - 36px (2.25rem)- Playfair Display 600  - Section headings
h3 - 30px (1.875rem)- Playfair Display 500  - Card headings, modal titles
h4 - 24px (1.5rem) - Cormorant Garamond 600 - Subsection headings
h5 - 20px (1.25rem)- Cormorant Garamond 600 - Product names
h6 - 18px (1.125rem)- Inter 600            - Card subtitles

Body - 16px (1rem) - Inter 400             - Default text
Body Small - 14px  - Inter 400             - Secondary text
Caption - 12px     - Inter 400             - Labels, timestamps
Button - 15px      - Inter 500             - Button text
```

### Line Heights
- Headings: 1.1 - 1.2 (tight)
- Body: 1.6 (comfortable)
- Captions: 1.4

### Letter Spacing
- Headings (display): -0.01em
- Body: normal
- Uppercase labels: 0.05em
- Buttons: 0.02em

---

## Spacing System

| Token | Value | Usage |
|---|---|---|
| 0.5 | 4px | Mini gaps, icon spacing |
| 1 | 8px | Button padding, small gaps |
| 1.5 | 12px | Input padding, tag gaps |
| 2 | 16px | Card padding, section gaps |
| 2.5 | 20px | Modal padding |
| 3 | 24px | Between sections |
| 4 | 32px | Page section margins |
| 5 | 40px | Hero section spacing |
| 6 | 48px | Major sections |
| 8 | 64px | Page padding top/bottom |
| 10 | 80px | Large sections |

### Component Spacing Standards
- **Card padding**: p-3 (24px) desktop, p-2 (16px) mobile
- **Section gap**: space-y-6 (48px)
- **Form field gap**: space-y-4 (32px)
- **Grid gap**: gap-3 (24px) desktop, gap-2 (16px) mobile
- **Content max-width**: max-w-7xl (1280px)

---

## Border Radius

```
Buttons:       rounded (8px)
Cards:         rounded-lg (12px) 
Inputs:        rounded (8px)
Modals:        rounded-xl (20px)
Badges:        rounded-full (9999px)
Avatars:       rounded-full
Images:        rounded (8px)
Drawers:       rounded-l-xl (left) / rounded-r-xl (right)
```

### Border Usage
- Cards: border border-muted-sand/30 (30% opacity for subtlety)
- Inputs: border border-muted-sand (full opacity)
- Focus: ring-2 ring-royal-blue/30
- Active: ring-2 ring-temple-gold/40
- Dividers: border-t border-muted-sand/20

---

## Shadows

| Level | Token | Usage |
|---|---|---|
| Soft | shadow-soft | Subtle elevation for cards in a grid |
| Card | shadow-card | Default card shadow |
| Elevated | shadow-elevated | Dropdown menus, hover state |
| Modal | shadow-modal | Modals, drawers |
| Gold | shadow-gold | Gold buttons, featured items |

---

## Animations

### Duration Standards
- Micro-interactions (hover, focus): 150ms
- Component transitions (tabs, accordion): 200ms
- Page transitions: 300ms
- Modals/Drawers: 250ms

### Allowed Animations
| Animation | Where | Duration |
|---|---|---|
| Fade in | Page content, modals | 250ms |
| Slide up | Cards entering view | 300ms |
| Slide in right | Drawer (cart, mobile menu) | 200ms |
| Scale in | Modal backdrop | 200ms |
| Shimmer | Skeleton loading | 1.5s loop |
| Hover lift (translateY -2px) | Cards, buttons | 150ms |
| Opacity change | Hover states | 150ms |

### Banned Animations
- ❌ Bounce effects
- ❌ Spin (except loading spinner)
- ❌ Pulse (except skeleton)
- ❌ Staggered entrance (too distracting)
- ❌ 3D transforms
- ❌ Overflowing animations
- ❌ Confetti / celebration effects
- ❌ Auto-playing carousels on desktop

---

## Responsive Breakpoints

```javascript
// Mobile First
sm: 640px     // Large phones
md: 768px     // Tablets
lg: 1024px    // Desktop
xl: 1280px    // Large desktop
2xl: 1536px   // Extra large
```

### Layout Changes by Breakpoint

| Component | < sm (Mobile) | sm-md (Tablet) | lg+ (Desktop) |
|---|---|---|---|
| Product Grid | 2 columns | 3 columns | 4 columns |
| Card padding | 16px | 20px | 24px |
| Header | Compact + hamburger | Hamburger + icons | Full + mega menu |
| Footer | Stacked, 1 column | 2 columns | 4 columns |
| Customer dashboard | Bottom tabs | Sidebar | Full sidebar |
| Admin sidebar | Drawer overlay | Collapsible | Expanded |
| Cart drawer | Full width | 380px | 420px |
| Font sizes | Scale down 1 step | Normal | Normal |
| Container padding | px-4 | px-6 | px-8 |
| Hero section | min-h-[50vh] | min-h-[60vh] | min-h-[70vh] |
</content>

