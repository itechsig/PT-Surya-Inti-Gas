import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MailOpen, MessageSquareText, Users, ArrowRight, AlertCircle } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { useAuth } from '../../context';
import { API_ENDPOINTS } from '../../config/api';
import { apiRequest } from '../../utils/apiClient';
import { adminNavItems, CONTENT_ROLES, RECRUITMENT_ROLES } from './navConfig';
import { ROLE_LABELS } from './roleLabels';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../components/ui/chart';
import { getCareerApplicationStatistics, getCareerApplicationTimeline } from './careerApplications/api';
import { STATUS_LABELS, type CareerApplicationStatistics, type CareerApplicationTimelinePoint } from './careerApplications/types';
import { getAuditLogStatistics, getAuditLogTimeline } from './auditLogs/api';
import { ACTION_TYPE_LABELS, type AuditLogStatistics, type AuditLogTimelinePoint } from './auditLogs/types';
import { listGalleryItems } from './gallery/api';
import { listProducts } from './products/api';
import { listPortfolios } from './portfolios/api';

interface RecentContact {
  id: number;
  nama: string;
  email: string;
  pesan: string;
  status: 'pending' | 'read' | 'replied' | 'archived';
  created_at: string;
}

interface DashboardOverview {
  contacts: {
    total: number;
    pending: number;
    new: number;
    by_status?: { pending: number; read: number; replied: number; archived: number };
  };
  recent_contacts: RecentContact[];
}

interface ContentSummaryRow {
  module: string;
  total: number;
  aktif: number;
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

const monthLabelFormatter = new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' });
const dayLabelFormatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' });

/** "2026-03" -> "Mar 2026" */
function formatMonthLabel(month: string): string {
  const [year, m] = month.split('-').map(Number);
  return monthLabelFormatter.format(new Date(year, m - 1, 1));
}

/** "2026-08-05" -> "5 Agu" */
function formatDayLabel(date: string): string {
  const [year, m, d] = date.split('-').map(Number);
  return dayLabelFormatter.format(new Date(year, m - 1, d));
}

function getTimeGreeting(hour: number): string {
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 19) return 'Selamat sore';
  return 'Selamat malam';
}

