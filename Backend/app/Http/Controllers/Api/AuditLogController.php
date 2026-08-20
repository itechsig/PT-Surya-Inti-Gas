<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\RestoreFailedException;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\BlockedUser;
use App\Models\CareerApplication;
use App\Models\GalleryItem;
use App\Models\HeroSlide;
use App\Models\JobVacancy;
use App\Models\Portfolio;
use App\Models\Product;
use App\Models\Role;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuditLogController extends Controller
{
    use LogsActivity;

    /**
     * entity_type => model class, for every entity a Super Admin can restore. Deliberately
     * excludes 'user': UserController's delete_user audit entries only snapshot name/email
     * (no password/role), so reconstructing a User from that would violate NOT NULL columns.
     */
    private const RESTORABLE_ENTITIES = [
        'role' => Role::class,
        'hero_slide' => HeroSlide::class,
        'product' => Product::class,
        'gallery_item' => GalleryItem::class,
        'portfolio' => Portfolio::class,
        'job_vacancy' => JobVacancy::class,
        'career_application' => CareerApplication::class,
        'blocked_user' => BlockedUser::class,
    ];

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

    /**
     * Reverts the change/addition/deletion recorded in one audit log entry (Super Admin only —
     * see the role:super_admin route group). Role entries additionally re-sync permissions,
     * since those live in a pivot rather than a plain column.
     */
    public function restore(Request $request, AuditLog $auditLog): JsonResponse
    {
        if ($auditLog->action_type === 'restore') {
            return response()->json(['success' => false, 'message' => 'Aktivitas pemulihan tidak dapat dipulihkan lagi'], 422);
        }

        if ($auditLog->reverted_at !== null) {
            return response()->json(['success' => false, 'message' => 'Aktivitas ini sudah pernah dipulihkan'], 422);
        }

        $old = $auditLog->old_values ?? [];
        $new = $auditLog->new_values ?? [];

        if (empty($old) && empty($new)) {
            return response()->json(['success' => false, 'message' => 'Aktivitas ini tidak memiliki data untuk dipulihkan'], 422);
        }

        $modelClass = self::RESTORABLE_ENTITIES[$auditLog->entity_type] ?? null;
        if ($modelClass === null) {
            return response()->json(['success' => false, 'message' => 'Tipe data ini belum didukung untuk pemulihan'], 422);
        }

        try {
            DB::transaction(function () use ($request, $auditLog, $modelClass, $old, $new) {
                /** @var Model $model */
                $model = new $modelClass;
                $usesSoftDeletes = in_array(SoftDeletes::class, class_uses_recursive($modelClass), true);
                $fillableOld = array_intersect_key($old, array_flip($model->getFillable()));

                if (empty($old) && !empty($new)) {
                    // Undo a create: delete the record if it's still there.
                    $existing = $modelClass::find($auditLog->entity_id);
                    $existing?->delete();
                } elseif (!empty($old) && !empty($new)) {
                    // Undo an update: write the old values back.
                    $existing = $modelClass::find($auditLog->entity_id);
                    if (!$existing) {
                        throw new RestoreFailedException('Data sudah dihapus, tidak dapat dipulihkan ke versi ini');
                    }
                    $existing->update($fillableOld);
                    if ($auditLog->entity_type === 'role' && array_key_exists('permissions', $old)) {
                        $existing->permissions()->sync($old['permissions']);
                    }
                } else {
                    // Undo a delete: recreate (or un-soft-delete) the record.
                    if ($usesSoftDeletes) {
                        $trashed = $modelClass::withTrashed()->find($auditLog->entity_id);
                        if ($trashed) {
                            $trashed->restore();
                            return;
                        }
                    } elseif ($modelClass::find($auditLog->entity_id)) {
                        throw new RestoreFailedException('Data sudah ada kembali, tidak perlu dipulihkan');
                    }
                    $created = $modelClass::create($fillableOld);
                    if ($auditLog->entity_type === 'role' && array_key_exists('permissions', $old)) {
                        $created->permissions()->sync($old['permissions']);
                    }
                }

                $auditLog->update(['reverted_at' => now(), 'reverted_by' => $request->user()->id]);

                $this->logActivity(
                    $request,
                    'restore',
                    $auditLog->entity_type,
                    $auditLog->entity_id,
                    "Memulihkan aktivitas #{$auditLog->id} ({$auditLog->description})",
                    old: $new,
                    new: $old
                );
            });

            return response()->json([
                'success' => true,
                'message' => 'Aktivitas berhasil dipulihkan',
                'data' => $auditLog->fresh(['user', 'revertedByUser']),
            ]);
        } catch (RestoreFailedException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            Log::error('Audit log restore error', ['error' => $e->getMessage(), 'audit_log_id' => $auditLog->id]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal memulihkan aktivitas. Data terkait (mis. file gambar) mungkin sudah tidak lengkap.',
            ], 422);
        }
    }
}
