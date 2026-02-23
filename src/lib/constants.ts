import { LayoutConfig, DigitalLayout, VintageLayout, LayoutType, CameraFilter, PhotoboothMode } from '@/types/photobooth';

export const COUNTDOWN_DURATION = 3;
export const SPACEBAR_TIMEOUT = 10;
export const PAUSE_BETWEEN_PHOTOS = 1500; // ms
export const CANVAS_SCALE = 2; // retina
export const DIGITAL_CAPTURE_COUNT = 8;
export const LOGO_AREA_HEIGHT = 60;

export const LAYOUTS: Record<LayoutType, LayoutConfig> = {
  single: {
    type: 'single',
    label: 'Single',
    photoCount: 1,
    canvasWidth: 600,
    canvasHeight: 860,
    padding: 40,
    slots: [{ x: 40, y: 40, width: 520, height: 720 }],
  },
  '2x2-horizontal': {
    type: '2x2-horizontal',
    label: '2x2',
    photoCount: 4,
    canvasWidth: 800,
    canvasHeight: 660,
    padding: 30,
    slots: [
      { x: 30, y: 30, width: 365, height: 260 },
      { x: 405, y: 30, width: 365, height: 260 },
      { x: 30, y: 310, width: 365, height: 260 },
      { x: 405, y: 310, width: 365, height: 260 },
    ],
  },
  '2x2-vertical': {
    type: '2x2-vertical',
    label: '2x2 Vertical',
    photoCount: 4,
    canvasWidth: 640,
    canvasHeight: 820,
    padding: 30,
    slots: [
      { x: 30, y: 30, width: 282, height: 335 },
      { x: 328, y: 30, width: 282, height: 335 },
      { x: 30, y: 395, width: 282, height: 335 },
      { x: 328, y: 395, width: 282, height: 335 },
    ],
  },
  '1x4-strip': {
    type: '1x4-strip',
    label: 'Photo Strip',
    photoCount: 4,
    canvasWidth: 400,
    canvasHeight: 1260,
    padding: 24,
    slots: [
      { x: 24, y: 24, width: 352, height: 270 },
      { x: 24, y: 318, width: 352, height: 270 },
      { x: 24, y: 612, width: 352, height: 270 },
      { x: 24, y: 906, width: 352, height: 270 },
    ],
  },
  '2x4-grid': {
    type: '2x4-grid',
    label: '2x4 Grid',
    photoCount: 8,
    canvasWidth: 800,
    canvasHeight: 1260,
    padding: 24,
    slots: [
      { x: 24, y: 24, width: 368, height: 270 },
      { x: 408, y: 24, width: 368, height: 270 },
      { x: 24, y: 318, width: 368, height: 270 },
      { x: 408, y: 318, width: 368, height: 270 },
      { x: 24, y: 612, width: 368, height: 270 },
      { x: 408, y: 612, width: 368, height: 270 },
      { x: 24, y: 906, width: 368, height: 270 },
      { x: 408, y: 906, width: 368, height: 270 },
    ],
  },
  'vintage-strip': {
    type: 'vintage-strip',
    label: 'Vintage Strip',
    photoCount: 4,
    canvasWidth: 400,
    canvasHeight: 1820,
    padding: 30,
    slots: [
      { x: 30, y: 30, width: 340, height: 425 },
      { x: 30, y: 475, width: 340, height: 425 },
      { x: 30, y: 920, width: 340, height: 425 },
      { x: 30, y: 1365, width: 340, height: 425 },
    ],
  },
  'vintage-4x1': {
    type: 'vintage-4x1',
    label: 'Vintage 4x1',
    photoCount: 4,
    canvasWidth: 1160,
    canvasHeight: 385,
    padding: 30,
    slots: [
      { x: 30, y: 30, width: 260, height: 325 },
      { x: 310, y: 30, width: 260, height: 325 },
      { x: 590, y: 30, width: 260, height: 325 },
      { x: 870, y: 30, width: 260, height: 325 },
    ],
  },
};

export function getSlotAspectRatio(layout: LayoutConfig): number {
  const slot = layout.slots[0];
  return slot.width / slot.height;
}

export const DIGITAL_LAYOUTS: DigitalLayout[] = [
  'single',
  '2x2-horizontal',
  '2x2-vertical',
  '1x4-strip',
  '2x4-grid',
];

export const VINTAGE_LAYOUTS: VintageLayout[] = [
  'vintage-strip',
  'vintage-4x1',
];

export const DEFAULT_FRAME_COLOR = '#ffffff';

export const VINTAGE_FRAME_COLORS = ['#ffffff', '#000000'];

export const FILTERS: Record<CameraFilter, { css: string; label: string }> = {
  none: { css: 'none', label: 'None' },
  bw: { css: 'grayscale(1)', label: 'B&W' },
  smoothing: { css: 'blur(0.5px) brightness(1.05) contrast(0.97)', label: 'Smooth' },
  brighter: { css: 'brightness(1.3)', label: 'Bright' },
  warm: { css: 'sepia(0.3) saturate(1.2) brightness(1.05)', label: 'Warm' },
  cool: { css: 'brightness(1.05) saturate(1.1) hue-rotate(15deg)', label: 'Cool' },
  vintage: { css: 'sepia(0.2) contrast(0.9) brightness(1.1) saturate(0.85)', label: 'Vintage' },
  vivid: { css: 'saturate(1.5) contrast(1.15)', label: 'Vivid' },
  sepia: { css: 'sepia(0.6) brightness(1.05) contrast(1.05)', label: 'Sepia' },
  faded: { css: 'brightness(1.1) contrast(0.8) saturate(0.7)', label: 'Faded' },
  retro: { css: 'sepia(0.4) saturate(0.8) contrast(1.1) brightness(0.95)', label: 'Retro' },
  noir: { css: 'grayscale(1) contrast(1.4) brightness(0.9)', label: 'Noir' },
  rose: { css: 'sepia(0.15) saturate(1.2) hue-rotate(-10deg) brightness(1.05)', label: 'Rose' },
};

export const FILTER_CSS: Record<CameraFilter, string> = Object.fromEntries(
  Object.entries(FILTERS).map(([k, v]) => [k, v.css])
) as Record<CameraFilter, string>;

export const FILTER_LABELS: Record<CameraFilter, string> = Object.fromEntries(
  Object.entries(FILTERS).map(([k, v]) => [k, v.label])
) as Record<CameraFilter, string>;

export const MODE_FILTERS: Record<PhotoboothMode, CameraFilter[]> = {
  digital: ['none', 'bw', 'smoothing', 'brighter', 'warm', 'cool', 'vintage', 'vivid'],
  vintage: ['none', 'bw', 'warm', 'vintage', 'sepia', 'faded', 'retro', 'noir', 'rose'],
};

export const FRAME_COLORS = [
  '#ffffff',
  '#000000',
  '#f8b4c8',
  '#a8d8ea',
  '#ffd93d',
  '#c8e6c9',
  '#e1bee7',
  '#ffe0b2',
];
