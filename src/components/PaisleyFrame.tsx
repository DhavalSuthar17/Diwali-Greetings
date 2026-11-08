import type { FC } from 'react';
import { motion } from 'framer-motion';

export interface PaisleyFrameProps {
  readonly visible: boolean;
  readonly className?: string;
}

export const PaisleyFrame: FC<PaisleyFrameProps> = ({ visible, className = '' }) => {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-[45] p-3 sm:p-6 md:p-8 flex flex-col justify-between ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* Top Corners */}
      <div className="flex justify-between items-start">
        {/* Top-Left Paisley / Kalka Motif */}
        <svg
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gold-primary/25 fill-none stroke-current"
          strokeWidth="0.9"
          viewBox="0 0 120 120"
        >
          <path d="M15,105 C15,35 65,15 100,15 C90,40 55,42 55,70 C55,90 85,82 72,100 C60,112 28,112 15,105 Z" />
          <circle cx="50" cy="58" r="2.5" fill="#F5B83D" opacity="0.4" />
          <path d="M 28,95 C 28,52 62,30 84,28" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>

        {/* Top-Right Paisley (Mirrored horizontally) */}
        <svg
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gold-primary/25 fill-none stroke-current scale-x-[-1]"
          strokeWidth="0.9"
          viewBox="0 0 120 120"
        >
          <path d="M15,105 C15,35 65,15 100,15 C90,40 55,42 55,70 C55,90 85,82 72,100 C60,112 28,112 15,105 Z" />
          <circle cx="50" cy="58" r="2.5" fill="#F5B83D" opacity="0.4" />
          <path d="M 28,95 C 28,52 62,30 84,28" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* Bottom Corners */}
      <div className="flex justify-between items-end">
        {/* Bottom-Left Paisley (Mirrored vertically) */}
        <svg
          className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gold-primary/20 fill-none stroke-current scale-y-[-1]"
          strokeWidth="0.9"
          viewBox="0 0 120 120"
        >
          <path d="M15,105 C15,35 65,15 100,15 C90,40 55,42 55,70 C55,90 85,82 72,100 C60,112 28,112 15,105 Z" />
        </svg>

        {/* Bottom-Right Paisley (Mirrored both axes) */}
        <svg
          className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gold-primary/20 fill-none stroke-current scale-[-1]"
          strokeWidth="0.9"
          viewBox="0 0 120 120"
        >
          <path d="M15,105 C15,35 65,15 100,15 C90,40 55,42 55,70 C55,90 85,82 72,100 C60,112 28,112 15,105 Z" />
        </svg>
      </div>
    </motion.div>
  );
};
