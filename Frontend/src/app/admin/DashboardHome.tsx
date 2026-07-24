import { useAuth } from '../../context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Selamat datang, {user?.name}</h1>
        <p className="text-muted-foreground">
          Ini adalah landasan Admin Dashboard. Modul pengelolaan konten (Produk, Karir, Galeri, dll.)
          akan muncul di sini secara bertahap.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fondasi selesai</CardTitle>
          <CardDescription>Autentikasi, peran pengguna, dan tata letak admin sudah aktif.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Modul CRUD berikutnya akan ditambahkan satu per satu ke navigasi di sebelah kiri.
        </CardContent>
      </Card>
    </div>
  );
}
