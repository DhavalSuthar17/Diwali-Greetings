import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface DiyaItem {
  readonly id: number;
  readonly lit: boolean;
}

export interface DiyaParapetProps {
  readonly diyas: readonly DiyaItem[];
  readonly onLight: (id: number) => void;
  readonly interactive: boolean;
  readonly onAllLit?: () => void;
  readonly className?: string;
}

const VERTICAL_OFFSETS = [
  'mb-0',
  'mb-1',
  'mb-2 sm:mb-3',
  'mb-2 sm:mb-3',
  'mb-1',
  'mb-0',
];

export const DiyaParapet: React.FC<DiyaParapetProps> = ({
  diyas,
  onLight,
  interactive,
  onAllLit,
  className = '',
}) => {
  const prevAllLitRef = useRef(false);

  useEffect(() => {
    const isAllLit = diyas.length > 0 && diyas.every((d) => d.lit);
    if (isAllLit && !prevAllLitRef.current) {
      prevAllLitRef.current = true;
      onAllLit?.();
    } else if (!isAllLit) {
      prevAllLitRef.current = false;
    }
  }, [diyas, onAllLit]);

  const handleClick = (id: number) => {
    if (!interactive) return;
    onLight(id);
  };

  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-40 pointer-events-none select-none flex flex-col justify-end ${className}`}
    >
      {/* Hidden global SVG gradients definition for Diyas */}
      <svg className="sr-only" aria-hidden="true" width="0" height="0">
        <defs>
          <linearGradient id="diyaFlameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF5A1F" />
            <stop offset="65%" stopColor="#F5B83D" />
            <stop offset="100%" stopColor="#FFF3D6" />
          </linearGradient>
          <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9E431B" />
            <stop offset="50%" stopColor="#753313" />
            <stop offset="100%" stopColor="#4E1F09" />
          </linearGradient>
        </defs>
      </svg>

      <div className="w-full relative pb-4 md:pb-6">
        {/* 1. Floor glow gradient div from silhouette-dark */}
        <div
          id="parapet-floor-glow"
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-silhouette-dark via-silhouette-dark/80 to-transparent pointer-events-none transition-all duration-700"
        />

        {/* 2. Container div with 6 diya buttons spread with justify-around */}
        <div
          role="group"
          aria-label="Traditional Rooftop Diyas"
          className="relative z-10 w-full max-w-4xl mx-auto flex justify-around sm:justify-between items-end px-4 sm:px-12 md:px-20 pointer-events-auto"
        >
          {diyas.map((diya, index) => {
            const offsetClass = VERTICAL_OFFSETS[index % VERTICAL_OFFSETS.length];
            const diyaNumber = diya.id + 1;

            return (
              <button
                key={`diya-${diya.id}`}
                type="button"
                aria-label={`Kindle earthenware diya ${diyaNumber}`}
                aria-pressed={diya.lit}
                disabled={!interactive}
                onClick={() => handleClick(diya.id)}
                className={`diya-item group relative w-14 sm:w-15 h-16 sm:h-17 flex flex-col items-center justify-end focus:outline-none focus:scale-105 min-w-[48px] min-h-[48px] transition-transform duration-200 ${
                  interactive ? 'cursor-pointer' : 'cursor-default'
                } ${offsetClass}`}
              >
                {/* Parapet glow span (orange blur, visible when lit) */}
                <span
                  className={`parapet-glow absolute -bottom-2 w-16 sm:w-18 h-5 rounded-full blur-md pointer-events-none transition-all duration-700 ${
                    diya.lit
                      ? 'bg-orange-secondary/50 opacity-100'
                      : 'bg-orange-secondary/0 opacity-0'
                  }`}
                />

                {/* Flame halo span with Framer Motion entrance */}
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={
                    diya.lit
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0.5, opacity: 0 }
                  }
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flame-halo absolute bottom-[50%] flex flex-col items-center pointer-events-none"
                >
                  {/* Outer warm glow circle */}
                  <span className="absolute -top-7 sm:-top-8 w-16 sm:w-18 h-16 sm:h-18 rounded-full bg-orange-secondary/25 blur-lg" />

                  {/* SVG flame with teardrop path using diyaFlameGrad gradient */}
                  <svg
                    className="diya-flame-active w-5 sm:w-6 h-8 sm:h-9 overflow-visible"
                    viewBox="0 0 24 38"
                    aria-hidden="true"
                  >
                    <path
                      d="M12,2 C15,9 22,17 22,25 C22,32 17.5,37 12,37 C6.5,37 2,32 2,25 C2,17 9,9 12,2 Z"
                      fill="url(#diyaFlameGrad)"
                    />
                    {/* Inner white-cream ellipse */}
                    <ellipse
                      cx="12"
                      cy="27"
                      rx="3.4"
                      ry="6.2"
                      fill="#FFF3D6"
                    />
                  </svg>
                </motion.span>

                {/* Terracotta pot SVG */}
                <svg
                  className="w-12 sm:w-14 h-6 sm:h-6.5 text-[#753313] drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
                  viewBox="0 0 76 34"
                  aria-hidden="true"
                >
                  {/* Bowl shape with terracotta gradient */}
                  <path
                    d="M5,13 C11,28 65,28 71,13 C65,19 50,21 38,21 C24,21 11,19 5,13 Z"
                    fill="url(#terracottaGrad)"
                  />
                  {/* Top ellipse rim in #A84C20 */}
                  <ellipse cx="38" cy="13" rx="33" ry="8.5" fill="#A84C20" />
                  {/* Inner dark fill #421A08 */}
                  <ellipse cx="38" cy="13.5" rx="25" ry="5.8" fill="#421A08" />
                  {/* Wick stroke */}
                  <path
                    d="M37,13 C38,10 39,9 40,8"
                    fill="none"
                    stroke="#251206"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DiyaParapet;
