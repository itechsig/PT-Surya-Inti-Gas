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
import { deleteHeroSlide, listHeroSlides, reorderHeroSlides, toggleHeroSlideActive } from './api';
import { HeroSlideFormDialog } from './HeroSlideFormDialog';
import type { AdminHeroSlide } from './types';

export function HeroSlidesPage() {
  const { hasRole } = useAuth();
  const canDelete = hasRole(['super_admin', 'admin', 'editor']);

  const [slides, setSlides] = useState<AdminHeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<AdminHeroSlide | null>(null);
  const [deletingSlide, setDeletingSlide] = useState<AdminHeroSlide | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await listHeroSlides();
      setSlides(res.data);
    } catch {
      toast.error('Gagal memuat hero slides');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingSlide(null);
    setFormOpen(true);
  };

  const openEdit = (slide: AdminHeroSlide) => {
    setEditingSlide(slide);
    setFormOpen(true);
  };

  const handleToggleActive = async (slide: AdminHeroSlide) => {
    const previous = slides;
    setSlides((prev) => prev.map((s) => (s.id === slide.id ? { ...s, is_active: !s.is_active } : s)));
    try {
      await toggleHeroSlideActive(slide.id);
    } catch {
      setSlides(previous);
      toast.error('Gagal mengubah status slide');
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const reordered = [...slides];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setSlides(reordered);

    try {
      await reorderHeroSlides(reordered.map((s, i) => ({ id: s.id, display_order: i })));
    } catch {
      toast.error('Gagal menyimpan urutan slide');
      load();
    }
  };

  const handleDelete = async () => {
    if (!deletingSlide) return;
    try {
      await deleteHeroSlide(deletingSlide.id);
      toast.success('Slide berhasil dihapus');
      setSlides((prev) => prev.filter((s) => s.id !== deletingSlide.id));
    } catch {
      toast.error('Gagal menghapus slide');
    } finally {
      setDeletingSlide(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hero Slides</h1>
          <p className="text-muted-foreground">Kelola slide gambar &amp; teks di halaman utama website.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Slide
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Slide</CardTitle>
          <CardDescription>Urutan di sini menentukan urutan tampil di homepage.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Memuat...</p>
          ) : slides.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Belum ada slide.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Urutan</TableHead>
                  <TableHead className="w-24">Gambar</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slides.map((slide, index) => (
                  <TableRow key={slide.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === 0} onClick={() => move(index, -1)}>
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === slides.length - 1} onClick={() => move(index, 1)}>
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <img src={slide.image} alt={slide.title_id} className="h-12 w-20 rounded object-cover" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{slide.title_id}</div>
                      <div className="text-xs text-muted-foreground">{slide.subtitle_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={slide.is_active} onCheckedChange={() => handleToggleActive(slide)} />
                        <Badge variant={slide.is_active ? 'default' : 'secondary'}>
                          {slide.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(slide)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {canDelete && (
                        <Button variant="ghost" size="icon" onClick={() => setDeletingSlide(slide)}>
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

      <HeroSlideFormDialog open={formOpen} onOpenChange={setFormOpen} slide={editingSlide} onSaved={load} />

      <AlertDialog open={!!deletingSlide} onOpenChange={(open) => !open && setDeletingSlide(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus slide ini?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deletingSlide?.title_id}" akan dihapus permanen dan tidak akan tampil lagi di website.
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
