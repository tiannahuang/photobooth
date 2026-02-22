/**
 * Calculates the source rectangle for object-fit:cover behavior.
 * Centers and crops the source image to fill the target dimensions.
 */
export function calculateCoverCrop(
  srcWidth: number,
  srcHeight: number,
  targetWidth: number,
  targetHeight: number
): { sx: number; sy: number; sw: number; sh: number } {
  const srcAspect = srcWidth / srcHeight;
  const targetAspect = targetWidth / targetHeight;

  let sw: number, sh: number, sx: number, sy: number;

  if (srcAspect > targetAspect) {
    // Source is wider — crop horizontally
    sh = srcHeight;
    sw = srcHeight * targetAspect;
    sx = (srcWidth - sw) / 2;
    sy = 0;
  } else {
    // Source is taller — crop vertically
    sw = srcWidth;
    sh = srcWidth / targetAspect;
    sx = 0;
    sy = (srcHeight - sh) / 2;
  }

  return { sx, sy, sw, sh };
}
