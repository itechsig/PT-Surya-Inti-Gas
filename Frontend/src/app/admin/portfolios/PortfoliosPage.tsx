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
  deletePortfolio, listIndustries, listPortfolios, listServiceTypes, togglePortfolioFeatured, togglePortfolioPublished,
} from './api';
import { PortfolioFormDialog } from './PortfolioFormDialog';
import type { AdminIndustry, AdminPortfolio, AdminServiceType } from './types';

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function formatCompletionDate(isoDate: string): string {
  const [year, month] = isoDate.split('-').map(Number);
  return `${MONTH_NAMES_ID[month - 1]} ${year}`;
}

export function PortfoliosPage() {
  const { can } = useAuth();
  const canDelete = can('portfolios.manage');

  const [portfolios, setPortfolios] = useState<AdminPortfolio[]>([]);
  const [industries, setIndustries] = useState<AdminIndustry[]>([]);
  const [serviceTypes, setServiceTypes] = useState<AdminServiceType[]>([]);
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<AdminPortfolio | null>(null);
  const [deletingPortfolio, setDeletingPortfolio] = useState<AdminPortfolio | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [portfoliosRes, industriesRes, serviceTypesRes] = await Promise.all([listPortfolios(), listIndustries(), listServiceTypes()]);
      setPortfolios(portfoliosRes.data);
      setIndustries(industriesRes.data);
      setServiceTypes(serviceTypesRes.data);
    } catch {
      toast.error('Gagal memuat portofolio');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredPortfolios = useMemo(() => {
    if (industryFilter === 'all') return portfolios;
    return portfolios.filter((p) => String(p.industry_id) === industryFilter);
  }, [portfolios, industryFilter]);

  const openCreate = () => {
    setEditingPortfolio(null);
    setFormOpen(true);
  };

  const openEdit = (portfolio: AdminPortfolio) => {
    setEditingPortfolio(portfolio);
    setFormOpen(true);
  };

  const handleTogglePublished = async (portfolio: AdminPortfolio) => {
    const previous = portfolios;
    setPortfolios((prev) => prev.map((p) => (p.id === portfolio.id ? { ...p, is_published: !p.is_published } : p)));
    try {
      await togglePortfolioPublished(portfolio.id);
    } catch {
      setPortfolios(previous);
      toast.error('Gagal mengubah status publikasi');
    }
  };

  const handleToggleFeatured = async (portfolio: AdminPortfolio) => {
    const previous = portfolios;
    setPortfolios((prev) => prev.map((p) => (p.id === portfolio.id ? { ...p, is_featured: !p.is_featured } : p)));
    try {
      await togglePortfolioFeatured(portfolio.id);
    } catch {
      setPortfolios(previous);
      toast.error('Gagal mengubah status unggulan');
    }
  };

  const handleDelete = async () => {
    if (!deletingPortfolio) return;
    try {
      await deletePortfolio(deletingPortfolio.id);
      toast.success('Portofolio berhasil dihapus');
      setPortfolios((prev) => prev.filter((p) => p.id !== deletingPortfolio.id));
    } catch {
      toast.error('Gagal menghapus portofolio');
    } finally {
      setDeletingPortfolio(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Portofolio</h1>
          <p className="text-muted-foreground">Kelola pengalaman layanan yang ditampilkan pada halaman Portofolio.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Portofolio
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daftar Portofolio</CardTitle>
            <CardDescription>{filteredPortfolios.length} entri</CardDescription>
          </div>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Semua Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Industry</SelectItem>
              {industries.map((ind) => (
                <SelectItem key={ind.id} value={String(ind.id)}>
                  {ind.name_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Memuat...</p>
          ) : filteredPortfolios.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Belum ada portofolio.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Thumbnail</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Selesai</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Publish</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPortfolios.map((portfolio) => (
                  <TableRow key={portfolio.id}>
                    <TableCell>
                      <img src={portfolio.thumbnail} alt={portfolio.title_id} className="h-12 w-12 rounded object-cover" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{portfolio.title_id}</div>
                      <div className="text-xs text-muted-foreground">{portfolio.location_id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{portfolio.industry?.name_id ?? '—'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{portfolio.service_type?.name_id ?? '—'}</Badge>
                    </TableCell>
                    <TableCell>{formatCompletionDate(portfolio.completion_date)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleToggleFeatured(portfolio)}>
                        <Star className={`h-4 w-4 ${portfolio.is_featured ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={portfolio.is_published} onCheckedChange={() => handleTogglePublished(portfolio)} />
                        <Badge variant={portfolio.is_published ? 'default' : 'secondary'}>
                          {portfolio.is_published ? 'Terbit' : 'Draf'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(portfolio)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {canDelete && (
                        <Button variant="ghost" size="icon" onClick={() => setDeletingPortfolio(portfolio)}>
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

      <PortfolioFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        portfolio={editingPortfolio}
        industries={industries}
        serviceTypes={serviceTypes}
        onSaved={load}
      />

      <AlertDialog open={!!deletingPortfolio} onOpenChange={(open) => !open && setDeletingPortfolio(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus portofolio ini?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deletingPortfolio?.title_id}" akan dihapus permanen dan tidak akan tampil lagi di website.
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
