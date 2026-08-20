<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlockedUser;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BlockedUserController extends Controller
{
    use LogsActivity;

    /** Fields snapshotted for the activity log's before/after preview. */
    private const AUDIT_FIELDS = ['blockable_type', 'blockable_value', 'reason', 'block_type', 'is_active'];

    /**
     * Get all blocked users with filtering
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = BlockedUser::with(['blockedBy', 'unblockedBy', 'aiRecommendation']);

            // Filter by active status
            if ($request->has('is_active')) {
                $query->where('is_active', $request->input('is_active'));
            }

            // Filter by type
            if ($request->has('type')) {
                $query->where('blockable_type', $request->input('type'));
            }

            // Search by value
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where('blockable_value', 'like', "%{$search}%");
            }

            // Pagination
            $perPage = min((int) $request->input('per_page', 20), 100);
            $blockedUsers = $query->latest()->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $blockedUsers
            ]);
        } catch (\Exception $e) {
            Log::error('Blocked users error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get blocked users'
            ], 500);
        }
    }

    /**
     * Block a user (manual block by admin)
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'blockable_type' => 'required|in:ip_address,email,user_id',
                'blockable_value' => 'required|string',
                'reason' => 'required|string',
                'block_type' => 'required|in:temporary,permanent',
            ]);

            $blockedUser = BlockedUser::create([
                'blockable_type' => $validated['blockable_type'],
                'blockable_value' => $validated['blockable_value'],
                'reason' => $validated['reason'],
                'block_type' => $validated['block_type'],
                'blocked_by' => auth()->id(),
                'is_active' => true,
                'admin_notes' => $request->input('admin_notes'),
            ]);

            $this->logActivity(
                $request,
                'create_blocked_user',
                'blocked_user',
                $blockedUser->id,
                "Memblokir {$blockedUser->blockable_type} \"{$blockedUser->blockable_value}\"",
                new: $blockedUser->only(self::AUDIT_FIELDS)
            );

            return response()->json([
                'success' => true,
                'message' => 'User blocked successfully',
                'data' => $blockedUser
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Block user error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to block user'
            ], 500);
        }
    }

    /**
     * Unblock a user
     */
    public function unblock(Request $request, string|int $id): JsonResponse
    {
        try {
            $blockedUser = BlockedUser::findOrFail($id);
            $old = $blockedUser->only(self::AUDIT_FIELDS);

            $blockedUser->update([
                'is_active' => false,
                'unblocked_at' => now(),
                'unblocked_by' => auth()->id(),
                'admin_notes' => $request->input('admin_notes'),
            ]);

            $this->logActivity(
                $request,
                'update_blocked_user',
                'blocked_user',
                $blockedUser->id,
                "Membuka blokir \"{$blockedUser->blockable_value}\"",
                old: $old,
                new: $blockedUser->only(self::AUDIT_FIELDS)
            );

            return response()->json([
                'success' => true,
                'message' => 'User unblocked successfully',
                'data' => $blockedUser
            ]);
        } catch (\Exception $e) {
            Log::error('Unblock user error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to unblock user'
            ], 500);
        }
    }

    /**
     * Get blocked user statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => BlockedUser::count(),
                'active' => BlockedUser::active()->count(),
                'inactive' => BlockedUser::inactive()->count(),
                'by_ip' => BlockedUser::byType('ip_address')->count(),
                'by_email' => BlockedUser::byType('email')->count(),
                'permanent' => BlockedUser::permanent()->count(),
                'temporary' => BlockedUser::temporary()->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Blocked user statistics error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get statistics'
            ], 500);
        }
    }

    /**
     * Check if a value is blocked
     */
    public function checkBlocked(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'type' => 'required|in:ip_address,email',
                'value' => 'required|string',
            ]);

            $isBlocked = BlockedUser::active()
                ->where('blockable_type', $request->input('type'))
                ->where('blockable_value', $request->input('value'))
                ->exists();

            return response()->json([
                'success' => true,
                'data' => [
                    'is_blocked' => $isBlocked,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Check blocked error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to check blocked status'
            ], 500);
        }
    }

    /**
     * Delete a blocked user record
     */
    public function destroy(Request $request, string|int $id): JsonResponse
    {
        try {
            $blockedUser = BlockedUser::findOrFail($id);
            $value = $blockedUser->blockable_value;
            $old = $blockedUser->only(self::AUDIT_FIELDS);
            $blockedUserId = $blockedUser->id;

            $blockedUser->delete();

            $this->logActivity($request, 'delete_blocked_user', 'blocked_user', $blockedUserId, "Menghapus catatan blokir \"{$value}\"", old: $old);

            return response()->json([
                'success' => true,
                'message' => 'Blocked user record deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Delete blocked user error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete blocked user record'
            ], 500);
        }
    }
}
