import { useCallback, useEffect, useState } from 'react';
import Cropper, { type Area, type MediaSize } from 'react-easy-crop';
import { RotateCcw, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Slider } from '../../components/ui/slider';
import { getCroppedImageFile } from './cropImage';

/** A crop ratio choice; `'original'` keeps the photo's own proportions (pan/zoom only). */
export interface AspectOption {
  label: string;
  value: number | 'original';
}

export const ORIGINAL_ASPECT: AspectOption = { label: 'Asli', value: 'original' };

export interface CropRequestOptions {
  aspects: AspectOption[];
  /** Index into `aspects` selected when the dialog opens (default 0). */
  defaultAspect?: number;
  /** Where/how the photo is shown on the website, so the admin knows what to frame. */
  hint?: string;
}

interface ImageCropDialogProps extends CropRequestOptions {
  files: File[];
  /** Cropped files in the same order, or null when the admin cancelled. */
  onFinish: (files: File[] | null) => void;
}

function ImageCropDialog({ files, aspects, defaultAspect = 0, hint, onFinish }: ImageCropDialogProps) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<File[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [aspectIndex, setAspectIndex] = useState(defaultAspect);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [mediaSize, setMediaSize] = useState<MediaSize | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const file = files[index];
  const total = files.length;

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setMediaSize(null);
    setCroppedAreaPixels(null);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const selected = aspects[aspectIndex] ?? aspects[0];
  const isQuarterTurned = rotation % 180 !== 0;
  const aspect = selected.value === 'original'
    ? (mediaSize
      ? (isQuarterTurned ? mediaSize.naturalHeight / mediaSize.naturalWidth : mediaSize.naturalWidth / mediaSize.naturalHeight)
      : 4 / 3)
    : selected.value;

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const advance = (output: File) => {
    const next = [...results, output];
    if (index + 1 >= total) {
      onFinish(next);
    } else {
      setResults(next);
      setIndex(index + 1);
    }
  };

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      advance(await getCroppedImageFile(imageSrc, croppedAreaPixels, file.name, file.type, rotation));
    } catch {
      toast.error('Gagal memproses gambar');
    } finally {
      setIsProcessing(false);
    }
  };

  const rotate = (delta: number) => setRotation((r) => (r + delta + 360) % 360);

  return (
    <Dialog open onOpenChange={(open) => !open && onFinish(null)}>
      <DialogContent className="max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            Sesuaikan Crop Gambar{total > 1 && ` (${index + 1} dari ${total})`}
          </DialogTitle>
          <DialogDescription>
            {hint ?? 'Geser dan zoom gambar sampai bagian yang ingin ditampilkan berada di dalam bingkai.'}
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-[min(55vh,420px)] w-full overflow-hidden rounded-md bg-muted">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              minZoom={1}
              maxZoom={4}
              showGrid
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              onMediaLoaded={setMediaSize}
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          {aspects.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-16 text-xs text-muted-foreground">Rasio</span>
              {aspects.map((option, i) => (
                <Button
                  key={option.label}
                  type="button"
                  size="sm"
                  variant={i === aspectIndex ? 'default' : 'outline'}
                  onClick={() => setAspectIndex(i)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs text-muted-foreground">Zoom</span>
            <Slider value={[zoom]} min={1} max={4} step={0.05} onValueChange={([v]) => setZoom(v)} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 text-xs text-muted-foreground">Putar</span>
            <Button type="button" size="sm" variant="outline" onClick={() => rotate(-90)} aria-label="Putar ke kiri">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => rotate(90)} aria-label="Putar ke kanan">
              <RotateCw className="h-3.5 w-3.5" />
            </Button>
            {croppedAreaPixels && (
              <span className="ml-auto text-xs text-muted-foreground">
                Hasil: {Math.round(croppedAreaPixels.width)} × {Math.round(croppedAreaPixels.height)} px
              </span>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={() => onFinish(null)} disabled={isProcessing}>
            Batal
          </Button>
          <Button type="button" variant="secondary" onClick={() => advance(file)} disabled={isProcessing}>
            Pakai Tanpa Crop
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={isProcessing || !croppedAreaPixels}>
            {isProcessing ? 'Memproses...' : index + 1 < total ? 'Crop & Lanjut' : 'Gunakan Gambar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface PendingCrop extends CropRequestOptions {
  id: number;
  files: File[];
  resolve: (files: File[] | null) => void;
}

let requestCounter = 0;

/**
 * Promise-based crop step for admin uploads:
 *   const { requestCrop, cropDialog } = useImageCropper();
 *   const files = await requestCrop([file], { aspects: [...] }); // null = cancelled
 * and render `{cropDialog}` somewhere in the component.
 */
export function useImageCropper() {
  const [pending, setPending] = useState<PendingCrop | null>(null);

  const requestCrop = useCallback(
    (files: File[], options: CropRequestOptions) =>
      new Promise<File[] | null>((resolve) => {
        if (files.length === 0) {
          resolve([]);
          return;
        }
        setPending({ ...options, id: ++requestCounter, files, resolve });
      }),
    [],
  );

  const cropDialog = pending ? (
    <ImageCropDialog
      key={pending.id}
      files={pending.files}
      aspects={pending.aspects}
      defaultAspect={pending.defaultAspect}
      hint={pending.hint}
      onFinish={(result) => {
        pending.resolve(result);
        setPending(null);
      }}
    />
  ) : null;

  return { requestCrop, cropDialog };
}
