<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\WebsiteVisitor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard overview data (Simplified version for stability)
     */
    public function overview(Request $request): JsonResponse
    {
        try {
            $dateRange = $request->input('date_range', 'today');
            $startDate = $this->getStartDate($dateRange);

            // Get recent contacts
            $recentContacts = Contact::latest()
                ->limit(5)
                ->get(['id', 'nama', 'email', 'pesan', 'status', 'created_at']);

            // All-time status breakdown, for the contacts distribution chart
            $contactsByStatus = [
                'pending' => Contact::pending()->count(),
                'read' => Contact::read()->count(),
                'replied' => Contact::replied()->count(),
                'archived' => Contact::archived()->count(),
            ];

            // "Total Kontak" is labeled all-time and "Kontak Menunggu" means currently outstanding —
            // neither should be scoped to $dateRange, or a contact from yesterday that's still
            // pending would silently disappear from the count once the day rolls over.
            $totalContacts = Contact::count();
            $pendingContacts = $contactsByStatus['pending'];
            $newContacts = Contact::whereDate('created_at', '>=', $startDate)->count();

            // Visitor traffic for the same date range as the contact stats above
            $visitorsInRange = WebsiteVisitor::whereBetween('first_visit', [$startDate, now()]);
            $totalVisitors = (clone $visitorsInRange)->count();
            $newVisitors = (clone $visitorsInRange)->where('is_returning_visitor', false)->count();
            $pageViews = (int) (clone $visitorsInRange)->sum('page_views');
            $avgTimeOnSite = (int) (clone $visitorsInRange)->avg('time_on_site');

            $devices = WebsiteVisitor::whereBetween('first_visit', [$startDate, now()])
                ->select('device_type')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('device_type')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'contacts' => [
                        'total' => $totalContacts,
                        'pending' => $pendingContacts,
                        'new' => $newContacts,
                        'by_status' => $contactsByStatus,
                    ],
                    'visitors' => [
                        'total' => $totalVisitors,
                        'unique' => $newVisitors,
                        'page_views' => $pageViews,
                        'avg_time_on_site' => $avgTimeOnSite,
                    ],
                    'devices' => $devices,
                    'recent_contacts' => $recentContacts,
                    'recent_visitors' => [],
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
            $query = Contact::query();

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
            $perPage = min((int) $request->input('per_page', 10), 100);
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
            $contact = Contact::findOrFail($id);

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
                'notes' => $request->input('notes', $contact->notes ?? ''),
            ]);

            if ($request->input('status') === 'replied') {
                $contact->update([
                    'replied_at' => now(),
                    'replied_by' => $request->user()?->id,
                ]);
            }

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