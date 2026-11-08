import type { FC } from 'react';
import { motion } from 'framer-motion';

export interface MandalaProps {
  readonly isBlooming: boolean;
  readonly isSettled: boolean;
  readonly className?: string;
}

export const Mandala: FC<MandalaProps> = ({ isBlooming, isSettled, className = '' }) => {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[18] select-none flex items-center justify-center ${className}`}
      initial={{ scale: 0.2, opacity: 0 }}
      animate={
        isBlooming || isSettled
          ? {
              scale: isSettled ? [1, 1.035, 1] : 1,
              opacity: isSettled ? [0.38, 0.58, 0.38] : 0.6,
            }
          : { scale: 0.2, opacity: 0 }
      }
      transition={
        isSettled
          ? {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : {
              duration: 1.0,
              ease: 'easeOut',
            }
      }
      style={{
        width: 'min(72vw, 72vh, 600px)',
        height: 'min(72vw, 72vh, 600px)',
        filter: 'drop-shadow(0 0 20px rgba(245, 184, 61, 0.45)) drop-shadow(0 0 45px rgba(255, 138, 31, 0.25))',
      }}
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full text-gold-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <radialGradient id="mandalaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF3D6" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#F5B83D" stopOpacity="0.7" />
            <stop offset="85%" stopColor="#FF8A1F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F5B83D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Ring */}
        <circle cx="200" cy="200" r="185" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="200" cy="200" r="172" strokeWidth="1.4" opacity="0.8" />
        <circle cx="200" cy="200" r="158" strokeWidth="0.9" opacity="0.5" />

        {/* 16 Outer Lotus Petals */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={`outer-${i}`} transform={`rotate(${angle} 200 200)`}>
              <path
                d="M 200,28 C 188,70 178,110 200,140 C 222,110 212,70 200,28 Z"
                strokeWidth="1.1"
                opacity="0.85"
              />
              <circle cx="200" cy="28" r="2.5" fill="#F5B83D" />
              <path d="M 200,38 L 200,125" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
            </g>
          );
        })}

        {/* Intermediate Ring */}
        <circle cx="200" cy="200" r="128" strokeWidth="1.2" opacity="0.75" />
        <circle cx="200" cy="200" r="115" strokeWidth="0.7" strokeDasharray="4 2" opacity="0.6" />

        {/* 12 Mid-Layer Petals with Kalash Silhouette */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <g key={`mid-${i}`} transform={`rotate(${angle} 200 200)`}>
              <path
                d="M 200,85 C 182,112 178,142 200,165 C 222,142 218,112 200,85 Z"
                strokeWidth="1.2"
                opacity="0.9"
              />
              <circle cx="200" cy="88" r="2.2" fill="#FFF3D6" />
            </g>
          );
        })}

        {/* Inner Ring */}
        <circle cx="200" cy="200" r="75" strokeWidth="1.3" opacity="0.85" />
        <circle cx="200" cy="200" r="62" strokeWidth="0.8" opacity="0.6" />

        {/* 8 Inner Sacred Rays */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <g key={`inner-${i}`} transform={`rotate(${angle} 200 200)`}>
              <path
                d="M 200,138 C 190,158 190,178 200,190 C 210,178 210,158 200,138 Z"
                strokeWidth="1.4"
                fill="url(#mandalaGrad)"
                opacity="0.8"
              />
            </g>
          );
        })}

        {/* Center Bindu */}
        <circle cx="200" cy="200" r="26" strokeWidth="1.2" opacity="0.9" />
        <circle cx="200" cy="200" r="12" fill="#F5B83D" opacity="0.65" />
        <circle cx="200" cy="200" r="4" fill="#FFF3D6" opacity="0.9" />
      </svg>
    </motion.div>
  );
};
