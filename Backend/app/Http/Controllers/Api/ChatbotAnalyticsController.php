<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use App\Services\FeedbackService;
use App\Services\AdvancedCacheService;
use App\Services\HttpClientPoolService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChatbotAnalyticsController extends Controller
{
    private AnalyticsService $analyticsService;
    private FeedbackService $feedbackService;
    private ?AdvancedCacheService $advancedCacheService;
    private ?HttpClientPoolService $httpClientPool;

    public function __construct(
        AnalyticsService $analyticsService,
        FeedbackService $feedbackService
    ) {
        $this->analyticsService = $analyticsService;
        $this->feedbackService = $feedbackService;
        $this->advancedCacheService = null;
        $this->httpClientPool = null;
    }

    public function analytics(Request $request): JsonResponse
    {
        try {
            $type = $request->query('type', 'summary');

            switch ($type) {
                case 'popular':
                    $limit = $request->query('limit', 10);
                    $data = $this->analyticsService->getPopularQuestions($limit);
                    break;
                case 'by_source':
                    $source = $request->query('source');
                    $limit = $request->query('limit', 20);
                    $data = $this->analyticsService->getQuestionsBySource($source, $limit);
                    break;
                case 'summary':
                default:
                    $data = $this->analyticsService->getAnalyticsSummary();
                    break;
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve analytics',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function feedbackStats(Request $request): JsonResponse
    {
        try {
            $stats = $this->feedbackService->getFeedbackStats();

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve feedback stats',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function poolStats(): JsonResponse
    {
        try {
            if (!$this->httpClientPool) {
                return response()->json([
                    'success' => false,
                    'message' => 'HTTP client pool not enabled'
                ], 400);
            }

            $stats = $this->httpClientPool->getStats();

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve pool stats',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function cacheStats(): JsonResponse
    {
        try {
            if (!$this->advancedCacheService) {
                return response()->json([
                    'success' => false,
                    'message' => 'Advanced cache service not enabled'
                ], 400);
            }

            $stats = $this->advancedCacheService->getStats();

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve cache stats',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function realTimeAnalytics(Request $request): JsonResponse
    {
        try {
            // Use RealTimeAnalyticsService if available
            $realTimeService = app(\App\Services\RealTimeAnalyticsService::class);
            
            $type = $request->query('type', 'overview');
            $limit = $request->query('limit', 50);

            switch ($type) {
                case 'recent':
                    $data = $realTimeService->getRecentInteractions($limit);
                    break;
                case 'overview':
                default:
                    $data = $realTimeService->getOverview();
                    break;
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve real-time analytics',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function trackAnalytics(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'question' => 'required|string',
                'answer' => 'required|string',
                'source' => 'required|string',
                'similarity' => 'nullable|numeric',
                'intent' => 'nullable|string',
                'confidence' => 'nullable|numeric',
            ]);

            $this->analyticsService->trackInteraction(
                $validated['question'],
                $validated['answer'],
                $validated['source'],
                $validated['similarity'] ?? null,
                $validated['intent'] ?? null,
                $validated['confidence'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Analytics tracked successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to track analytics',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
