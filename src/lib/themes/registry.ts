import type { Theme, ThemeAsset } from "@/types/photobooth";

function getDecoAssets(w: number, h: number): ThemeAsset[] {
  const s = (pct: number) => w * pct; // size helper
  return [
    // Top edge (4 assets)
    { src: "/themes/deco/heart.svg", x: w * 0.02, y: h * 0.005, width: s(0.09), height: s(0.09) },
    { src: "/themes/deco/star.svg", x: w * 0.3, y: -s(0.02), width: s(0.1), height: s(0.1) },
    { src: "/themes/deco/sparkle.svg", x: w * 0.6, y: h * 0.008, width: s(0.07), height: s(0.07) },
    { src: "/themes/deco/smiley.svg", x: w * 0.85, y: -s(0.01), width: s(0.1), height: s(0.1) },
    // Bottom edge (4 assets)
    { src: "/themes/deco/cherry.svg", x: w * 0.03, y: h - s(0.1), width: s(0.1), height: s(0.1) },
    { src: "/themes/deco/flower.svg", x: w * 0.35, y: h - s(0.09), width: s(0.09), height: s(0.09) },
    { src: "/themes/deco/rainbow.svg", x: w * 0.6, y: h - s(0.08), width: s(0.13), height: s(0.07) },
    { src: "/themes/deco/lightning.svg", x: w * 0.88, y: h - s(0.1), width: s(0.08), height: s(0.1) },
    // Left edge (3 assets)
    { src: "/themes/deco/cloud.svg", x: -s(0.03), y: h * 0.25, width: s(0.12), height: s(0.08) },
    { src: "/themes/deco/sparkle.svg", x: w * 0.01, y: h * 0.5, width: s(0.06), height: s(0.06) },
    { src: "/themes/deco/star.svg", x: -s(0.02), y: h * 0.73, width: s(0.08), height: s(0.08) },
    // Right edge (3 assets)
    { src: "/themes/deco/heart.svg", x: w - s(0.09), y: h * 0.2, width: s(0.08), height: s(0.08) },
    { src: "/themes/deco/smiley.svg", x: w - s(0.1), y: h * 0.48, width: s(0.09), height: s(0.09) },
    { src: "/themes/deco/flower.svg", x: w - s(0.08), y: h * 0.72, width: s(0.07), height: s(0.07) },
  ];
}

function getDecoChaosAssets(w: number, h: number): ThemeAsset[] {
  const s = (pct: number) => w * pct;
  return [
    // Top edge scatter (7)
    { src: "/themes/deco/heart.svg", x: w * 0.01, y: -s(0.02), width: s(0.12), height: s(0.12), rotation: -20 },
    { src: "/themes/deco/star.svg", x: w * 0.15, y: h * 0.01, width: s(0.14), height: s(0.14), rotation: 25 },
    { src: "/themes/deco/butterfly.svg", x: w * 0.32, y: -s(0.03), width: s(0.13), height: s(0.13), rotation: -15 },
    { src: "/themes/deco/sparkle.svg", x: w * 0.48, y: h * 0.005, width: s(0.09), height: s(0.09), rotation: 30 },
    { src: "/themes/deco/cat.svg", x: w * 0.6, y: -s(0.01), width: s(0.12), height: s(0.12), rotation: -10 },
    { src: "/themes/deco/diamond.svg", x: w * 0.75, y: h * 0.01, width: s(0.1), height: s(0.1), rotation: 20 },
    { src: "/themes/deco/moon.svg", x: w * 0.88, y: -s(0.02), width: s(0.11), height: s(0.11), rotation: -25 },
    // Bottom edge scatter (7)
    { src: "/themes/deco/smiley.svg", x: w * 0.01, y: h - s(0.12), width: s(0.13), height: s(0.13), rotation: 15 },
    { src: "/themes/deco/cherry.svg", x: w * 0.16, y: h - s(0.1), width: s(0.11), height: s(0.11), rotation: -28 },
    { src: "/themes/deco/flower.svg", x: w * 0.32, y: h - s(0.13), width: s(0.14), height: s(0.14), rotation: 22 },
    { src: "/themes/deco/lightning.svg", x: w * 0.48, y: h - s(0.09), width: s(0.1), height: s(0.1), rotation: -18 },
    { src: "/themes/deco/rainbow.svg", x: w * 0.62, y: h - s(0.11), width: s(0.15), height: s(0.08), rotation: 12 },
    { src: "/themes/deco/heart.svg", x: w * 0.78, y: h - s(0.12), width: s(0.11), height: s(0.11), rotation: -30 },
    { src: "/themes/deco/star.svg", x: w * 0.9, y: h - s(0.1), width: s(0.1), height: s(0.1), rotation: 25 },
    // Left edge scatter (5)
    { src: "/themes/deco/cloud.svg", x: -s(0.04), y: h * 0.15, width: s(0.14), height: s(0.09), rotation: 10 },
    { src: "/themes/deco/butterfly.svg", x: w * 0.01, y: h * 0.3, width: s(0.1), height: s(0.1), rotation: -22 },
    { src: "/themes/deco/diamond.svg", x: -s(0.02), y: h * 0.45, width: s(0.09), height: s(0.09), rotation: 18 },
    { src: "/themes/deco/flower.svg", x: w * 0.01, y: h * 0.6, width: s(0.11), height: s(0.11), rotation: -15 },
    { src: "/themes/deco/sparkle.svg", x: -s(0.01), y: h * 0.78, width: s(0.08), height: s(0.08), rotation: 28 },
    // Right edge scatter (5)
    { src: "/themes/deco/smiley.svg", x: w - s(0.12), y: h * 0.12, width: s(0.12), height: s(0.12), rotation: -20 },
    { src: "/themes/deco/moon.svg", x: w - s(0.1), y: h * 0.28, width: s(0.1), height: s(0.1), rotation: 15 },
    { src: "/themes/deco/cat.svg", x: w - s(0.11), y: h * 0.44, width: s(0.11), height: s(0.11), rotation: -25 },
    { src: "/themes/deco/cherry.svg", x: w - s(0.09), y: h * 0.6, width: s(0.1), height: s(0.1), rotation: 20 },
    { src: "/themes/deco/heart.svg", x: w - s(0.1), y: h * 0.76, width: s(0.09), height: s(0.09), rotation: -12 },
    // Overlapping onto photo edges (4)
    { src: "/themes/deco/star.svg", x: w * 0.08, y: h * 0.08, width: s(0.1), height: s(0.1), rotation: 30 },
    { src: "/themes/deco/sparkle.svg", x: w * 0.82, y: h * 0.06, width: s(0.08), height: s(0.08), rotation: -22 },
    { src: "/themes/deco/flower.svg", x: w * 0.07, y: h * 0.85, width: s(0.09), height: s(0.09), rotation: 18 },
    { src: "/themes/deco/lightning.svg", x: w * 0.84, y: h * 0.88, width: s(0.08), height: s(0.1), rotation: -28 },
  ];
}

