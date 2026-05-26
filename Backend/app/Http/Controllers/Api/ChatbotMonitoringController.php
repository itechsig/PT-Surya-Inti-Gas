<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MonitoringService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChatbotMonitoringController extends Controller
{
    private MonitoringService $monitoringService;

    public function __construct(MonitoringService $monitoringService)
    {
        $this->monitoringService = $monitoringService;
    }

    public function runMonitoringChecks(Request $request): JsonResponse
    {
        try {
            $results = $this->monitoringService->runAllChecks();

            return response()->json([
                'success' => true,
                'data' => $results,
                'message' => 'Monitoring checks completed'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to run monitoring checks',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getHealthStatus(Request $request): JsonResponse
    {
        try {
            $status = $this->monitoringService->getHealthStatus();

            return response()->json([
                'success' => true,
                'data' => $status
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get health status',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getActiveAlerts(Request $request): JsonResponse
    {
        try {
            $alerts = $this->monitoringService->getActiveAlerts();

            return response()->json([
                'success' => true,
                'data' => $alerts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get active alerts',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getAlertHistory(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 50);
            $history = $this->monitoringService->getAlertHistory($limit);

            return response()->json([
                'success' => true,
                'data' => $history
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get alert history',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getMetricsHistory(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 100);
            $history = $this->monitoringService->getMetricsHistory($limit);

            return response()->json([
                'success' => true,
                'data' => $history
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get metrics history',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function resolveAlert(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'alert_key' => 'required|string',
            ]);

            $result = $this->monitoringService->resolveAlert($validated['alert_key']);

            return response()->json([
                'success' => true,
                'message' => 'Alert resolved successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to resolve alert',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function clearAllAlerts(Request $request): JsonResponse
    {
        try {
            $result = $this->monitoringService->clearAllAlerts();

            return response()->json([
                'success' => true,
                'message' => 'All alerts cleared successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear alerts',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getAlertRules(Request $request): JsonResponse
    {
        try {
            $rules = $this->monitoringService->getAlertRules();

            return response()->json([
                'success' => true,
                'data' => $rules
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get alert rules',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function updateAlertRules(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'rules' => 'required|array',
                'rules.*.metric' => 'required|string',
                'rules.*.threshold' => 'required|numeric',
                'rules.*.comparison' => 'required|in:>,<,>=,<=,==',
            ]);

            $result = $this->monitoringService->updateAlertRules($validated['rules']);

            return response()->json([
                'success' => true,
                'message' => 'Alert rules updated successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update alert rules',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
