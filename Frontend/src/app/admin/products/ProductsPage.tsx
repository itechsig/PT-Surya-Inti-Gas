import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../../context';
import {
  deleteProduct, listProductCategories, listProducts, toggleProductFeatured, toggleProductPublished,
} from './api';
import { ProductFormDialog } from './ProductFormDialog';
import type { AdminProduct, AdminProductCategory } from './types';

export function ProductsPage() {
  const { hasRole } = useAuth();
  const canDelete = hasRole(['administrator', 'editor']);

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([listProducts(), listProductCategories()]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch {
      toast.error('Gagal memuat produk');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'all') return products;
    return products.filter((p) => String(p.product_category_id) === categoryFilter);
  }, [products, categoryFilter]);

  const openCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleTogglePublished = async (product: AdminProduct) => {
    const previous = products;
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, is_published: !p.is_published } : p)));
    try {
      await toggleProductPublished(product.id);
    } catch {
      setProducts(previous);
      toast.error('Gagal mengubah status publikasi');
    }
  };

  const handleToggleFeatured = async (product: AdminProduct) => {
    const previous = products;
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, is_featured: !p.is_featured } : p)));
    try {
      await toggleProductFeatured(product.id);
    } catch {
      setProducts(previous);
      toast.error('Gagal mengubah status unggulan');
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.id);
      toast.success('Produk berhasil dihapus');
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    } catch {
      toast.error('Gagal menghapus produk');
    } finally {
      setDeletingProduct(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Produk</h1>
          <p className="text-muted-foreground">Kelola katalog produk gas &amp; peralatan.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daftar Produk</CardTitle>
            <CardDescription>{filteredProducts.length} produk</CardDescription>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.main_category === 'gas' ? 'Gas' : 'Equipment'} — {cat.name_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Memuat...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Belum ada produk.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Gambar</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Unggulan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img src={product.image} alt={product.name_id} className="h-12 w-12 rounded object-cover" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.name_id}</div>
                      <div className="text-xs text-muted-foreground">{product.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category?.name_id ?? '—'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleToggleFeatured(product)}>
                        <Star className={`h-4 w-4 ${product.is_featured ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={product.is_published} onCheckedChange={() => handleTogglePublished(product)} />
                        <Badge variant={product.is_published ? 'default' : 'secondary'}>
                          {product.is_published ? 'Terbit' : 'Draf'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {canDelete && (
                        <Button variant="ghost" size="icon" onClick={() => setDeletingProduct(product)}>
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

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        categories={categories}
        onSaved={load}
      />

      <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus produk ini?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deletingProduct?.name_id}" akan dihapus permanen dan tidak akan tampil lagi di website.
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
