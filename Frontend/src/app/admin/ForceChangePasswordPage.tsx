import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../../context';
import { ApiError } from '../../utils/apiClient';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { PasswordInput } from './PasswordInput';

/** Full-screen gate shown instead of the dashboard while user.must_change_password is true. */
export function ForceChangePasswordPage() {
  const { user, logout, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});
    try {
      await updatePassword({
        currentPassword,
        password: newPassword,
        passwordConfirmation: newPasswordConfirmation,
      });
      toast.success('Kata sandi berhasil diperbarui');
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
      }
      toast.error(error instanceof ApiError ? error.message : 'Gagal memperbarui kata sandi');
    } finally {
      setIsSaving(false);
    }
  };

  const fieldError = (key: string) => errors[key]?.[0];

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <CardTitle>Ganti Kata Sandi Diperlukan</CardTitle>
          <CardDescription>
            Demi keamanan, Anda harus mengganti kata sandi sementara sebelum melanjutkan ke dashboard, {user?.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="force-current-password">Kata Sandi Saat Ini</Label>
              <PasswordInput
                id="force-current-password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={setCurrentPassword}
              />
              {fieldError('current_password') && <p className="text-xs text-destructive">{fieldError('current_password')}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="force-new-password">Kata Sandi Baru</Label>
              <PasswordInput
                id="force-new-password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={setNewPassword}
              />
              <p className="text-xs text-muted-foreground">
                Minimal 8 karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol.
              </p>
              {fieldError('password') && <p className="text-xs text-destructive">{fieldError('password')}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="force-new-password-confirmation">Konfirmasi Kata Sandi Baru</Label>
              <PasswordInput
                id="force-new-password-confirmation"
                autoComplete="new-password"
                required
                value={newPasswordConfirmation}
                onChange={setNewPasswordConfirmation}
              />
            </div>
            <Button type="submit" disabled={isSaving} className="mt-2">
              {isSaving ? 'Menyimpan...' : 'Ganti Kata Sandi'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => logout().then(() => navigate('/admin/login', { replace: true }))}
              className="text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
