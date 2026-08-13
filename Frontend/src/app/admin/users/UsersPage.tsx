import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowDownAZ, ArrowUpAZ, KeyRound, Pencil, Plus, Search, ShieldOff, Trash2, UserCheck } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Skeleton } from '../../components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { useAuth } from '../../../context';
import { ApiError } from '../../../utils/apiClient';
import { deleteUser, listUsers, toggleUserStatus } from './api';
import { UserFormDialog } from './UserFormDialog';
import { ResetPasswordDialog } from './ResetPasswordDialog';
import { ROLE_LABELS } from '../roleLabels';
import type { AdminRole } from '../../../context';
import type { AdminUserRecord } from './types';

const dateFormatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const ROLE_FILTER_OPTIONS: AdminRole[] = ['super_admin', 'admin', 'editor', 'hr'];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AdminRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created_at'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);
  const [resettingUser, setResettingUser] = useState<AdminUserRecord | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUserRecord | null>(null);
  const [deactivatingUser, setDeactivatingUser] = useState<AdminUserRecord | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await listUsers({
        search: search || undefined,
        role: roleFilter,
        status: statusFilter,
        sort_by: sortBy,
        sort_dir: sortDir,
        page: currentPage,
      });
      setUsers(res.data.data);
      setLastPage(res.data.last_page);
      setTotal(res.data.total);
    } catch {
      toast.error('Gagal memuat daftar user');
    } finally {
      setIsLoading(false);
    }
  }, [search, roleFilter, statusFilter, sortBy, sortDir, currentPage]);

  useEffect(() => {
    load();
  }, [load]);

  // Any filter/search/sort change should reset back to page 1, not silently keep an out-of-range page.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter, sortBy, sortDir]);

  const openCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const openEdit = (user: AdminUserRecord) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const toggleSortDir = () => setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser(deletingUser.id);
      toast.success('User berhasil dihapus');
      load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Gagal menghapus user');
    } finally {
      setDeletingUser(null);
    }
  };

  const handleActivate = async (user: AdminUserRecord) => {
    try {
      await toggleUserStatus(user.id);
      toast.success(`"${user.name}" berhasil diaktifkan`);
      load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Gagal mengaktifkan user');
    }
  };

  const handleDeactivate = async () => {
    if (!deactivatingUser) return;
    try {
      await toggleUserStatus(deactivatingUser.id);
      toast.success(`"${deactivatingUser.name}" berhasil dinonaktifkan`);
      load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Gagal menonaktifkan user');
    } finally {
      setDeactivatingUser(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen User</h1>
          <p className="text-muted-foreground">Kelola akun Super Admin, Admin, Editor, dan HR.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah User
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Daftar User</CardTitle>
              <CardDescription>
                {isLoading ? 'Memuat...' : `${total} user ditemukan`} — akun Anda sendiri tidak dapat diubah,
                direset, dinonaktifkan, atau dihapus di sini; gunakan menu Edit Profil.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama/email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 pl-8"
              />
            </div>
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as AdminRole | 'all')}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Semua Peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Peran</SelectItem>
                {ROLE_FILTER_OPTIONS.map((role) => (
                  <SelectItem key={role} value={role}>{ROLE_LABELS[role]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'active' | 'inactive' | 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'created_at')}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Urutkan: Nama</SelectItem>
                <SelectItem value="created_at">Urutkan: Tanggal Dibuat</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={toggleSortDir} aria-label="Balik arah urutan">
              {sortDir === 'asc' ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Tidak ada user yang cocok dengan pencarian/filter.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Login Terakhir</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                              {initials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.name}
                              {isSelf && <span className="ml-2 text-xs text-muted-foreground">(Anda)</span>}
                            </div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'outline'}>
                          {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                        {user.must_change_password && (
                          <div className="mt-1 text-xs text-muted-foreground">Wajib ganti kata sandi</div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.last_login_at ? dateTimeFormatter.format(new Date(user.last_login_at)) : 'Belum pernah'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {dateFormatter.format(new Date(user.created_at))}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" disabled={isSelf} onClick={() => openEdit(user)} aria-label="Edit user">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isSelf}
                          onClick={() => setResettingUser(user)}
                          aria-label="Reset kata sandi"
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        {user.is_active ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isSelf}
                            onClick={() => setDeactivatingUser(user)}
                            aria-label="Nonaktifkan user"
                          >
                            <ShieldOff className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isSelf}
                            onClick={() => handleActivate(user)}
                            aria-label="Aktifkan user"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isSelf}
                          onClick={() => setDeletingUser(user)}
                          aria-label="Hapus user"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {!isLoading && lastPage > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>Halaman {currentPage} dari {lastPage}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= lastPage}
                  onClick={() => setCurrentPage((p) => Math.min(lastPage, p + 1))}
                >
                  Berikutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={editingUser} onSaved={load} />
      <ResetPasswordDialog open={!!resettingUser} onOpenChange={(open) => !open && setResettingUser(null)} user={resettingUser} />

      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus user ini?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deletingUser?.name}" ({deletingUser ? ROLE_LABELS[deletingUser.role] : ''}) akan dihapus permanen dan tidak akan bisa masuk lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deactivatingUser} onOpenChange={(open) => !open && setDeactivatingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan user ini?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deactivatingUser?.name}" tidak akan bisa masuk ke dashboard sampai diaktifkan kembali. Sesi login yang sedang aktif akan langsung berakhir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate}>Nonaktifkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
