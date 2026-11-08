import type { FestoonBulb, ThemeConfig, ThemeKey } from '../types';

/**
 * 4 Ambient Color Palettes for Diwali night atmosphere
 */
export const THEMES: Record<ThemeKey, ThemeConfig> = {
  golden: {
    name: 'Golden Glow',
    color: '#F5B83D',
    aura: 'radial-gradient(circle at 50% 90%, rgba(245, 184, 61, 0.42) 0%, rgba(255, 138, 31, 0.25) 35%, rgba(245, 184, 61, 0.08) 60%, transparent 80%)',
    horizon: 'radial-gradient(ellipse 100% 70% at 50% 100%, rgba(245, 184, 61, 0.22) 0%, rgba(255, 138, 31, 0.12) 36%, rgba(11, 16, 38, 0) 72%)',
    bulbColors: ['#F5B83D', '#FF8A1F', '#FFF3D6', '#fabc41', '#ffe4a0'],
    washCore: '#F5B83D',
    washMid: '#FF8A1F',
  },
  vermilion: {
    name: 'Warm Ember',
    color: '#FF8A1F',
    aura: 'radial-gradient(circle at 50% 90%, rgba(255, 138, 31, 0.45) 0%, rgba(224, 64, 200, 0.22) 35%, rgba(245, 184, 61, 0.08) 60%, transparent 80%)',
    horizon: 'radial-gradient(ellipse 100% 70% at 50% 100%, rgba(255, 138, 31, 0.24) 0%, rgba(245, 92, 168, 0.12) 36%, rgba(11, 16, 38, 0) 72%)',
    bulbColors: ['#FF8A1F', '#F5B83D', '#FF5CA8', '#FFF3D6', '#FF8A1F'],
    washCore: '#FF8A1F',
    washMid: '#FF5CA8',
  },
  jewel: {
    name: 'Emerald & Ruby',
    color: '#3DDC84',
    aura: 'radial-gradient(circle at 50% 90%, rgba(61, 220, 132, 0.38) 0%, rgba(224, 64, 200, 0.22) 35%, rgba(0, 245, 212, 0.08) 60%, transparent 80%)',
    horizon: 'radial-gradient(ellipse 100% 70% at 50% 100%, rgba(61, 220, 132, 0.20) 0%, rgba(224, 64, 200, 0.10) 36%, rgba(11, 16, 38, 0) 72%)',
    bulbColors: ['#3DDC84', '#00F5D4', '#E040C8', '#F5B83D', '#FF5CA8'],
    washCore: '#3DDC84',
    washMid: '#E040C8',
  },
  festive: {
    name: 'Festive Aurora',
    color: '#E040C8',
    aura: 'radial-gradient(circle at 50% 90%, rgba(224, 64, 200, 0.42) 0%, rgba(0, 245, 212, 0.20) 35%, rgba(255, 138, 31, 0.09) 60%, transparent 80%)',
    horizon: 'radial-gradient(ellipse 100% 70% at 50% 100%, rgba(224, 64, 200, 0.22) 0%, rgba(0, 245, 212, 0.10) 36%, rgba(11, 16, 38, 0) 72%)',
    bulbColors: ['#E040C8', '#FF5CA8', '#00F5D4', '#F5B83D', '#3DDC84'],
    washCore: '#E040C8',
    washMid: '#00F5D4',
  },
};

/**
 * Ordered list of theme keys for cycling
 */
export const THEME_KEYS: ThemeKey[] = ['golden', 'vermilion', 'jewel', 'festive'];

/**
 * Ordered theme configs array
 */
export const THEMES_LIST: ThemeConfig[] = THEME_KEYS.map((key) => THEMES[key]);

/**
 * Vivid festive firework burst palette
 */
export const FIREWORK_COLORS: string[] = [
  '#F5B83D', // Gold
  '#FF8A1F', // Orange
  '#FF5CA8', // Pink
  '#E040C8', // Magenta
  '#3DDC84', // Green
  '#00F5D4', // Cyan
  '#FFE4A0', // Warm Light Cream
];

/**
 * Default Diwali blessing wish line
 */
export const DEFAULT_WISH =
  'May the light of a thousand diyas guide your path to joy, prosperity, and peace.';

/**
 * 6 Diya positions spread evenly across the terrace base (normalized 0-1 range)
 */
export const DIYA_POSITIONS = [
  { id: 0, x: 0.10, y: 0.93 },
  { id: 1, x: 0.26, y: 0.91 },
  { id: 2, x: 0.42, y: 0.89 },
  { id: 3, x: 0.58, y: 0.89 },
  { id: 4, x: 0.74, y: 0.91 },
  { id: 5, x: 0.90, y: 0.93 },
] as const;

/**
 * Rooftop fairy light / festoon bulb coordinates based on SVG viewBox 0 0 1440 260
 * ~44 precise bulbs along the palace terraces and chhatri cornices
 */
