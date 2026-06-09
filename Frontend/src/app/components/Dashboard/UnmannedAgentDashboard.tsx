import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Bot,
  MapPin,
  AlertTriangle,
  FileText,
  Settings,
  Search,
  Bell,
  MessageSquare,
  User,
  ChevronDown,
  Activity,
  Battery,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Satellite,
  Car,
  Plane,
  Maximize,
  Plus,
  Minus,
  Menu,
  X,
  Layers,
  Radio,
  BarChart3,
  Globe,
  Cpu,
  RefreshCw,
  ArrowUpRight,
  ArrowDown,
  LogOut,
  Wifi,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api';

// Color scheme as specified
const COLORS = {
  primary: '#2563EB',
  sidebar: '#071B36',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#F8FAFC',
  card: '#FFFFFF'
};

// Navigation menu items
const NAVIGATION_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Bot, label: 'Unmanned Agents', id: 'agents', hasSubmenu: true },
  { icon: Layers, label: 'Semua Agent', id: 'all-agents' },
  { icon: Globe, label: 'Grup Agent', id: 'agent-groups' },
  { icon: Activity, label: 'Status Agent', id: 'agent-status' },
  { icon: Settings, label: 'Maintenance', id: 'maintenance' },
  { icon: Radio, label: 'Misi', id: 'missions' },
  { icon: MapPin, label: 'Monitoring', id: 'monitoring' },
  { icon: Satellite, label: 'Peta Lokasi', id: 'location-map' },
  { icon: AlertTriangle, label: 'Alert & Notifikasi', id: 'alerts' },
  { icon: FileText, label: 'Log Aktivitas', id: 'activity-logs' },
  { icon: BarChart3, label: 'Laporan', id: 'reports' },
  { icon: Shield, label: 'Geofence', id: 'geofence' },
  { icon: Cpu, label: 'Integrasi', id: 'integrations' },
  { icon: Settings, label: 'Pengaturan', id: 'settings' },
];





