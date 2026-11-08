import React from 'react';
import { motion } from 'framer-motion';

export interface HillsSilhouetteProps {
  readonly offsetY: number;
  readonly className?: string;
}

export const HillsSilhouette: React.FC<HillsSilhouetteProps> = ({
  offsetY,
  className = '',
}) => {
  return (
    <motion.div
      className={`absolute inset-x-0 bottom-0 z-[15] pointer-events-none will-change-transform ${className}`}
      animate={{ y: offsetY }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        aria-hidden="true"
        className="w-full h-auto max-h-[190px] fill-silhouette-dark opacity-90 block"
        preserveAspectRatio="none"
        viewBox="0 0 1440 180"
      >
        <path d="M0,180 L0,120 Q180,95 360,110 T720,105 Q980,85 1200,105 T1440,95 L1440,180 Z" />
      </svg>
    </motion.div>
  );
};

export default HillsSilhouette;
