export type PhotoboothMode = 'digital' | 'vintage';

export type DigitalLayout =
  | 'single'
  | '2x2-horizontal'
  | '2x2-vertical'
  | '1x4-strip'
  | '2x4-grid';

export type VintageLayout = 'vintage-strip' | 'vintage-4x1';

export type LayoutType = DigitalLayout | VintageLayout;

export interface PhotoSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutConfig {
  type: LayoutType;
  label: string;
  photoCount: number;
  canvasWidth: number;
  canvasHeight: number;
  slots: PhotoSlot[];
  padding: number;
}

export type ThemeName = 'minimalist' | 'y2k' | 'coquette' | 'cottagecore';

export interface ThemeAsset {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Theme {
  name: ThemeName;
  label: string;
  colors: string[];
  assets: ThemeAsset[];
  previewSrc: string;
}

export type CameraFilter = 'none' | 'bw' | 'smoothing' | 'brighter' | 'warm' | 'cool' | 'vintage' | 'vivid' | 'sepia' | 'faded' | 'retro' | 'noir' | 'rose';

export type CaptureStep = 'idle' | 'countdown' | 'capturing' | 'review';

export type WizardStep =
  | 'layout'
  | 'capture'
  | 'review'
  | 'select'
  | 'customize'
  | 'download';

export interface CompositionOptions {
  frameColor: string;
  theme: Theme | null;
}
