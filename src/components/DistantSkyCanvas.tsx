import React, { useEffect, useRef } from 'react';

export interface DistantSkyCanvasProps {
  isActive: boolean;
  onDistantBurst?: () => void;
}

type FireworkStyle = 'peony' | 'chrysanthemum' | 'willow';

const DISTANT_COLORS = [
  '#F5B83D', // Gold
  '#FF8A1F', // Orange
  '#FF5CA8', // Pink
  '#E040C8', // Magenta
  '#3DDC84', // Green
  '#00F5D4', // Cyan
  '#FFE4A0', // Champagne
];

class DistantRocket {
  x: number;
  y: number;
  tx: number;
  ty: number;
  color: string;
  style: FireworkStyle;
  dx: number;
  dy: number;
  distance: number;
  traveled: number;
  angle: number;
  speed: number;
  accel: number;
  trail: Array<{ x: number; y: number }>;
  maxTrail: number;
  curveFactor: number;

  constructor(sx: number, sy: number, tx: number, ty: number, color: string, style: FireworkStyle) {
    this.x = sx;
    this.y = sy;
    this.tx = tx;
    this.ty = ty;
    this.color = color;
    this.style = style;
    this.dx = tx - sx;
    this.dy = ty - sy;
    this.distance = Math.hypot(this.dx, this.dy);
    this.traveled = 0;
    this.angle = Math.atan2(this.dy, this.dx);
    this.speed = Math.random() * 1.5 + 4.2;
    this.accel = 1.025;
    this.trail = [];
    this.maxTrail = 12;
    this.curveFactor = (Math.random() - 0.5) * 0.0028;
  }

