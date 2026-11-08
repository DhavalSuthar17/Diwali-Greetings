/**
 * TypeScript definitions and interfaces for the Diwali Greeting Web Experience.
 */

/**
 * Stages of the cinematic intro rocket sequence
 */
export type IntroStage =
  | 'idle'
  | 'launching'
  | 'ascending'
  | 'bursting'
  | 'blooming'
  | 'revealing'
  | 'settled';

/**
 * Value object matching IntroStage for enum-like access
 */
export const IntroStage = {
  Idle: 'idle' as const,
  Launching: 'launching' as const,
  Ascending: 'ascending' as const,
  Bursting: 'bursting' as const,
  Blooming: 'blooming' as const,
  Revealing: 'revealing' as const,
  Settled: 'settled' as const,
};

/**
 * State for interactive terracotta rooftop diyas
 */
export interface DiyaState {
  id: number;
  lit: boolean;
  x: number;
  y: number;
}

/**
 * Theme configuration for ambient atmospheric lighting
 */
export interface ThemeConfig {
  name: string;
  color: string;
  aura: string;
  horizon: string;
  bulbColors: string[];
  washCore: string;
  washMid: string;
}

/**
 * Theme palette keys
 */
export type ThemeKey = 'golden' | 'vermilion' | 'jewel' | 'festive';

/**
 * Base properties for 2D canvas particles
 */
export interface ParticleBase {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  radius: number;
  color: string;
  life: number;
}

/**
 * Burst visual styles for fireworks
 */
export type FireworkStyle = 'peony' | 'chrysanthemum' | 'willow';

/**
 * Ascending firework rocket particle
 */
export interface FireworkRocket extends ParticleBase {
  trail: { x: number; y: number }[];
  targetX: number;
  targetY: number;
  style: 'peony' | 'chrysanthemum' | 'willow';
  isIntro?: boolean;
  onBurst?: (x: number, y: number) => void;
}

/**
 * Spark / ember exploding outwards from a firework burst
 */
export interface BurstParticle extends ParticleBase {
  decay: number;
  friction: number;
  gravity: number;
  isGlitter: boolean;
  trail?: { x: number; y: number; alpha?: number }[];
  maxTrail?: number;
  sparklePhase?: number;
}

/**
 * Distant twinkling night sky star
 */
export interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
}

/**
 * Atmospheric floating Diwali sky lantern (kandil / sky lamp)
 */
export interface Lantern {
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

/**
 * Drifting golden glitter and sparkle particle
 */
export interface GoldenSparkle {
  x: number;
  y: number;
  speedY: number;
  speedX: number;
  size: number;
  alpha: number;
  phase: number;
}

/**
 * Fixed garland fairy light bulb
 */
export interface FestoonBulb {
  cx: number;
  cy: number;
  fill: string;
}

/**
 * Return type for useIntroSequence hook
 */
export interface UseIntroSequenceReturn {
  stage: IntroStage;
  progress: number;
  replay: () => void;
}

/**
 * Return type for useTheme hook
 */
export interface UseThemeReturn {
  theme: ThemeConfig;
  themeIndex: number;
  cycleTheme: () => void;
  setThemeIndex: (index: number) => void;
}

/**
 * Return type for useRecipient hook
 */
export interface UseRecipientReturn {
  recipientName: string | null;
}
