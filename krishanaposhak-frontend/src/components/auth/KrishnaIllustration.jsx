import { motion } from 'framer-motion';

export default function KrishnaIllustration({ className = '' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient Soft Gold Radial Glow */}
      <motion.div
        className="absolute h-44 w-44 rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,0.22)_0%,_rgba(201,154,59,0.06)_55%,_transparent_75%)] blur-2xl pointer-events-none"
        animate={{ opacity: [0.6, 0.9, 0.6], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -4, 0] }}
        transition={{
          scale: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.7 },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative z-10 drop-shadow-[0_14px_28px_rgba(201,154,59,0.2)]"
      >
        <defs>
          {/* Metallic Temple Gold Gradient */}
          <linearGradient id="goldMetallic" x1="10" y1="20" x2="170" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF0C7" />
            <stop offset="25%" stopColor="#E5C158" />
            <stop offset="50%" stopColor="#C99A3B" />
            <stop offset="85%" stopColor="#9E7422" />
            <stop offset="100%" stopColor="#6B4B0C" />
          </linearGradient>

          {/* Bright Sheen Gold */}
          <linearGradient id="brightGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF7E6" />
            <stop offset="50%" stopColor="#F3D375" />
            <stop offset="100%" stopColor="#C99A3B" />
          </linearGradient>

          {/* Peacock Feather Gradients */}
          <linearGradient id="peacockOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="45%" stopColor="#0D9488" />
            <stop offset="85%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          <radialGradient id="peacockEye" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="35%" stopColor="#1D4ED8" />
            <stop offset="70%" stopColor="#5B21B6" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>

          {/* Soft Shadow Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Aura Ring */}
        <circle
          cx="90"
          cy="90"
          r="76"
          stroke="url(#brightGold)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          opacity="0.4"
        />
        <circle
          cx="90"
          cy="90"
          r="68"
          stroke="url(#goldMetallic)"
          strokeWidth="1"
          opacity="0.25"
        />

        {/* Crown Motif (Mukut Accent) */}
        <g transform="translate(90, 48)">
          <path d="M 0 -18 L 7 4 L 0 0 L -7 4 Z" fill="url(#brightGold)" />
          <circle cx="0" cy="-22" r="3" fill="#E5C158" />
          <path
            d="M -13 6 C -7 -4 0 -8 0 -8 C 0 -8 7 -4 13 6 C 7 11 -7 11 -13 6 Z"
            fill="url(#goldMetallic)"
            opacity="0.9"
          />
        </g>

        {/* Peacock Feather (Mor Pankh) */}
        <g transform="translate(108, 56) rotate(18)">
          {/* Feather Stem */}
          <path
            d="M0 60 Q-10 30 0 0"
            stroke="url(#brightGold)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Feather Eye Outer */}
          <path
            d="M 0 -2 C -18 -18 -18 -42 0 -54 C 18 -42 18 -18 0 -2 Z"
            fill="url(#peacockOuter)"
          />
          {/* Feather Eye Inner */}
          <ellipse cx="0" cy="-28" rx="10" ry="14" fill="url(#peacockEye)" />
          {/* Center Spot */}
          <ellipse cx="0" cy="-26" rx="4" ry="6" fill="#38BDF8" />

          {/* Delicate Strands */}
          {[-44, -36, -28, -20, -12].map((y, idx) => (
            <g key={idx}>
              <path
                d={`M 0 ${y} Q -12 ${y - 4} -18 ${y - 10}`}
                stroke="#10B981"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d={`M 0 ${y} Q 12 ${y - 4} 18 ${y - 10}`}
                stroke="#10B981"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>
          ))}
        </g>

        {/* Divine Bansuri (Flute) */}
        <g transform="translate(90, 105) rotate(-24)">
          {/* Main Flute Body */}
          <rect
            x="-65"
            y="-6"
            width="130"
            height="12"
            rx="6"
            fill="url(#goldMetallic)"
            filter="url(#softGlow)"
          />

          {/* Gold Decorative Rings */}
          {[-45, -25, 0, 25, 45].map((xPos) => (
            <rect
              key={xPos}
              x={xPos}
              y="-7"
              width="4"
              height="14"
              rx="2"
              fill="url(#brightGold)"
            />
          ))}

          {/* Flute Holes */}
          {[-35, -15, -5, 10, 20, 35].map((xPos) => (
            <circle key={xPos} cx={xPos} cy="0" r="2.2" fill="#3D2908" />
          ))}

          {/* Hanging Gold Tassels */}
          <g transform="translate(55, 6)">
            <path d="M0 0 L0 22 M-4 0 L-4 16 M4 0 L4 18" stroke="#E5C158" strokeWidth="1.2" />
            <circle cx="0" cy="24" r="3" fill="#E5C158" />
            <circle cx="-4" cy="18" r="2" fill="#F3D375" />
            <circle cx="4" cy="20" r="2.2" fill="#F3D375" />
          </g>
        </g>

        {/* Sparkles */}
        {[
          { cx: 38, cy: 62, r: 2 },
          { cx: 142, cy: 85, r: 1.8 },
          { cx: 50, cy: 135, r: 2.2 },
          { cx: 130, cy: 140, r: 1.5 },
        ].map((star, i) => (
          <circle key={i} cx={star.cx} cy={star.cy} r={star.r} fill="#FFF7E6" opacity="0.9" />
        ))}
      </motion.svg>
    </div>
  );
}
