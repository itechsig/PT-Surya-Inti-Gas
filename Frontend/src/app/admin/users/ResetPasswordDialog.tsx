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
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { PasswordInput } from '../PasswordInput';
import { ApiError } from '../../../utils/apiClient';
import { resetUserPassword } from './api';
import type { AdminUserRecord } from './types';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserRecord | null;
}

export function ResetPasswordDialog({ open, onOpenChange, user }: ResetPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [forceChange, setForceChange] = useState(true);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPassword('');
    setPasswordConfirmation('');
    setForceChange(true);
    setErrors({});
  }, [open, user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setErrors({});
    try {
      await resetUserPassword(user.id, {
        password,
        password_confirmation: passwordConfirmation,
        force_change: forceChange,
      });
      toast.success(`Kata sandi untuk "${user.name}" berhasil direset`);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
      }
      toast.error(error instanceof ApiError ? error.message : 'Gagal mereset kata sandi');
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
            <DialogTitle>Reset Kata Sandi</DialogTitle>
            <DialogDescription>
              Atur kata sandi baru untuk "{user?.name}". Semua sesi login user ini akan otomatis berakhir.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reset-password">Kata Sandi Baru</Label>
              <PasswordInput
                id="reset-password"
                autoComplete="new-password"
                required
                value={password}
                onChange={setPassword}
              />
              <p className="text-xs text-muted-foreground">
                Minimal 8 karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol.
              </p>
              {fieldError('password') && <p className="text-xs text-destructive">{fieldError('password')}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reset-password-confirmation">Konfirmasi Kata Sandi</Label>
              <PasswordInput
                id="reset-password-confirmation"
                autoComplete="new-password"
                required
                value={passwordConfirmation}
                onChange={setPasswordConfirmation}
              />
            </div>

            <label htmlFor="reset-force-change" className="flex items-center gap-2 text-sm">
              <Checkbox
                id="reset-force-change"
                checked={forceChange}
                onCheckedChange={(checked) => setForceChange(checked === true)}
              />
              Wajibkan ganti kata sandi saat login berikutnya
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Reset Kata Sandi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
