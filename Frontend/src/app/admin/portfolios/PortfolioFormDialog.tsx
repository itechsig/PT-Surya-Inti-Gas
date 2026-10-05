import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import { ApiError } from '../../../utils/apiClient';
import { FormErrorSummary, fieldErrorProps } from '../formErrors';
import { createPortfolio, deletePortfolioImage, reorderPortfolioImages, updatePortfolio, uploadPortfolioImages } from './api';
import { ORIGINAL_ASPECT, useImageCropper } from '../components/ImageCropDialog';
import { PortfolioGalleryManager, type GalleryManagerItem } from './PortfolioGalleryManager';
import { EntityCombobox } from './EntityCombobox';
import {
  type AdminIndustry, type AdminPortfolio, type AdminPortfolioImage, type AdminServiceType,
  type PortfolioFormValues,
} from './types';
import { RichTextEditor } from '../components/RichTextEditor';

const EMPTY_FORM: PortfolioFormValues = {
  industry_id: '', industry_name: '', service_type_id: '', service_type_name: '', slug: '',
  title_id: '', title_en: '', title_zh: '',
  summary_id: '', summary_en: '', summary_zh: '',
  is_featured: false, is_published: true,
  thumbnail: null, newGalleryFiles: [],
};

interface StagedGalleryFile {
  id: string;
  file: File;
  url: string;
}

interface PortfolioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolio: AdminPortfolio | null;
  industries: AdminIndustry[];
  serviceTypes: AdminServiceType[];
  onSaved: () => void;
}

