import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MoreVertical,
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
import { getApiUrl, API_ENDPOINTS } from '../../../config/api';

interface CareerApplication {
  id: number;
  nama: string;
  email: string;
  no_hp: string | null;
  posisi: string;
  cover_letter: string | null;
  cv_path: string | null;
  status: string;
  ai_summary: string | null;
  ai_score: number | null;
  ai_insights: string[] | null;
  notes: string | null;
  created_at: string;
}

interface ApplicationStats {
  total: number;
  pending: number;
  reviewed: number;
  interview: number;
  rejected: number;
  hired: number;
  high_quality: number;
}

export const CareerApplicationsManagement = () => {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);

  useEffect(() => {
    fetchApplications();
    fetchStatistics();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let url = getApiUrl(API_ENDPOINTS.CAREER_APPLICATIONS);
      
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.CAREER_APPLICATIONS_STATISTICS));
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const updateStatus = async (applicationId: number, newStatus: string) => {
    try {
      const response = await fetch(
        getApiUrl(`${API_ENDPOINTS.CAREER_APPLICATIONS}/${applicationId}`),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        fetchApplications();
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredApplications = applications.filter(app =>
    app.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.posisi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'reviewed': return 'bg-blue-500';
      case 'interview': return 'bg-purple-500';
      case 'rejected': return 'bg-red-500';
      case 'hired': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  if (loading && applications.length === 0) {
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
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Career Applications</h1>
                <p className="text-sm text-gray-500">Manage job applications with AI assistance</p>
              </div>
            </div>
            <Button
              onClick={() => {
                fetchApplications();
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <StatCard title="Total" value={stats.total} icon={Briefcase} />
            <StatCard title="Pending" value={stats.pending} icon={Clock} color="yellow" />
            <StatCard title="Reviewed" value={stats.reviewed} icon={Eye} color="blue" />
            <StatCard title="Interview" value={stats.interview} icon={User} color="purple" />
            <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="red" />
            <StatCard title="Hired" value={stats.hired} icon={CheckCircle} color="green" />
          </div>
        )}

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('reviewed')}>Reviewed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('interview')}>Interview</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>Rejected</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('hired')}>Hired</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              {filteredApplications.length} application(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredApplications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No applications found</p>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedApplication(app)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{app.nama}</h4>
                          <Badge className={`text-white ${getStatusColor(app.status)}`}>
                            {app.status}
                          </Badge>
                          {app.ai_score !== null && (
                            <Badge className={`text-white ${getScoreColor(app.ai_score)}`}>
                              <Star className="w-3 h-3 mr-1" />
                              {app.ai_score}%
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {app.email}
                          </div>
                          {app.no_hp && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {app.no_hp}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(app.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Position:</span> {app.posisi}
                        </div>
                        {app.ai_summary && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <span className="font-medium text-blue-700">AI Summary:</span> {app.ai_summary}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSelectedApplication(app)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {app.status === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => updateStatus(app.id, 'reviewed')}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Mark as Reviewed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(app.id, 'interview')}>
                                  <User className="w-4 h-4 mr-2" />
                                  Schedule Interview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(app.id, 'rejected')}>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {app.status === 'reviewed' && (
                              <>
                                <DropdownMenuItem onClick={() => updateStatus(app.id, 'interview')}>
                                  <User className="w-4 h-4 mr-2" />
                                  Schedule Interview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(app.id, 'hired')}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Hire
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(app.id, 'rejected')}>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {app.status === 'interview' && (
                              <>
                                <DropdownMenuItem onClick={() => updateStatus(app.id, 'hired')}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Hire
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(app.id, 'rejected')}>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Details Modal */}
        {selectedApplication && (
          <ApplicationDetailsModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onUpdateStatus={updateStatus}
          />
        )}
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
          <div className={`p-3 rounded-lg ${colorClasses[color] || 'bg-gray-500'} bg-opacity-10`}>
            <Icon className={`w-5 h-5 text-${color}-500`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ApplicationDetailsModal = ({ application, onClose, onUpdateStatus }: any) => {
  const [notes, setNotes] = useState(application.notes || '');

  const handleSaveNotes = async () => {
    try {
      const response = await fetch(
        getApiUrl(`${API_ENDPOINTS.CAREER_APPLICATIONS}/${application.id}`),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notes }),
        }
      );
      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Application Details</h2>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Applicant Information</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Name:</span> {application.nama}</div>
              <div><span className="font-medium">Email:</span> {application.email}</div>
              {application.no_hp && <div><span className="font-medium">Phone:</span> {application.no_hp}</div>}
              <div><span className="font-medium">Applied:</span> {new Date(application.created_at).toLocaleString()}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Position</h3>
            <p className="text-sm">{application.posisi}</p>
          </div>

          {application.cover_letter && (
            <div>
              <h3 className="font-semibold mb-2">Cover Letter</h3>
              <p className="text-sm bg-gray-50 p-3 rounded">{application.cover_letter}</p>
            </div>
          )}

          {application.ai_summary && (
            <div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <div className="bg-blue-50 p-3 rounded text-sm space-y-2">
                <p><span className="font-medium">Summary:</span> {application.ai_summary}</p>
                {application.ai_score !== null && (
                  <p><span className="font-medium">Relevance Score:</span> {application.ai_score}%</p>
                )}
                {application.ai_insights && application.ai_insights.length > 0 && (
                  <div>
                    <span className="font-medium">Insights:</span>
                    <ul className="list-disc list-inside mt-1">
                      {application.ai_insights.map((insight: string, index: number) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Admin Notes</h3>
            <textarea
              className="w-full p-2 border rounded-lg"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes here..."
            />
            <Button onClick={handleSaveNotes} className="mt-2" size="sm">
              Save Notes
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Update Status</h3>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant={application.status === 'reviewed' ? 'default' : 'outline'}
                onClick={() => onUpdateStatus(application.id, 'reviewed')}
              >
                Mark as Reviewed
              </Button>
              <Button
                size="sm"
                variant={application.status === 'interview' ? 'default' : 'outline'}
                onClick={() => onUpdateStatus(application.id, 'interview')}
              >
                Schedule Interview
              </Button>
              <Button
                size="sm"
                variant={application.status === 'hired' ? 'default' : 'outline'}
                className={application.status === 'hired' ? 'bg-green-600' : ''}
                onClick={() => onUpdateStatus(application.id, 'hired')}
              >
                Hire
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onUpdateStatus(application.id, 'rejected')}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
