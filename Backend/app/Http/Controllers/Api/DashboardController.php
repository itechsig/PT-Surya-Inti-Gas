<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
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

            // Get contact statistics (reliable data source)
            $totalContacts = Contact::whereBetween('created_at', [$startDate, now()])->count();
            $pendingContacts = Contact::where('status', 'pending')
                ->whereBetween('created_at', [$startDate, now()])
                ->count();
            $newContacts = Contact::whereDate('created_at', '>=', $startDate)->count();

            // Get recent contacts
            $recentContacts = Contact::latest()
                ->limit(5)
                ->get(['id', 'nama', 'email', 'pesan', 'status', 'created_at']);

            // Return simplified data without visitor tracking (can be added later when setup is ready)
            return response()->json([
                'success' => true,
                'data' => [
                    'contacts' => [
                        'total' => $totalContacts,
                        'pending' => $pendingContacts,
                        'new' => $newContacts,
                    ],
                    'visitors' => [
                        'total' => 0,
                        'unique' => 0,
                        'page_views' => 0,
                        'avg_time_on_site' => 0,
                    ],
                    'devices' => [],
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
                    'replied_by' => null, // Can be updated when auth is properly implemented
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