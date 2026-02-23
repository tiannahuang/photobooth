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

function createVideoFromBlob(blob: Blob): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(blob);
    video.src = url;
    video.onloadeddata = () => resolve(video);
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video from blob"));
    };
  });
}

/**
 * Generates an animated video of the photo strip.
 * If clips are provided, plays all countdown clips simultaneously in their slots,
 * then flashes and holds the final still photos.
 * Falls back to fade-in animation if no clips.
 */
export async function generateFrameVideo(
  photos: string[],
  layout: LayoutConfig,
  options: CompositionOptions,
  clips: Blob[] = []
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
  if (options.theme) {
    const assets = options.theme.getAssets?.(canvas.width, canvas.height) ?? options.theme.assets;
    for (const asset of assets) {
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

  // Pre-compute crops for still photos
  const crops = images.map((img, i) => {
    const slot = layout.slots[i];
    return calculateCoverCrop(img.naturalWidth, img.naturalHeight, slot.width, slot.height);
  });

  // Logo rendering config
  const logoY = canvas.height - LOGO_AREA_HEIGHT;
  const logoColor = isLightColor(options.frameColor)
    ? "rgba(0, 0, 0, 0.25)"
    : "rgba(255, 255, 255, 0.35)";

  const drawBackground = () => {
    ctx!.fillStyle = options.frameColor;
    ctx!.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawTheme = () => {
    for (const { img, x, y, w, h } of themeImages) {
      ctx!.drawImage(img, x, y, w, h);
    }
  };

  const drawLogo = () => {
    ctx!.fillStyle = logoColor;
    ctx!.font = "600 20px system-ui, sans-serif";
    ctx!.textAlign = "center";
    ctx!.textBaseline = "middle";
    ctx!.fillText("Photobooth", canvas.width / 2, logoY + LOGO_AREA_HEIGHT / 2);
  };

  const drawStillPhotos = () => {
    for (let i = 0; i < totalPhotos; i++) {
      const slot = layout.slots[i];
      const img = images[i];
      const crop = crops[i];
      ctx!.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, slot.x, slot.y, slot.width, slot.height);
    }
  };

  // Check if we have usable clips for simultaneous playback
  const hasClips = clips.length >= totalPhotos && totalPhotos > 0;

  if (hasClips) {
    return renderWithClips();
  } else {
    return renderWithFadeIn();
  }

  async function renderWithClips(): Promise<Blob | null> {
    // Load video elements from clip blobs
    const clipVideos: HTMLVideoElement[] = [];
    for (let i = 0; i < totalPhotos; i++) {
      try {
        const video = await createVideoFromBlob(clips[i]);
        clipVideos.push(video);
      } catch {
        // If any clip fails to load, fall back to fade-in
        return renderWithFadeIn();
      }
    }

    // Determine clip duration from the shortest clip
    const clipDuration = Math.min(...clipVideos.map((v) => v.duration || 3)) * 1000;
    const FLASH_DURATION = 150;
    const HOLD_DURATION = 1500;
    const totalDuration = clipDuration + FLASH_DURATION + HOLD_DURATION;

    return new Promise<Blob | null>((resolve) => {
      recorder.onstop = () => {
        // Clean up video blob URLs
        clipVideos.forEach((v) => URL.revokeObjectURL(v.src));
        resolve(new Blob(chunks, { type: mimeType }));
      };

      recorder.start();

      // Start all clips playing simultaneously
      clipVideos.forEach((v) => {
        v.currentTime = 0;
        v.play().catch(() => {});
      });

      const startTime = performance.now();

      function animate(timestamp: number) {
        const elapsed = timestamp - startTime;

        drawBackground();

        if (elapsed < clipDuration) {
          // Phase 1: All clips playing simultaneously
          for (let i = 0; i < totalPhotos; i++) {
            const slot = layout.slots[i];
            const video = clipVideos[i];

            if (video.readyState >= 2) {
              // Cover-crop the video frame into the slot
              const vw = video.videoWidth;
              const vh = video.videoHeight;
              const crop = calculateCoverCrop(vw, vh, slot.width, slot.height);
              ctx!.drawImage(video, crop.sx, crop.sy, crop.sw, crop.sh, slot.x, slot.y, slot.width, slot.height);
            }
          }
        } else if (elapsed < clipDuration + FLASH_DURATION) {
          // Phase 2: White flash transition
          const flashProgress = (elapsed - clipDuration) / FLASH_DURATION;
          drawStillPhotos();
          ctx!.fillStyle = `rgba(255, 255, 255, ${1 - flashProgress})`;
          ctx!.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          // Phase 3: Hold final still photos
          drawStillPhotos();
        }

        drawTheme();
        drawLogo();

        if (elapsed < totalDuration) {
          requestAnimationFrame(animate);
        } else {
          clipVideos.forEach((v) => v.pause());
          recorder.stop();
        }
      }

      requestAnimationFrame(animate);
    });
  }

  function renderWithFadeIn(): Promise<Blob | null> {
    // Animation timing (original fade-in behavior)
    const HOLD_START = 600;
    const PHOTO_FADE_DURATION = 500;
    const PHOTO_GAP = 400;
    const HOLD_END = 1200;
    const animationEnd =
      HOLD_START +
      totalPhotos * PHOTO_FADE_DURATION +
      (totalPhotos - 1) * PHOTO_GAP +
      HOLD_END;

    return new Promise<Blob | null>((resolve) => {
      recorder.onstop = () => {
        resolve(new Blob(chunks, { type: mimeType }));
      };

      recorder.start();
      const startTime = performance.now();

      function animate(timestamp: number) {
        const elapsed = timestamp - startTime;

        drawBackground();

        // Draw photos based on timeline
        for (let i = 0; i < totalPhotos; i++) {
          const photoStart = HOLD_START + i * (PHOTO_FADE_DURATION + PHOTO_GAP);

          if (elapsed >= photoStart) {
            const rawProgress = Math.min(1, (elapsed - photoStart) / PHOTO_FADE_DURATION);
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

            ctx!.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, slot.x, slot.y, slot.width, slot.height);
            ctx!.restore();
          }
        }

        drawTheme();
        drawLogo();

        if (elapsed < animationEnd) {
          requestAnimationFrame(animate);
        } else {
          recorder.stop();
        }
      }

      requestAnimationFrame(animate);
    });
  }
}
