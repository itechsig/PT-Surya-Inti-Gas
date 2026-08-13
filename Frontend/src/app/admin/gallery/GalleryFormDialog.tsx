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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ApiError } from '../../../utils/apiClient';
import { createGalleryItem, updateGalleryItem } from './api';
import { GALLERY_CATEGORIES, GALLERY_SIZES, type AdminGalleryItem, type GalleryItemFormValues } from './types';

const EMPTY_FORM: GalleryItemFormValues = {
  title_id: '', title_en: '', title_zh: '',
  description_id: '', description_en: '', description_zh: '',
  detailed_description_id: '', detailed_description_en: '', detailed_description_zh: '',
  category: 'products', year: new Date().getFullYear(), size: 'medium', is_active: true, image: null,
};

interface GalleryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: AdminGalleryItem | null;
  onSaved: () => void;
}

export function GalleryFormDialog({ open, onOpenChange, item, onSaved }: GalleryFormDialogProps) {
  const [values, setValues] = useState<GalleryItemFormValues>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (item) {
      setValues({
        title_id: item.title_id, title_en: item.title_en ?? '', title_zh: item.title_zh ?? '',
        description_id: item.description_id, description_en: item.description_en ?? '', description_zh: item.description_zh ?? '',
        detailed_description_id: item.detailed_description_id ?? '',
        detailed_description_en: item.detailed_description_en ?? '',
        detailed_description_zh: item.detailed_description_zh ?? '',
        category: item.category, year: item.year, size: item.size, is_active: item.is_active, image: null,
      });
      setImagePreview(item.image);
    } else {
      setValues(EMPTY_FORM);
      setImagePreview(null);
    }
    setErrors({});
  }, [open, item]);

  const field = (key: keyof GalleryItemFormValues) => ({
    value: values[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [key]: e.target.value })),
  });

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
      if (item) {
        await updateGalleryItem(item.id, values);
        toast.success('Foto berhasil diperbarui');
      } else {
        if (!values.image) {
          setErrors({ image: ['Gambar wajib diunggah'] });
          setIsSaving(false);
          return;
        }
        await createGalleryItem(values);
        toast.success('Foto berhasil ditambahkan');
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
        toast.error(error.message);
      } else {
        toast.error('Gagal menyimpan foto');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const fieldError = (key: string) => errors[key]?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{item ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}</DialogTitle>
            <DialogDescription>
              Isi konten untuk setiap bahasa. Bahasa Indonesia wajib diisi; Inggris &amp; Mandarin opsional
              (akan otomatis memakai teks Indonesia jika kosong).
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="gallery-image">Gambar</Label>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="h-32 w-full rounded-md object-cover" />
              )}
              <Input id="gallery-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} />
              {fieldError('image') && <p className="text-xs text-destructive">{fieldError('image')}</p>}
            </div>

            <Tabs defaultValue="id">
              <TabsList>
                <TabsTrigger value="id">Indonesia</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="zh">中文</TabsTrigger>
              </TabsList>
              {(['id', 'en', 'zh'] as const).map((lang) => (
                <TabsContent key={lang} value={lang} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`title_${lang}`}>Judul</Label>
                    <Input id={`title_${lang}`} {...field(`title_${lang}` as keyof GalleryItemFormValues)} />
                    {fieldError(`title_${lang}`) && <p className="text-xs text-destructive">{fieldError(`title_${lang}`)}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`description_${lang}`}>Deskripsi Singkat</Label>
                    <Textarea id={`description_${lang}`} rows={2} {...field(`description_${lang}` as keyof GalleryItemFormValues)} />
                    {fieldError(`description_${lang}`) && <p className="text-xs text-destructive">{fieldError(`description_${lang}`)}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`detailed_description_${lang}`}>Deskripsi Lengkap</Label>
                    <Textarea id={`detailed_description_${lang}`} rows={4} {...field(`detailed_description_${lang}` as keyof GalleryItemFormValues)} />
                    {fieldError(`detailed_description_${lang}`) && <p className="text-xs text-destructive">{fieldError(`detailed_description_${lang}`)}</p>}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category">Kategori</Label>
                <Select value={values.category} onValueChange={(value) => setValues((prev) => ({ ...prev, category: value }))}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {GALLERY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError('category') && <p className="text-xs text-destructive">{fieldError('category')}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="year">Tahun</Label>
                <Input
                  id="year"
                  type="number"
                  min={2000}
                  max={2100}
                  value={values.year}
                  onChange={(e) => setValues((prev) => ({ ...prev, year: Number(e.target.value) }))}
                />
                {fieldError('year') && <p className="text-xs text-destructive">{fieldError('year')}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="size">Ukuran Grid</Label>
                <Select value={values.size} onValueChange={(value) => setValues((prev) => ({ ...prev, size: value }))}>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Pilih ukuran" />
                  </SelectTrigger>
                  <SelectContent>
                    {GALLERY_SIZES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
