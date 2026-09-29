import type { Area } from 'react-easy-crop';

/** Longest edge of the exported image — plenty for full-screen hero slides, and keeps uploads small. */
const MAX_OUTPUT_EDGE = 2560;
/** Backend validates uploads with `max:5120` (KB); leave some headroom. */
const MAX_OUTPUT_BYTES = 4.5 * 1024 * 1024;

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.crossOrigin = 'anonymous';
    image.src = url;
  });
}

/** Keep PNG/WebP (transparent product cut-outs stay transparent); everything else becomes JPEG. */
function outputType(sourceType: string): string {
  return sourceType === 'image/png' || sourceType === 'image/webp' ? sourceType : 'image/jpeg';
}

function withExtension(fileName: string, mimeType: string): string {
  const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
  const base = fileName.replace(/\.[^.]+$/, '') || 'image';
  return `${base}.${ext}`;
}

/**
 * Crops `imageSrc` to `cropPixels` (as reported by react-easy-crop, i.e. relative to the image
 * after `rotation` degrees of clockwise rotation) and returns it as an upload-ready File.
 */
export async function getCroppedImageFile(
  imageSrc: string,
  cropPixels: Area,
  fileName: string,
  sourceType = 'image/jpeg',
  rotation = 0,
): Promise<File> {
  const image = await loadImage(imageSrc);
  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const rotatedW = image.naturalWidth * cos + image.naturalHeight * sin;
  const rotatedH = image.naturalWidth * sin + image.naturalHeight * cos;

  // Draw the whole rotated image first, then copy the crop window out of it.
  const rotated = document.createElement('canvas');
  rotated.width = Math.round(rotatedW);
  rotated.height = Math.round(rotatedH);
  const rctx = rotated.getContext('2d');
  if (!rctx) throw new Error('Canvas context unavailable');
  rctx.translate(rotatedW / 2, rotatedH / 2);
  rctx.rotate(rad);
  rctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

  const scale = Math.min(1, MAX_OUTPUT_EDGE / Math.max(cropPixels.width, cropPixels.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(cropPixels.width * scale));
  canvas.height = Math.max(1, Math.round(cropPixels.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  const mimeType = outputType(sourceType);
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    rotated,
    cropPixels.x, cropPixels.y, cropPixels.width, cropPixels.height,
    0, 0, canvas.width, canvas.height,
  );

  // Stay under the backend's 5 MB upload rule: large PNGs fall back to WebP (still transparent),
  // then quality steps down until the file fits.
  const attempts: [string, number][] = [[mimeType, 0.9]];
  if (mimeType === 'image/png') attempts.push(['image/webp', 0.9]);
  const lossyType = mimeType === 'image/jpeg' ? 'image/jpeg' : 'image/webp';
  attempts.push([lossyType, 0.8], [lossyType, 0.7]);

  let blob: Blob | null = null;
  let type = mimeType;
  for (const [candidateType, quality] of attempts) {
    blob = await canvasToBlob(canvas, candidateType, quality);
    type = blob.type || candidateType;
    if (blob.size <= MAX_OUTPUT_BYTES) break;
  }
  return new File([blob!], withExtension(fileName, type), { type });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate cropped image'));
    }, type, quality);
  });
}
