import { useState, FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context';
import { ApiError } from '../../utils/apiClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const FEATURES = [
  'Kelola produk, galeri, dan lowongan kerja dalam satu tempat',
  'Pantau lamaran kerja yang masuk secara real-time',
  'Akses berbasis peran untuk menjaga keamanan data',
];

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: Location })?.from?.pathname || '/admin';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsRateLimited(false);
    setIsSubmitting(true);
    try {
      // Trim to avoid whitespace-padded credentials; never mutate the password's case/content.
      await login(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setIsRateLimited(err.status === 429);
        setError(err.message);
      } else {
        setError('Gagal masuk. Silakan coba lagi.');
      }
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_55%)]" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white/90">
            <img src="/logo.png" alt="PT Surya Inti Gas" className="h-full w-full object-contain p-1" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">PT Surya Inti Gas</p>
            <p className="text-sm text-primary-foreground/70">Admin Dashboard</p>
          </div>
        </div>
        <div className="relative flex flex-col gap-6">
          <h1 className="text-3xl font-semibold leading-snug">
            Kelola konten perusahaan dengan aman dan efisien.
          </h1>
          <ul className="flex flex-col gap-3 text-sm text-primary-foreground/85">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-primary-foreground/60">
          &copy; {new Date().getFullYear()} PT Surya Inti Gas. Semua hak dilindungi.
        </p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center px-4 py-10 lg:w-1/2">
        <Card className="w-full max-w-sm border-none shadow-lg lg:border lg:shadow-sm">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-border lg:hidden">
              <img src="/logo.png" alt="PT Surya Inti Gas" className="h-full w-full object-contain p-1" />
            </div>
            <CardTitle>Masuk ke Admin Dashboard</CardTitle>
            <CardDescription>Gunakan kredensial admin yang telah diberikan kepada Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={255}
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@suryaintigas.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    maxLength={255}
                    required
                    disabled={isSubmitting}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <p
                  className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                  role="alert"
                >
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </p>
              )}
              <Button type="submit" disabled={isSubmitting || isRateLimited} className="mt-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Masuk
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
