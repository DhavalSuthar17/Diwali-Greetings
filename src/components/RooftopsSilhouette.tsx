import React from 'react';
import { motion } from 'framer-motion';

export interface RooftopsSilhouetteProps {
  readonly offsetY: number;
  readonly onRooftopClick: (normX: number) => void;
  readonly bulbColors?: readonly string[];
  readonly className?: string;
}

interface BulbData {
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly defaultColor: string;
}

const FAIRY_BULBS: readonly BulbData[] = [
  { cx: 38, cy: 85, r: 2.4, defaultColor: '#F5B83D' },
  { cx: 60, cy: 92, r: 2.3, defaultColor: '#FF5CA8' },
  { cx: 80, cy: 88, r: 2.4, defaultColor: '#3DDC84' },
  { cx: 95, cy: 83, r: 2.5, defaultColor: '#FF8A1F' },
  { cx: 115, cy: 89, r: 2.3, defaultColor: '#00F5D4' },
  { cx: 135, cy: 92, r: 2.4, defaultColor: '#E040C8' },
  { cx: 155, cy: 85, r: 2.3, defaultColor: '#F5B83D' },
  { cx: 230, cy: 132, r: 2.2, defaultColor: '#FF8A1F' },
  { cx: 265, cy: 138, r: 2.5, defaultColor: '#F5B83D' },
  { cx: 300, cy: 131, r: 2.2, defaultColor: '#3DDC84' },
  { cx: 345, cy: 114, r: 2.4, defaultColor: '#FF5CA8' },
  { cx: 366, cy: 119, r: 2.6, defaultColor: '#F5B83D' },
  { cx: 388, cy: 114, r: 2.3, defaultColor: '#00F5D4' },
  { cx: 435, cy: 128, r: 2.3, defaultColor: '#E040C8' },
  { cx: 475, cy: 136, r: 2.5, defaultColor: '#F5B83D' },
  { cx: 515, cy: 140, r: 2.4, defaultColor: '#FF8A1F' },
  { cx: 555, cy: 134, r: 2.3, defaultColor: '#3DDC84' },
  { cx: 585, cy: 126, r: 2.3, defaultColor: '#FF5CA8' },
  { cx: 620, cy: 98, r: 2.5, defaultColor: '#F5B83D' },
  { cx: 655, cy: 103, r: 2.4, defaultColor: '#FF8A1F' },
  { cx: 690, cy: 97, r: 2.5, defaultColor: '#00F5D4' },
  { cx: 720, cy: 93, r: 2.8, defaultColor: '#FFF3D6' },
  { cx: 750, cy: 97, r: 2.5, defaultColor: '#FF5CA8' },
  { cx: 785, cy: 103, r: 2.4, defaultColor: '#3DDC84' },
  { cx: 820, cy: 98, r: 2.5, defaultColor: '#F5B83D' },
  { cx: 640, cy: 128, r: 2.3, defaultColor: '#FF8A1F' },
  { cx: 680, cy: 133, r: 2.4, defaultColor: '#E040C8' },
  { cx: 720, cy: 136, r: 2.7, defaultColor: '#F5B83D' },
  { cx: 760, cy: 133, r: 2.4, defaultColor: '#00F5D4' },
  { cx: 800, cy: 128, r: 2.3, defaultColor: '#3DDC84' },
  { cx: 865, cy: 127, r: 2.3, defaultColor: '#F5B83D' },
  { cx: 905, cy: 135, r: 2.4, defaultColor: '#FF5CA8' },
  { cx: 945, cy: 140, r: 2.5, defaultColor: '#FF8A1F' },
  { cx: 985, cy: 134, r: 2.3, defaultColor: '#3DDC84' },
  { cx: 1045, cy: 114, r: 2.3, defaultColor: '#00F5D4' },
  { cx: 1066, cy: 119, r: 2.6, defaultColor: '#F5B83D' },
  { cx: 1088, cy: 114, r: 2.4, defaultColor: '#E040C8' },
  { cx: 1135, cy: 130, r: 2.3, defaultColor: '#FF8A1F' },
  { cx: 1175, cy: 137, r: 2.5, defaultColor: '#F5B83D' },
  { cx: 1215, cy: 132, r: 2.2, defaultColor: '#3DDC84' },
  { cx: 1270, cy: 86, r: 2.3, defaultColor: '#F5B83D' },
  { cx: 1292, cy: 92, r: 2.4, defaultColor: '#FF5CA8' },
  { cx: 1312, cy: 88, r: 2.4, defaultColor: '#00F5D4' },
  { cx: 1325, cy: 83, r: 2.5, defaultColor: '#FF8A1F' },
  { cx: 1345, cy: 89, r: 2.3, defaultColor: '#3DDC84' },
  { cx: 1368, cy: 92, r: 2.4, defaultColor: '#E040C8' },
  { cx: 1388, cy: 85, r: 2.3, defaultColor: '#F5B83D' },
];

