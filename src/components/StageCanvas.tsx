import React, { useEffect, useRef, useCallback } from 'react';

export interface StageCanvasProps {
  isActive: boolean;
  introStage: string;
  onExplode?: (x: number, y: number, color: string) => void;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
}

interface Sparkle {
  x: number;
  y: number;
  speedY: number;
  speedX: number;
  size: number;
  alpha: number;
  phase: number;
}

interface Lantern {
  x: number;
  y: number;
  speedY: number;
  swaySpeed: number;
  swayRange: number;
  width: number;
  height: number;
  alpha: number;
  phase: number;
}

const FIREWORK_COLORS = [
  '#F5B83D', // Gold
  '#FF8A1F', // Orange
  '#FF5CA8', // Pink
  '#E040C8', // Magenta
  '#3DDC84', // Green
  '#00F5D4', // Cyan
  '#FFE4A0', // Champagne Gold
];

class Rocket {
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
  isIntro: boolean;
  onBurst?: (x: number, y: number) => void;
  dx: number;
  dy: number;
  distance: number;
  traveled: number;
  angle: number;
  speed: number;
  accel: number;
  trail: Array<{ x: number; y: number }>;
  maxTrail: number;
  wobblePhase: number;

  constructor(
    sx: number,
    sy: number,
    tx: number,
    ty: number,
    color: string,
    isIntro = false,
    onBurst?: (x: number, y: number) => void
  ) {
    this.x = sx;
    this.y = sy;
    this.tx = tx;
    this.ty = ty;
    this.color = color;
    this.isIntro = isIntro;
    this.onBurst = onBurst;
    this.dx = tx - sx;
    this.dy = ty - sy;
    this.distance = Math.hypot(this.dx, this.dy);
    this.traveled = 0;
    this.angle = Math.atan2(this.dy, this.dx);
    this.speed = isIntro ? 4.5 : 5.8;
    this.accel = isIntro ? 1.036 : 1.042;
    this.trail = [];
    this.maxTrail = isIntro ? 14 : 10;
    this.wobblePhase = Math.random() * Math.PI * 2;
  }

  update(): boolean {
    this.speed *= this.accel;
    this.wobblePhase += 0.32;
    const wobble = Math.sin(this.wobblePhase) * 0.45;
    const vx = Math.cos(this.angle) * this.speed + wobble;
    const vy = Math.sin(this.angle) * this.speed;

    this.trail.unshift({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) this.trail.pop();

    this.x += vx;
    this.y += vy;
    this.traveled += Math.hypot(vx, vy);

    if (this.traveled >= this.distance || this.y <= this.ty) {
      if (this.onBurst) {
        this.onBurst(this.tx, this.ty);
      }
      return true; // reached destination, ready to burst
    }
    return false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const len = this.trail.length;
    for (let i = 0; i < len; i++) {
      const p = this.trail[i];
      const a = 1 - i / len;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.7, 3.2 - i * 0.26), 0, Math.PI * 2);
      ctx.fillStyle = i < 3 ? '#FFF3D6' : this.color;
      ctx.globalAlpha = a * 0.9;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Glowing head
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF3D6';
    ctx.fill();
  }
}

class BurstParticle {
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
  friction: number;
  gravity: number;
  alpha: number;
  decay: number;
  radius: number;
  isGlitter: boolean;
  sparklePhase: number;
  trail: Array<{ x: number; y: number }>;
  maxTrail: number;

  constructor(
    x: number,
    y: number,
    color: string,
    opts: {
      angle?: number;
      speed?: number;
      friction?: number;
      gravity?: number;
      decay?: number;
      radius?: number;
      maxTrail?: number;
    } = {}
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = opts.angle !== undefined ? opts.angle : Math.random() * Math.PI * 2;
    this.speed = opts.speed !== undefined ? opts.speed : Math.random() * 7.5 + 2.2;
    this.friction = opts.friction || 0.958;
    this.gravity = opts.gravity || 0.045;
    this.alpha = 1;
    this.decay = opts.decay || Math.random() * 0.012 + 0.007;
    this.radius = opts.radius || 1.7;
    this.isGlitter = Math.random() < 0.28;
    this.sparklePhase = Math.random() * Math.PI * 2;
    this.trail = [];
    this.maxTrail = opts.maxTrail || 8;
  }

