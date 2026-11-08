import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TapToBeginProps {
  onStart: () => void;
  visible: boolean;
}

interface FloatingLight {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  swaySpeed: number;
  swayRange: number;
  baseAlpha: number;
  phase: number;
  colorBase: string;
  candleCore: boolean;
}

interface DistantBurst {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

export const TapToBegin: React.FC<TapToBeginProps> = ({ onStart, visible }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const lights: FloatingLight[] = [];
    const distantBursts: DistantBurst[] = [];

    const palette = [
      'rgba(245, 184, 61, ',   // Gold
      'rgba(255, 138, 31, ',   // Orange
      'rgba(255, 92, 168, ',   // Pink
      'rgba(224, 64, 200, ',   // Magenta
      'rgba(61, 220, 132, ',   // Green
    ];

    const initLights = () => {
      lights.length = 0;
      for (let i = 0; i < 40; i++) {
        lights.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 28 + 14,
          speedY: Math.random() * 0.28 + 0.12,
          swaySpeed: Math.random() * 0.012 + 0.005,
          swayRange: Math.random() * 18 + 8,
          baseAlpha: Math.random() * 0.28 + 0.15,
          phase: Math.random() * Math.PI * 2,
          colorBase: palette[Math.floor(Math.random() * palette.length)],
          candleCore: Math.random() > 0.35,
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initLights();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render floating light orbs
      for (let i = 0; i < lights.length; i++) {
        const l = lights[i];
        l.y -= l.speedY;
        l.phase += l.swaySpeed;
        const currentX = l.x + Math.sin(l.phase) * l.swayRange;
        const currentAlpha = Math.max(0.04, l.baseAlpha + Math.sin(l.phase * 2) * 0.06);

        const grad = ctx.createRadialGradient(currentX, l.y, 0, currentX, l.y, l.radius);
        grad.addColorStop(0, `${l.colorBase}${currentAlpha})`);
        grad.addColorStop(0.45, `${l.colorBase}${currentAlpha * 0.5})`);
        grad.addColorStop(1, `${l.colorBase}0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(currentX, l.y, l.radius, 0, Math.PI * 2);
        ctx.fill();

        if (l.candleCore) {
          const coreGrad = ctx.createRadialGradient(currentX, l.y, 0, currentX, l.y, l.radius * 0.35);
          coreGrad.addColorStop(0, `rgba(255, 243, 214, ${currentAlpha * 0.85})`);
          coreGrad.addColorStop(1, 'rgba(255, 138, 31, 0)');
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(currentX, l.y, l.radius * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }

        if (l.y < -l.radius * 2) {
          l.y = height + l.radius * 2;
          l.x = Math.random() * width;
        }
      }

      // Occasional gentle ambient background burst
      if (Math.random() < 0.025 && distantBursts.length < 4) {
        distantBursts.push({
          x: Math.random() * (width * 0.8) + width * 0.1,
          y: Math.random() * (height * 0.45) + height * 0.1,
          radius: Math.random() * 40 + 25,
          color: Math.random() > 0.5 ? 'rgba(245, 184, 61,' : 'rgba(255, 92, 168,',
          alpha: 0.35,
          decay: 0.007,
        });
      }

      for (let i = distantBursts.length - 1; i >= 0; i--) {
        const db = distantBursts[i];
        db.alpha -= db.decay;
        db.radius += 0.45;
        if (db.alpha <= 0) {
          distantBursts.splice(i, 1);
          continue;
        }
        const bgGlow = ctx.createRadialGradient(db.x, db.y, 0, db.x, db.y, db.radius);
        bgGlow.addColorStop(0, `${db.color} ${db.alpha})`);
        bgGlow.addColorStop(1, `${db.color} 0)`);
        ctx.fillStyle = bgGlow;
        ctx.beginPath();
        ctx.arc(db.x, db.y, db.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="tap-to-begin-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onClick={onStart}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onStart();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Tap anywhere to begin ceremony"
          className="fixed inset-0 z-[9999] bg-[#0B1026] flex flex-col items-center justify-center p-6 cursor-pointer select-none overflow-hidden pointer-events-auto focus:outline-none"
        >
          {/* Subtle floating blurred light orbs canvas */}
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none filter blur-[1px]"
          />

          {/* Vignette depth gradient */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#060A1C]/80 via-transparent to-[#060A1C]/60" />

          {/* Centered Content */}
          <div className="relative z-10 flex flex-col items-center text-center pointer-events-none">
            <div className="relative flex items-center justify-center mb-6">
              <div className="rocket-hover-anim relative flex items-center justify-center">
                {/* Standalone Authentic Indian Firework Rocket Icon */}
                <svg
                  className="w-14 h-14 sm:w-16 sm:h-16 text-[#F5B83D] drop-shadow-[0_0_16px_rgba(245,184,61,0.65)]"
                  fill="none"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="tapRocketBodyGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFF3D6" />
                      <stop offset="35%" stopColor="#F5B83D" />
                      <stop offset="100%" stopColor="#D98A1B" />
                    </linearGradient>
                    <linearGradient id="tapRocketConeGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFE4A0" />
                      <stop offset="60%" stopColor="#FF8A1F" />
                      <stop offset="100%" stopColor="#D94E00" />
                    </linearGradient>
                    <linearGradient id="tapRocketFinGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#FF9E3D" />
                      <stop offset="100%" stopColor="#C24400" />
                    </linearGradient>
                    <radialGradient id="tapSparkTip" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="40%" stopColor="#FFF3D6" />
                      <stop offset="100%" stopColor="#F5B83D" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* Rocket Stick */}
                  <path d="M23 41 L10 54" stroke="#8C7A58" strokeLinecap="round" strokeWidth="2.2" />
                  {/* Fuse / spark trace */}
                  <path d="M25 43 L18 50" stroke="#FF8A1F" strokeLinecap="round" strokeOpacity="0.8" strokeWidth="1.2" />
                  {/* Left & Right Fins */}
                  <path d="M26 38 L19 41 L23 45 Z" fill="url(#tapRocketFinGrad)" />
                  <path d="M38 26 L41 19 L45 23 Z" fill="url(#tapRocketFinGrad)" />
                  {/* Cylindrical Main Body */}
                  <path d="M24 40 L38 26 L44 32 L30 46 Z" fill="url(#tapRocketBodyGrad)" />
                  {/* Traditional gold accents */}
                  <path d="M27 37 L33 43" stroke="#FFF3D6" strokeOpacity="0.9" strokeWidth="1.4" />
                  <path d="M32 32 L38 38" stroke="#0B1026" strokeOpacity="0.35" strokeWidth="1.2" />
                  <path d="M35 29 L41 35" stroke="#FFF3D6" strokeOpacity="0.7" strokeWidth="1.2" />
                  {/* Pointed Nose Cone */}
                  <path d="M38 26 L51 13 L44 32 Z" fill="url(#tapRocketConeGrad)" />
                  {/* Glowing Spark Tip */}
                  <circle cx="51.5" cy="12.5" r="4.5" fill="url(#tapSparkTip)" />
                  <circle cx="51.5" cy="12.5" r="1.5" fill="#FFFFFF" />
                  <circle cx="55" cy="9" r="1" fill="#FFF3D6" opacity="0.9" />
                  <circle cx="49" cy="7" r="0.8" fill="#F5B83D" opacity="0.8" />
                  <circle cx="57" cy="15" r="0.8" fill="#FF8A1F" opacity="0.85" />
                </svg>
              </div>
            </div>
            <p className="font-body italic text-[20px] sm:text-[22px] text-[#FFF3D6] font-normal tracking-[0.16em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              Tap to begin
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TapToBegin;
