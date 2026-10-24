import React from 'react';

interface DhammaChakraProps {
  className?: string;
  size?: number;
  spin?: boolean;
}

/**
 * 24-Spoke Dhammachakka (Ashoka Chakra) Motif
 */
export const DhammaChakraIcon: React.FC<DhammaChakraProps> = ({
  className = '',
  size = 40,
  spin = true,
}) => {
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${spin ? 'animate-dhamma-spin' : ''} ${className}`}
      aria-hidden="true"
    >
      {/* Outer Rim */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.65"
      />
      {/* 24 Semi-circular inner rim indent beads */}
      {spokes.map((deg) => {
        const rad = ((deg + 7.5) * Math.PI) / 180;
        const bx = 50 + 40 * Math.cos(rad);
        const by = 50 + 40 * Math.sin(rad);
        return (
          <circle
            key={`bead-${deg}`}
            cx={bx}
            cy={by}
            r="1.4"
            fill="currentColor"
          />
        );
      })}
      {/* 24 Spokes */}
      {spokes.map((deg) => (
        <line
          key={`spoke-${deg}`}
          x1="50"
          y1="50"
          x2="50"
          y2="10"
          stroke="currentColor"
          strokeWidth="1.6"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {/* Central Hub */}
      <circle cx="50" cy="50" r="8" fill="currentColor" />
      <circle cx="50" cy="50" r="3.2" fill="#FFFFFF" />
    </svg>
  );
};

/**
 * Dignified SVG Portrait Illustration for Member Bereavement Cards
 * Adapted for Crisp Modern White & Deep Indigo daylight aesthetic.
 */
export const MemberPortraitIllustration: React.FC<{
  portraitId: 'surendra' | 'ramprakash' | 'anita';
  name: string;
  cadre: string;
}> = ({ portraitId, name, cadre }) => {
  const palette =
    portraitId === 'surendra'
      ? { bg1: '#EFF6FF', bg2: '#DBEAFE', accent: '#1E3A8A', suit: '#1E293B', badge: '#D97706' }
      : portraitId === 'ramprakash'
      ? { bg1: '#F0F9FF', bg2: '#E0F2FE', accent: '#1D4ED8', suit: '#0F172A', badge: '#1E3A8A' }
      : { bg1: '#FEF3C7', bg2: '#DBEAFE', accent: '#1E3A8A', suit: '#1E40AF', badge: '#B45309' };

  return (
    <div
      className="relative w-18 h-18 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center"
      role="img"
      aria-label={`${name} (${cadre}) Portrait`}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-${portraitId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.bg1} />
            <stop offset="100%" stopColor={palette.bg2} />
          </linearGradient>
        </defs>
        <rect width="120" height="120" fill={`url(#grad-${portraitId})`} />
        <circle
          cx="60"
          cy="46"
          r="34"
          stroke={palette.accent}
          strokeOpacity="0.18"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Shoulders / Suit silhouette */}
        <path
          d="M20 120 C20 88, 40 80, 60 80 C80 80, 100 88, 100 120 Z"
          fill={palette.suit}
        />
        {portraitId !== 'anita' ? (
          <>
            <polygon points="50,80 60,98 70,80" fill="#FFFFFF" />
            <polygon points="58,86 62,86 64,114 56,114" fill="#D97706" />
          </>
        ) : (
          <path
            d="M35 84 L78 120 L95 120 L52 80 Z"
            fill="#D97706"
            fillOpacity="0.85"
          />
        )}
        {/* Head */}
        <circle cx="60" cy="46" r="20" fill="#334155" fillOpacity="0.18" />
        <circle cx="60" cy="45" r="19" fill="#F8FAFC" stroke="#475569" strokeWidth="1.5" />
        {/* Spectacles */}
        <rect
          x="48"
          y="41"
          width="10"
          height="6"
          rx="2"
          stroke="#1E3A8A"
          strokeWidth="1.5"
          fill="none"
        />
        <rect
          x="62"
          y="41"
          width="10"
          height="6"
          rx="2"
          stroke="#1E3A8A"
          strokeWidth="1.5"
          fill="none"
        />
        <line x1="58" y1="44" x2="62" y2="44" stroke="#1E3A8A" strokeWidth="1.5" />
      </svg>
      <span
        className="absolute bottom-1 right-1.5 text-[10px] font-mono-tabular font-bold px-1 rounded bg-white/90 text-[#1E3A8A]"
      >
        {cadre}
      </span>
    </div>
  );
};

export const StupaMonumentIllustration: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 140 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Deekshabhoomi Stupa Architectural Seal"
  >
    {/* Harmika & Chatra Spire */}
    <line x1="70" y1="8" x2="70" y2="26" stroke="#FBBF24" strokeWidth="2.5" />
    <path d="M58 14 H82" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
    <path d="M62 19 H78" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
    <rect
      x="56"
      y="25"
      width="28"
      height="9"
      rx="1.5"
      stroke="#FBBF24"
      strokeWidth="1.8"
      fill="#1E3A8A"
    />
    {/* Stupa Dome (Anda) */}
    <path
      d="M28 74 C28 44, 112 44, 112 74 Z"
      fill="#1E40AF"
      fillOpacity="0.45"
      stroke="#93C5FD"
      strokeWidth="2"
    />
    {/* Torana Pillars & Base Plinth */}
    <rect x="18" y="74" width="104" height="7" rx="2" fill="#3B82F6" fillOpacity="0.35" stroke="#93C5FD" strokeWidth="1.5" />
    <rect x="12" y="81" width="116" height="7" rx="2" fill="#1E3A8A" stroke="#FBBF24" strokeWidth="1.5" />
    <circle cx="70" cy="56" r="10" stroke="#FBBF24" strokeWidth="1.8" fill="#0F172A" />
    <circle cx="70" cy="56" r="3" fill="#FBBF24" />
  </svg>
);

