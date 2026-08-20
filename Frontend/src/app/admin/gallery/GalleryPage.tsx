import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { useAuth } from '../../../context';
import { deleteGalleryItem, listGalleryItems, reorderGalleryItems, toggleGalleryItemActive } from './api';
import { GalleryFormDialog } from './GalleryFormDialog';
import { GALLERY_CATEGORIES, type AdminGalleryItem } from './types';

export function GalleryPage() {
  const { can } = useAuth();
  const canDelete = can('gallery.manage');

  const [items, setItems] = useState<AdminGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminGalleryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<AdminGalleryItem | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await listGalleryItems();
      setItems(res.data);
    } catch {
      toast.error('Gagal memuat galeri');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEdit = (item: AdminGalleryItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const categoryLabel = (value: string) =>
    GALLERY_CATEGORIES.find((c) => c.value === value)?.label ?? value;

  const handleToggleActive = async (item: AdminGalleryItem) => {
    const previous = items;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_active: !i.is_active } : i)));
    try {
      await toggleGalleryItemActive(item.id);
    } catch {
      setItems(previous);
      toast.error('Gagal mengubah status foto');
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setItems(reordered);

    try {
      await reorderGalleryItems(reordered.map((i, idx) => ({ id: i.id, display_order: idx })));
    } catch {
      toast.error('Gagal menyimpan urutan foto');
      load();
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteGalleryItem(deletingItem.id);
      toast.success('Foto berhasil dihapus');
      setItems((prev) => prev.filter((i) => i.id !== deletingItem.id));
    } catch {
      toast.error('Gagal menghapus foto');
    } finally {
      setDeletingItem(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Galeri</h1>
          <p className="text-muted-foreground">Kelola foto dokumentasi yang tampil di halaman Galeri website.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Foto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Foto</CardTitle>
          <CardDescription>Urutan di sini menentukan urutan tampil di halaman galeri.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Memuat...</p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Belum ada foto.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Urutan</TableHead>
                  <TableHead className="w-24">Gambar</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === 0} onClick={() => move(index, -1)}>
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === items.length - 1} onClick={() => move(index, 1)}>
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <img src={item.image} alt={item.title_id} className="h-12 w-20 rounded object-cover" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.title_id}</div>
                      <div className="text-xs text-muted-foreground">{item.description_id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{categoryLabel(item.category)}</Badge>
                    </TableCell>
                    <TableCell>{item.year}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={item.is_active} onCheckedChange={() => handleToggleActive(item)} />
                        <Badge variant={item.is_active ? 'default' : 'secondary'}>
                          {item.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {canDelete && (
                        <Button variant="ghost" size="icon" onClick={() => setDeletingItem(item)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <GalleryFormDialog open={formOpen} onOpenChange={setFormOpen} item={editingItem} onSaved={load} />

      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus foto ini?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deletingItem?.title_id}" akan dihapus permanen dan tidak akan tampil lagi di website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
