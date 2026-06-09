 import { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Eye, 
  AlertCircle,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  LogOut,
  Home,
  LayoutDashboard,
  HelpCircle,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowRight,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api';

// Simple auth check for demo purposes
const checkAuth = (): boolean => {
  // For development/testing purposes - allow access
  // In production, implement proper auth validation
  return true; // Allow access for testing purposes
};

interface DashboardOverview {
  contacts: {
    total: number;
    pending: number;
    new: number;
  };
  visitors: {
    total: number;
    unique: number;
    page_views: number;
    avg_time_on_site: number;
  };
  devices: {
    [key: string]: number;
  };
  recent_contacts: any[];
  recent_visitors: any[];
}

export const AdminDashboard = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('today');
  const [activeTab, setActiveTab] = useState('overview');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // For testing purposes, always allow access in development
    const isDev = import.meta.env.DEV;
    if (isDev) {
      fetchDashboardData();
    } else {
      if (checkAuth()) {
        fetchDashboardData();
      } else {
        setLoading(false);
      }
    }
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        getApiUrl(`${API_ENDPOINTS.DASHBOARD_OVERVIEW}?date_range=${dateRange}`),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOverview(data.data);
      } else {
        setError('Gagal memuat data dashboard. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Terjadi kesalahan koneksi. Pastikan server berjalan dengan baik.');
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  if (!checkAuth()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600">Dashboard admin memerlukan login untuk mengakses.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>⚠️ Development Mode:</strong>
              </p>
              <p className="text-sm text-yellow-700 mb-2">
                Anda sedang di environment development. Untuk testing dashboard tanpa authentication:
              </p>
              <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                <li>Klik tombol "Skip Auth" di bawah</li>
                <li>Atau refresh browser untuk reload kode terbaru</li>
              </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Cara akses (Production):</strong>
              </p>
              <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
                <li>Login sebagai admin melalui sistem auth</li>
                <li>Setelah login, dashboard akan otomatis dapat diakses</li>
                <li>Atau akses langsung via URL: <code className="bg-gray-200 px-1 rounded">/admin/dashboard</code></li>
              </ol>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Kembali ke Beranda
              </button>
              <button 
                onClick={() => {
                  // Skip auth for development testing
                  localStorage.setItem('skip_auth', 'true');
                  fetchDashboardData();
                }}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Skip Auth (Dev)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat data dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-xs text-gray-500">PT Surya Inti Gas - Selamat datang, Admin!</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                title="Bantuan penggunaan dashboard"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Bantuan</span>
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                title="Kembali ke halaman utama website"
              >
                <Home className="w-4 h-4" />
                <span>Website</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                title="Refresh data dashboard"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('skip_auth');
                  window.location.href = '/';
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                title="Keluar dari dashboard admin"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Bantuan Dashboard</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 text-gray-600">
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Filter Tanggal</h4>
                  <p className="text-sm">Pilih rentang waktu untuk melihat data dalam periode tertentu.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Kontak & Pesan</h4>
                  <p className="text-sm">Monitor pesan dari pengunjung dan status respon.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Statistik Pengunjung</h4>
                  <p className="text-sm">Lihat statistik pengunjung dan analisis website.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Trend & Analisis</h4>
                  <p className="text-sm">Gunakan data untuk mengoptimalkan performa website.</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Ringkasan Aktivitas</h2>
          <p className="text-gray-600">Monitor aktivitas website dan statistik pengunjung secara real-time.</p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Periode:</span>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="today">📅 Hari Ini</option>
            <option value="yesterday">📅 Kemarin</option>
            <option value="last_7_days">📅 7 Hari Terakhir</option>
            <option value="last_30_days">📅 30 Hari Terakhir</option>
            <option value="this_week">📅 Minggu Ini</option>
            <option value="this_month">📅 Bulan Ini</option>
          </select>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Info className="w-4 h-4" />
            <span>Data akan otomatis di-refresh saat mengubah periode</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Kontak</CardTitle>
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{overview?.contacts.total || 0}</div>
              <p className="text-sm text-gray-500 mt-1">
                {overview?.contacts.new || 0} baru hari ini
              </p>
              <div className="mt-3 pt-3 border-t">
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Lihat semua pesan <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Kontak Pending</CardTitle>
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{overview?.contacts.pending || 0}</div>
              <p className="text-sm text-orange-500 mt-1">Perlu respon segera</p>
              {(overview?.contacts.pending || 0) > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <button className="text-sm text-orange-600 hover:text-orange-800 flex items-center gap-1">
                    Tanggapi sekarang <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pengunjung</CardTitle>
              <Users className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{overview?.visitors.total || 0}</div>
              <p className="text-sm text-gray-500 mt-1">
                {overview?.visitors.unique || 0} pengunjung unik
              </p>
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Traffic aktif</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Page Views</CardTitle>
              <Eye className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{overview?.visitors.page_views || 0}</div>
              <p className="text-sm text-gray-500 mt-1">
                Rata-rata {overview?.visitors.avg_time_on_site || 0} menit on-site
              </p>
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Engagement metric</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Distribution */}
        <Card className="mb-8 hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Distribusi Perangkat</CardTitle>
                <CardDescription>Pengunjung berdasarkan jenis perangkat yang digunakan</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Smartphone className="w-4 h-4" />
                <span>Analytics</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {Object.keys(overview?.devices || {}).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(overview?.devices || {}).map(([device, count]) => (
                  <div key={device} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                    <div className="text-blue-600">
                      {getDeviceIcon(device)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold capitalize text-gray-900">{device}</div>
                      <div className="text-sm text-gray-600">{count} pengunjung</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Monitor className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada data pengunjung</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Kontak
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Contacts */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Kontak Terbaru</CardTitle>
                    <CardDescription>5 pesan terakhir yang diterima dari pengunjung</CardDescription>
                  </div>
                  {overview?.recent_contacts && overview.recent_contacts.length > 0 && (
                    <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      Lihat semua <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {overview?.recent_contacts && overview.recent_contacts.length > 0 ? (
                  <div className="space-y-4">
                    {overview?.recent_contacts?.map((contact) => (
                      <div key={contact.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{contact.nama}</h4>
                            <Badge variant={
                              contact.status === 'pending' ? 'destructive' :
                              contact.status === 'read' ? 'default' :
                              'secondary'
                            } className="flex items-center gap-1">
                              {contact.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                              {contact.status === 'read' && <CheckCircle className="w-3 h-3" />}
                              {contact.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {contact.email}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-2">{contact.pesan}</p>
                        </div>
                        <div className="text-xs text-gray-400 ml-4 flex flex-col items-end">
                          {new Date(contact.created_at).toLocaleDateString('id-ID')}
                          {new Date(contact.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Belum ada pesan masuk</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Visitors */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pengunjung Terbaru</CardTitle>
                    <CardDescription>5 pengunjung terakhir yang mengakses website</CardDescription>
                  </div>
                  {overview?.recent_visitors && overview.recent_visitors.length > 0 && (
                    <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      Lihat semua <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {overview?.recent_visitors && overview.recent_visitors.length > 0 ? (
                  <div className="space-y-4">
                    {overview?.recent_visitors?.map((visitor) => (
                      <div key={visitor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="text-blue-600">
                            {getDeviceIcon(visitor.device_type)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{visitor.ip_address}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <Monitor className="w-3 h-3" />
                              {visitor.browser} - {visitor.os}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 flex flex-col items-end">
                          {new Date(visitor.last_visit).toLocaleDateString('id-ID')}
                          {new Date(visitor.last_visit).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Belum ada data pengunjung</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Manajemen Kontak</CardTitle>
                <CardDescription>Daftar lengkap semua pesan yang diterima dengan fitur filter dan aksi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fitur Manajemen Kontak</h3>
                  <p className="text-gray-500 text-center max-w-md mb-4">
                    Fitur lengkap untuk mengelola semua pesan kontak akan segera tersedia. Anda akan dapat memfilter, mencari, dan memproses pesan dari sini.
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Navigasi ke Overview
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
