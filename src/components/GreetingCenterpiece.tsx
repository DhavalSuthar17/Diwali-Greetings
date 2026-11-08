import React from 'react';
import { motion, type Transition } from 'framer-motion';

export interface GreetingCenterpieceProps {
  readonly recipientName: string | null;
  readonly showRecipient: boolean;
  readonly showOm: boolean;
  readonly showHeadline: boolean;
  readonly showWish: boolean;
  readonly showHint: boolean;
  readonly wishText?: string;
  readonly className?: string;
}

const DEFAULT_WISH =
  'May the light of a thousand diyas guide your path to joy, prosperity, and peace.';

const transitionConfig: Transition = {
  duration: 0.7,
  ease: [0.16, 1, 0.3, 1],
};

export const GreetingCenterpiece: React.FC<GreetingCenterpieceProps> = ({
  recipientName,
  showRecipient,
  showOm,
  showHeadline,
  showWish,
  showHint,
  wishText = DEFAULT_WISH,
  className = '',
}) => {
  const hasRecipient = Boolean(recipientName && recipientName.trim().length > 0);

  return (
    <section
      aria-label="Festive Diwali Greeting"
      className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] w-[90%] max-w-[620px] text-center flex flex-col items-center justify-center pointer-events-none select-none ${className}`}
    >
      {/* 1. Recipient line */}
      {hasRecipient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showRecipient ? 1 : 0,
            y: showRecipient ? 0 : 20,
          }}
          transition={transitionConfig}
          className="mb-1"
        >
          <p className="font-body italic text-gold-primary/100 text-[26px] sm:text-[30px] md:text-[35px] tracking-wider">
            Dear {recipientName?.trim()},
          </p>
        </motion.div>
      )}

      {/* 2. Om symbol */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showOm ? 1 : 0,
          y: showOm ? 0 : 20,
        }}
        transition={transitionConfig}
        className="mb-1"
      >
        <span
          aria-label="Sacred Om symbol"
          className="font-sacred text-gold-primary/70 text-[26px] sm:text-[30px] filter drop-shadow-[0_0_12px_rgba(245,184,61,0.5)] block leading-none"
        >
          ॐ
        </span>
      </motion.div> */}

      {/* 3. Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showHeadline ? 1 : 0,
          y: showHeadline ? 0 : 20,
        }}
        transition={transitionConfig}
        className="my-2"
      >
        <h1 className="font-headline italic font-normal text-gold-primary text-[44px] sm:text-[56px] md:text-[68px] leading-[1.1] tracking-wide luminous-headline m-0">
          Happy Diwali
        </h1>
      </motion.div>

      {/* 4. Wish line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showWish ? 1 : 0,
          y: showWish ? 0 : 20,
        }}
        transition={transitionConfig}
        className="max-w-[520px] mx-auto mt-2 px-4"
      >
        <p className="font-body text-text-cream/95 font-light italic text-[18px] sm:text-[21px] md:text-[23px] leading-[1.65] m-0">
          {wishText}
        </p>
      </motion.div>

      {/* 5. Hint pill */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showHint ? 1 : 0,
          y: showHint ? 0 : 20,
        }}
        transition={{ ...transitionConfig, duration: 0.5 }}
        className="mt-6 flex items-center gap-2 px-3.5 py-1 rounded-full bg-silhouette-dark/70 backdrop-blur-sm border border-gold-primary/20 shadow-sm"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-ping" />
        <span className="font-body tracking-[0.16em] uppercase text-[11px] font-medium text-gold-primary/80">
          Tap sky for fireworks • Tap terrace to light
        </span>
      </motion.div>
    </section>
  );
};

export default GreetingCenterpiece;
