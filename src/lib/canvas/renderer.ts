import type { LayoutConfig, CompositionOptions } from "@/types/photobooth";
import { LOGO_AREA_HEIGHT } from "@/lib/constants";
import { calculateCoverCrop } from "./crop";

export function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function renderComposition(
  photos: string[],
  layout: LayoutConfig,
  options: CompositionOptions
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = layout.canvasWidth;
  canvas.height = layout.canvasHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Fill background with frame color
  ctx.fillStyle = options.frameColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw each photo into its slot
  const slots = layout.slots;
  for (let i = 0; i < slots.length && i < photos.length; i++) {
    const slot = slots[i];
    const img = await loadImage(photos[i]);

    const crop = calculateCoverCrop(
      img.naturalWidth,
      img.naturalHeight,
      slot.width,
      slot.height
    );

    ctx.drawImage(
      img,
      crop.sx,
      crop.sy,
      crop.sw,
      crop.sh,
      slot.x,
      slot.y,
      slot.width,
      slot.height
    );
  }

  // Draw theme assets (stickers, borders) if theme is set
  if (options.theme) {
    const assets = options.theme.getAssets?.(canvas.width, canvas.height) ?? options.theme.assets;
    for (const asset of assets) {
      try {
        const assetImg = await loadImage(asset.src);
        if (asset.rotation) {
          ctx.save();
          const cx = asset.x + asset.width / 2;
          const cy = asset.y + asset.height / 2;
          ctx.translate(cx, cy);
          ctx.rotate((asset.rotation * Math.PI) / 180);
          ctx.drawImage(assetImg, -asset.width / 2, -asset.height / 2, asset.width, asset.height);
          ctx.restore();
        } else {
          ctx.drawImage(assetImg, asset.x, asset.y, asset.width, asset.height);
        }
      } catch {
        // Skip assets that fail to load
      }
    }
  }

  // Draw "Photobooth" logo text in bottom area (skip for vintage layouts)
  if (!layout.type.startsWith('vintage-')) {
    const logoY = canvas.height - LOGO_AREA_HEIGHT;
    const isLightFrame = isLightColor(options.frameColor);
    ctx.fillStyle = isLightFrame ? "rgba(0, 0, 0, 0.25)" : "rgba(255, 255, 255, 0.35)";
    ctx.font = "600 20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Photobooth", canvas.width / 2, logoY + LOGO_AREA_HEIGHT / 2);
  }

  return canvas;
}
