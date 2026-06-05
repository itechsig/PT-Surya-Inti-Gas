<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AIAgentService;
use App\Models\AIAgentActivity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AIAgentController extends Controller
{
    private AIAgentService $aiAgentService;

    public function __construct(AIAgentService $aiAgentService)
    {
        $this->aiAgentService = $aiAgentService;
    }

    /**
     * Get AI Agent status
     */
    public function getStatus(): JsonResponse
    {
        try {
            $status = $this->aiAgentService->getAgentStatus();
            
            return response()->json([
                'success' => true,
                'data' => $status
            ]);
        } catch (\Exception $e) {
            Log::error('AI Agent status error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get AI Agent status'
            ], 500);
        }
    }

    /**
     * Run comprehensive monitoring
     */
    public function runMonitoring(): JsonResponse
    {
        try {
            $results = $this->aiAgentService->runComprehensiveMonitoring();
            
            return response()->json([
                'success' => true,
                'message' => 'Monitoring completed successfully',
                'data' => $results
            ]);
        } catch (\Exception $e) {
            Log::error('AI Agent monitoring error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to run monitoring'
            ], 500);
        }
    }

    /**
     * Run contact message monitoring
     */
    public function monitorContacts(): JsonResponse
    {
        try {
            $results = $this->aiAgentService->monitorContactMessages();
            
            return response()->json([
                'success' => true,
                'message' => 'Contact monitoring completed',
                'data' => $results
            ]);
        } catch (\Exception $e) {
            Log::error('Contact monitoring error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to monitor contacts'
            ], 500);
        }
    }

    /**
     * Run career application monitoring
     */
    public function monitorApplications(): JsonResponse
    {
        try {
            $results = $this->aiAgentService->monitorCareerApplications();
            
            return response()->json([
                'success' => true,
                'message' => 'Career application monitoring completed',
                'data' => $results
            ]);
        } catch (\Exception $e) {
            Log::error('Career application monitoring error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to monitor applications'
            ], 500);
        }
    }

    /**
     * Run visitor behavior monitoring
     */
    public function monitorVisitors(): JsonResponse
    {
        try {
            $results = $this->aiAgentService->monitorVisitorBehavior();
            
            return response()->json([
                'success' => true,
                'message' => 'Visitor behavior monitoring completed',
                'data' => $results
            ]);
        } catch (\Exception $e) {
            Log::error('Visitor monitoring error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to monitor visitors'
            ], 500);
        }
    }

    /**
     * Get recent AI Agent activities (including visitor entries)
     */
    public function getActivities(): JsonResponse
    {
        try {
            $activities = AIAgentActivity::where('activity_type', 'visitor_entry')
                ->orWhere('activity_type', 'monitoring')
                ->orderBy('created_at', 'desc')
                ->limit(50)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $activities
            ]);
        } catch (\Exception $e) {
            Log::error('Get AI Agent activities error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get activities'
            ], 500);
        }
    }
}
