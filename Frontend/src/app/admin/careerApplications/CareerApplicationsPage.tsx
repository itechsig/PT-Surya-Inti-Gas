import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Eye, Search, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../../context';
import { deleteCareerApplication, getCareerApplicationStatistics, listCareerApplications } from './api';
import { CareerApplicationDetailDialog } from './CareerApplicationDetailDialog';
import { STATUS_BADGE_VARIANT, STATUS_LABELS, type ApplicationStatus, type CareerApplication, type CareerApplicationStatistics } from './types';

export function CareerApplicationsPage() {
  const { hasRole } = useAuth();
  const canDelete = hasRole(['super_admin', 'admin', 'hr']);

  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [stats, setStats] = useState<CareerApplicationStatistics | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewingApplication, setViewingApplication] = useState<CareerApplication | null>(null);
  const [deletingApplication, setDeletingApplication] = useState<CareerApplication | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        listCareerApplications({ status: statusFilter, search: search || undefined }),
        getCareerApplicationStatistics(),
      ]);
      setApplications(appsRes.data.data);
      setStats(statsRes.data);
    } catch {
      toast.error('Gagal memuat data pelamar');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deletingApplication) return;
    try {
      await deleteCareerApplication(deletingApplication.id);
      toast.success('Lamaran berhasil dihapus');
      setApplications((prev) => prev.filter((a) => a.id !== deletingApplication.id));
    } catch {
      toast.error('Gagal menghapus lamaran');
    } finally {
      setDeletingApplication(null);
    }
  };

  const statCards: { label: string; value: number | undefined }[] = [
    { label: 'Total', value: stats?.total },
    { label: 'Menunggu', value: stats?.pending },
    { label: 'Ditinjau', value: stats?.reviewed },
    { label: 'Interview', value: stats?.interview },
    { label: 'Diterima', value: stats?.hired },
    { label: 'Ditolak', value: stats?.rejected },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Pelamar Kerja</h1>
        <p className="text-muted-foreground">Kelola lamaran yang masuk dari halaman Karir website.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-6">
              <p className="text-2xl font-semibold">{card.value ?? '—'}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Daftar Lamaran</CardTitle>
            <CardDescription>{applications.length} lamaran ditampilkan</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama/email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Memuat...</p>
          ) : applications.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Belum ada lamaran masuk.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="font-medium">{app.nama}</div>
                      {app.ai_score !== null && (
                        <div className="text-xs text-muted-foreground">Skor AI: {app.ai_score}</div>
                      )}
                    </TableCell>
                    <TableCell>{app.posisi}</TableCell>
                    <TableCell>
                      <div className="text-sm">{app.email}</div>
                      <div className="text-xs text-muted-foreground">{app.no_hp}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(app.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_BADGE_VARIANT[app.status]}>{STATUS_LABELS[app.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setViewingApplication(app)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canDelete && (
                        <Button variant="ghost" size="icon" onClick={() => setDeletingApplication(app)}>
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

      <CareerApplicationDetailDialog
        open={!!viewingApplication}
        onOpenChange={(open) => !open && setViewingApplication(null)}
        application={viewingApplication}
        onSaved={load}
      />

      <AlertDialog open={!!deletingApplication} onOpenChange={(open) => !open && setDeletingApplication(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus lamaran ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Lamaran dari "{deletingApplication?.nama}" akan dihapus permanen.
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