export const FESTOON_BULBS: FestoonBulb[] = [
  // Left pavilion garland
  { cx: 38, cy: 85, fill: '#F5B83D' },
  { cx: 60, cy: 92, fill: '#FF5CA8' },
  { cx: 80, cy: 88, fill: '#3DDC84' },
  { cx: 95, cy: 83, fill: '#FF8A1F' },
  { cx: 115, cy: 89, fill: '#00F5D4' },
  { cx: 135, cy: 92, fill: '#E040C8' },
  { cx: 155, cy: 85, fill: '#F5B83D' },

  // Left parapet connector
  { cx: 230, cy: 132, fill: '#FF8A1F' },
  { cx: 265, cy: 138, fill: '#F5B83D' },
  { cx: 300, cy: 131, fill: '#3DDC84' },

  // Left Chhatri dome garland
  { cx: 345, cy: 114, fill: '#FF5CA8' },
  { cx: 366, cy: 119, fill: '#F5B83D' },
  { cx: 388, cy: 114, fill: '#00F5D4' },

  // Left-center wall garland
  { cx: 435, cy: 128, fill: '#E040C8' },
  { cx: 475, cy: 136, fill: '#F5B83D' },
  { cx: 515, cy: 140, fill: '#FF8A1F' },
  { cx: 555, cy: 134, fill: '#3DDC84' },
  { cx: 585, cy: 126, fill: '#FF5CA8' },

  // Center Palace Upper Roof Garland
  { cx: 620, cy: 98, fill: '#F5B83D' },
  { cx: 655, cy: 103, fill: '#FF8A1F' },
  { cx: 690, cy: 97, fill: '#00F5D4' },
  { cx: 720, cy: 93, fill: '#FFF3D6' },
  { cx: 750, cy: 97, fill: '#FF5CA8' },
  { cx: 785, cy: 103, fill: '#3DDC84' },
  { cx: 820, cy: 98, fill: '#F5B83D' },

  // Center Palace Lower Cornice Garland
  { cx: 640, cy: 128, fill: '#FF8A1F' },
  { cx: 680, cy: 133, fill: '#E040C8' },
  { cx: 720, cy: 136, fill: '#F5B83D' },
  { cx: 760, cy: 133, fill: '#00F5D4' },
  { cx: 800, cy: 128, fill: '#3DDC84' },

  // Right-center wall garland
  { cx: 865, cy: 127, fill: '#F5B83D' },
  { cx: 905, cy: 135, fill: '#FF5CA8' },
  { cx: 945, cy: 140, fill: '#FF8A1F' },
  { cx: 985, cy: 134, fill: '#3DDC84' },

  // Right Chhatri dome garland
  { cx: 1045, cy: 114, fill: '#00F5D4' },
  { cx: 1066, cy: 119, fill: '#F5B83D' },
  { cx: 1088, cy: 114, fill: '#E040C8' },

  // Right parapet connector
  { cx: 1135, cy: 130, fill: '#FF8A1F' },
  { cx: 1175, cy: 137, fill: '#F5B83D' },
  { cx: 1215, cy: 132, fill: '#3DDC84' },

  // Right pavilion garland
  { cx: 1270, cy: 86, fill: '#F5B83D' },
  { cx: 1292, cy: 92, fill: '#FF5CA8' },
  { cx: 1312, cy: 88, fill: '#00F5D4' },
  { cx: 1325, cy: 83, fill: '#FF8A1F' },
  { cx: 1345, cy: 89, fill: '#3DDC84' },
  { cx: 1368, cy: 92, fill: '#E040C8' },
  { cx: 1388, cy: 85, fill: '#F5B83D' },
];

/**
 * Jharokha arch window SVG path strings illuminated with warm amber lamplight
 */
export const ROOFTOP_WINDOWS: string[] = [
  'M 85,115 Q 95,102 105,115 L 105,134 L 85,134 Z',
  'M 356,128 Q 366,116 376,128 L 376,144 L 356,144 Z',
  'M 708,118 Q 721,104 734,118 L 734,138 L 708,138 Z',
  'M 645,130 Q 655,118 665,130 L 665,145 L 645,145 Z',
  'M 775,130 Q 785,118 795,130 L 795,145 L 775,145 Z',
  'M 1056,128 Q 1066,116 1076,128 L 1076,144 L 1056,144 Z',
  'M 1315,115 Q 1325,102 1335,115 L 1335,134 L 1315,134 Z',
];

/**
 * Garland string wire paths connecting the light bulbs
 */
export const FESTOON_WIRES: string[] = [
  'M 25,82 Q 60,94 95,82 Q 130,94 165,82',
  'M 210,126 Q 265,142 320,122',
  'M 330,110 Q 366,122 402,110',
  'M 412,122 Q 506,144 600,122',
  'M 600,92 Q 660,105 720,92 Q 780,105 840,92',
  'M 600,122 Q 720,138 840,122',
  'M 840,122 Q 930,144 1020,122',
  'M 1030,110 Q 1066,122 1102,110',
  'M 1112,122 Q 1180,142 1250,126',
  'M 1255,82 Q 1290,94 1325,82 Q 1360,94 1395,82',
];
