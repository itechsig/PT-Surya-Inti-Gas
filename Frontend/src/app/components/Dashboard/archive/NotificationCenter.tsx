import { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  Check, 
  CheckCheck, 
  Trash2,
  AlertTriangle,
  Info,
  MessageSquare,
  FileText,
  Shield,
  Search,
  Filter,
  Clock,
  ExternalLink,
  X
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

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: string;
  status: string;
  action_url: string | null;
  action_text: string | null;
  created_at: string;
  read_at: string | null;
}

interface NotificationStats {
  total: number;
  unread: number;
  high_priority: number;
  critical: number;
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
    fetchUnreadNotifications();
    fetchStatistics();
  }, [typeFilter, statusFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      let url = getApiUrl(API_ENDPOINTS.NOTIFICATIONS);
      const params = new URLSearchParams();
      
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.NOTIFICATIONS_UNREAD));
      if (response.ok) {
        const data = await response.json();
        setUnreadNotifications(data.data);
      }
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.NOTIFICATIONS_STATISTICS));
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(
        getApiUrl(`${API_ENDPOINTS.NOTIFICATION_MARK_READ}/${notificationId}`),
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        fetchNotifications();
        fetchUnreadNotifications();
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        getApiUrl(API_ENDPOINTS.NOTIFICATIONS_MARK_ALL_READ),
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        fetchNotifications();
        fetchUnreadNotifications();
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      const response = await fetch(
        getApiUrl(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}`),
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        fetchNotifications();
        fetchUnreadNotifications();
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notif =>
    notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notif.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'approval_request': return <Shield className="w-5 h-5" />;
      case 'new_message': return <MessageSquare className="w-5 h-5" />;
      case 'new_application': return <FileText className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-red-500';
      case 'approval_request': return 'text-orange-500';
      case 'new_message': return 'text-blue-500';
      case 'new_application': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (loading && notifications.length === 0) {
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
              <div className="p-3 bg-blue-100 rounded-lg">
                {stats?.unread && stats.unread > 0 ? (
                  <BellRing className="w-6 h-6 text-blue-600" />
                ) : (
                  <Bell className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
                <p className="text-sm text-gray-500">
                  {stats?.unread && stats.unread > 0 
                    ? `${stats.unread} unread notification(s)` 
                    : 'All notifications read'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {stats?.unread && stats.unread > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark All Read
                </Button>
              )}
              <Button
                onClick={() => {
                  fetchNotifications();
                  fetchUnreadNotifications();
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
            <StatCard title="Total" value={stats.total} icon={Bell} />
            <StatCard title="Unread" value={stats.unread} icon={BellRing} color="blue" />
            <StatCard title="High Priority" value={stats.high_priority} icon={AlertTriangle} color="orange" />
            <StatCard title="Critical" value={stats.critical} icon={AlertTriangle} color="red" />
          </div>
        )}

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {typeFilter === 'all' ? 'All Types' : typeFilter}
                    <X className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setTypeFilter('all')}>All Types</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('warning')}>Warnings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('approval_request')}>Approval Requests</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('new_message')}>New Messages</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('new_application')}>New Applications</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter}
                    <X className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('unread')}>Unread</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('read')}>Read</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <Card className="mb-6 border-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-600">Unread Notifications</CardTitle>
              <CardDescription>
                {unreadNotifications.length} new notification(s) requiring your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unreadNotifications.map((notif) => (
                  <NotificationCard
                    key={notif.id}
                    notification={notif}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    getPriorityColor={getPriorityColor}
                    getTypeIcon={getTypeIcon}
                    getTypeColor={getTypeColor}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>
              {filteredNotifications.length} notification(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredNotifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No notifications found</p>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notif) => (
                  <NotificationCard
                    key={notif.id}
                    notification={notif}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    getPriorityColor={getPriorityColor}
                    getTypeIcon={getTypeIcon}
                    getTypeColor={getTypeColor}
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
    orange: 'bg-orange-500',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color] || 'bg-gray-500'} bg-opacity-10`}>
            <Icon className={`w-5 h-5 text-${color}-500`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NotificationCard = ({ 
  notification, 
  onMarkAsRead, 
  onDelete,
  getPriorityColor,
  getTypeIcon,
  getTypeColor 
}: any) => {
  return (
    <div className={`p-4 border rounded-lg ${notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${notification.status === 'unread' ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <div className={getTypeColor(notification.type)}>
            {getTypeIcon(notification.type)}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{notification.title}</h4>
                {notification.priority !== 'low' && (
                  <Badge className={`text-white ${getPriorityColor(notification.priority)}`}>
                    {notification.priority}
                  </Badge>
                )}
                {notification.status === 'unread' && (
                  <Badge className="bg-blue-500">New</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(notification.created_at).toLocaleString()}
                </div>
                {notification.read_at && (
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Read {new Date(notification.read_at).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4 flex items-center gap-2">
              {notification.action_url && (
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <a href={notification.action_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {notification.status === 'unread' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onMarkAsRead(notification.id)}
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(notification.id)}
                title="Delete"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
