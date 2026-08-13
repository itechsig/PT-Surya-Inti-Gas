import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MailOpen, MessageSquareText, Users, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context';
import { API_ENDPOINTS } from '../../config/api';
import { apiRequest } from '../../utils/apiClient';
import { adminNavItems } from './navConfig';
import { ROLE_LABELS } from './roleLabels';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

interface RecentContact {
  id: number;
  nama: string;
  email: string;
  pesan: string;
  status: 'pending' | 'read' | 'replied' | 'archived';
  created_at: string;
}

interface DashboardOverview {
  contacts: { total: number; pending: number; new: number };
  recent_contacts: RecentContact[];
}

interface CareerApplicationStatistics {
  total: number;
  pending: number;
}

type ApiResponse<T> = { success: boolean; message?: string; data: T };

const CONTACT_STATUS_LABELS: Record<RecentContact['status'], string> = {
  pending: 'Menunggu',
  read: 'Dibaca',
  replied: 'Dibalas',
  archived: 'Diarsipkan',
};

const CONTACT_STATUS_VARIANT: Record<RecentContact['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  read: 'outline',
  replied: 'default',
  archived: 'outline',
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

function getTimeGreeting(hour: number): string {
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 19) return 'Selamat sore';
  return 'Selamat malam';
}

export function DashboardHome() {
  const { user, hasRole } = useAuth();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [applicationStats, setApplicationStats] = useState<CareerApplicationStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setIsLoading(true);
      setError(null);

      const [overviewResult, statsResult] = await Promise.allSettled([
        apiRequest<ApiResponse<DashboardOverview>>(API_ENDPOINTS.DASHBOARD_OVERVIEW),
        apiRequest<ApiResponse<CareerApplicationStatistics>>(API_ENDPOINTS.CAREER_APPLICATIONS_STATISTICS),
      ]);

      if (cancelled) return;

      if (overviewResult.status === 'fulfilled') {
        setOverview(overviewResult.value.data);
      } else {
        setError('Sebagian data dashboard gagal dimuat. Coba muat ulang halaman.');
      }

      if (statsResult.status === 'fulfilled') {
        setApplicationStats(statsResult.value.data);
      }

      setIsLoading(false);
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    {
      label: 'Kontak Baru',
      value: overview?.contacts.new,
      icon: Mail,
      description: 'Masuk hari ini',
    },
    {
      label: 'Kontak Menunggu',
      value: overview?.contacts.pending,
      icon: MailOpen,
      description: 'Belum ditindaklanjuti',
    },
    {
      label: 'Total Kontak',
      value: overview?.contacts.total,
      icon: MessageSquareText,
      description: 'Sepanjang waktu',
    },
    {
      label: 'Pelamar Menunggu',
      value: applicationStats?.pending,
      icon: Users,
      description: 'Perlu ditinjau',
    },
  ];

  const quickLinks = adminNavItems.filter(
    (item) => item.to !== '/admin' && (!item.roles || hasRole(item.roles))
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {getTimeGreeting(new Date().getHours())}, {user?.name}
          {user && <span className="font-normal text-muted-foreground"> ({ROLE_LABELS[user.role]})</span>}
        </h1>
        <p className="text-muted-foreground">Ringkasan aktivitas terbaru pada website PT Surya Inti Gas.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value ?? '–'}</div>
              )}
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pesan Kontak Terbaru</CardTitle>
            <CardDescription>5 pesan terakhir yang masuk melalui formulir kontak.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : overview?.recent_contacts.length ? (
              <ul className="flex flex-col divide-y">
                {overview.recent_contacts.map((contact) => (
                  <li key={contact.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{contact.nama}</p>
                      <p className="truncate text-xs text-muted-foreground">{contact.email}</p>
                      <p className="mt-1 line-clamp-1 text-sm text-foreground/80">{contact.pesan}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge variant={CONTACT_STATUS_VARIANT[contact.status]}>
                        {CONTACT_STATUS_LABELS[contact.status]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {dateFormatter.format(new Date(contact.created_at))}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">Belum ada pesan kontak.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Akses Cepat</CardTitle>
            <CardDescription>Modul yang dapat Anda kelola.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {quickLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between rounded-md border p-3 text-sm transition-colors hover:bg-accent"
              >
                <span className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.label}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