  update(): boolean {
    this.speed *= this.accel;
    this.angle += this.curveFactor;
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;

    this.trail.unshift({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) this.trail.pop();

    this.x += vx;
    this.y += vy;
    this.traveled += Math.hypot(vx, vy);

    return this.traveled >= this.distance || this.y <= this.ty;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const len = this.trail.length;
    for (let i = 0; i < len; i++) {
      const pt = this.trail[i];
      const a = (1 - i / len) * 0.75;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(0.6, 2.0 - i * 0.14), 0, Math.PI * 2);
      ctx.fillStyle = i < 2 ? '#FFF3D6' : this.color;
      ctx.globalAlpha = a;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Rocket head
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF3D6';
    ctx.fill();
  }
}

class DistantBurstParticle {
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
  trail: Array<{ x: number; y: number }>;
  maxTrail: number;
  isGlitter: boolean;
  sparklePhase: number;

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
      isGlitter?: boolean;
    } = {}
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = opts.angle !== undefined ? opts.angle : Math.random() * Math.PI * 2;
    this.speed = opts.speed !== undefined ? opts.speed : Math.random() * 4.2 + 1.8;
    this.friction = opts.friction || 0.958;
    this.gravity = opts.gravity || 0.035;
    this.alpha = 1;
    this.decay = opts.decay || Math.random() * 0.014 + 0.009;
    this.radius = opts.radius || 1.6;
    this.trail = [];
    this.maxTrail = opts.maxTrail || 6;
    this.isGlitter = opts.isGlitter || false;
    this.sparklePhase = Math.random() * Math.PI * 2;
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
      this.alpha += Math.sin(this.sparklePhase) * 0.05;
    }

    return this.alpha <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.alpha <= 0) return;
    const len = this.trail.length;
    for (let i = 0; i < len; i++) {
      const t = this.trail[i];
      const trailAlpha = (1 - i / len) * this.alpha * 0.6;
      ctx.beginPath();
      ctx.arc(t.x, t.y, Math.max(0.4, this.radius * (1 - i * 0.12)), 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, trailAlpha);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.isGlitter ? '#FFFFFF' : this.color;
    ctx.globalAlpha = Math.min(1, Math.max(0, this.alpha * 0.95));
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

interface SoftFlash {
  x: number;
  y: number;
  color: string;
  radius: number;
  alpha: number;
}

export const DistantSkyCanvas: React.FC<DistantSkyCanvasProps> = ({ isActive, onDistantBurst }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onDistantBurstRef = useRef(onDistantBurst);
  useEffect(() => {
    onDistantBurstRef.current = onDistantBurst;
  }, [onDistantBurst]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const timeoutIds: number[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const rockets: DistantRocket[] = [];
    const particles: DistantBurstParticle[] = [];
    const flashes: SoftFlash[] = [];

    let nextLaunchTime = performance.now() + 1200;

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
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const explodeDistantAt = (x: number, y: number, primaryColor: string, style: FireworkStyle) => {
      onDistantBurstRef.current?.();
      const secondaryColor = DISTANT_COLORS[Math.floor(Math.random() * DISTANT_COLORS.length)];
      const count = style === 'willow' ? 65 : style === 'chrysanthemum' ? 85 : 75;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.15;
        let speed = Math.random() * 3.4 + 1.6;
        let friction = 0.955;
        let gravity = 0.038;
        let decay = Math.random() * 0.014 + 0.008;
        let isGlitter = false;
        let maxTrail = 7;
        let c = i % 3 === 0 ? secondaryColor : primaryColor;

        if (style === 'willow') {
          speed = Math.random() * 2.8 + 1.2;
          friction = 0.965;
          gravity = 0.065;
          decay = Math.random() * 0.008 + 0.005;
          maxTrail = 14;
          c = Math.random() > 0.3 ? '#F5B83D' : '#FFE4A0';
        } else if (style === 'chrysanthemum') {
          speed = Math.random() * 4.0 + 1.8;
          friction = 0.952;
          gravity = 0.032;
          isGlitter = true;
          decay = Math.random() * 0.011 + 0.007;
          maxTrail = 8;
        }

        particles.push(
          new DistantBurstParticle(x, y, c, {
            angle,
            speed,
            friction,
            gravity,
            decay,
            radius: style === 'willow' ? 1.4 : 1.7,
            maxTrail,
            isGlitter,
          })
        );
      }

      // Atmospheric soft radial glow flash
      flashes.push({
        x,
        y,
        color: primaryColor,
        radius: 95,
        alpha: 0.28,
      });
    };

    const launchDistantRocket = () => {
      if (!isActive) return;
      const sx = Math.random() * (width * 0.88) + width * 0.06;
      const sy = height - (Math.random() * 60 + 80);
      const ty = (Math.random() * 0.4 + 0.15) * height;
      const tx = sx + (Math.random() - 0.5) * (width * 0.22);

      const styles: FireworkStyle[] = ['peony', 'chrysanthemum', 'willow'];
      const chosenStyle = styles[Math.floor(Math.random() * styles.length)];
      const chosenColor = DISTANT_COLORS[Math.floor(Math.random() * DISTANT_COLORS.length)];

      rockets.push(new DistantRocket(sx, sy, tx, ty, chosenColor, chosenStyle));

      // 28% chance of companion secondary rocket launch
      if (Math.random() < 0.28) {
        const timerId = window.setTimeout(() => {
          if (!isActive) return;
          const sx2 = Math.random() * (width * 0.88) + width * 0.06;
          const sy2 = height - (Math.random() * 60 + 80);
          const ty2 = (Math.random() * 0.38 + 0.16) * height;
          const tx2 = sx2 + (Math.random() - 0.5) * (width * 0.2);
          const color2 = DISTANT_COLORS[Math.floor(Math.random() * DISTANT_COLORS.length)];
          const style2 = styles[Math.floor(Math.random() * styles.length)];
          rockets.push(new DistantRocket(sx2, sy2, tx2, ty2, color2, style2));
        }, Math.random() * 350 + 150);
        timeoutIds.push(timerId);
      }

      // Schedule next distant launch every 2-4 seconds
      const delay = Math.random() * 2000 + 2000;
      nextLaunchTime = performance.now() + delay;
    };

    const render = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // Auto-launch distant atmospheric rockets every 2-4 seconds when active
      if (isActive && timestamp >= nextLaunchTime) {
        launchDistantRocket();
      }

      // Render & fade soft flash halos
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.alpha -= 0.015;
        if (f.alpha <= 0) {
          flashes.splice(i, 1);
          continue;
        }
        const flashGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
        flashGrad.addColorStop(0, `${f.color}${Math.floor(f.alpha * 255).toString(16).padStart(2, '0')}`);
        flashGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update & Draw distant rising rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.draw(ctx);
        const reachedTarget = r.update();
        if (reachedTarget) {
          explodeDistantAt(r.x, r.y, r.color, r.style);
          rockets.splice(i, 1);
        }
      }

      // Update & Draw distant burst particles
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

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      timeoutIds.forEach((id) => clearTimeout(id));
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full z-[8] pointer-events-none filter blur-[2.5px] opacity-90"
    />
  );
};

export default DistantSkyCanvas;