export const UnmannedAgentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Dashboard data states
  const [overviewData, setOverviewData] = useState<any>(null);
  const [missionsData, setMissionsData] = useState<any>(null);
  const [alertsData, setAlertsData] = useState<any>(null);
  const [agentHealthData, setAgentHealthData] = useState<any>(null);
  const [systemActivityData, setSystemActivityData] = useState<any>(null);
  const [operationalStats, setOperationalStats] = useState<any>(null);
  
  // Real-time notification state
  const [showNewAlertNotification, setShowNewAlertNotification] = useState(false);
  const [latestAlert, setLatestAlert] = useState<any>(null);

  useEffect(() => {
    fetchAllData();
    
    // Set up auto-refresh interval
    let intervalId: number | null = null;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchAllData();
      }, 30000) as unknown as number; // 30 seconds default
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh]);

  const fetchAllData = async () => {
    try {
      // Only show loading state for initial load, not for auto-refresh
      if (!overviewData) {
        setLoading(true);
      }
      
      setIsRefreshing(true);
      setError(null);

      // Fetch all data in parallel
      const [overview, missions, alerts, health, activity, stats] = await Promise.all([
        fetch(getApiUrl(API_ENDPOINTS.UNMANNED_OVERVIEW)),
        fetch(getApiUrl(API_ENDPOINTS.UNMANNED_MISSIONS)),
        fetch(getApiUrl(API_ENDPOINTS.UNMANNED_ALERTS)),
        fetch(getApiUrl(API_ENDPOINTS.UNMANNED_AGENT_HEALTH)),
        fetch(getApiUrl(API_ENDPOINTS.UNMANNED_SYSTEM_ACTIVITY)),
        fetch(getApiUrl(API_ENDPOINTS.UNMANNED_OPERATIONAL_STATS))
      ]);

      if (overview.ok) {
        const data = await overview.json();
        setOverviewData(data.data);
      }

      if (missions.ok) {
        const data = await missions.json();
        setMissionsData(data.data);
      }

      if (alerts.ok) {
        const data = await alerts.json();
        setAlertsData(data.data);
        
        // Check for new critical alerts and show notification
        if (data.data && data.data.alerts && data.data.alerts.length > 0) {
          const criticalAlerts = data.data.alerts.filter((alert: any) => alert.type === 'critical' && !alert.resolved);
          if (criticalAlerts.length > 0 && alertsData) {
            const newCritical = criticalAlerts.find((alert: any) => !alertsData.alerts?.some((existing: any) => existing.id === alert.id));
            if (newCritical) {
              setLatestAlert(newCritical);
              setShowNewAlertNotification(true);
              
              // Auto-hide notification after 5 seconds
              setTimeout(() => {
                setShowNewAlertNotification(false);
              }, 5000);
            }
          }
        }
      }

      if (health.ok) {
        const data = await health.json();
        setAgentHealthData(data.data);
      }

      if (activity.ok) {
        const data = await activity.json();
        setSystemActivityData(data.data);
      }

      if (stats.ok) {
        const data = await stats.json();
        setOperationalStats(data.data);
      }
      
      setLastRefreshTime(new Date());
    } catch (error) {
      console.error('Error fetching unmanned agent data:', error);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'success': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-700 border-green-200">Aktif</Badge>;
      case 'idle': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Idle</Badge>;
      case 'in-mission': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Dalam Misi</Badge>;
      case 'maintenance': return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Maintenance</Badge>;
      case 'warning': return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Warning</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-700 border-gray-200">{status}</Badge>;
    }
  };

  const getMissionStatusBadge = (status: string) => {
    switch (status) {
      case 'in-progress': return <Badge className="bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1 animate-pulse"><div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />In Progress</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Selesai</Badge>;
      case 'paused': return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1"><Clock className="w-3 h-3" />Paused</Badge>;
      case 'failed': return <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1"><X className="w-3 h-3" />Gagal</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-700 border-gray-200">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <Button onClick={fetchAllData} className="w-full">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.background }}>
      {/* Real-time Notification Popup */}
      {showNewAlertNotification && latestAlert && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-right">
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 animate-bounce">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-red-900">Alert Baru!</p>
                <p className="text-sm text-red-700 mt-1">{latestAlert.title}</p>
                <p className="text-xs text-red-600 mt-1">{latestAlert.message}</p>
              </div>
              <button
                onClick={() => setShowNewAlertNotification(false)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
        style={{
          background: `linear-gradient(180deg, ${COLORS.sidebar} 0%, #0f2744 100%)`,
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(37, 99, 235, 0.2)' }}>
              <Bot className="w-6 h-6 text-blue-400" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-white">Unmanned Agent</h1>
                <p className="text-xs text-blue-300">Monitoring System</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveNavItem(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/20 text-white border border-blue-500/30'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-xs font-medium text-green-400">Online</p>
                <p className="text-xs text-gray-400">Semua Sistem Beroperasi Normal</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari agent, misi, atau alert..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Auto-refresh Toggle */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border">
                  <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                  <span className="text-xs text-gray-600">Auto-refresh</span>
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`w-8 h-4 rounded-full transition-colors ${autoRefresh ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full shadow-md transition-transform ${autoRefresh ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={() => fetchAllData()}
                  disabled={isRefreshing}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing && <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />}
                </button>

                {/* Last Refresh Time */}
                <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Last update: {lastRefreshTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Notification Button */}
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Messages Button */}
                <button
                  onClick={() => setShowMessages(!showMessages)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
                </button>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      A
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500">Super Administrator</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profil
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Pengaturan
                      </button>
                      <hr className="my-2" />
                      <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Monitoring</h1>
              <p className="text-gray-500">Real-time unmanned agent monitoring and management</p>
            </div>
            <Button className="flex items-center gap-2" style={{ backgroundColor: COLORS.primary }}>
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
          </div>

          {/* Statistic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {overviewData ? [
              {
                title: 'Total Agent',
                icon: Bot,
                value: overviewData.total_agents.toString(),
                trend: '+12%',
                trendUp: true,
                color: '#2563EB',
                backgroundColor: 'bg-blue-50'
              },
              {
                title: 'Agent Aktif',
                icon: Activity,
                value: overviewData.active_agents.toString(),
                trend: '+8%',
                trendUp: true,
                color: '#22C55E',
                backgroundColor: 'bg-green-50'
              },
              {
                title: 'Misi Aktif',
                icon: Radio,
                value: overviewData.active_missions.toString(),
                trend: '-3%',
                trendUp: false,
                color: '#F59E0B',
                backgroundColor: 'bg-yellow-50'
              },
              {
                title: 'Alert',
                icon: AlertTriangle,
                value: overviewData.alerts.toString(),
                trend: '+5%',
                trendUp: true,
                color: '#EF4444',
                backgroundColor: 'bg-red-50'
              },
              {
                title: 'Rata-rata Baterai',
                icon: Battery,
                value: overviewData.average_battery + '%',
                trend: '+2%',
                trendUp: true,
                color: '#22C55E',
                backgroundColor: 'bg-green-50'
              }
            ].map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform" style={{ borderRadius: '16px' }}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${card.backgroundColor} transition-transform hover:scale-110 duration-200`}>
                        <Icon className="w-6 h-6" style={{ color: card.color }} />
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${card.trendUp ? 'text-green-600' : 'text-red-600'} animate-pulse`}>
                        {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        <span className="font-medium">{card.trend}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                      <p className="text-sm text-gray-500">{card.title}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            }) : (
              <div className="col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="animate-pulse" style={{ borderRadius: '16px' }}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="p-3 bg-gray-200 rounded-lg w-12 h-12" />
                        <div className="w-16 h-6 bg-gray-200 rounded" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="w-20 h-8 bg-gray-200 rounded" />
                        <div className="w-16 h-4 bg-gray-200 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Overview Status Agent & Monitoring Peta */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent Status Overview */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderRadius: '16px' }}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Overview Status Agent</CardTitle>
              </CardHeader>
              <CardContent>
                {overviewData ? (
                  <div className="flex items-center gap-6">
                    <div className="relative" style={{ width: 180, height: 180 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Aktif', value: overviewData.agent_status?.active || 0, color: '#22C55E' },
                              { name: 'Idle', value: overviewData.agent_status?.idle || 0, color: '#3B82F6' },
                              { name: 'Sedang Bertugas', value: overviewData.agent_status?.on_mission || 0, color: '#F59E0B' },
                              { name: 'Maintenance', value: overviewData.agent_status?.maintenance || 0, color: '#6B7280' },
                              { name: 'Offline', value: overviewData.agent_status?.offline || 0, color: '#EF4444' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {[
                              { name: 'Aktif', value: overviewData.agent_status?.active || 0, color: '#22C55E' },
                              { name: 'Idle', value: overviewData.agent_status?.idle || 0, color: '#3B82F6' },
                              { name: 'Sedang Bertugas', value: overviewData.agent_status?.on_mission || 0, color: '#F59E0B' },
                              { name: 'Maintenance', value: overviewData.agent_status?.maintenance || 0, color: '#6B7280' },
                              { name: 'Offline', value: overviewData.agent_status?.offline || 0, color: '#EF4444' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{overviewData.total_agents || 0}</p>
                          <p className="text-xs text-gray-500">Total Agent</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      {[
                        { name: 'Aktif', value: overviewData.agent_status?.active || 0, color: '#22C55E' },
                        { name: 'Idle', value: overviewData.agent_status?.idle || 0, color: '#3B82F6' },
                        { name: 'Sedang Bertugas', value: overviewData.agent_status?.on_mission || 0, color: '#F59E0B' },
                        { name: 'Maintenance', value: overviewData.agent_status?.maintenance || 0, color: '#6B7280' },
                        { name: 'Offline', value: overviewData.agent_status?.offline || 0, color: '#EF4444' }
                      ].map((item) => (
                        <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className="w-3 h-3 rounded-full group-hover:scale-125 transition-transform" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{item.name}</span>
                          <span className="text-sm font-medium text-gray-900 ml-auto group-hover:scale-110 transition-transform">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">Memuat data status agent...</div>
                )}
              </CardContent>
            </Card>

            {/* Real-time Map Monitoring */}
            <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-300" style={{ borderRadius: '16px' }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Monitoring Peta Real-Time</CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8">
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8">
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-100 rounded-lg h-64 overflow-hidden">
                  {/* Simulated Map */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                    {/* Grid lines */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="grid grid-cols-12 grid-rows-6 h-full">
                        {Array.from({ length: 72 }).map((_, i) => (
                          <div key={i} className="border border-gray-300" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Drone positions */}
                    <div className="absolute top-1/4 left-1/4 animate-pulse">
                      <div className="p-2 bg-blue-600 rounded-full shadow-lg">
                        <Plane className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600" />
                    </div>
                    
                    <div className="absolute top-1/2 right-1/3 animate-pulse">
                      <div className="p-2 bg-blue-600 rounded-full shadow-lg">
                        <Plane className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600" />
                    </div>
                    
                    {/* Robot positions */}
                    <div className="absolute bottom-1/3 left-1/3 animate-pulse">
                      <div className="p-2 bg-green-600 rounded-full shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-1/2 right-1/4 animate-pulse">
                      <div className="p-2 bg-green-600 rounded-full shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    {/* Vehicle position */}
                    <div className="absolute top-2/3 left-1/2 animate-pulse">
                      <div className="p-2 bg-purple-600 rounded-full shadow-lg">
                        <Car className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    {/* Geofence area */}
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-yellow-400 rounded-lg opacity-50" />
                    
                    {/* Mission route */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <path
                        d="M 100 80 Q 200 120 300 80 T 500 80"
                        stroke="#2563EB"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                        opacity="0.5"
                      />
                    </svg>
                  </div>
                  
                  {/* Map controls overlay */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Drone</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      <span>Robot</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs">
                      <div className="w-2 h-2 rounded-full bg-purple-600" />
                      <span>Kendaraan</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert Panel & Active Missions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alert Panel */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderRadius: '16px' }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Alert Terbaru
                </CardTitle>
                <Button size="sm" variant="outline" className="hover:bg-orange-50 hover:border-orange-300 transition-colors">
                  Lihat Semua
                </Button>
              </CardHeader>
              <CardContent>
                {alertsData && alertsData.alerts ? (
                  <div className="space-y-3">
                    {alertsData.alerts.map((alert: any, index: number) => {
                      const Icon = alert.type === 'critical' ? AlertTriangle :
                                 alert.type === 'warning' ? AlertTriangle :
                                 alert.type === 'success' ? CheckCircle :
                                 alert.type === 'info' ? Info : AlertTriangle;
                      return (
                        <div
                          key={alert.id}
                          className={`p-4 rounded-lg border ${getAlertColor(alert.type)} transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full bg-white/20 ${alert.type === 'critical' ? 'animate-pulse' : ''}`}>
                              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm">{alert.title}</p>
                                <span className="text-xs opacity-75">{alert.time}</span>
                              </div>
                              <p className="text-sm mt-1 opacity-90">{alert.message}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">Memuat data alert...</div>
                )}
              </CardContent>
            </Card>

            {/* Active Missions Table */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderRadius: '16px' }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Radio className="w-5 h-5 text-blue-600" />
                  Misi Aktif
                </CardTitle>
                <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:border-blue-300 transition-colors">
                  Lihat Semua
                </Button>
              </CardHeader>
              <CardContent>
                {missionsData && missionsData.missions ? (
                  <div className="space-y-4">
                    {missionsData.missions.map((mission: any, index: number) => (
                      <div key={mission.id} className="p-4 border rounded-lg hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-900">{mission.name}</h4>
                            <p className="text-xs text-gray-500">{mission.agent}</p>
                          </div>
                          {getMissionStatusBadge(mission.status)}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs mb-3">
                          <div>
                            <p className="text-gray-500">Tipe</p>
                            <p className="font-medium text-gray-900">{mission.type}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Lokasi</p>
                            <p className="font-medium text-gray-900">{mission.location}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Progress</p>
                            <p className="font-medium text-gray-900">{mission.progress}%</p>
                          </div>
                        </div>
                        <Progress value={mission.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">Memuat data misi...</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Agent Health & System Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Health Monitoring */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderRadius: '16px' }}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
                  Monitoring Kesehatan Agent
                </CardTitle>
              </CardHeader>
              <CardContent>
                {agentHealthData && agentHealthData.agents ? (
                  <div className="space-y-4">
                    {agentHealthData.agents.map((agent: any, index: number) => {
                      const Icon = agent.type === 'drone' ? Plane : agent.type === 'robot' ? Bot : Car;
                      const statusColor = agent.status === 'active' ? 'bg-green-500' : 
                                       agent.status === 'warning' ? 'bg-orange-500' : 
                                       agent.status === 'in-mission' ? 'bg-blue-500' : 'bg-gray-500';
                      return (
                        <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer" style={{ animationDelay: `${index * 75}ms` }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${agent.status === 'warning' ? 'bg-orange-100' : 'bg-blue-50'} transition-transform hover:scale-110 duration-200`}>
                                <Icon className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-900">{agent.name}</h4>
                                {getStatusBadge(agent.status)}
                              </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${statusColor} ${agent.status === 'active' ? 'animate-pulse' : ''}`} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Battery className="w-3 h-3" />
                                  Baterai
                                </span>
                                <span className="text-xs font-medium text-gray-900">{agent.battery}%</span>
                              </div>
                              <Progress value={agent.battery} className="h-2" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Wifi className="w-3 h-3" />
                                  Sinyal
                                </span>
                                <span className="text-xs font-medium text-gray-900">{agent.signal}%</span>
                              </div>
                              <Progress value={agent.signal} className="h-2" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">Memuat data kesehatan agent...</div>
                )}
              </CardContent>
            </Card>

            {/* System Activity Chart */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderRadius: '16px' }}>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Grafik Aktivitas Sistem
                </CardTitle>
              </CardHeader>
              <CardContent>
                {systemActivityData && systemActivityData.activity ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={systemActivityData.activity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="operations" 
                        stroke="#2563EB" 
                        strokeWidth={2}
                        dot={{ fill: '#2563EB' }}
                        name="Jumlah Operasi"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="runtime" 
                        stroke="#22C55E" 
                        strokeWidth={2}
                        dot={{ fill: '#22C55E' }}
                        name="Runtime Sistem"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="data" 
                        stroke="#F59E0B" 
                        strokeWidth={2}
                        dot={{ fill: '#F59E0B' }}
                        name="Pengumpulan Data"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-500 py-8">Memuat data aktivitas sistem...</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Operational Statistics */}
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderRadius: '16px' }}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Statistik Operasional
              </CardTitle>
            </CardHeader>
            <CardContent>
              {operationalStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: 'Total Penerbangan',
                      value: operationalStats.total_flights,
                      icon: Plane,
                      color: '#2563EB'
                    },
                    {
                      title: 'Total Jarak Tempuh',
                      value: operationalStats.total_distance,
                      icon: MapPin,
                      color: '#22C55E'
                    },
                    {
                      title: 'Total Runtime',
                      value: operationalStats.total_runtime,
                      icon: Clock,
                      color: '#F59E0B'
                    },
                    {
                      title: 'Data Terkumpul',
                      value: operationalStats.data_collected,
                      icon: Cpu,
                      color: '#8B5CF6'
                    }
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="p-6 border rounded-lg hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 rounded-lg transition-transform hover:scale-110 duration-200" style={{ backgroundColor: `${stat.color}15` }}>
                            <Icon className="w-6 h-6" style={{ color: stat.color }} />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">Memuat data statistik operasional...</div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
