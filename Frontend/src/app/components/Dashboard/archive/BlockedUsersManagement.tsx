import { useState, useEffect } from 'react';
import { 
  Shield, 
  UserX, 
  UserCheck, 
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  Ban,
  Unlock,
  ChevronDown
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api';

interface BlockedUser {
  id: number;
  blockable_type: string;
  blockable_value: string;
  reason: string;
  block_type: string;
  blocked_at: string;
  is_active: boolean;
  warning_count: number;
}

interface BlockedStats {
  total: number;
  active: number;
  inactive: number;
  by_ip: number;
  by_email: number;
  permanent: number;
  temporary: number;
}

export const BlockedUsersManagement = () => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [stats, setStats] = useState<BlockedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [currentIP, setCurrentIP] = useState<string>('');
  const [blockForm, setBlockForm] = useState({
    type: 'ip_address',
    value: '',
    reason: '',
    blockType: 'permanent'
  });

  useEffect(() => {
    fetchBlockedUsers();
    fetchStatistics();
    fetchCurrentIP();
  }, [typeFilter]);

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      let url = getApiUrl(API_ENDPOINTS.BLOCKED_USERS);
      
      if (typeFilter !== 'all') {
        url += `?type=${typeFilter}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBlockedUsers(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.BLOCKED_USERS_STATISTICS));
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchCurrentIP = async () => {
    try {
      const response = await fetch(getApiUrl('/api/v1/visitor/current-ip'));
      if (response.ok) {
        const data = await response.json();
        setCurrentIP(data.ip);
      }
    } catch (error) {
      console.error('Error fetching current IP:', error);
    }
  };

  const handleBlockUser = async () => {
    try {
      // Validate form data before sending
      if (!blockForm.value || !blockForm.reason) {
        alert('Please fill in all required fields');
        return;
      }

      // Prevent blocking own IP
      if (blockForm.type === 'ip_address' && blockForm.value === currentIP) {
        alert('⚠️ DANGER: You are about to block your own IP address! This will prevent you from accessing the website.');
        const confirmBlock = confirm('Are you absolutely sure you want to block your own IP address?');
        if (!confirmBlock) {
          return;
        }
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.BLOCKED_USERS), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockable_type: blockForm.type,
          blockable_value: blockForm.value,
          reason: blockForm.reason,
          block_type: blockForm.blockType,
        }),
      });

      if (response.ok) {
        setShowBlockDialog(false);
        setBlockForm({ type: 'ip_address', value: '', reason: '', blockType: 'permanent' });
        fetchBlockedUsers();
        fetchStatistics();
      } else {
        const errorData = await response.json();
        alert(`Failed to block user: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Failed to block user. Please try again.');
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      const response = await fetch(
        getApiUrl(`${API_ENDPOINTS.BLOCKED_USER_UNBLOCK}/${userId}/unblock`),
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        fetchBlockedUsers();
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const filteredUsers = blockedUsers.filter(user =>
    user.blockable_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && blockedUsers.length === 0) {
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
              <div className="p-3 bg-red-100 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Blocked Users Management</h1>
                <p className="text-sm text-gray-500">Manage users and IPs blocked by AI recommendations</p>
              </div>
            </div>
            <Button
              onClick={() => setShowBlockDialog(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <Ban className="w-4 h-4" />
              Block User
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard title="Total" value={stats.total} icon={Shield} />
            <StatCard title="Active" value={stats.active} icon={UserX} color="red" />
            <StatCard title="Inactive" value={stats.inactive} icon={UserCheck} color="green" />
            <StatCard title="By IP" value={stats.by_ip} icon={AlertTriangle} color="blue" />
            <StatCard title="By Email" value={stats.by_email} icon={Shield} color="purple" />
            <StatCard title="Permanent" value={stats.permanent} icon={Ban} color="orange" />
          </div>
        )}

        {/* Current IP Warning */}
        {currentIP && (
          <Card className="mb-6 border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Your Current IP Address</h4>
                  <p className="text-blue-700">
                    {currentIP} - Be careful not to block your own IP address
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by IP, email, or reason..."
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
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setTypeFilter('all')}>All Types</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('ip_address')}>IP Addresses</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('email')}>Email Addresses</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('user_id')}>User IDs</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Blocked Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Blocked Users</CardTitle>
            <CardDescription>
              {filteredUsers.length} user(s) blocked
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No blocked users found</p>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-4 border rounded-lg ${!user.is_active ? 'bg-gray-50 opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{user.blockable_value}</h4>
                          <Badge className={`text-white ${user.is_active ? 'bg-red-500' : 'bg-gray-500'}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge className="bg-blue-500">
                            {user.blockable_type}
                          </Badge>
                          <Badge className={user.block_type === 'permanent' ? 'bg-orange-500' : 'bg-green-500'}>
                            {user.block_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.reason}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(user.blocked_at).toLocaleString()}
                          </div>
                          {user.warning_count > 0 && (
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4" />
                              {user.warning_count} warning(s)
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        {user.is_active ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnblockUser(user.id)}
                            className="flex items-center gap-2"
                          >
                            <Unlock className="w-4 h-4" />
                            Unblock
                          </Button>
                        ) : (
                          <Badge className="bg-gray-500">Unblocked</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Block User Dialog */}
        <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Block User</DialogTitle>
              <DialogDescription>
                Block a user by IP address, email, or user ID. This action will prevent them from accessing the website.
                {currentIP && blockForm.type === 'ip_address' && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    ⚠️ Your current IP: <strong>{currentIP}</strong> - Do not block your own IP address!
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Block Type</label>
                <select
                  className="w-full mt-2 p-2 border rounded-lg"
                  value={blockForm.type}
                  onChange={(e) => setBlockForm({ ...blockForm, type: e.target.value })}
                >
                  <option value="ip_address">IP Address</option>
                  <option value="email">Email Address</option>
                  <option value="user_id">User ID</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Value</label>
                <Input
                  className="mt-2"
                  placeholder={blockForm.type === 'ip_address' ? '192.168.1.1' : blockForm.type === 'email' ? 'user@example.com' : '123'}
                  value={blockForm.value}
                  onChange={(e) => setBlockForm({ ...blockForm, value: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Reason</label>
                <Input
                  className="mt-2"
                  placeholder="Reason for blocking..."
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Block Type</label>
                <select
                  className="w-full mt-2 p-2 border rounded-lg"
                  value={blockForm.blockType}
                  onChange={(e) => setBlockForm({ ...blockForm, blockType: e.target.value })}
                >
                  <option value="permanent">Permanent</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleBlockUser} className="bg-red-600 hover:bg-red-700">
                Block User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

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
