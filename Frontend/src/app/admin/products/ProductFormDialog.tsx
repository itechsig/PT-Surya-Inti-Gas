import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ApiError } from '../../../utils/apiClient';
import { createProduct, updateProduct } from './api';
import { MAIN_CATEGORY_LABELS, type AdminProduct, type AdminProductCategory, type ProductFormValues } from './types';
import { getImageUrl } from '../../../utils/imageUrl';

const EMPTY_FORM: ProductFormValues = {
  product_category_id: '', slug: '',
  name_id: '', name_en: '', name_zh: '',
  description_id: '', description_en: '', description_zh: '',
  full_description_id: '', full_description_en: '', full_description_zh: '',
  is_featured: false, is_published: true,
  image: null, newGalleryFiles: [], existingGallery: [], specifications: [],
};

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: AdminProduct | null;
  categories: AdminProductCategory[];
  onSaved: () => void;
}

export function ProductFormDialog({ open, onOpenChange, product, categories, onSaved }: ProductFormDialogProps) {
  const [values, setValues] = useState<ProductFormValues>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (product) {
      setValues({
        product_category_id: String(product.product_category_id), slug: product.slug,
        name_id: product.name_id, name_en: product.name_en ?? '', name_zh: product.name_zh ?? '',
        description_id: product.description_id, description_en: product.description_en ?? '', description_zh: product.description_zh ?? '',
        full_description_id: product.full_description_id ?? '', full_description_en: product.full_description_en ?? '', full_description_zh: product.full_description_zh ?? '',
        is_featured: product.is_featured, is_published: product.is_published,
        image: null, newGalleryFiles: [], existingGallery: product.gallery, specifications: product.specifications,
      });
      setImagePreview(getImageUrl(product.image));
    } else {
      setValues(EMPTY_FORM);
      setImagePreview(null);
    }
    setErrors({});
  }, [open, product]);

  const field = (key: keyof ProductFormValues) => ({
    value: values[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [key]: e.target.value })),
  });

  const fieldError = (key: string) => errors[key]?.[0];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValues((prev) => ({ ...prev, image: file }));
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setValues((prev) => ({ ...prev, newGalleryFiles: [...prev.newGalleryFiles, ...files] }));
    e.target.value = '';
  };

  const removeExistingGalleryImage = (url: string) => {
    setValues((prev) => ({ ...prev, existingGallery: prev.existingGallery.filter((g) => g !== url) }));
  };

  const removeNewGalleryFile = (index: number) => {
    setValues((prev) => ({ ...prev, newGalleryFiles: prev.newGalleryFiles.filter((_, i) => i !== index) }));
  };

  const addSpecRow = () => {
    setValues((prev) => ({ ...prev, specifications: [...prev.specifications, { label: '', value: '' }] }));
  };

  const updateSpecRow = (index: number, key: 'label' | 'value', value: string) => {
    setValues((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => (i === index ? { ...spec, [key]: value } : spec)),
    }));
  };

  const removeSpecRow = (index: number) => {
    setValues((prev) => ({ ...prev, specifications: prev.specifications.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});
    try {
      if (product) {
        await updateProduct(product.id, values);
        toast.success('Produk berhasil diperbarui');
      } else {
        if (!values.image) {
          setErrors({ image: ['Gambar wajib diunggah'] });
          setIsSaving(false);
          return;
        }
        await createProduct(values);
        toast.success('Produk berhasil ditambahkan');
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
        toast.error(error.message);
      } else {
        toast.error('Gagal menyimpan produk');
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
            <DialogTitle>{product ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
            <DialogDescription>
              Bahasa Indonesia wajib diisi; Inggris &amp; Mandarin opsional (otomatis memakai teks Indonesia jika kosong).
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={values.product_category_id}
                  onValueChange={(value) => setValues((prev) => ({ ...prev, product_category_id: value }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {MAIN_CATEGORY_LABELS[cat.main_category]} — {cat.name_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError('product_category_id') && <p className="text-xs text-destructive">{fieldError('product_category_id')}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="slug">Slug (untuk URL, huruf/angka/tanda hubung)</Label>
                <Input id="slug" placeholder="misal: oxygen" {...field('slug')} />
                {fieldError('slug') && <p className="text-xs text-destructive">{fieldError('slug')}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="product-image">Gambar Utama</Label>
              {imagePreview && <img src={imagePreview} alt="Preview" className="h-32 w-48 rounded-md object-cover" />}
              <Input id="product-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} />
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
                    <Label htmlFor={`name_${lang}`}>Nama Produk</Label>
                    <Input id={`name_${lang}`} {...field(`name_${lang}` as keyof ProductFormValues)} />
                    {fieldError(`name_${lang}`) && <p className="text-xs text-destructive">{fieldError(`name_${lang}`)}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`description_${lang}`}>Deskripsi Singkat</Label>
                    <Textarea id={`description_${lang}`} rows={2} {...field(`description_${lang}` as keyof ProductFormValues)} />
                    {fieldError(`description_${lang}`) && <p className="text-xs text-destructive">{fieldError(`description_${lang}`)}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`full_description_${lang}`}>Deskripsi Lengkap</Label>
                    <Textarea id={`full_description_${lang}`} rows={4} {...field(`full_description_${lang}` as keyof ProductFormValues)} />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex flex-col gap-2">
              <Label>Galeri Gambar</Label>
              <div className="flex flex-wrap gap-2">
                {values.existingGallery.map((url) => (
                  <div key={url} className="relative">
                    <img src={url} alt="Gallery" className="h-20 w-20 rounded object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingGalleryImage(url)}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {values.newGalleryFiles.map((file, i) => (
                  <div key={i} className="relative">
                    <img src={URL.createObjectURL(file)} alt="New" className="h-20 w-20 rounded object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewGalleryFile(i)}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleGalleryAdd} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Spesifikasi</Label>
              {values.specifications.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder="Label (misal: Kemurnian)" value={spec.label} onChange={(e) => updateSpecRow(i, 'label', e.target.value)} />
                  <Input placeholder="Nilai (misal: 99.5%)" value={spec.value} onChange={(e) => updateSpecRow(i, 'value', e.target.value)} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecRow(i)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addSpecRow} className="w-fit">
                <Plus className="h-4 w-4" />
                Tambah Spesifikasi
              </Button>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_featured"
                  checked={values.is_featured}
                  onCheckedChange={(checked) => setValues((prev) => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="is_featured">Produk Unggulan</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_published"
                  checked={values.is_published}
                  onCheckedChange={(checked) => setValues((prev) => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="is_published">Terbitkan</Label>
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
    </Dialog>
  );
}
