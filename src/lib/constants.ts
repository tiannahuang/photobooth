import { LayoutConfig, KoreanLayout, LayoutType } from '@/types/photobooth';

export const COUNTDOWN_DURATION = 3;
export const PAUSE_BETWEEN_PHOTOS = 1500; // ms
export const CANVAS_SCALE = 2; // retina

export const LAYOUTS: Record<LayoutType, LayoutConfig> = {
  single: {
    type: 'single',
    label: 'Single',
    photoCount: 1,
    canvasWidth: 600,
    canvasHeight: 800,
    padding: 40,
    slots: [{ x: 40, y: 40, width: 520, height: 720 }],
  },
  '2x2-horizontal': {
    type: '2x2-horizontal',
    label: '2x2',
    photoCount: 4,
    canvasWidth: 800,
    canvasHeight: 600,
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
    canvasWidth: 600,
    canvasHeight: 900,
    padding: 30,
    slots: [
      { x: 30, y: 30, width: 262, height: 405 },
      { x: 308, y: 30, width: 262, height: 405 },
      { x: 30, y: 465, width: 262, height: 405 },
      { x: 308, y: 465, width: 262, height: 405 },
    ],
  },
  '1x4-strip': {
    type: '1x4-strip',
    label: 'Photo Strip',
    photoCount: 4,
    canvasWidth: 400,
    canvasHeight: 1200,
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
    canvasHeight: 1200,
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
    canvasHeight: 1200,
    padding: 30,
    slots: [
      { x: 30, y: 30, width: 340, height: 264 },
      { x: 30, y: 314, width: 340, height: 264 },
      { x: 30, y: 598, width: 340, height: 264 },
      { x: 30, y: 882, width: 340, height: 264 },
    ],
  },
};

export function getSlotAspectRatio(layout: LayoutConfig): number {
  const slot = layout.slots[0];
  return slot.width / slot.height;
}

export const KOREAN_LAYOUTS: KoreanLayout[] = [
  'single',
  '2x2-horizontal',
  '2x2-vertical',
  '1x4-strip',
  '2x4-grid',
];

export const DEFAULT_FRAME_COLOR = '#ffffff';

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
