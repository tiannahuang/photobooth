import type { Theme } from "@/types/photobooth";

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
        y: 1130,
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
        y: 1150,
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
        y: 1145,
        width: 50,
        height: 50,
      },
      {
        src: "/themes/cottagecore/leaf.svg",
        x: 345,
        y: 1145,
        width: 50,
        height: 50,
      },
    ],
    previewSrc: "/themes/cottagecore/preview.svg",
  },
];
