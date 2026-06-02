<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Contact;
use App\Models\WebsiteVisitor;
use App\Models\DashboardAnalytics;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class RunDashboardAgent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dashboard:agent {action=all}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run the unmanned agent for dashboard monitoring and management';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $action = $this->argument('action');

        $this->info('Starting Dashboard Agent...');
        $this->info('Action: ' . $action);
        $this->info('Time: ' . now()->format('Y-m-d H:i:s'));

        try {
            switch ($action) {
                case 'all':
                    $this->runAllTasks();
                    break;
                case 'monitor-contacts':
                    $this->monitorContacts();
                    break;
                case 'monitor-visitors':
                    $this->monitorVisitors();
                    break;
                case 'generate-analytics':
                    $this->generateDailyAnalytics();
                    break;
                case 'cleanup':
                    $this->cleanupOldData();
                    break;
                case 'send-reports':
                    $this->sendDailyReports();
                    break;
                default:
                    $this->error('Invalid action. Available: all, monitor-contacts, monitor-visitors, generate-analytics, cleanup, send-reports');
                    return 1;
            }

            $this->info('Dashboard Agent completed successfully.');
            return 0;
        } catch (\Exception $e) {
            $this->error('Error running Dashboard Agent: ' . $e->getMessage());
            Log::error('Dashboard Agent error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return 1;
        }
    }

    /**
     * Run all monitoring and management tasks
     */
    private function runAllTasks(): void
    {
        $this->info('Running all tasks...');

        $this->monitorContacts();
        $this->monitorVisitors();
        $this->generateDailyAnalytics();
        $this->cleanupOldData();
        $this->sendDailyReports();

        $this->info('All tasks completed.');
    }

    /**
     * Monitor contacts for pending status and send alerts
     */
    private function monitorContacts(): void
    {
        $this->info('Monitoring contacts...');

        $pendingContacts = Contact::where('status', 'pending')
            ->where('created_at', '<=', now()->subHours(24))
            ->count();

        if ($pendingContacts > 0) {
            $this->warn("Found {$pendingContacts} pending contacts older than 24 hours");

            // Log warning
            Log::warning('Pending contacts overdue', [
                'count' => $pendingContacts,
                'timestamp' => now()
            ]);

            // Send email notification to admins
            $this->sendPendingContactAlert($pendingContacts);
        }

        // Check for contacts pending more than 48 hours
        $criticalContacts = Contact::where('status', 'pending')
            ->where('created_at', '<=', now()->subHours(48))
            ->count();

        if ($criticalContacts > 0) {
            $this->error("Found {$criticalContacts} critical contacts pending more than 48 hours");

            // Log critical alert
            Log::critical('Critical pending contacts', [
                'count' => $criticalContacts,
                'timestamp' => now()
            ]);
        }

        $this->info('Contact monitoring completed.');
    }

    /**
     * Monitor visitor activity and detect anomalies
     */
    private function monitorVisitors(): void
    {
        $this->info('Monitoring visitors...');

        // Get today's visitor statistics
        $todayVisitors = WebsiteVisitor::whereDate('first_visit', today())->count();
        $yesterdayVisitors = WebsiteVisitor::whereDate('first_visit', now()->subDay())->count();

        // Calculate growth rate
        if ($yesterdayVisitors > 0) {
            $growthRate = (($todayVisitors - $yesterdayVisitors) / $yesterdayVisitors) * 100;

            // Alert if significant drop (more than 50% decrease)
            if ($growthRate < -50) {
                $this->warn("Significant visitor drop detected: {$growthRate}%");
                Log::warning('Significant visitor drop', [
                    'today' => $todayVisitors,
                    'yesterday' => $yesterdayVisitors,
                    'growth_rate' => $growthRate,
                    'timestamp' => now()
                ]);
            }

            // Alert if unusual spike (more than 200% increase - could be bot attack)
            if ($growthRate > 200) {
                $this->warn("Unusual visitor spike detected: {$growthRate}%");
                Log::warning('Unusual visitor spike', [
                    'today' => $todayVisitors,
                    'yesterday' => $yesterdayVisitors,
                    'growth_rate' => $growthRate,
                    'timestamp' => now()
                ]);
            }
        }

        // Monitor for suspicious activity (same IP visiting many times in short period)
        $suspiciousIps = DB::table('website_visitors')
            ->select('ip_address', DB::raw('COUNT(*) as visit_count'))
            ->where('first_visit', '>=', now()->subHours(1))
            ->groupBy('ip_address')
            ->having('visit_count', '>', 10)
            ->get();

        if ($suspiciousIps->count() > 0) {
            $this->warn("Found {$suspiciousIps->count()} suspicious IP addresses");
            foreach ($suspiciousIps as $ip) {
                $this->warn("IP: {$ip->ip_address} - Visits: {$ip->visit_count}");
                Log::warning('Suspicious IP activity', [
                    'ip' => $ip->ip_address,
                    'visit_count' => $ip->visit_count,
                    'timestamp' => now()
                ]);
            }
        }

        $this->info('Visitor monitoring completed.');
    }

    /**
     * Generate daily analytics data
     */
    private function generateDailyAnalytics(): void
    {
        $this->info('Generating daily analytics...');

        $today = today();

        // Check if analytics already exist for today
        $existingAnalytics = DashboardAnalytics::where('date', $today)->first();

        if ($existingAnalytics) {
            $this->info('Analytics already exist for today. Updating...');
            $analytics = $existingAnalytics;
        } else {
            $this->info('Creating new analytics entry for today...');
            $analytics = new DashboardAnalytics(['date' => $today]);
        }

        // Calculate visitor statistics
        $totalVisitors = WebsiteVisitor::whereDate('first_visit', $today)->count();
        $uniqueVisitors = WebsiteVisitor::whereDate('first_visit', $today)
            ->where('is_returning_visitor', false)->count();
        $pageViews = WebsiteVisitor::whereDate('first_visit', $today)
            ->sum('page_views');
        $avgTimeOnSite = WebsiteVisitor::whereDate('first_visit', $today)
            ->avg('time_on_site') ?? 0;

        // Calculate contact statistics
        $newContacts = Contact::whereDate('created_at', $today)->count();
        $pendingContacts = Contact::where('status', 'pending')->count();
        $resolvedContacts = Contact::where('status', 'replied')->count();

        // Get top pages
        $topPages = DB::table('website_visitors')
            ->select('landing_page', DB::raw('COUNT(*) as count'))
            ->whereDate('first_visit', $today)
            ->whereNotNull('landing_page')
            ->groupBy('landing_page')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'page' => $item->landing_page,
                    'count' => $item->count
                ];
            });

        // Get top referrers
        $topReferrers = DB::table('website_visitors')
            ->select('referrer', DB::raw('COUNT(*) as count'))
            ->whereDate('first_visit', $today)
            ->whereNotNull('referrer')
            ->where('referrer', '!=', '')
            ->groupBy('referrer')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'referrer' => $item->referrer,
                    'count' => $item->count
                ];
            });

        // Get visitor device distribution
        $visitorDevices = DB::table('website_visitors')
            ->select('device_type', DB::raw('COUNT(*) as count'))
            ->whereDate('first_visit', $today)
            ->groupBy('device_type')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->device_type => $item->count];
            });

        // Get visitor locations
        $visitorLocations = DB::table('website_visitors')
            ->select('country', DB::raw('COUNT(*) as count'))
            ->whereDate('first_visit', $today)
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'country' => $item->country,
                    'count' => $item->count
                ];
            });

        // Calculate bounce rate (visitors with 1 page view / total visitors)
        $bounceRate = $totalVisitors > 0
            ? (WebsiteVisitor::whereDate('first_visit', $today)->where('page_views', 1)->count() / $totalVisitors) * 100
            : 0;

        // Update analytics
        $analytics->update([
            'total_visitors' => $totalVisitors,
            'unique_visitors' => $uniqueVisitors,
            'page_views' => $pageViews,
            'new_contacts' => $newContacts,
            'pending_contacts' => $pendingContacts,
            'resolved_contacts' => $resolvedContacts,
            'chatbot_interactions' => 0, // Will be implemented later
            'avg_time_on_site' => $avgTimeOnSite,
            'bounce_rate' => $bounceRate,
            'top_pages' => $topPages,
            'top_referrers' => $topReferrers,
            'visitor_devices' => $visitorDevices,
            'visitor_locations' => $visitorLocations,
        ]);

        $this->info('Daily analytics generated successfully.');
    }

    /**
     * Clean up old data to prevent database bloat
     */
    private function cleanupOldData(): void
    {
        $this->info('Cleaning up old data...');

        // Delete visitor data older than 90 days
        $deletedVisitors = WebsiteVisitor::where('first_visit', '<', now()->subDays(90))->delete();
        $this->info("Deleted {$deletedVisitors} old visitor records");

        // Delete old analytics data older than 1 year
        $deletedAnalytics = DashboardAnalytics::where('date', '<', now()->subYear())->delete();
        $this->info("Deleted {$deletedAnalytics} old analytics records");

        // Archive soft-deleted contacts older than 180 days
        $deletedContacts = Contact::onlyTrashed()
            ->where('deleted_at', '<', now()->subDays(180))
            ->forceDelete();
        $this->info("Permanently deleted {$deletedContacts} archived contact records");

        $this->info('Data cleanup completed.');
    }

    /**
     * Send daily reports to administrators
     */
    private function sendDailyReports(): void
    {
        $this->info('Sending daily reports...');

        try {
            $today = today();
            $analytics = DashboardAnalytics::where('date', $today)->first();

            if (!$analytics) {
                $this->warn('No analytics data available for today');
                return;
            }

            $reportData = [
                'date' => $today->format('Y-m-d'),
                'total_visitors' => $analytics->total_visitors,
                'unique_visitors' => $analytics->unique_visitors,
                'page_views' => $analytics->page_views,
                'new_contacts' => $analytics->new_contacts,
                'pending_contacts' => $analytics->pending_contacts,
                'avg_time_on_site' => round($analytics->avg_time_on_site / 60, 2),
                'bounce_rate' => round($analytics->bounce_rate, 2),
            ];

            // Get admin users
            $adminUsers = User::where('role', 'admin')->get();

            foreach ($adminUsers as $admin) {
                try {
                    Mail::raw(
                        $this->formatDailyReportEmail($reportData),
                        function ($message) use ($admin, $today) {
                            $message->to($admin->email)
                                   ->subject('Daily Dashboard Report - ' . $today->format('Y-m-d'));
                        }
                    );
                    $this->info("Daily report sent to: {$admin->email}");
                } catch (\Exception $e) {
                    $this->error("Failed to send report to {$admin->email}: " . $e->getMessage());
                }
            }

            $this->info('Daily reports sent successfully.');
        } catch (\Exception $e) {
            $this->error('Error sending daily reports: ' . $e->getMessage());
            Log::error('Daily report error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Send alert for pending contacts
     */
    private function sendPendingContactAlert(int $count): void
    {
        try {
            $adminUsers = User::where('role', 'admin')->get();

            foreach ($adminUsers as $admin) {
                try {
                    Mail::raw(
                        "ALERT: {$count} contacts pending response for more than 24 hours.\n\n" .
                        "Please check the dashboard and respond to pending contacts.\n\n" .
                        "Dashboard: " . config('app.url') . "/admin/dashboard",
                        function ($message) use ($admin) {
                            $message->to($admin->email)
                                   ->subject('Urgent: Pending Contacts Alert');
                        }
                    );
                } catch (\Exception $e) {
                    $this->error("Failed to send alert to {$admin->email}: " . $e->getMessage());
                }
            }
        } catch (\Exception $e) {
            $this->error('Error sending pending contact alert: ' . $e->getMessage());
        }
    }

    /**
     * Format daily report email content
     */
    private function formatDailyReportEmail(array $data): string
    {
        return "
DAILY DASHBOARD REPORT
======================
Date: {$data['date']}
Time: " . now()->format('H:i:s') . "

VISITORS
--------
Total Visitors: {$data['total_visitors']}
Unique Visitors: {$data['unique_visitors']}
Page Views: {$data['page_views']}
Avg Time on Site: {$data['avg_time_on_site']} minutes
Bounce Rate: {$data['bounce_rate']}%

CONTACTS
--------
New Contacts: {$data['new_contacts']}
Pending Contacts: {$data['pending_contacts']}

This is an automated report generated by the Dashboard Agent.
";
    }
}