function getDecoSweetAssets(w: number, h: number): ThemeAsset[] {
  const s = (pct: number) => w * pct;
  return [
    // Top-left cluster (6)
    { src: "/themes/deco/heart.svg", x: -s(0.02), y: -s(0.02), width: s(0.13), height: s(0.13), rotation: -12 },
    { src: "/themes/deco/flower.svg", x: w * 0.08, y: -s(0.01), width: s(0.1), height: s(0.1), rotation: 8 },
    { src: "/themes/deco/butterfly.svg", x: w * 0.01, y: h * 0.08, width: s(0.11), height: s(0.11), rotation: -10 },
    { src: "/themes/deco/cherry.svg", x: w * 0.12, y: h * 0.04, width: s(0.08), height: s(0.08), rotation: 15 },
    { src: "/themes/deco/sparkle.svg", x: w * 0.18, y: -s(0.01), width: s(0.07), height: s(0.07), rotation: -5 },
    { src: "/themes/deco/heart.svg", x: -s(0.01), y: h * 0.15, width: s(0.07), height: s(0.07), rotation: 12 },
    // Top-right cluster (5)
    { src: "/themes/deco/flower.svg", x: w - s(0.12), y: -s(0.02), width: s(0.12), height: s(0.12), rotation: 10 },
    { src: "/themes/deco/heart.svg", x: w - s(0.08), y: h * 0.06, width: s(0.09), height: s(0.09), rotation: -14 },
    { src: "/themes/deco/butterfly.svg", x: w * 0.78, y: -s(0.01), width: s(0.1), height: s(0.1), rotation: 8 },
    { src: "/themes/deco/cherry.svg", x: w - s(0.06), y: h * 0.14, width: s(0.07), height: s(0.07), rotation: -10 },
    { src: "/themes/deco/sparkle.svg", x: w * 0.82, y: h * 0.08, width: s(0.06), height: s(0.06), rotation: 15 },
    // Bottom-left cluster (5)
    { src: "/themes/deco/flower.svg", x: -s(0.01), y: h - s(0.13), width: s(0.12), height: s(0.12), rotation: 10 },
    { src: "/themes/deco/heart.svg", x: w * 0.09, y: h - s(0.1), width: s(0.09), height: s(0.09), rotation: -8 },
    { src: "/themes/deco/cherry.svg", x: w * 0.01, y: h - s(0.06), width: s(0.08), height: s(0.08), rotation: 14 },
    { src: "/themes/deco/butterfly.svg", x: w * 0.15, y: h - s(0.07), width: s(0.08), height: s(0.08), rotation: -12 },
    { src: "/themes/deco/cloud.svg", x: -s(0.03), y: h * 0.78, width: s(0.1), height: s(0.07), rotation: 5 },
    // Bottom-right cluster (6)
    { src: "/themes/deco/heart.svg", x: w - s(0.11), y: h - s(0.12), width: s(0.11), height: s(0.11), rotation: -10 },
    { src: "/themes/deco/flower.svg", x: w - s(0.07), y: h - s(0.06), width: s(0.09), height: s(0.09), rotation: 12 },
    { src: "/themes/deco/cherry.svg", x: w * 0.8, y: h - s(0.09), width: s(0.08), height: s(0.08), rotation: -15 },
    { src: "/themes/deco/butterfly.svg", x: w - s(0.05), y: h * 0.82, width: s(0.07), height: s(0.07), rotation: 8 },
    { src: "/themes/deco/sparkle.svg", x: w * 0.78, y: h - s(0.04), width: s(0.06), height: s(0.06), rotation: -6 },
    { src: "/themes/deco/cat.svg", x: w - s(0.1), y: h * 0.78, width: s(0.08), height: s(0.08), rotation: 10 },
  ];
}

