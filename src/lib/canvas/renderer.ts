import type { LayoutConfig, CompositionOptions } from "@/types/photobooth";
import { calculateCoverCrop } from "./crop";

function loadImage(src: string): Promise<HTMLImageElement> {
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
  if (options.theme && options.theme.assets.length > 0) {
    for (const asset of options.theme.assets) {
      try {
        const assetImg = await loadImage(asset.src);
        ctx.drawImage(assetImg, asset.x, asset.y, asset.width, asset.height);
      } catch {
        // Skip assets that fail to load
      }
    }
  }

  return canvas;
}
