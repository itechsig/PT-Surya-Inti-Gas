import { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Eye, 
  AlertCircle,
  Smartphone,
  Monitor,
  Tablet
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
  const [dateRange, setDateRange] = useState('today');
  const [activeTab, setActiveTab] = useState('overview');

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
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Monitoring pesan dan pengunjung website</p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Hari Ini</option>
            <option value="yesterday">Kemarin</option>
            <option value="last_7_days">7 Hari Terakhir</option>
            <option value="last_30_days">30 Hari Terakhir</option>
            <option value="this_week">Minggu Ini</option>
            <option value="this_month">Bulan Ini</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Kontak</CardTitle>
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.contacts.total || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {overview?.contacts.new || 0} baru hari ini
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Kontak Pending</CardTitle>
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.contacts.pending || 0}</div>
              <p className="text-xs text-orange-500 mt-1">Perlu respon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pengunjung</CardTitle>
              <Users className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.visitors.total || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {overview?.visitors.unique || 0} pengunjung unik
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Page Views</CardTitle>
              <Eye className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview?.visitors.page_views || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                Rata-rata {overview?.visitors.avg_time_on_site || 0} menit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Device Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Distribusi Perangkat</CardTitle>
            <CardDescription>Pengunjung berdasarkan jenis perangkat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(overview?.devices || {}).map(([device, count]) => (
                <div key={device} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="text-blue-600">
                    {getDeviceIcon(device)}
                  </div>
                  <div>
                    <div className="font-semibold capitalize">{device}</div>
                    <div className="text-sm text-gray-600">{count} pengunjung</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">Kontak</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Kontak Terbaru</CardTitle>
                <CardDescription>5 pesan terakhir yang diterima</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {overview?.recent_contacts?.map((contact) => (
                    <div key={contact.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{contact.nama}</h4>
                          <Badge variant={
                            contact.status === 'pending' ? 'destructive' :
                            contact.status === 'read' ? 'default' :
                            'secondary'
                          }>
                            {contact.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{contact.pesan}</p>
                      </div>
                      <div className="text-xs text-gray-400 ml-4">
                        {new Date(contact.created_at).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Visitors */}
            <Card>
              <CardHeader>
                <CardTitle>Pengunjung Terbaru</CardTitle>
                <CardDescription>5 pengunjung terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {overview?.recent_visitors?.map((visitor) => (
                    <div key={visitor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="text-blue-600">
                          {getDeviceIcon(visitor.device_type)}
                        </div>
                        <div>
                          <div className="font-semibold">{visitor.ip_address}</div>
                          <div className="text-sm text-gray-600">
                            {visitor.browser} - {visitor.os}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(visitor.last_visit).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Semua Kontak</CardTitle>
                <CardDescription>Daftar semua pesan yang diterima</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Fitur lengkap manajemen kontak akan diimplementasikan selanjutnya
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