function getDecoPartyAssets(w: number, h: number): ThemeAsset[] {
  const s = (pct: number) => w * pct;
  return [
    // Top edge confetti burst (8)
    { src: "/themes/deco/star.svg", x: w * 0.01, y: -s(0.03), width: s(0.14), height: s(0.14), rotation: -40 },
    { src: "/themes/deco/sparkle.svg", x: w * 0.14, y: h * 0.01, width: s(0.1), height: s(0.1), rotation: 35 },
    { src: "/themes/deco/lightning.svg", x: w * 0.26, y: -s(0.02), width: s(0.12), height: s(0.15), rotation: -30 },
    { src: "/themes/deco/smiley.svg", x: w * 0.4, y: h * 0.005, width: s(0.13), height: s(0.13), rotation: 45 },
    { src: "/themes/deco/star.svg", x: w * 0.55, y: -s(0.01), width: s(0.11), height: s(0.11), rotation: -35 },
    { src: "/themes/deco/diamond.svg", x: w * 0.68, y: h * 0.01, width: s(0.1), height: s(0.1), rotation: 40 },
    { src: "/themes/deco/sparkle.svg", x: w * 0.8, y: -s(0.02), width: s(0.12), height: s(0.12), rotation: -25 },
    { src: "/themes/deco/lightning.svg", x: w * 0.92, y: h * 0.005, width: s(0.09), height: s(0.12), rotation: 30 },
    // Bottom edge confetti burst (8)
    { src: "/themes/deco/smiley.svg", x: w * 0.01, y: h - s(0.14), width: s(0.14), height: s(0.14), rotation: 35 },
    { src: "/themes/deco/star.svg", x: w * 0.15, y: h - s(0.12), width: s(0.12), height: s(0.12), rotation: -45 },
    { src: "/themes/deco/sparkle.svg", x: w * 0.28, y: h - s(0.1), width: s(0.11), height: s(0.11), rotation: 30 },
    { src: "/themes/deco/lightning.svg", x: w * 0.42, y: h - s(0.13), width: s(0.1), height: s(0.13), rotation: -40 },
    { src: "/themes/deco/diamond.svg", x: w * 0.56, y: h - s(0.11), width: s(0.12), height: s(0.12), rotation: 45 },
    { src: "/themes/deco/star.svg", x: w * 0.7, y: h - s(0.12), width: s(0.11), height: s(0.11), rotation: -30 },
    { src: "/themes/deco/smiley.svg", x: w * 0.82, y: h - s(0.13), width: s(0.13), height: s(0.13), rotation: 40 },
    { src: "/themes/deco/sparkle.svg", x: w * 0.93, y: h - s(0.1), width: s(0.09), height: s(0.09), rotation: -35 },
    // Left edge (2)
    { src: "/themes/deco/star.svg", x: -s(0.04), y: h * 0.35, width: s(0.12), height: s(0.12), rotation: 30 },
    { src: "/themes/deco/lightning.svg", x: -s(0.02), y: h * 0.6, width: s(0.1), height: s(0.12), rotation: -40 },
    // Right edge (2)
    { src: "/themes/deco/sparkle.svg", x: w - s(0.1), y: h * 0.3, width: s(0.11), height: s(0.11), rotation: -35 },
    { src: "/themes/deco/smiley.svg", x: w - s(0.11), y: h * 0.62, width: s(0.12), height: s(0.12), rotation: 45 },
  ];
}

export const themes: Theme[] = [
  {
    name: "deco",
    label: "Deco",
    colors: ["#fff5f5", "#fce4ec", "#ffffff"],
    assets: [],
    previewSrc: "/themes/deco/preview.svg",
    getAssets: getDecoAssets,
  },
  {
    name: "deco-chaos",
    label: "Deco Chaos",
    colors: ["#fff0f5", "#ffe4f0", "#ffffff"],
    assets: [],
    previewSrc: "/themes/deco/preview-chaos.svg",
    getAssets: getDecoChaosAssets,
  },
  {
    name: "deco-sweet",
    label: "Deco Sweet",
    colors: ["#fff5f0", "#ffe8e0", "#ffffff"],
    assets: [],
    previewSrc: "/themes/deco/preview-sweet.svg",
    getAssets: getDecoSweetAssets,
  },
  {
    name: "deco-party",
    label: "Deco Party",
    colors: ["#fffff0", "#fff8e1", "#ffffff"],
    assets: [],
    previewSrc: "/themes/deco/preview-party.svg",
    getAssets: getDecoPartyAssets,
  },
];
