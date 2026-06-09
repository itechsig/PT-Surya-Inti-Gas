import { useState, useEffect } from 'react';
import {
  Bot,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Users,
  FileText,
  Eye,
  RefreshCw,
  Play
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api';

interface AIAgentStatus {
  status: string;
  last_activity: string;
  pending_recommendations: number;
  recent_activities: number;
  uptime: string;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
}

export const AIAgentDashboard = () => {
  const [agentStatus, setAgentStatus] = useState<AIAgentStatus | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchAgentStatus();
    fetchRecommendations();
  }, []);

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAgentStatus();
      fetchRecommendations();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AI_AGENT_STATUS));
      if (response.ok) {
        const data = await response.json();
        setAgentStatus(data.data);
      }
    } catch (error) {
      console.error('Error fetching AI agent status:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AI_RECOMMENDATIONS));
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.data.data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const runMonitoring = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(API_ENDPOINTS.AI_MONITORING), {
        method: 'POST',
      });
      if (response.ok) {
        await fetchAgentStatus();
        await fetchRecommendations();
      }
    } catch (error) {
      console.error('Error running monitoring:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading && !agentStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AI Agent Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Agent Monitoring Center</h1>
                <p className="text-sm text-gray-500">Human-in-the-Loop AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={runMonitoring}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {loading ? 'Running...' : 'Run Monitoring'}
              </Button>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto-refreshing' : 'Enable Auto-refresh'}
              </Button>
              <Button
                variant="outline"
                onClick={fetchAgentStatus}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Agent Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${agentStatus?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-2xl font-bold">{agentStatus?.status || 'Unknown'}</span>
                </div>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{agentStatus?.pending_recommendations || 0}</span>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{agentStatus?.recent_activities || 0}</span>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{agentStatus?.uptime || '0%'}</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recommendations">
              Recommendations
              {agentStatus && agentStatus.pending_recommendations > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {agentStatus.pending_recommendations}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="blocked">Blocked Users</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Recommendations</CardTitle>
                  <CardDescription>Latest AI agent recommendations requiring your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  {recommendations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No pending recommendations</p>
                  ) : (
                    <div className="space-y-3">
                      {recommendations.slice(0, 5).map((rec) => (
                        <div key={rec.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(rec.priority)} mt-2`}></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{rec.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{rec.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={`text-white ${getPriorityColor(rec.priority)}`}>
                                {rec.priority}
                              </Badge>
                              <Badge className={`text-white ${getStatusColor(rec.status)}`}>
                                {rec.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Agent Capabilities</CardTitle>
                  <CardDescription>What the AI agent can monitor and analyze</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Contact Message Monitoring</h4>
                        <p className="text-xs text-gray-500">Detects spam and categorizes important messages</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Career Application Analysis</h4>
                        <p className="text-xs text-gray-500">Scores and summarizes job applications</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Visitor Behavior Tracking</h4>
                        <p className="text-xs text-gray-500">Identifies suspicious activities and bots</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">User Risk Assessment</h4>
                        <p className="text-xs text-gray-500">Evaluates user behavior for potential threats</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <RecommendationsPanel recommendations={recommendations} />
          </TabsContent>

          <TabsContent value="monitoring">
            <MonitoringPanel />
          </TabsContent>

          <TabsContent value="blocked">
            <BlockedUsersPanel />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="settings">
            <AIAgentSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Sub-components
const RecommendationsPanel = ({ recommendations }: { recommendations: Recommendation[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recommendations</CardTitle>
        <CardDescription>Review and approve or reject AI agent recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recommendations found</p>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`text-white ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </Badge>
                    <Badge className={`text-white ${getStatusColor(rec.status)}`}>
                      {rec.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">View Details</Button>
                  {rec.status === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                      <Button size="sm" variant="destructive">Reject</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface VisitorActivity {
  id: number;
  activity_type: string;
  source: string;
  source_id: number;
  source_type: string;
  description: string;
  metadata: any;
  status: string;
  executed_at: string;
  created_at: string;
}

const MonitoringPanel = () => {
  const [visitorActivities, setVisitorActivities] = useState<VisitorActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitorActivities();
    
    // Auto-refresh visitor activities every 5 seconds
    const interval = setInterval(() => {
      fetchVisitorActivities();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchVisitorActivities = async () => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.AI_MONITOR_VISITORS));
      if (response.ok) {
        const data = await response.json();
        setVisitorActivities(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching visitor activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      case 'info': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Real-time Visitor Activities</CardTitle>
          <CardDescription>Live monitoring of visitor entry and behavior</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : visitorActivities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent visitor activities detected. Access the website to trigger visitor tracking.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {visitorActivities.map((activity) => (
                <div key={activity.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`text-white ${getStatusColor(activity.status)}`}>
                          {activity.activity_type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(activity.created_at).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="font-medium">{activity.description}</h4>
                      {activity.metadata && typeof activity.metadata === 'object' && (
                        <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                          {activity.metadata.ip_address && <div><span className="font-medium">IP:</span> {activity.metadata.ip_address}</div>}
                          {activity.metadata.browser && <div><span className="font-medium">Browser:</span> {activity.metadata.browser}</div>}
                          {activity.metadata.os && <div><span className="font-medium">OS:</span> {activity.metadata.os}</div>}
                          {activity.metadata.device_type && <div><span className="font-medium">Device:</span> {activity.metadata.device_type}</div>}
                          {activity.metadata.landing_page && <div><span className="font-medium">Page:</span> {activity.metadata.landing_page}</div>}
                          {activity.metadata.country && <div><span className="font-medium">Country:</span> {activity.metadata.country}</div>}
                        </div>
                      )}
                    </div>
                    <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monitoring Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Contact Messages</span>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Career Applications</span>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Visitor Behavior</span>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">User Risk Assessment</span>
                <Badge className="bg-green-500">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Run Specific Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Monitor Contact Messages
              </Button>
              <Button className="w-full" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Monitor Career Applications
              </Button>
              <Button className="w-full" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Monitor Visitor Behavior
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const BlockedUsersPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocked Users</CardTitle>
        <CardDescription>Manage users and IPs blocked by AI recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-center py-8">No blocked users found</p>
      </CardContent>
    </Card>
  );
};

const NotificationCenter = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Center</CardTitle>
        <CardDescription>Real-time notifications from AI agent</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-center py-8">No new notifications</p>
      </CardContent>
    </Card>
  );
};

const AIAgentSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Agent Settings</CardTitle>
        <CardDescription>Configure AI agent behavior and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Monitoring Interval</label>
            <select className="w-full mt-2 p-2 border rounded-lg">
              <option>Every 5 minutes</option>
              <option>Every 15 minutes</option>
              <option>Every 30 minutes</option>
              <option>Every hour</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Spam Detection Threshold</label>
            <input
              type="range"
              className="w-full mt-2"
              min="0"
              max="100"
              defaultValue="70"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Email Notifications</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Auto-block Critical Threats</label>
            <input type="checkbox" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions (move to utils)
function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'approved': return 'bg-green-500';
    case 'rejected': return 'bg-red-500';
    case 'completed': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
}