export function PortfolioFormDialog({ open, onOpenChange, portfolio, industries, serviceTypes, onSaved }: PortfolioFormDialogProps) {
  const [values, setValues] = useState<PortfolioFormValues>(EMPTY_FORM);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const { requestCrop, cropDialog } = useImageCropper();

  const [stagedGallery, setStagedGallery] = useState<StagedGalleryFile[]>([]);
  const [galleryImages, setGalleryImages] = useState<AdminPortfolioImage[]>([]);

  useEffect(() => {
    if (!open) return;
    if (portfolio) {
      setValues({
        industry_id: String(portfolio.industry_id), industry_name: '',
        service_type_id: String(portfolio.service_type_id), service_type_name: '',
        slug: portfolio.slug,
        title_id: portfolio.title_id, title_en: portfolio.title_en ?? '', title_zh: portfolio.title_zh ?? '',
        summary_id: portfolio.summary_id, summary_en: portfolio.summary_en ?? '', summary_zh: portfolio.summary_zh ?? '',
        is_featured: portfolio.is_featured, is_published: portfolio.is_published,
        thumbnail: null, newGalleryFiles: [],
      });
      setThumbnailPreview(portfolio.thumbnail);
      setGalleryImages(portfolio.gallery ?? []);
      setStagedGallery([]);
    } else {
      setValues(EMPTY_FORM);
      setThumbnailPreview(null);
      setGalleryImages([]);
      setStagedGallery([]);
    }
    setErrors({});
  }, [open, portfolio]);

  const field = (key: keyof PortfolioFormValues) => ({
    value: values[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [key]: e.target.value })),
    ...fieldErrorProps(errors, key as string),
  });

  const richTextField = (key: keyof PortfolioFormValues) => ({
    value: values[key] as string,
    onChange: (value: string) => setValues((prev) => ({ ...prev, [key]: value })),
    error: errors[key]?.[0],
  });

  const fieldError = (key: string) => errors[key]?.[0];

  const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const cropped = await requestCrop([file], {
      aspects: [{ label: '4:3', value: 4 / 3 }, { label: '16:9', value: 16 / 9 }, ORIGINAL_ASPECT],
      hint: 'Thumbnail tampil di kartu portofolio dengan rasio 4:3 — pastikan objek utama berada di tengah bingkai.',
    });
    if (!cropped) return;
    setValues((prev) => ({ ...prev, thumbnail: cropped[0] }));
    setThumbnailPreview(URL.createObjectURL(cropped[0]));
  };

  // Gallery — create mode stages files locally; edit mode calls the live API immediately.
  const galleryItems: GalleryManagerItem[] = portfolio
    ? galleryImages.map((img) => ({ id: String(img.id), url: img.image }))
    : stagedGallery.map((s) => ({ id: s.id, url: s.url }));

  const handleGalleryAddFiles = async (selected: File[]) => {
    const files = await requestCrop(selected, {
      aspects: [ORIGINAL_ASPECT, { label: '4:3', value: 4 / 3 }, { label: '16:9', value: 16 / 9 }, { label: '1:1', value: 1 }],
      hint: 'Galeri proyek tampil utuh saat diperbesar; pilih "Asli" jika tidak perlu memotong.',
    });
    if (!files) return;
    if (portfolio) {
      try {
        const res = await uploadPortfolioImages(portfolio.id, files);
        setGalleryImages(res.data);
        toast.success('Gambar galeri ditambahkan');
      } catch {
        toast.error('Gagal mengunggah gambar galeri');
      }
    } else {
      const additions = files.map((file) => ({
        id: crypto.randomUUID(), file, url: URL.createObjectURL(file),
      }));
      setStagedGallery((prev) => [...prev, ...additions]);
    }
  };

  const handleGalleryRemove = async (id: string) => {
    if (portfolio) {
      const previous = galleryImages;
      setGalleryImages((prev) => prev.filter((img) => String(img.id) !== id));
      try {
        await deletePortfolioImage(portfolio.id, Number(id));
      } catch {
        setGalleryImages(previous);
        toast.error('Gagal menghapus gambar galeri');
      }
    } else {
      setStagedGallery((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleGalleryReorder = async (items: GalleryManagerItem[]) => {
    if (portfolio) {
      const previous = galleryImages;
      const reordered = items
        .map((item, index) => {
          const image = galleryImages.find((img) => String(img.id) === item.id);
          return image ? { ...image, display_order: index } : null;
        })
        .filter((img): img is AdminPortfolioImage => img !== null);
      setGalleryImages(reordered);
      try {
        await reorderPortfolioImages(portfolio.id, reordered.map((img, index) => ({ id: img.id, display_order: index })));
      } catch {
        setGalleryImages(previous);
        toast.error('Gagal mengubah urutan galeri');
      }
    } else {
      const reordered = items
        .map((item) => stagedGallery.find((s) => s.id === item.id))
        .filter((s): s is StagedGalleryFile => s !== undefined);
      setStagedGallery(reordered);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});
    try {
      if (portfolio) {
        await updatePortfolio(portfolio.id, values);
        toast.success('Portofolio berhasil diperbarui');
      } else {
        if (!values.thumbnail) {
          setErrors({ thumbnail: ['Thumbnail wajib diunggah'] });
          setIsSaving(false);
          return;
        }
        await createPortfolio({ ...values, newGalleryFiles: stagedGallery.map((s) => s.file) });
        toast.success('Portofolio berhasil ditambahkan');
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
        toast.error(error.message);
      } else {
        toast.error('Gagal menyimpan portofolio');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{portfolio ? 'Edit Portofolio' : 'Tambah Portofolio'}</DialogTitle>
            <DialogDescription>
              Bahasa Indonesia wajib diisi; Inggris &amp; Mandarin opsional (otomatis memakai teks Indonesia jika kosong).
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <FormErrorSummary errors={errors} />
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="industry">Solusi Industri</Label>
                <EntityCombobox
                  options={industries.map((ind) => ({ id: ind.id, name: ind.name_id }))}
                  selectedId={values.industry_id}
                  newName={values.industry_name}
                  placeholder="Pilih atau ketik solusi industri"
                  onSelectExisting={(id) => setValues((prev) => ({ ...prev, industry_id: id, industry_name: '' }))}
                  onCreateNew={(name) => setValues((prev) => ({ ...prev, industry_id: '', industry_name: name }))}
                />
                {fieldError('industry_id') && <p className="text-xs text-destructive">{fieldError('industry_id')}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="service_type">Service Type</Label>
                <EntityCombobox
                  options={serviceTypes.map((s) => ({ id: s.id, name: s.name_id }))}
                  selectedId={values.service_type_id}
                  newName={values.service_type_name}
                  placeholder="Pilih atau ketik layanan"
                  onSelectExisting={(id) => setValues((prev) => ({ ...prev, service_type_id: id, service_type_name: '' }))}
                  onCreateNew={(name) => setValues((prev) => ({ ...prev, service_type_id: '', service_type_name: name }))}
                />
                {fieldError('service_type_id') && <p className="text-xs text-destructive">{fieldError('service_type_id')}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="slug">Slug (untuk URL)</Label>
                <Input id="slug" placeholder="misal: pt-abc-manufaktur" {...field('slug')} />
                {fieldError('slug') && <p className="text-xs text-destructive">{fieldError('slug')}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="portfolio-thumbnail">Thumbnail (rasio 4:3)</Label>
              {thumbnailPreview && <img src={thumbnailPreview} alt="Preview" className="h-32 w-full rounded-md object-cover" />}
              <Input id="portfolio-thumbnail" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleThumbnailSelect} {...fieldErrorProps(errors, 'thumbnail')} />
              {fieldError('thumbnail') && <p className="text-xs text-destructive">{fieldError('thumbnail')}</p>}
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
                    <Input id={`title_${lang}`} {...field(`title_${lang}` as keyof PortfolioFormValues)} />
                    {fieldError(`title_${lang}`) && <p className="text-xs text-destructive">{fieldError(`title_${lang}`)}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`summary_${lang}`}>Summary</Label>
                    <RichTextEditor
                      id={`summary_${lang}`}
                      placeholder="Masukkan summary..."
                      {...richTextField(`summary_${lang}` as keyof PortfolioFormValues)}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <PortfolioGalleryManager
              items={galleryItems}
              onAddFiles={handleGalleryAddFiles}
              onRemove={handleGalleryRemove}
              onReorder={handleGalleryReorder}
            />

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_featured"
                  checked={values.is_featured}
                  onCheckedChange={(checked) => setValues((prev) => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_published"
                  checked={values.is_published}
                  onCheckedChange={(checked) => setValues((prev) => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="is_published">Publish</Label>
              </div>
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

      {cropDialog}
    </Dialog>
  );
}
