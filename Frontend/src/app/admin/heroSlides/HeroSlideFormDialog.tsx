import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import { ApiError } from '../../../utils/apiClient';
import { FormErrorSummary, FieldError, fieldErrorProps } from '../formErrors';
import { createHeroSlide, updateHeroSlide } from './api';
import type { AdminHeroSlide, HeroSlideFormValues } from './types';

const EMPTY_FORM: HeroSlideFormValues = {
  title_id: '', title_en: '', title_zh: '',
  subtitle_id: '', subtitle_en: '', subtitle_zh: '',
  description_id: '', description_en: '', description_zh: '',
  cta_path: '', duration_ms: 5000, is_active: true, image: null,
};

interface HeroSlideFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide: AdminHeroSlide | null;
  onSaved: () => void;
}

export function HeroSlideFormDialog({ open, onOpenChange, slide, onSaved }: HeroSlideFormDialogProps) {
  const [values, setValues] = useState<HeroSlideFormValues>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (slide) {
      setValues({
        title_id: slide.title_id, title_en: slide.title_en ?? '', title_zh: slide.title_zh ?? '',
        subtitle_id: slide.subtitle_id, subtitle_en: slide.subtitle_en ?? '', subtitle_zh: slide.subtitle_zh ?? '',
        description_id: slide.description_id, description_en: slide.description_en ?? '', description_zh: slide.description_zh ?? '',
        cta_path: slide.cta_path ?? '', duration_ms: slide.duration_ms, is_active: slide.is_active, image: null,
      });
      setImagePreview(slide.image);
    } else {
      setValues(EMPTY_FORM);
      setImagePreview(null);
    }
    setErrors({});
  }, [open, slide]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValues((prev) => ({ ...prev, image: file }));
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});
    try {
      if (slide) {
        await updateHeroSlide(slide.id, values);
        toast.success('Slide berhasil diperbarui');
      } else {
        if (!values.image) {
          setErrors({ image: ['Gambar wajib diunggah'] });
          setIsSaving(false);
          return;
        }
        await createHeroSlide(values);
        toast.success('Slide berhasil ditambahkan');
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
        toast.error(error.message);
      } else {
        toast.error('Gagal menyimpan slide');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{slide ? 'Edit Hero Slide' : 'Tambah Hero Slide'}</DialogTitle>
            <DialogDescription>
              Upload gambar untuk hero slide. Teks konten sudah diset secara statis dan tidak dapat diubah.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <FormErrorSummary errors={errors} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="hero-image">Gambar Latar</Label>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-32 w-full rounded-md object-cover" />
              )}
              <Input id="hero-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} {...fieldErrorProps(errors, 'image')} />
              <FieldError errors={errors} name="image" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="duration_ms">Durasi Tampil (ms)</Label>
              <Input
                id="duration_ms"
                type="number"
                min={1000}
                step={500}
                value={values.duration_ms}
                onChange={(e) => setValues((prev) => ({ ...prev, duration_ms: Number(e.target.value) }))}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={values.is_active}
                onCheckedChange={(checked) => setValues((prev) => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Aktif (tampil di website)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
