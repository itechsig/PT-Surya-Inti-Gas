import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { ApiError } from '../../../utils/apiClient';
import { deleteRole, listRoles } from './api';
import { RoleFormDialog } from './RoleFormDialog';
import type { AdminRoleRecord } from './types';

export function RolesPage() {
  const [roles, setRoles] = useState<AdminRoleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRoleRecord | null>(null);
  const [deletingRole, setDeletingRole] = useState<AdminRoleRecord | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await listRoles();
      setRoles(res.data);
    } catch {
      toast.error('Gagal memuat daftar role');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingRole(null);
    setFormOpen(true);
  };

  const openEdit = (role: AdminRoleRecord) => {
    setEditingRole(role);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingRole) return;
    try {
      await deleteRole(deletingRole.id);
      toast.success('Role berhasil dihapus');
      load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Gagal menghapus role');
    } finally {
      setDeletingRole(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen Role</h1>
          <p className="text-muted-foreground">Atur role dan modul apa saja yang boleh diakses tiap role.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Role</CardTitle>
          <CardDescription>
            {isLoading ? 'Memuat...' : `${roles.length} role terdaftar`} — role sistem (Super Admin) tidak dapat diubah atau dihapus.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Izin Akses</TableHead>
                  <TableHead>Pengguna</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        {role.name}
                        {role.is_system && (
                          <Badge variant="outline" className="gap-1 font-normal">
                            <ShieldCheck className="h-3 w-3" />
                            Sistem
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {role.is_system ? (
                        <span className="text-sm text-muted-foreground">Semua modul</span>
                      ) : role.permissions.length === 0 ? (
                        <span className="text-sm text-muted-foreground">Belum ada izin</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((permission) => (
                            <Badge key={permission.id} variant="secondary" className="font-normal">
                              {permission.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{role.users_count}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={role.is_system}
                        onClick={() => openEdit(role)}
                        aria-label="Edit role"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={role.is_system}
                        onClick={() => setDeletingRole(role)}
                        aria-label="Hapus role"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <RoleFormDialog open={formOpen} onOpenChange={setFormOpen} role={editingRole} onSaved={load} />

      <AlertDialog open={!!deletingRole} onOpenChange={(open) => !open && setDeletingRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus role ini?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deletingRole?.name}" akan dihapus permanen. Ini hanya bisa dilakukan jika tidak ada pengguna yang masih memakai role ini.
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
