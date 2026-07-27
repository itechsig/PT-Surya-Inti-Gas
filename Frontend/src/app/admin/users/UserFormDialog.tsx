import { useEffect, useState, FormEvent } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { ApiError } from '../../../utils/apiClient';
import { createUser, updateUser } from './api';
import type { AdminUserRecord } from './types';
import { ROLE_LABELS } from '../roleLabels';
import { PasswordInput } from '../PasswordInput';
import type { AdminRole } from '../../../context';

const ROLE_OPTIONS: AdminRole[] = ['super_admin', 'admin', 'editor', 'hr'];

const EMPTY_FORM = {
  name: '',
  email: '',
  role: 'editor' as AdminRole,
  isActive: true,
  password: '',
  passwordConfirmation: '',
  forcePasswordChange: true,
};

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserRecord | null;
  onSaved: () => void;
}

export function UserFormDialog({ open, onOpenChange, user, onSaved }: UserFormDialogProps) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (user) {
      setValues({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.is_active,
        password: '',
        passwordConfirmation: '',
        forcePasswordChange: true,
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setErrors({});
  }, [open, user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});
    try {
      if (user) {
        await updateUser(user.id, {
          name: values.name,
          email: values.email,
          role: values.role,
          is_active: values.isActive,
        });
        toast.success('User berhasil diperbarui');
      } else {
        await createUser({
          name: values.name,
          email: values.email,
          role: values.role,
          is_active: values.isActive,
          password: values.password,
          password_confirmation: values.passwordConfirmation,
          force_password_change: values.forcePasswordChange,
        });
        toast.success('User berhasil dibuat');
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
      }
      toast.error(error instanceof ApiError ? error.message : 'Gagal menyimpan user');
    } finally {
      setIsSaving(false);
    }
  };

  const fieldError = (key: string) => errors[key]?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{user ? 'Edit User' : 'Tambah User'}</DialogTitle>
            <DialogDescription>
              {user
                ? 'Perbarui nama, email, peran, dan status akun ini. Gunakan tombol "Reset Password" di tabel untuk mengganti kata sandi.'
                : 'Buat akun admin baru beserta perannya.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-name">Nama Lengkap</Label>
              <Input
                id="user-name"
                maxLength={255}
                required
                value={values.name}
                onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
              />
              {fieldError('name') && <p className="text-xs text-destructive">{fieldError('name')}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                maxLength={255}
                required
                value={values.email}
                onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
              />
              {fieldError('email') && <p className="text-xs text-destructive">{fieldError('email')}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="user-role">Peran</Label>
                <Select value={values.role} onValueChange={(value) => setValues((prev) => ({ ...prev, role: value as AdminRole }))}>
                  <SelectTrigger id="user-role">
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError('role') && <p className="text-xs text-destructive">{fieldError('role')}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="user-status">Status</Label>
                <Select
                  value={values.isActive ? 'active' : 'inactive'}
                  onValueChange={(value) => setValues((prev) => ({ ...prev, isActive: value === 'active' }))}
                >
                  <SelectTrigger id="user-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!user && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="user-password">Kata Sandi</Label>
                  <PasswordInput
                    id="user-password"
                    autoComplete="new-password"
                    required
                    value={values.password}
                    onChange={(value) => setValues((prev) => ({ ...prev, password: value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimal 8 karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol.
                  </p>
                  {fieldError('password') && <p className="text-xs text-destructive">{fieldError('password')}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="user-password-confirmation">Konfirmasi Kata Sandi</Label>
                  <PasswordInput
                    id="user-password-confirmation"
                    autoComplete="new-password"
                    required
                    value={values.passwordConfirmation}
                    onChange={(value) => setValues((prev) => ({ ...prev, passwordConfirmation: value }))}
                  />
                </div>

                <label htmlFor="force-password-change" className="flex items-center gap-2 text-sm">
                  <Checkbox
                    id="force-password-change"
                    checked={values.forcePasswordChange}
                    onCheckedChange={(checked) => setValues((prev) => ({ ...prev, forcePasswordChange: checked === true }))}
                  />
                  Wajibkan ganti kata sandi saat login pertama
                </label>
              </>
            )}
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
