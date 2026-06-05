<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Get all notifications for user
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Notification::with(['user', 'related']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            // Filter by type
            if ($request->has('type')) {
                $query->where('type', $request->input('type'));
            }

            // Filter by priority
            if ($request->has('priority')) {
                $query->where('priority', $request->input('priority'));
            }

            // Filter for current user or all admins
            $userId = auth()->id();
            $query->where(function ($q) use ($userId) {
                $q->where('user_id', $userId)
                  ->orWhereNull('user_id');
            });

            // Pagination
            $perPage = $request->input('per_page', 20);
            $notifications = $query->latest()->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $notifications
            ]);
        } catch (\Exception $e) {
            Log::error('Notifications error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get notifications'
            ], 500);
        }
    }

    /**
     * Get unread notifications
     */
    public function unread(): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $notifications = Notification::unread()
                ->where(function ($q) use ($userId) {
                    $q->where('user_id', $userId)
                      ->orWhereNull('user_id');
                })
                ->latest()
                ->limit(20)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $notifications
            ]);
        } catch (\Exception $e) {
            Log::error('Unread notifications error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get unread notifications'
            ], 500);
        }
    }

    /**
     * Get unread count
     */
    public function unreadCount(): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $count = Notification::unread()
                ->where(function ($q) use ($userId) {
                    $q->where('user_id', $userId)
                      ->orWhereNull('user_id');
                })
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'unread_count' => $count
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Unread count error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get unread count'
            ], 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(string|int $id): JsonResponse
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->markAsRead();

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read',
                'data' => $notification
            ]);
        } catch (\Exception $e) {
            Log::error('Mark notification as read error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notification as read'
            ], 500);
        }
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            Notification::unread()
                ->where(function ($q) use ($userId) {
                    $q->where('user_id', $userId)
                      ->orWhereNull('user_id');
                })
                ->update([
                    'status' => 'read',
                    'read_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => 'All notifications marked as read'
            ]);
        } catch (\Exception $e) {
            Log::error('Mark all as read error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to mark all as read'
            ], 500);
        }
    }

    /**
     * Delete notification
     */
    public function destroy(string|int $id): JsonResponse
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->delete();

            return response()->json([
                'success' => true,
                'message' => 'Notification deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Delete notification error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete notification'
            ], 500);
        }
    }

    /**
     * Get notification statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $stats = [
                'total' => Notification::where(function ($q) use ($userId) {
                    $q->where('user_id', $userId)->orWhereNull('user_id');
                })->count(),
                'unread' => Notification::unread()->where(function ($q) use ($userId) {
                    $q->where('user_id', $userId)->orWhereNull('user_id');
                })->count(),
                'high_priority' => Notification::highPriority()->where(function ($q) use ($userId) {
                    $q->where('user_id', $userId)->orWhereNull('user_id');
                })->count(),
                'critical' => Notification::critical()->where(function ($q) use ($userId) {
                    $q->where('user_id', $userId)->orWhereNull('user_id');
                })->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Notification statistics error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get statistics'
            ], 500);
        }
    }
}
