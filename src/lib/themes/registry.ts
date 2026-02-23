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

export const themes: Theme[] = [
  {
    name: "minimalist",
    label: "Minimalist",
    colors: ["#ffffff", "#f5f5f5", "#000000"],
    assets: [],
    previewSrc: "/themes/minimalist/preview.svg",
  },
  {
    name: "y2k",
    label: "Y2K",
    colors: ["#ff69b4", "#00ffff", "#ff00ff"],
    assets: [
      {
        src: "/themes/y2k/star.svg",
        x: 10,
        y: 10,
        width: 60,
        height: 60,
      },
      {
        src: "/themes/y2k/star.svg",
        x: 330,
        y: 10,
        width: 60,
        height: 60,
      },
      {
        src: "/themes/y2k/butterfly.svg",
        x: 150,
        y: 1190,
        width: 80,
        height: 60,
      },
    ],
    previewSrc: "/themes/y2k/preview.svg",
  },
  {
    name: "coquette",
    label: "Coquette",
    colors: ["#fce4ec", "#f8bbd0", "#f48fb1"],
    assets: [
      {
        src: "/themes/coquette/bow.svg",
        x: 140,
        y: 5,
        width: 120,
        height: 50,
      },
      {
        src: "/themes/coquette/bow.svg",
        x: 140,
        y: 1200,
        width: 120,
        height: 50,
      },
    ],
    previewSrc: "/themes/coquette/preview.svg",
  },
  {
    name: "cottagecore",
    label: "Cottagecore",
    colors: ["#e8f5e9", "#c8e6c9", "#a5d6a7"],
    assets: [
      {
        src: "/themes/cottagecore/flower.svg",
        x: 5,
        y: 5,
        width: 50,
        height: 50,
      },
      {
        src: "/themes/cottagecore/flower.svg",
        x: 345,
        y: 5,
        width: 50,
        height: 50,
      },
      {
        src: "/themes/cottagecore/mushroom.svg",
        x: 5,
        y: 1200,
        width: 50,
        height: 50,
      },
      {
        src: "/themes/cottagecore/leaf.svg",
        x: 345,
        y: 1200,
        width: 50,
        height: 50,
      },
    ],
    previewSrc: "/themes/cottagecore/preview.svg",
  },
  {
    name: "deco",
    label: "Deco",
    colors: ["#fff5f5", "#fce4ec", "#ffffff"],
    assets: [],
    previewSrc: "/themes/deco/preview.svg",
    getAssets: getDecoAssets,
  },
];
