<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AuditLogController extends Controller
{
    /**
     * Get all audit logs with filtering
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = AuditLog::with(['user']);

            // Filter by action type
            if ($request->has('action_type')) {
                $query->where('action_type', $request->input('action_type'));
            }

            // Filter by entity type
            if ($request->has('entity_type')) {
                $query->where('entity_type', $request->input('entity_type'));
            }

            // Filter by user
            if ($request->has('user_id')) {
                $query->where('user_id', $request->input('user_id'));
            }

            // Date range
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('created_at', [
                    $request->input('start_date'),
                    $request->input('end_date')
                ]);
            }

            // Pagination
            $perPage = $request->input('per_page', 50);
            $logs = $query->latest()->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $logs
            ]);
        } catch (\Exception $e) {
            Log::error('Audit logs error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get audit logs'
            ], 500);
        }
    }

    /**
     * Get audit log details
     */
    public function show(string|int $id): JsonResponse
    {
        try {
            $log = AuditLog::with(['user'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $log
            ]);
        } catch (\Exception $e) {
            Log::error('Audit log details error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Audit log not found'
            ], 404);
        }
    }

    /**
     * Get audit log statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => AuditLog::count(),
                'recent_24h' => AuditLog::recent(1)->count(),
                'recent_7d' => AuditLog::recent(7)->count(),
                'recent_30d' => AuditLog::recent(30)->count(),
            ];

            // Get activity by type
            $byAction = AuditLog::select('action_type')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('action_type')
                ->orderByDesc('count')
                ->get();

            // Get activity by entity
            $byEntity = AuditLog::select('entity_type')
                ->selectRaw('COUNT(*) as count')
                ->whereNotNull('entity_type')
                ->groupBy('entity_type')
                ->orderByDesc('count')
                ->get();

            return response()->json([
                'success' => true,
                'data' => array_merge($stats, [
                    'by_action' => $byAction,
                    'by_entity' => $byEntity,
                ])
            ]);
        } catch (\Exception $e) {
            Log::error('Audit log statistics error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get statistics'
            ], 500);
        }
    }

    /**
     * Get daily activity counts for the last 14 days, for a trend chart.
     */
    public function timeline(): JsonResponse
    {
        try {
            $days = 14;
            $start = now()->subDays($days - 1)->startOfDay();

            $counts = AuditLog::where('created_at', '>=', $start)
                ->get(['created_at'])
                ->groupBy(fn ($log) => $log->created_at->format('Y-m-d'))
                ->map->count();

            $timeline = collect(range(0, $days - 1))->map(function ($offset) use ($start, $counts) {
                $key = $start->copy()->addDays($offset)->format('Y-m-d');

                return [
                    'date' => $key,
                    'count' => $counts->get($key, 0),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $timeline,
            ]);
        } catch (\Exception $e) {
            Log::error('Audit log timeline error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get activity timeline'
            ], 500);
        }
    }

    /**
     * Get recent activity
     */
    public function recent(): JsonResponse
    {
        try {
            $recentLogs = AuditLog::with(['user'])
                ->latest()
                ->limit(50)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $recentLogs
            ]);
        } catch (\Exception $e) {
            Log::error('Recent activity error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get recent activity'
            ], 500);
        }
    }
}