export const RooftopsSilhouette: React.FC<RooftopsSilhouetteProps> = ({
  offsetY,
  onRooftopClick,
  bulbColors,
  className = '',
}) => {
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width > 0) {
      const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onRooftopClick(normX);
    }
  };

  return (
    <motion.div
      className={`absolute inset-x-0 bottom-0 z-[20] pointer-events-auto will-change-transform overflow-visible ${className}`}
      animate={{ y: offsetY }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 1. Ambient aura glow div behind rooftops */}
      <div
        className="absolute -inset-x-12 -top-40 bottom-0 pointer-events-none opacity-50 rooftop-ambient-glow mix-blend-screen filter blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 90%, rgba(245, 184, 61, 0.42) 0%, rgba(255, 138, 31, 0.25) 35%, rgba(224, 64, 200, 0.08) 58%, transparent 78%)',
        }}
      />

      {/* 2. Main SVG */}
      <svg
        aria-label="Interactive rooftop architecture"
        className="w-full h-auto max-h-[270px] filter drop-shadow-[0_-8px_30px_rgba(6,10,28,0.95)] block cursor-pointer transition-all duration-500 overflow-visible"
        preserveAspectRatio="none"
        role="region"
        viewBox="0 0 1440 260"
        onClick={handleSvgClick}
      >
        <defs>
          <filter id="windowGlowSubtle" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="festoonGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
          <linearGradient id="amberLampGlow" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#F5B83D" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFF3D6" stopOpacity="0.98" />
          </linearGradient>
          <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9E431B" />
            <stop offset="50%" stopColor="#753313" />
            <stop offset="100%" stopColor="#4E1F09" />
          </linearGradient>
          <radialGradient id="dynamicRippleWash" cx="50%" cy="85%" r="75%">
            <stop offset="0%" stopColor="#F5B83D" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#FF8A1F" stopOpacity="0.20" />
            <stop offset="85%" stopColor="#0B1026" stopOpacity="0" />
            <stop offset="100%" stopColor="#0B1026" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Architecture Silhouettes in #060A1C */}
        <g fill="#060A1C">
          {/* Left building with decorative arch stroke */}
          <rect x="35" y="80" width="120" height="180" />
          <polygon points="25,80 95,43 165,80" />
          <path
            d="M 35,92 Q 65,84 95,84 Q 125,84 155,92"
            fill="none"
            stroke="#F5B83D"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />

          {/* Left minaret with gold tip */}
          <path d="M 330,260 L 330,105 Q 365,58 365,38 L 365,26 L 367,26 L 367,38 Q 367,58 402,105 L 402,260 Z" />
          <circle cx="366" cy="24" r="3.2" fill="#F5B83D" opacity="0.9" />

          {/* Center palace with central taller minaret with gold tip */}
          <rect x="605" y="90" width="230" height="170" />
          <polygon points="595,90 720,50 845,90" />
          <path d="M 685,260 L 685,95 Q 720,38 720,18 L 720,10 L 722,10 L 722,18 Q 722,38 757,95 L 757,260 Z" />
          <circle cx="721" cy="9" r="3.6" fill="#F5B83D" opacity="0.95" />

          {/* Right minaret with gold tip */}
          <path d="M 1030,260 L 1030,105 Q 1065,58 1065,38 L 1065,26 L 1067,26 L 1067,38 Q 1067,58 1102,105 L 1102,260 Z" />
          <circle cx="1066" cy="24" r="3.2" fill="#F5B83D" opacity="0.9" />

          {/* Right building (mirror of left) */}
          <rect x="1265" y="80" width="120" height="180" />
          <polygon points="1255,80 1325,43 1395,80" />
          <path
            d="M 1265,92 Q 1325,84 1385,92"
            fill="none"
            stroke="#F5B83D"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />

          {/* Base parapet connecting all buildings */}
          <path d="M 0,260 L 0,140 L 150,140 L 150,125 L 210,125 L 210,140 L 320,140 L 320,118 L 412,118 L 412,140 L 600,140 L 600,120 L 840,120 L 840,140 L 1020,140 L 1020,118 L 1112,118 L 1112,140 L 1250,140 L 1250,125 L 1310,125 L 1310,140 L 1440,140 L 1440,260 Z" />
        </g>

        {/* Jharokha arch windows with amberLampGlow fill */}
        <g className="window-glow-anim" filter="url(#windowGlowSubtle)">
          <path d="M 85,115 Q 95,102 105,115 L 105,134 L 85,134 Z" fill="url(#amberLampGlow)" />
          <path d="M 356,128 Q 366,116 376,128 L 376,144 L 356,144 Z" fill="url(#amberLampGlow)" />
          <path d="M 708,118 Q 721,104 734,118 L 734,138 L 708,138 Z" fill="url(#amberLampGlow)" />
          <path
            d="M 645,130 Q 655,118 665,130 L 665,145 L 645,145 Z"
            fill="url(#amberLampGlow)"
            opacity="0.82"
          />
          <path
            d="M 775,130 Q 785,118 795,130 L 795,145 L 775,145 Z"
            fill="url(#amberLampGlow)"
            opacity="0.82"
          />
          <path d="M 1056,128 Q 1066,116 1076,128 L 1076,144 L 1056,144 Z" fill="url(#amberLampGlow)" />
          <path d="M 1315,115 Q 1325,102 1335,115 L 1335,134 L 1315,134 Z" fill="url(#amberLampGlow)" />
        </g>

        {/* Festoon Garland Wires & Bulbs */}
        <g filter="url(#festoonGlow)" id="festoon-garlands">
          <g fill="none" opacity="0.4" stroke="#F5B83D" strokeWidth="0.85">
            <path d="M 25,82 Q 60,94 95,82 Q 130,94 165,82" />
            <path d="M 210,126 Q 265,142 320,122" />
            <path d="M 330,110 Q 366,122 402,110" />
            <path d="M 412,122 Q 506,144 600,122" />
            <path d="M 600,92 Q 660,105 720,92 Q 780,105 840,92" />
            <path d="M 600,122 Q 720,138 840,122" />
            <path d="M 840,122 Q 930,144 1020,122" />
            <path d="M 1030,110 Q 1066,122 1102,110" />
            <path d="M 1112,122 Q 1180,142 1250,126" />
            <path d="M 1255,82 Q 1290,94 1325,82 Q 1360,94 1395,82" />
          </g>

          <g id="fairy-bulbs">
            {FAIRY_BULBS.map((bulb, index) => {
              const color =
                bulbColors && bulbColors.length > 0
                  ? bulbColors[index % bulbColors.length]
                  : bulb.defaultColor;

              return (
                <circle
                  key={`bulb-${bulb.cx}-${bulb.cy}-${index}`}
                  className="festoon-bulb"
                  cx={bulb.cx}
                  cy={bulb.cy}
                  r={bulb.r}
                  fill={color}
                  style={{ color }}
                />
              );
            })}
          </g>
        </g>
      </svg>
    </motion.div>
  );
};

export default RooftopsSilhouette;
