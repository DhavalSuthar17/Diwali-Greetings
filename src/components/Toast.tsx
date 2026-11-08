import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastProps {
  readonly message: string;
  readonly visible: boolean;
}

export const Toast: FC<ToastProps> = ({ message, visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          className="fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-[80] pointer-events-none px-4 py-1.5 rounded-full bg-[#182142]/95 backdrop-blur-md border border-gold-primary/35 shadow-xl text-text-cream font-body text-[14px] text-center tracking-wide"
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
