import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Slider } from '../../components/ui/slider';
import { getCroppedImageFile } from './cropImage';

interface ThumbnailCropDialogProps {
  open: boolean;
  imageSrc: string | null;
  aspect?: number;
  fileName: string;
  onOpenChange: (open: boolean) => void;
  onCropped: (file: File) => void;
}

export function ThumbnailCropDialog({ open, imageSrc, aspect = 4 / 3, fileName, onOpenChange, onCropped }: ThumbnailCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const file = await getCroppedImageFile(imageSrc, croppedAreaPixels, fileName);
      onCropped(file);
      onOpenChange(false);
    } finally {
      setIsProcessing(false);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sesuaikan Crop Gambar</DialogTitle>
        </DialogHeader>
        <div className="relative h-80 w-full overflow-hidden rounded-md bg-muted">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>
        <div className="flex items-center gap-3 py-2">
          <span className="w-10 text-xs text-muted-foreground">Zoom</span>
          <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={([v]) => setZoom(v)} />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={isProcessing || !croppedAreaPixels}>
            {isProcessing ? 'Memproses...' : 'Gunakan Gambar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
