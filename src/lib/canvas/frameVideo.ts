import type { LayoutConfig, CompositionOptions } from "@/types/photobooth";
import { LOGO_AREA_HEIGHT } from "@/lib/constants";
import { calculateCoverCrop } from "./crop";
import { isLightColor, loadImage } from "./renderer";

function getSupportedMimeType(): string {
  const types = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];
  for (const type of types) {
    if (
      typeof MediaRecorder !== "undefined" &&
      MediaRecorder.isTypeSupported(type)
    ) {
      return type;
    }
  }
  return "video/webm";
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Generates an animated video of the photo strip being built up:
 * starts with the empty frame, then each photo fades into its slot one by one.
 */
export async function generateFrameVideo(
  photos: string[],
  layout: LayoutConfig,
  options: CompositionOptions
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = layout.canvasWidth;
  canvas.height = layout.canvasHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Pre-load all images
  const totalPhotos = Math.min(photos.length, layout.slots.length);
  const images: HTMLImageElement[] = [];
  for (let i = 0; i < totalPhotos; i++) {
    images.push(await loadImage(photos[i]));
  }

  // Pre-load theme assets
  const themeImages: { img: HTMLImageElement; x: number; y: number; w: number; h: number }[] = [];
  if (options.theme && options.theme.assets.length > 0) {
    for (const asset of options.theme.assets) {
      try {
        const img = await loadImage(asset.src);
        themeImages.push({ img, x: asset.x, y: asset.y, w: asset.width, h: asset.height });
      } catch {
        // Skip failed assets
      }
    }
  }

  // Check if recording is supported
  if (typeof MediaRecorder === "undefined") return null;

  let stream: MediaStream;
  try {
    stream = canvas.captureStream(30);
  } catch {
    return null;
  }

  const mimeType = getSupportedMimeType();
  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType });
  } catch {
    return null;
  }

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  // Pre-compute crops
  const crops = images.map((img, i) => {
    const slot = layout.slots[i];
    return calculateCoverCrop(img.naturalWidth, img.naturalHeight, slot.width, slot.height);
  });

  // Animation timing
  const HOLD_START = 600;
  const PHOTO_FADE_DURATION = 500;
  const PHOTO_GAP = 400;
  const HOLD_END = 1200;
  const animationEnd =
    HOLD_START +
    totalPhotos * PHOTO_FADE_DURATION +
    (totalPhotos - 1) * PHOTO_GAP +
    HOLD_END;

  // Logo rendering config
  const logoY = canvas.height - LOGO_AREA_HEIGHT;
  const logoColor = isLightColor(options.frameColor)
    ? "rgba(0, 0, 0, 0.25)"
    : "rgba(255, 255, 255, 0.35)";

  return new Promise<Blob | null>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }));
    };

    recorder.start();
    const startTime = performance.now();

    function animate(timestamp: number) {
      const elapsed = timestamp - startTime;

      // Background
      ctx!.fillStyle = options.frameColor;
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      // Draw photos based on timeline
      for (let i = 0; i < totalPhotos; i++) {
        const photoStart = HOLD_START + i * (PHOTO_FADE_DURATION + PHOTO_GAP);

        if (elapsed >= photoStart) {
          const rawProgress = Math.min(
            1,
            (elapsed - photoStart) / PHOTO_FADE_DURATION
          );
          const progress = easeOutCubic(rawProgress);

          const slot = layout.slots[i];
          const img = images[i];
          const crop = crops[i];

          ctx!.save();
          ctx!.globalAlpha = progress;

          // Subtle scale-up effect (95% -> 100%)
          const scale = 0.95 + 0.05 * progress;
          const cx = slot.x + slot.width / 2;
          const cy = slot.y + slot.height / 2;
          ctx!.translate(cx, cy);
          ctx!.scale(scale, scale);
          ctx!.translate(-cx, -cy);

          ctx!.drawImage(
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
          ctx!.restore();
        }
      }

      // Theme assets
      for (const { img, x, y, w, h } of themeImages) {
        ctx!.drawImage(img, x, y, w, h);
      }

      // Logo
      ctx!.fillStyle = logoColor;
      ctx!.font = "600 20px system-ui, sans-serif";
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillText(
        "Photobooth",
        canvas.width / 2,
        logoY + LOGO_AREA_HEIGHT / 2
      );

      if (elapsed < animationEnd) {
        requestAnimationFrame(animate);
      } else {
        recorder.stop();
      }
    }

    requestAnimationFrame(animate);
  });
}
