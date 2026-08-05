import type { Area } from 'react-easy-crop';

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.crossOrigin = 'anonymous';
    image.src = url;
  });
}

export async function getCroppedImageFile(
  imageSrc: string,
  cropPixels: Area,
  fileName: string,
  mimeType = 'image/jpeg'
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.drawImage(
    image,
    cropPixels.x, cropPixels.y, cropPixels.width, cropPixels.height,
    0, 0, cropPixels.width, cropPixels.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to generate cropped image'));
        return;
      }
      resolve(new File([blob], fileName, { type: mimeType }));
    }, mimeType, 0.9);
  });
}
