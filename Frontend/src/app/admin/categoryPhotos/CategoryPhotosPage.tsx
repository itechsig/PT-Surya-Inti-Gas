import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { useAuth } from '../../../context';
import { getImageUrl } from '../../../utils/imageUrl';
import { clearCategoryPhoto, listCategoryPhotos, uploadCategoryPhoto } from './api';
import type { AdminCategoryPhoto } from './types';

/** Display label + grouping for each fixed key seeded in the category_photos migration. */
const GROUPS: { title: string; description: string; keys: { key: string; label: string }[] }[] = [
  {
    title: 'Kategori Utama',
    description: 'Foto kartu pilihan kategori di halaman Produk & Layanan.',
    keys: [
      { key: 'main-gas', label: 'Produk Gas' },
      { key: 'main-package', label: 'Kemasan' },
      { key: 'main-services', label: 'Layanan' },
    ],
  },
  {
    title: 'Sub-Kategori Produk Gas',
    description: 'Foto kartu sub-kategori yang tampil setelah memilih Produk Gas.',
    keys: [
      { key: 'sub-industrial-medical-speciality', label: 'Gas Industri, Medis & Spesial' },
      { key: 'sub-liquid', label: 'Gas Cair' },
      { key: 'sub-related-equipment', label: 'Peralatan Pendukung Industri' },
    ],
  },
  {
    title: 'Sub-Kategori Kemasan',
    description: 'Foto kartu sub-kategori yang tampil setelah memilih Kemasan.',
    keys: [
      { key: 'sub-package-gas', label: 'Kemasan Gas' },
      { key: 'sub-package-liquid', label: 'Kemasan Gas Cair' },
      { key: 'sub-package-cylinder', label: 'Kemasan Tabung' },
    ],
  },
];

function PhotoTile({ label, photo, onUpload, onClear, canManage }: {
  label: string;
  photo: AdminCategoryPhoto | undefined;
  onUpload: (file: File) => Promise<void>;
  onClear: () => Promise<void>;
  canManage: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isBusy, setIsBusy] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsBusy(true);
    try {
      await onUpload(file);
    } finally {
      setIsBusy(false);
    }
  };

  const handleClear = async () => {
    setIsBusy(true);
    try {
      await onClear();
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3">
      <img
        src={photo?.image ? getImageUrl(photo.image) : '/images/placeholder.svg'}
        alt={`Pratinjau ${label}`}
        className="h-32 w-full rounded-md border object-cover"
      />
      <div className="text-sm font-medium">{label}</div>
      {canManage && (
        <div className="flex items-center gap-2">
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />
          <Button type="button" size="sm" variant="outline" disabled={isBusy} onClick={() => inputRef.current?.click()}>
            <Upload className="h-3.5 w-3.5" />
            {photo?.image ? 'Ganti Foto' : 'Upload Foto'}
          </Button>
          {photo?.image && (
            <Button type="button" size="sm" variant="ghost" disabled={isBusy} onClick={handleClear} aria-label={`Hapus foto ${label}`}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function CategoryPhotosPage() {
  const { can } = useAuth();
  const canManage = can('products.manage');

  const [photos, setPhotos] = useState<Record<string, AdminCategoryPhoto>>({});
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await listCategoryPhotos();
      setPhotos(Object.fromEntries(res.data.map((p) => [p.key, p])));
    } catch {
      toast.error('Gagal memuat foto kategori');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (key: string, file: File) => {
    try {
      const res = await uploadCategoryPhoto(key, file);
      setPhotos((prev) => ({ ...prev, [key]: res.data }));
      toast.success('Foto berhasil diunggah');
    } catch {
      toast.error('Gagal mengunggah foto');
    }
  };

  const handleClear = async (key: string) => {
    try {
      await clearCategoryPhoto(key);
      setPhotos((prev) => ({ ...prev, [key]: { ...prev[key], key, image: null, updated_at: new Date().toISOString() } }));
      toast.success('Foto berhasil dihapus, kartu akan kembali memakai ikon');
    } catch {
      toast.error('Gagal menghapus foto');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Foto Kategori Produk</h1>
        <p className="text-muted-foreground">
          Kelola foto yang tampil di kartu kategori &amp; sub-kategori halaman Produk &amp; Layanan. Kartu tanpa foto akan tetap memakai ikon bawaan.
        </p>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Memuat...</p>
      ) : (
        GROUPS.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle>{group.title}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.keys.map(({ key, label }) => (
                  <PhotoTile
                    key={key}
                    label={label}
                    photo={photos[key]}
                    canManage={canManage}
                    onUpload={(file) => handleUpload(key, file)}
                    onClear={() => handleClear(key)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
