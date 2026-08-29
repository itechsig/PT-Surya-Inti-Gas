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
import { deleteJobVacancy, listJobVacancies, reorderJobVacancies, toggleJobVacancyActive } from './api';
import { JobVacancyFormDialog } from './JobVacancyFormDialog';
import type { AdminJobVacancy } from './types';

export function JobVacanciesPage() {
  const { can } = useAuth();
  const canDelete = can('job_vacancies.manage');

  const [jobs, setJobs] = useState<AdminJobVacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<AdminJobVacancy | null>(null);
  const [deletingJob, setDeletingJob] = useState<AdminJobVacancy | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await listJobVacancies();
      setJobs(res.data);
    } catch {
      toast.error('Gagal memuat lowongan kerja');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingJob(null);
    setFormOpen(true);
  };

  const openEdit = (job: AdminJobVacancy) => {
    setEditingJob(job);
    setFormOpen(true);
  };

  const isDeadlinePassed = (deadline: string) => new Date(deadline) < new Date();

  const handleToggleActive = async (job: AdminJobVacancy) => {
    const previous = jobs;
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, is_active: !j.is_active } : j)));
    try {
      await toggleJobVacancyActive(job.id);
    } catch {
      setJobs(previous);
      toast.error('Gagal mengubah status lowongan');
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= jobs.length) return;

    const reordered = [...jobs];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setJobs(reordered);

    try {
      await reorderJobVacancies(reordered.map((j, idx) => ({ id: j.id, display_order: idx })));
    } catch {
      toast.error('Gagal menyimpan urutan lowongan');
      load();
    }
  };

  const handleDelete = async () => {
    if (!deletingJob) return;
    try {
      await deleteJobVacancy(deletingJob.id);
      toast.success('Lowongan berhasil dihapus');
      setJobs((prev) => prev.filter((j) => j.id !== deletingJob.id));
    } catch {
      toast.error('Gagal menghapus lowongan');
    } finally {
      setDeletingJob(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Lowongan Kerja</h1>
          <p className="text-muted-foreground">Kelola daftar lowongan kerja yang tampil di halaman Karir website.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Lowongan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Lowongan</CardTitle>
          <CardDescription>Urutan di sini menentukan urutan tampil di halaman karir.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Memuat...</p>
          ) : jobs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Belum ada lowongan.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Urutan</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Batas Lamaran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job, index) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Naikkan urutan ${job.title_id}`}>
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === jobs.length - 1} onClick={() => move(index, 1)} aria-label={`Turunkan urutan ${job.title_id}`}>
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{job.title_id}</div>
                      <div className="text-xs text-muted-foreground">{job.level_id}</div>
                    </TableCell>
                    <TableCell>{job.division_id}</TableCell>
                    <TableCell>{job.location_id}</TableCell>
                    <TableCell>
                      <div>{job.deadline}</div>
                      {isDeadlinePassed(job.deadline) && (
                        <Badge variant="secondary" className="mt-1">Lewat Batas</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={job.is_active} onCheckedChange={() => handleToggleActive(job)} aria-label={`Aktifkan lowongan ${job.title_id}`} />
                        <Badge variant={job.is_active ? 'default' : 'secondary'}>
                          {job.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(job)} aria-label={`Edit ${job.title_id}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {canDelete && (
                        <Button variant="ghost" size="icon" onClick={() => setDeletingJob(job)} aria-label={`Hapus ${job.title_id}`}>
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

      <JobVacancyFormDialog open={formOpen} onOpenChange={setFormOpen} job={editingJob} onSaved={load} />

      <AlertDialog open={!!deletingJob} onOpenChange={(open) => !open && setDeletingJob(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus lowongan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deletingJob?.title_id}" akan dihapus permanen dan tidak akan tampil lagi di website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