  update(): boolean {
    this.trail.unshift({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) this.trail.pop();

    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.isGlitter) {
      this.sparklePhase += 0.35;
      this.alpha += Math.sin(this.sparklePhase) * 0.04;
    }

    return this.alpha <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    const len = this.trail.length;
    for (let i = 0; i < len; i++) {
      const t = this.trail[i];
      ctx.beginPath();
      ctx.arc(t.x, t.y, Math.max(0.4, this.radius * (1 - i * 0.11)), 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, (1 - i / len) * this.alpha * 0.75);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.isGlitter ? '#FFFFFF' : '#FFF3D6';
    ctx.globalAlpha = Math.min(1, Math.max(0, this.alpha * 1.2));
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export const StageCanvas: React.FC<StageCanvasProps> = ({
  isActive,
  introStage,
  onExplode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Particle systems persistent state
  const starsRef = useRef<Star[]>([]);
  const sparklesRef = useRef<Sparkle[]>([]);
  const lanternsRef = useRef<Lantern[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const burstParticlesRef = useRef<BurstParticle[]>([]);

  // Track intro rocket launch state
  const introRocketLaunchedRef = useRef(false);

  // Keep callback fresh in ref
  const onExplodeRef = useRef(onExplode);
  useEffect(() => {
    onExplodeRef.current = onExplode;
  }, [onExplode]);

  const explodeAt = useCallback((x: number, y: number, primaryColor?: string, isIntro = false) => {
    const c1 = primaryColor || FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
    const c2 = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
    const count = isIntro ? 160 : 110;

    // Primary burst ring
    const ringCount = Math.floor(count * 0.6);
    for (let i = 0; i < ringCount; i++) {
      const angle = (Math.PI * 2 * i) / ringCount + (Math.random() - 0.5) * 0.18;
      burstParticlesRef.current.push(
        new BurstParticle(x, y, c1, {
          angle,
          speed: Math.random() * 3.5 + 4.5,
          friction: 0.962,
          decay: Math.random() * 0.01 + 0.006,
          maxTrail: 10,
        })
      );
    }

    // Secondary inner burst
    const innerCount = Math.floor(count * 0.4);
    for (let i = 0; i < innerCount; i++) {
      burstParticlesRef.current.push(
        new BurstParticle(x, y, c2, {
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 3.2 + 2.0,
          friction: 0.95,
          decay: Math.random() * 0.012 + 0.008,
          maxTrail: 8,
        })
      );
    }

    if (onExplodeRef.current) {
      onExplodeRef.current(x, y, c1);
    }

    // Notify other components (e.g., rooftop lighting pulse)
    window.dispatchEvent(
      new CustomEvent('diwali-stage-burst', {
        detail: { x, y, color: c1, isIntro },
      })
    );
  }, []);

  const launchRocket = useCallback(
    (
      sx: number,
      sy: number,
      tx: number,
      ty: number,
      color?: string,
      isIntro = false,
      onBurst?: (x: number, y: number) => void
    ) => {
      const chosenColor = color || FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
      rocketsRef.current.push(
        new Rocket(sx, sy, tx, ty, chosenColor, isIntro, (bx, by) => {
          explodeAt(bx, by, chosenColor, isIntro);
          if (onBurst) onBurst(bx, by);
        })
      );
    },
    [explodeAt]
  );

  // Initialize Stars (75 twinkling dots)
  const initStars = useCallback((w: number, h: number) => {
    starsRef.current = [];
    for (let i = 0; i < 75; i++) {
      starsRef.current.push({
        x: Math.random() * w,
        y: Math.random() * (h * 0.72),
        radius: Math.random() * 1.1 + 0.3,
        alpha: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.02 + 0.006,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }, []);

  // Initialize Golden Sparkles (~55 particles)
  const initSparkles = useCallback((w: number, h: number) => {
    sparklesRef.current = [];
    for (let i = 0; i < 55; i++) {
      sparklesRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speedY: Math.random() * 0.45 + 0.18,
        speedX: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.6 + 0.15,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }, []);

  // Spawn Sky Lanterns (~9 lanterns)
  const spawnLantern = useCallback((w: number, h: number, randomY = false): Lantern => {
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + 30,
      speedY: Math.random() * 0.28 + 0.16,
      swaySpeed: Math.random() * 0.015 + 0.006,
      swayRange: Math.random() * 15 + 6,
      width: Math.random() * 6 + 9,
      height: Math.random() * 9 + 13,
      alpha: Math.random() * 0.35 + 0.35,
      phase: Math.random() * Math.PI * 2,
    };
  }, []);

  const initLanterns = useCallback(
    (w: number, h: number) => {
      lanternsRef.current = [];
      for (let i = 0; i < 9; i++) {
        lanternsRef.current.push(spawnLantern(w, h, true));
      }
    },
    [spawnLantern]
  );

  // Trigger intro grand rocket when introStage === 'launching'
  useEffect(() => {
    if (introStage === 'idle') {
      introRocketLaunchedRef.current = false;
      return;
    }

    if (introStage === 'launching' && !introRocketLaunchedRef.current) {
      introRocketLaunchedRef.current = true;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const launchX = w * 0.5;
      const launchY = h - 65;
      const burstX = w * 0.5;
      const burstY = h * 0.38;

      launchRocket(launchX, launchY, burstX, burstY, '#F5B83D', true, () => {
        window.dispatchEvent(new CustomEvent('diwali-intro-burst', { detail: { x: burstX, y: burstY } }));
      });
    }
  }, [introStage, launchRocket]);

  // Main Canvas Setup and Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

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

      initStars(width, height);
      initSparkles(width, height);
      initLanterns(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Support external triggers (diyas, rooftop taps, etc.)
    const handleCustomLaunch = (e: Event) => {
      const ce = e as CustomEvent<{ x: number; y: number; color?: string }>;
      if (ce.detail) {
        const tx = ce.detail.x;
        const ty = ce.detail.y;
        const sx = tx + (Math.random() * 80 - 40);
        const sy = height - 40;
        launchRocket(sx, sy, tx, ty, ce.detail.color);
      }
    };
    window.addEventListener('diwali-launch-firework', handleCustomLaunch);

    // Interactive sky click listener
    const handlePointerDown = (e: PointerEvent) => {
      if (!isActive) return;
      const rect = canvas.getBoundingClientRect();
      const tx = e.clientX - rect.left;
      const ty = e.clientY - rect.top;
      const sx = tx + (Math.random() * 80 - 40);
      const sy = height - 40;
      const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
      launchRocket(sx, sy, tx, ty, color);
    };
    canvas.addEventListener('pointerdown', handlePointerDown);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Stars (75 twinkling dots with alpha oscillation)
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.phase += s.speed;
        const currentAlpha = Math.max(0.06, s.alpha + Math.sin(s.phase) * 0.2);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 243, 214, ${currentAlpha})`;
        ctx.fill();
      }

      // Determine visibility based on introStage
      // Golden sparkles appear once bursting stage has begun
      const showSparkles =
        introStage !== 'idle' && introStage !== 'launching';

      // Sky lanterns appear once intro has settled
      const showLanterns =
        introStage === 'settled' || introStage === 'complete' || introStage === 'active';

      // 2. Sky lanterns (~9 warm orange glowing rectangles with radial glow halos)
      if (showLanterns) {
        const lanterns = lanternsRef.current;
        for (let i = lanterns.length - 1; i >= 0; i--) {
          const l = lanterns[i];
          l.y -= l.speedY;
          l.phase += l.swaySpeed;
          const swayX = l.x + Math.sin(l.phase) * l.swayRange;

          // Radial glow halo
          const glow = ctx.createRadialGradient(swayX, l.y, 1, swayX, l.y, l.width * 2.5);
          glow.addColorStop(0, `rgba(255, 138, 31, ${l.alpha * 0.7})`);
          glow.addColorStop(1, 'rgba(255, 138, 31, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(swayX, l.y, l.width * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Warm lantern rectangular body
          ctx.fillStyle = `rgba(245, 184, 61, ${l.alpha * 0.85})`;
          ctx.beginPath();
          ctx.roundRect(swayX - l.width / 2, l.y - l.height / 2, l.width, l.height, [2, 2, 4, 4]);
          ctx.fill();

          if (l.y < -35) {
            lanterns.splice(i, 1);
            lanterns.push(spawnLantern(width, height, false));
          }
        }
      }

      // 3. Golden sparkles (~55 particles drifting slowly downward with slight twinkle)
      if (showSparkles) {
        const sparkles = sparklesRef.current;
        for (let i = 0; i < sparkles.length; i++) {
          const g = sparkles[i];
          g.y += g.speedY;
          g.x += g.speedX;
          g.phase += 0.025;
          if (g.y > height + 10) {
            g.y = -10;
            g.x = Math.random() * width;
          }
          const sparkleAlpha = Math.min(
            0.75,
            Math.max(0.1, g.alpha + Math.sin(g.phase) * 0.18)
          );
          ctx.fillStyle = `rgba(245, 184, 61, ${sparkleAlpha})`;
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Foreground Active Rockets
      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.draw(ctx);
        const shouldBurst = r.update();
        if (shouldBurst) {
          rockets.splice(i, 1);
        }
      }

      // 5. Exploding Firework Particles (trails, gravity, friction)
      const particles = burstParticlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.draw(ctx);
        const isDead = p.update();
        if (isDead) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('diwali-launch-firework', handleCustomLaunch);
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isActive, introStage, launchRocket, initStars, initSparkles, initLanterns, spawnLantern]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full z-10 pointer-events-auto cursor-crosshair"
    />
  );
};

export default StageCanvas;
