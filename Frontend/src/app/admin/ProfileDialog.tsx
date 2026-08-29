import { useEffect, useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../context';
import { ApiError } from '../../utils/apiClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { PasswordInput } from './PasswordInput';
import { FormErrorSummary, FieldError, fieldErrorProps } from './formErrors';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user, updateProfile, updatePassword } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileCurrentPassword, setProfileCurrentPassword] = useState('');
  const [profileErrors, setProfileErrors] = useState<Record<string, string[]>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string[]>>({});
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setName(user.name);
    setEmail(user.email);
    setProfileCurrentPassword('');
    setProfileErrors({});
    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirmation('');
    setPasswordErrors({});
  }, [open, user]);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileErrors({});
    try {
      await updateProfile({ name: name.trim(), email: email.trim(), currentPassword: profileCurrentPassword });
      toast.success('Profil berhasil diperbarui');
      setProfileCurrentPassword('');
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setProfileErrors(error.errors);
      }
      toast.error(error instanceof ApiError ? error.message : 'Gagal memperbarui profil');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    setPasswordErrors({});
    try {
      await updatePassword({
        currentPassword,
        password: newPassword,
        passwordConfirmation: newPasswordConfirmation,
      });
      toast.success('Kata sandi berhasil diperbarui');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirmation('');
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setPasswordErrors(error.errors);
      }
      toast.error(error instanceof ApiError ? error.message : 'Gagal memperbarui kata sandi');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
          <DialogDescription>Kelola informasi akun dan kata sandi Anda.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile">
          <TabsList className="w-full">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="password">Kata Sandi</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3 pt-2">
              <FormErrorSummary errors={profileErrors} />
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="profile-name">Nama</Label>
                <Input id="profile-name" maxLength={255} required value={name} onChange={(e) => setName(e.target.value)} {...fieldErrorProps(profileErrors, 'name')} />
                <FieldError errors={profileErrors} name="name" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  maxLength={255}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  {...fieldErrorProps(profileErrors, 'email')}
                />
                <FieldError errors={profileErrors} name="email" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="profile-current-password">Kata Sandi Saat Ini</Label>
                <PasswordInput
                  id="profile-current-password"
                  autoComplete="current-password"
                  required
                  value={profileCurrentPassword}
                  onChange={setProfileCurrentPassword}
                  invalid={!!profileErrors.current_password?.length}
                />
                <p className="text-xs text-muted-foreground">Diperlukan untuk mengonfirmasi perubahan.</p>
                <FieldError errors={profileErrors} name="current_password" />
              </div>
              <Button type="submit" disabled={isSavingProfile} className="mt-2">
                {isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="password">
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3 pt-2">
              <FormErrorSummary errors={passwordErrors} />
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
                <PasswordInput
                  id="current-password"
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  invalid={!!passwordErrors.current_password?.length}
                />
                <FieldError errors={passwordErrors} name="current_password" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-password">Kata Sandi Baru</Label>
                <PasswordInput
                  id="new-password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={setNewPassword}
                  invalid={!!passwordErrors.password?.length}
                />
                <p className="text-xs text-muted-foreground">
                  Minimal 8 karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol.
                </p>
                <FieldError errors={passwordErrors} name="password" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-password-confirmation">Konfirmasi Kata Sandi Baru</Label>
                <PasswordInput
                  id="new-password-confirmation"
                  autoComplete="new-password"
                  required
                  value={newPasswordConfirmation}
                  onChange={setNewPasswordConfirmation}
                />
              </div>
              <Button type="submit" disabled={isSavingPassword} className="mt-2">
                {isSavingPassword ? 'Menyimpan...' : 'Ubah Kata Sandi'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
