import type { FC } from 'react';
import { motion } from 'framer-motion';

export interface ControlsFooterProps {
  readonly visible: boolean;
  readonly onReplay: () => void;
  readonly className?: string;
}

export const ControlsFooter: FC<ControlsFooterProps> = ({
  visible,
  onReplay,
  className = '',
}) => {
  return (
    <motion.footer
      className={`fixed bottom-0 inset-x-0 z-[60] pointer-events-none p-3 sm:p-4 flex items-center justify-between ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {/* Spacer for symmetrical balancing */}
      <div className="w-10 h-10 hidden sm:block" />

      {/* Center discreet label */}
      <div className="pointer-events-auto mx-auto text-center select-none">
        <span className="font-body text-text-cream/45 text-[11px] sm:text-[12px] tracking-[0.25em] uppercase font-light">
          Made with love • Shubh Deepavali
        </span>
      </div>

      {/* Right Replay Button */}
      <div className="pointer-events-auto flex items-center">
        <button
          type="button"
          aria-label="Replay intro sequence"
          onClick={onReplay}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-silhouette-dark/70 hover:bg-silhouette-dark/95 backdrop-blur-md flex items-center justify-center text-gold-primary/70 hover:text-gold-primary border border-gold-primary/20 hover:border-gold-primary/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[19px]">replay</span>
        </button>
      </div>
    </motion.footer>
  );
};
