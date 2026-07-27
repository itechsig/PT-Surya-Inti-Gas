<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AIRecommendation;
use App\Models\ApprovalWorkflow;
use App\Models\BlockedUser;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AIRecommendationController extends Controller
{
    /**
     * Get all recommendations with filtering
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = AIRecommendation::query();

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            // Filter by priority
            if ($request->has('priority')) {
                $query->where('priority', $request->input('priority'));
            }

            // Filter by type
            if ($request->has('type')) {
                $query->where('recommendation_type', $request->input('type'));
            }

            // Search
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = min((int) $request->input('per_page', 20), 100);
            $recommendations = $query->latest()->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $recommendations
            ]);
        } catch (\Exception $e) {
            Log::error('AI recommendations error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get recommendations'
            ], 500);
        }
    }

    /**
     * Get single recommendation
     */
    public function show(string|int $id): JsonResponse
    {
        try {
            $recommendation = AIRecommendation::with(['approvalWorkflow', 'reviewedBy'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $recommendation
            ]);
        } catch (\Exception $e) {
            Log::error('AI recommendation details error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Recommendation not found'
            ], 404);
        }
    }

    /**
     * Approve recommendation
     */
    public function approve(Request $request, string|int $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $recommendation = AIRecommendation::findOrFail($id);
            $userId = auth()->id(); // Get current admin user

            // Update recommendation status
            $recommendation->update([
                'status' => 'approved',
                'reviewed_at' => now(),
                'reviewed_by' => $userId,
                'review_notes' => $request->input('notes'),
            ]);

            // Create or update approval workflow
            $workflow = ApprovalWorkflow::updateOrCreate(
                ['ai_recommendation_id' => $recommendation->id],
                [
                    'approved_by' => $userId,
                    'status' => 'approved',
                    'action_taken' => $request->input('action_taken', 'approved'),
                    'action_details' => $request->input('action_details'),
                    'approved_at' => now(),
                    'admin_notes' => $request->input('notes'),
                ]
            );

            // Execute the recommended action
            $this->executeRecommendedAction($recommendation, $workflow);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Recommendation approved successfully',
                'data' => $recommendation->load('approvalWorkflow')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Approve recommendation error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to approve recommendation'
            ], 500);
        }
    }

    /**
     * Reject recommendation
     */
    public function reject(Request $request, string|int $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $recommendation = AIRecommendation::findOrFail($id);
            $userId = auth()->id();

            // Update recommendation status
            $recommendation->update([
                'status' => 'rejected',
                'reviewed_at' => now(),
                'reviewed_by' => $userId,
                'review_notes' => $request->input('notes'),
            ]);

            // Create or update approval workflow
            ApprovalWorkflow::updateOrCreate(
                ['ai_recommendation_id' => $recommendation->id],
                [
                    'approved_by' => $userId,
                    'status' => 'rejected',
                    'rejection_reason' => $request->input('rejection_reason'),
                    'admin_notes' => $request->input('notes'),
                    'approved_at' => now(),
                ]
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Recommendation rejected successfully',
                'data' => $recommendation->load('approvalWorkflow')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Reject recommendation error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to reject recommendation'
            ], 500);
        }
    }

    /**
     * Get recommendation statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => AIRecommendation::count(),
                'pending' => AIRecommendation::pending()->count(),
                'approved' => AIRecommendation::approved()->count(),
                'rejected' => AIRecommendation::rejected()->count(),
                'high_priority' => AIRecommendation::highPriority()->count(),
                'critical' => AIRecommendation::critical()->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Recommendation statistics error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get statistics'
            ], 500);
        }
    }

    /**
     * Execute the recommended action
     */
    private function executeRecommendedAction(AIRecommendation $recommendation, ApprovalWorkflow $workflow): void
    {
        $action = $recommendation->suggested_action['type'] ?? null;
        $value = $recommendation->suggested_action['value'] ?? null;

        switch ($action) {
            case 'block_email':
                $this->blockUser('email', $value, $recommendation, $workflow);
                break;
            case 'block_ip':
                $this->blockUser('ip_address', $value, $recommendation, $workflow);
                break;
            case 'review_priority':
                // Just mark for review, no blocking
                break;
            default:
                Log::info('Unknown action type', ['action' => $action]);
        }

        $recommendation->update(['status' => 'completed']);
        $workflow->update(['completed_at' => now()]);
    }

    /**
     * Block user (email or IP)
     */
    private function blockUser(string $type, string $value, AIRecommendation $recommendation, ApprovalWorkflow $workflow): void
    {
        BlockedUser::create([
            'blockable_type' => $type,
            'blockable_value' => $value,
            'reason' => $recommendation->title,
            'block_type' => 'permanent',
            'blocked_by' => $workflow->approved_by,
            'ai_recommendation_id' => $recommendation->id,
            'is_active' => true,
            'evidence' => $recommendation->evidence,
        ]);

        Log::info("User blocked: {$type} - {$value}", [
            'recommendation_id' => $recommendation->id,
            'workflow_id' => $workflow->id,
        ]);
    }
}
