import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter,
  Calendar,
  User,
  Activity,
  Shield,
  CheckCircle,
  XCircle,
  Download,
  ChevronDown,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api';

interface AuditLog {
  id: number;
  user_id: number | null;
  action_type: string;
  entity_type: string | null;
  entity_id: number | null;
  description: string;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface AuditStats {
  total: number;
  recent_24h: number;
  recent_7d: number;
  recent_30d: number;
}

export const AuditLogHistory = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchLogs();
    fetchRecentLogs();
    fetchStatistics();
  }, [actionFilter, dateRange]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let url = getApiUrl(API_ENDPOINTS.AUDIT_LOGS);
      const params = new URLSearchParams();
      
      if (actionFilter !== 'all') params.append('action_type', actionFilter);
      
      // Add date range
      const now = new Date();
      if (dateRange === '24h') {
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        params.append('start_date', yesterday.toISOString());
        params.append('end_date', now.toISOString());
      } else if (dateRange === '7d') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        params.append('start_date', weekAgo.toISOString());
        params.append('end_date', now.toISOString());
      } else if (dateRange === '30d') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        params.append('start_date', monthAgo.toISOString());
        params.append('end_date', now.toISOString());
      }

      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentLogs = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AUDIT_LOGS_RECENT));
      if (response.ok) {
        const data = await response.json();
        setRecentLogs(data.data);
      }
    } catch (error) {
      console.error('Error fetching recent logs:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AUDIT_LOGS_STATISTICS));
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const filteredLogs = logs.filter(log =>
    log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.user?.name && log.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'login': return <User className="w-4 h-4" />;
      case 'logout': return <XCircle className="w-4 h-4" />;
      case 'approve': return <CheckCircle className="w-4 h-4" />;
      case 'reject': return <XCircle className="w-4 h-4" />;
      case 'block': return <Shield className="w-4 h-4" />;
      case 'unblock': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'login': return 'text-green-500';
      case 'logout': return 'text-gray-500';
      case 'approve': return 'text-blue-500';
      case 'reject': return 'text-red-500';
      case 'block': return 'text-red-500';
      case 'unblock': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const exportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Action Type,Entity Type,Entity ID,Description,User,Created At\n"
      + logs.map(log => 
        `${log.id},${log.action_type},${log.entity_type || ''},${log.entity_id || ''},"${log.description}",${log.user?.name || 'System'},${log.created_at}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Audit Log & Activity History</h1>
                <p className="text-sm text-gray-500">Track all system activities and changes</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={exportLogs}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                onClick={() => {
                  fetchLogs();
                  fetchRecentLogs();
                  fetchStatistics();
                }}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Logs" value={stats.total} icon={FileText} />
            <StatCard title="Last 24 Hours" value={stats.recent_24h} icon={Clock} color="blue" />
            <StatCard title="Last 7 Days" value={stats.recent_7d} icon={Calendar} color="green" />
            <StatCard title="Last 30 Days" value={stats.recent_30d} icon={Activity} color="purple" />
          </div>
        )}

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by description or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {actionFilter === 'all' ? 'All Actions' : actionFilter}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setActionFilter('all')}>All Actions</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActionFilter('login')}>Logins</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActionFilter('logout')}>Logouts</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActionFilter('approve')}>Approvals</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActionFilter('reject')}>Rejections</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActionFilter('block')}>Blocks</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActionFilter('unblock')}>Unblocks</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {dateRange === '24h' ? '24 Hours' : dateRange === '7d' ? '7 Days' : '30 Days'}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setDateRange('24h')}>Last 24 Hours</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateRange('7d')}>Last 7 Days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateRange('30d')}>Last 30 Days</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {recentLogs.length > 0 && (
          <Card className="mb-6 border-purple-500">
            <CardHeader>
              <CardTitle className="text-purple-600">Recent Activity</CardTitle>
              <CardDescription>
                Latest system activities and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLogs.slice(0, 5).map((log) => (
                  <ActivityLogCard
                    key={log.id}
                    log={log}
                    getActionIcon={getActionIcon}
                    getActionColor={getActionColor}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
            <CardDescription>
              {filteredLogs.length} log(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No activity logs found</p>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <ActivityLogCard
                    key={log.id}
                    log={log}
                    getActionIcon={getActionIcon}
                    getActionColor={getActionColor}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Sub-components
const StatCard = ({ title, value, icon: Icon, color = 'gray' }: { title: string; value: number; icon: any; color?: string }) => {
  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
            <Icon className={`w-5 h-5 text-${color}-500`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ActivityLogCard = ({ log, getActionIcon, getActionColor }: any) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${getActionColor(log.action_type)} bg-opacity-10`}>
          <div className={getActionColor(log.action_type)}>
            {getActionIcon(log.action_type)}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold capitalize">{log.action_type.replace('_', ' ')}</h4>
                {log.entity_type && (
                  <Badge className="bg-gray-500">{log.entity_type}</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{log.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {log.user?.name || 'System'}
                </div>
                {log.ip_address && (
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {log.ip_address}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDetails(!showDetails)}
              className="ml-4"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          
          {showDetails && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2">
              {log.old_values && Object.keys(log.old_values).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Old Values:</p>
                  <pre className="text-xs bg-white p-2 rounded overflow-auto">
                    {JSON.stringify(log.old_values, null, 2)}
                  </pre>
                </div>
              )}
              {log.new_values && Object.keys(log.new_values).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">New Values:</p>
                  <pre className="text-xs bg-white p-2 rounded overflow-auto">
                    {JSON.stringify(log.new_values, null, 2)}
                  </pre>
                </div>
              )}
              {log.entity_id && (
                <div className="text-xs">
                  <span className="font-medium">Entity ID:</span> {log.entity_id}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
