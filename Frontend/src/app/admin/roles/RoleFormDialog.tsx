import { useEffect, useMemo, useState, FormEvent } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { ApiError } from '../../../utils/apiClient';
import { createRole, listPermissions, updateRole } from './api';
import type { AdminRoleRecord, Permission } from './types';

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: AdminRoleRecord | null;
  onSaved: () => void;
}

export function RoleFormDialog({ open, onOpenChange, role, onSaved }: RoleFormDialogProps) {
  const [name, setName] = useState('');
  const [permissionIds, setPermissionIds] = useState<number[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    listPermissions()
      .then((res) => setAllPermissions(res.data))
      .catch(() => setAllPermissions([]));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (role) {
      setName(role.name);
      setPermissionIds(role.permissions.map((p) => p.id));
    } else {
      setName('');
      setPermissionIds([]);
    }
    setErrors({});
  }, [open, role]);

  const groupedPermissions = useMemo(() => {
    const groups = new Map<string, Permission[]>();
    for (const permission of allPermissions) {
      const list = groups.get(permission.group) ?? [];
      list.push(permission);
      groups.set(permission.group, list);
    }
    return Array.from(groups.entries());
  }, [allPermissions]);

  const togglePermission = (id: number, checked: boolean) => {
    setPermissionIds((prev) => (checked ? [...prev, id] : prev.filter((p) => p !== id)));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});
    try {
      if (role) {
        await updateRole(role.id, { name, permissionIds });
        toast.success('Role berhasil diperbarui');
      } else {
        await createRole({ name, permissionIds });
        toast.success('Role berhasil dibuat');
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
      }
      toast.error(error instanceof ApiError ? error.message : 'Gagal menyimpan role');
    } finally {
      setIsSaving(false);
    }
  };

  const fieldError = (key: string) => errors[key]?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{role ? 'Edit Role' : 'Tambah Role'}</DialogTitle>
            <DialogDescription>
              {role
                ? 'Ubah nama dan izin akses modul untuk role ini.'
                : 'Buat role baru dan pilih modul apa saja yang boleh diakses.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role-name">Nama Role</Label>
              <Input
                id="role-name"
                maxLength={100}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="mis. Marketing"
              />
              {fieldError('name') && <p className="text-xs text-destructive">{fieldError('name')}</p>}
            </div>

            <div className="flex flex-col gap-3">
              <Label>Izin Akses Modul</Label>
              {groupedPermissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Memuat daftar izin...</p>
              ) : (
                groupedPermissions.map(([group, permissions]) => (
                  <div key={group} className="flex flex-col gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{group}</p>
                    <div className="flex flex-col gap-2 rounded-md border p-3">
                      {permissions.map((permission) => (
                        <label key={permission.id} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={permissionIds.includes(permission.id)}
                            onCheckedChange={(checked) => togglePermission(permission.id, checked === true)}
                          />
                          {permission.name}
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              )}
              {fieldError('permissions') && <p className="text-xs text-destructive">{fieldError('permissions')}</p>}
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
