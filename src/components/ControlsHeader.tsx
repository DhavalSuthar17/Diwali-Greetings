import type { FC } from 'react';
import { motion } from 'framer-motion';

export interface ControlsHeaderProps {
  readonly visible: boolean;
  readonly isMuted: boolean;
  readonly themeName: string;
  readonly themeColor: string;
  readonly onToggleMute: () => void;
  readonly onCycleTheme: () => void;
  readonly onShare: () => void;
  readonly className?: string;
}

export const ControlsHeader: FC<ControlsHeaderProps> = ({
  visible,
  isMuted,
  themeName,
  themeColor,
  onToggleMute,
  onCycleTheme,
  onShare,
  className = '',
}) => {
  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-[60] pointer-events-none p-3.5 sm:p-5 md:p-6 flex items-center justify-between ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -10 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {/* Left: Music / Mute Toggle + Theme Cycle */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        <button
          type="button"
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          onClick={onToggleMute}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-silhouette-dark/70 hover:bg-silhouette-dark/95 backdrop-blur-md flex items-center justify-center text-gold-primary/80 hover:text-gold-primary border border-gold-primary/20 hover:border-gold-primary/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[19px]">
            {isMuted ? 'volume_off' : 'volume_up'}
          </span>
        </button>

        <button
          type="button"
          aria-label="Cycle lighting atmosphere"
          onClick={onCycleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-silhouette-dark/70 hover:bg-silhouette-dark/95 backdrop-blur-md border border-gold-primary/20 hover:border-gold-primary/50 transition-all duration-300 shadow-md group cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-primary/50"
        >
          <span
            className="w-2.5 h-2.5 rounded-full group-hover:scale-125 transition-transform"
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 0 8px ${themeColor}`,
            }}
          />
          <span className="font-body text-[12px] tracking-wider uppercase text-text-cream/80 group-hover:text-gold-primary transition-colors font-medium">
            {themeName}
          </span>
        </button>
      </div>

      {/* Right: Share Button */}
      <div className="pointer-events-auto">
        <button
          type="button"
          aria-label="Share Diwali blessing"
          onClick={onShare}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-silhouette-dark/70 hover:bg-silhouette-dark/95 backdrop-blur-md flex items-center justify-center text-gold-primary/80 hover:text-gold-primary border border-gold-primary/20 hover:border-gold-primary/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-primary/50 cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[19px]">share</span>
        </button>
      </div>
    </motion.header>
  );
};