const applicationTimelineConfig = {
  count: { label: 'Lamaran', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const applicationStatusConfig = {
  count: { label: 'Jumlah', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const auditTimelineConfig = {
  count: { label: 'Aktivitas', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const contactStatusConfig = {
  pending: { label: 'Menunggu', color: 'var(--chart-1)' },
  read: { label: 'Dibaca', color: 'var(--chart-2)' },
  replied: { label: 'Dibalas', color: 'var(--chart-3)' },
  archived: { label: 'Diarsipkan', color: 'var(--chart-4)' },
} satisfies ChartConfig;

const contentSummaryConfig = {
  total: { label: 'Total', color: 'var(--chart-3)' },
  aktif: { label: 'Aktif/Terbit', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function DashboardHome() {
  const { user, hasRole } = useAuth();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [applicationStats, setApplicationStats] = useState<CareerApplicationStatistics | null>(null);
  const [applicationTimeline, setApplicationTimeline] = useState<CareerApplicationTimelinePoint[]>([]);
  const [auditStats, setAuditStats] = useState<AuditLogStatistics | null>(null);
  const [auditTimeline, setAuditTimeline] = useState<AuditLogTimelinePoint[]>([]);
  const [contentSummary, setContentSummary] = useState<ContentSummaryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canViewRecruitment = hasRole(RECRUITMENT_ROLES);
  const canViewAudit = hasRole(['super_admin']);
  const canViewContent = hasRole(CONTENT_ROLES);

  useEffect(() => {
    let cancelled = false;
    const skipped = () => Promise.reject(new Error('skipped: role does not permit this request'));

    async function loadDashboard() {
      setIsLoading(true);
      setError(null);

      const [
        overviewResult,
        statsResult,
        appTimelineResult,
        auditStatsResult,
        auditTimelineResult,
        galleryResult,
        productsResult,
        portfoliosResult,
      ] = await Promise.allSettled([
        apiRequest<ApiResponse<DashboardOverview>>(API_ENDPOINTS.DASHBOARD_OVERVIEW),
        canViewRecruitment ? getCareerApplicationStatistics() : skipped(),
        canViewRecruitment ? getCareerApplicationTimeline() : skipped(),
        canViewAudit ? getAuditLogStatistics() : skipped(),
        canViewAudit ? getAuditLogTimeline() : skipped(),
        canViewContent ? listGalleryItems() : skipped(),
        canViewContent ? listProducts() : skipped(),
        canViewContent ? listPortfolios() : skipped(),
      ]);

      if (cancelled) return;

      if (overviewResult.status === 'fulfilled') {
        setOverview(overviewResult.value.data);
      } else {
        setError('Sebagian data dashboard gagal dimuat. Coba muat ulang halaman.');
      }

      if (statsResult.status === 'fulfilled') setApplicationStats(statsResult.value.data);
      if (appTimelineResult.status === 'fulfilled') setApplicationTimeline(appTimelineResult.value.data);
      if (auditStatsResult.status === 'fulfilled') setAuditStats(auditStatsResult.value.data);
      if (auditTimelineResult.status === 'fulfilled') setAuditTimeline(auditTimelineResult.value.data);

      if (canViewContent) {
        const gallery = galleryResult.status === 'fulfilled' ? galleryResult.value.data : [];
        const products = productsResult.status === 'fulfilled' ? productsResult.value.data : [];
        const portfolios = portfoliosResult.status === 'fulfilled' ? portfoliosResult.value.data : [];

        setContentSummary([
          { module: 'Galeri', total: gallery.length, aktif: gallery.filter((g) => g.is_active).length },
          { module: 'Produk', total: products.length, aktif: products.filter((p) => p.is_published).length },
          { module: 'Portofolio', total: portfolios.length, aktif: portfolios.filter((p) => p.is_published).length },
        ]);
      }

      setIsLoading(false);
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewRecruitment, canViewAudit, canViewContent]);

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
    ...(canViewRecruitment
      ? [
          {
            label: 'Pelamar Menunggu',
            value: applicationStats?.pending,
            icon: Users,
            description: 'Perlu ditinjau',
          },
        ]
      : []),
  ];

  const quickLinks = adminNavItems.filter(
    (item) => item.to !== '/admin' && (!item.roles || hasRole(item.roles))
  );

  const applicationStatusData = useMemo(() => {
    if (!applicationStats) return [];
    return (['pending', 'reviewed', 'interview', 'hired', 'rejected'] as const).map((key) => ({
      status: STATUS_LABELS[key],
      count: applicationStats[key],
    }));
  }, [applicationStats]);

  const contactStatusData = useMemo(() => {
    const byStatus = overview?.contacts.by_status;
    if (!byStatus) return [];
    return (['pending', 'read', 'replied', 'archived'] as const)
      .map((key) => ({ status: key, label: CONTACT_STATUS_LABELS[key], count: byStatus[key] }))
      .filter((row) => row.count > 0);
  }, [overview]);

  const topAuditActions = useMemo(() => (auditStats?.by_action ?? []).slice(0, 5), [auditStats]);

  const applicationTimelineData = useMemo(
    () => applicationTimeline.map((point) => ({ ...point, label: formatMonthLabel(point.month) })),
    [applicationTimeline]
  );

  const auditTimelineData = useMemo(
    () => auditTimeline.map((point) => ({ ...point, label: formatDayLabel(point.date) })),
    [auditTimeline]
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
      {canViewRecruitment && (
        <Card>
          <CardHeader>
            <CardTitle>Grafik Jumlah Lamaran masuk</CardTitle>
            <CardDescription>Jumlah lamaran masuk per bulan, 6 bulan terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[220px] w-full" />
            ) : applicationTimelineData.length ? (
              <ChartContainer config={applicationTimelineConfig} className="aspect-auto h-[220px] w-full">
                <AreaChart data={applicationTimelineData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="count"
                    type="monotone"
                    fill="var(--color-count)"
                    fillOpacity={0.2}
                    stroke="var(--color-count)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">Belum ada data lamaran.</p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {canViewRecruitment && (
          <Card>
            <CardHeader>
              <CardTitle>Status Lamaran Karir</CardTitle>
              <CardDescription>Distribusi seluruh lamaran berdasarkan status saat ini.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[220px] w-full" />
              ) : applicationStatusData.length ? (
                <ChartContainer config={applicationStatusConfig} className="aspect-auto h-[220px] w-full">
                  <BarChart data={applicationStatusData} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                    <YAxis dataKey="status" type="category" tickLine={false} axisLine={false} width={80} />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">Belum ada data lamaran.</p>
              )}
            </CardContent>
          </Card>
        )}

        {contactStatusData.length > 0 || isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Status Kontak</CardTitle>
              <CardDescription>Seluruh pesan kontak, sepanjang waktu.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[220px] w-full" />
              ) : (
                <ChartContainer config={contactStatusConfig} className="aspect-auto h-[220px] w-full">
                  <PieChart margin={{ top: 8, bottom: 8 }}>
                    <ChartTooltip content={<ChartTooltipContent nameKey="label" hideLabel />} />
                    <Pie data={contactStatusData} dataKey="count" nameKey="label" innerRadius={45} outerRadius={75} strokeWidth={2}>
                      {contactStatusData.map((row) => (
                        <Cell key={row.status} fill={`var(--color-${row.status})`} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="label" />} />
                  </PieChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {canViewAudit && (
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Admin</CardTitle>
              <CardDescription>Jumlah aksi admin per hari, 14 hari terakhir.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {isLoading ? (
                <Skeleton className="h-[220px] w-full" />
              ) : auditTimelineData.length ? (
                <>
                  <ChartContainer config={auditTimelineConfig} className="aspect-auto h-[180px] w-full">
                    <AreaChart data={auditTimelineData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval="preserveStartEnd" />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        dataKey="count"
                        type="monotone"
                        fill="var(--color-count)"
                        fillOpacity={0.2}
                        stroke="var(--color-count)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                  {topAuditActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-t pt-3">
                      {topAuditActions.map((row) => (
                        <Badge key={row.action_type} variant="outline" className="font-normal">
                          {ACTION_TYPE_LABELS[row.action_type] ?? row.action_type}: {row.count}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">Belum ada aktivitas tercatat.</p>
              )}
            </CardContent>
          </Card>
        )}

        {canViewContent && (
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Konten</CardTitle>
              <CardDescription>Total konten dibanding yang aktif/terbit per modul.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[220px] w-full" />
              ) : contentSummary.length ? (
                <ChartContainer config={contentSummaryConfig} className="aspect-auto h-[220px] w-full">
                  <BarChart data={contentSummary} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="module" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                    <Bar dataKey="aktif" fill="var(--color-aktif)" radius={4} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">Belum ada data konten.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
