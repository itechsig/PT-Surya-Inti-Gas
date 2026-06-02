<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\WebsiteVisitor;
use App\Models\DashboardAnalytics;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard overview data
     */
    public function overview(Request $request): JsonResponse
    {
        try {
            $dateRange = $request->input('date_range', 'today');
            $startDate = $this->getStartDate($dateRange);
            $endDate = now();

            // Get contact statistics
            $contacts = Contact::whereBetween('created_at', [$startDate, $endDate]);
            $totalContacts = $contacts->count();
            $pendingContacts = Contact::where('status', 'pending')->count();
            $newContacts = $contacts->where('created_at', '>=', $startDate)->count();

            // Get visitor statistics
            $visitors = WebsiteVisitor::whereBetween('first_visit', [$startDate, $endDate]);
            $totalVisitors = $visitors->count();
            $uniqueVisitors = $visitors->where('is_returning_visitor', false)->count();
            $pageViews = WebsiteVisitor::whereBetween('first_visit', [$startDate, $endDate])
                ->sum('page_views');
            $avgTimeOnSite = WebsiteVisitor::whereBetween('first_visit', [$startDate, $endDate])
                ->avg('time_on_site') ?? 0;

            // Get device distribution
            $deviceStats = WebsiteVisitor::whereBetween('first_visit', [$startDate, $endDate])
                ->selectRaw('device_type, COUNT(*) as count')
                ->groupBy('device_type')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->device_type => $item->count];
                });

            // Get recent contacts
            $recentContacts = Contact::latest()
                ->limit(5)
                ->get(['id', 'nama', 'email', 'subject', 'pesan', 'status', 'created_at']);

            // Get recent visitors
            $recentVisitors = WebsiteVisitor::latest('last_visit')
                ->limit(5)
                ->get(['id', 'ip_address', 'browser', 'os', 'device_type', 'first_visit', 'last_visit']);

            return response()->json([
                'success' => true,
                'data' => [
                    'contacts' => [
                        'total' => $totalContacts,
                        'pending' => $pendingContacts,
                        'new' => $newContacts,
                    ],
                    'visitors' => [
                        'total' => $totalVisitors,
                        'unique' => $uniqueVisitors,
                        'page_views' => $pageViews,
                        'avg_time_on_site' => round($avgTimeOnSite / 60, 2), // in minutes
                    ],
                    'devices' => $deviceStats,
                    'recent_contacts' => $recentContacts,
                    'recent_visitors' => $recentVisitors,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard overview error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data dashboard'
            ], 500);
        }
    }

    /**
     * Get all contacts with filtering and pagination
     */
    public function contacts(Request $request): JsonResponse
    {
        try {
            $query = Contact::with('repliedBy:id,name');

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            // Search by name or email
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Date range
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('created_at', [
                    $request->input('start_date'),
                    $request->input('end_date')
                ]);
            }

            // Pagination
            $perPage = $request->input('per_page', 10);
            $contacts = $query->latest()->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $contacts
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard contacts error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data kontak'
            ], 500);
        }
    }

    /**
     * Get single contact details
     */
    public function contactDetails(string|int $id): JsonResponse
    {
        try {
            $contact = Contact::with('repliedBy:id,name')->findOrFail($id);

            // Update status to read if it was pending
            if ($contact->status === 'pending') {
                $contact->update(['status' => 'read']);
            }

            return response()->json([
                'success' => true,
                'data' => $contact
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard contact details error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Kontak tidak ditemukan'
            ], 404);
        }
    }

    /**
     * Update contact status and notes
     */
    public function updateContact(Request $request, string|int $id): JsonResponse
    {
        try {
            $contact = Contact::findOrFail($id);

            $contact->update([
                'status' => $request->input('status', $contact->status),
                'notes' => $request->input('notes', $contact->notes),
                'replied_at' => $request->input('status') === 'replied' ? now() : $contact->replied_at,
                'replied_by' => $request->input('status') === 'replied' ? (Auth::check() ? Auth::id() : $contact->replied_by) : $contact->replied_by,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Kontak berhasil diperbarui',
                'data' => $contact
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard update contact error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui kontak'
            ], 500);
        }
    }

    /**
     * Get visitor analytics
     */
    public function visitors(Request $request): JsonResponse
    {
        try {
            $dateRange = $request->input('date_range', 'today');
            $startDate = $this->getStartDate($dateRange);
            $endDate = now();

            $query = WebsiteVisitor::whereBetween('first_visit', [$startDate, $endDate]);

            // Filter by device type
            if ($request->has('device_type')) {
                $query->where('device_type', $request->input('device_type'));
            }

            // Search by IP or session
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('ip_address', 'like', "%{$search}%")
                      ->orWhere('session_id', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = $request->input('per_page', 20);
            $visitors = $query->latest('first_visit')->paginate($perPage);

            // Get aggregated stats
            $stats = [
                'total' => $query->count(),
                'unique' => $query->where('is_returning_visitor', false)->count(),
                'returning' => $query->where('is_returning_visitor', true)->count(),
                'desktop' => $query->where('device_type', 'desktop')->count(),
                'mobile' => $query->where('device_type', 'mobile')->count(),
                'tablet' => $query->where('device_type', 'tablet')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'visitors' => $visitors,
                    'stats' => $stats
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard visitors error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pengunjung'
            ], 500);
        }
    }

    /**
     * Get visitor details
     */
    public function visitorDetails(string|int $id): JsonResponse
    {
        try {
            $visitor = WebsiteVisitor::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $visitor
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard visitor details error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Pengunjung tidak ditemukan'
            ], 404);
        }
    }

    /**
     * Get analytics data for charts
     */
    public function analytics(Request $request): JsonResponse
    {
        try {
            $dateRange = $request->input('date_range', 'last_30_days');
            $startDate = $this->getStartDate($dateRange);
            $endDate = now();

            // Daily visitor data
            $dailyVisitors = WebsiteVisitor::whereBetween('first_visit', [$startDate, $endDate])
                ->selectRaw('DATE(first_visit) as date, COUNT(*) as visitors, SUM(page_views) as page_views')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Daily contact data
            $dailyContacts = Contact::whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date, COUNT(*) as contacts')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Visitor locations (top countries)
            $visitorLocations = WebsiteVisitor::whereBetween('first_visit', [$startDate, $endDate])
                ->selectRaw('country, COUNT(*) as count')
                ->whereNotNull('country')
                ->groupBy('country')
                ->orderByDesc('count')
                ->limit(10)
                ->get();

            // Top referrers
            $topReferrers = WebsiteVisitor::whereBetween('first_visit', [$startDate, $endDate])
                ->selectRaw('referrer, COUNT(*) as count')
                ->whereNotNull('referrer')
                ->where('referrer', '!=', '')
                ->groupBy('referrer')
                ->orderByDesc('count')
                ->limit(10)
                ->get();

            // Top pages
            $topPages = WebsiteVisitor::whereBetween('first_visit', [$startDate, $endDate])
                ->selectRaw('landing_page, COUNT(*) as count')
                ->whereNotNull('landing_page')
                ->groupBy('landing_page')
                ->orderByDesc('count')
                ->limit(10)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'daily_visitors' => $dailyVisitors,
                    'daily_contacts' => $dailyContacts,
                    'visitor_locations' => $visitorLocations,
                    'top_referrers' => $topReferrers,
                    'top_pages' => $topPages,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard analytics error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data analitik'
            ], 500);
        }
    }

    /**
     * Helper function to get start date based on date range
     */
    private function getStartDate(string $dateRange): Carbon
    {
        return match($dateRange) {
            'today' => now()->startOfDay(),
            'yesterday' => now()->subDay()->startOfDay(),
            'last_7_days' => now()->subDays(7)->startOfDay(),
            'last_30_days' => now()->subDays(30)->startOfDay(),
            'this_week' => now()->startOfWeek(),
            'last_week' => now()->subWeek()->startOfWeek(),
            'this_month' => now()->startOfMonth(),
            'last_month' => now()->subMonth()->startOfMonth(),
            'this_year' => now()->startOfYear(),
            default => now()->subDays(30)->startOfDay(),
        };
    }
}
