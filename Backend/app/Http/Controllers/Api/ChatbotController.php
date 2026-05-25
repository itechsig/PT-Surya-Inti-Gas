<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ChatbotService;
use App\Services\FeedbackService;
use App\Services\GeminiApiKeyRotationService;
use App\Services\HttpClientPoolService;
use App\Services\AdvancedCacheService;
use App\Services\RealTimeAnalyticsService;
use App\Services\TranslationService;
use App\Services\SentimentAnalysisService;
use App\Services\MonitoringService;
use App\Services\ABTestingService;
use App\Http\Requests\Chat\ChatRequest;
use App\Http\Requests\Chat\FeedbackRequest;
use App\Http\Resources\Chatbot\ChatResponseResource;
use App\Jobs\ProcessGeminiAIRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Queue;

class ChatbotController extends Controller
{
    private ChatbotService $chatbotService;
    private FeedbackService $feedbackService;
    private GeminiApiKeyRotationService $apiKeyRotationService;
    private ?HttpClientPoolService $httpClientPool;
    private AdvancedCacheService $advancedCacheService;
    private RealTimeAnalyticsService $analyticsService;
    private TranslationService $translationService;
    private SentimentAnalysisService $sentimentAnalysisService;
    private MonitoringService $monitoringService;
    private ABTestingService $abTestingService;

    public function __construct(
        ChatbotService $chatbotService, 
        FeedbackService $feedbackService,
        GeminiApiKeyRotationService $apiKeyRotationService,
        HttpClientPoolService $httpClientPool = null,
        AdvancedCacheService $advancedCacheService = null,
        RealTimeAnalyticsService $analyticsService = null,
        TranslationService $translationService = null,
        SentimentAnalysisService $sentimentAnalysisService = null,
        MonitoringService $monitoringService = null,
        ABTestingService $abTestingService = null
    ) {
        $this->chatbotService = $chatbotService;
        $this->feedbackService = $feedbackService;
        $this->apiKeyRotationService = $apiKeyRotationService;
        $this->httpClientPool = $httpClientPool;
        $this->advancedCacheService = $advancedCacheService ?? app(AdvancedCacheService::class);
        $this->analyticsService = $analyticsService ?? app(RealTimeAnalyticsService::class);
        $this->translationService = $translationService ?? app(TranslationService::class);
        $this->sentimentAnalysisService = $sentimentAnalysisService ?? app(SentimentAnalysisService::class);
        $this->monitoringService = $monitoringService ?? app(MonitoringService::class);
        $this->abTestingService = $abTestingService ?? app(ABTestingService::class);
    }

    public function chat(ChatRequest $request)
    {
        try {
            $validated = $request->validated();
            $stream = $request->query('stream', false);
            $async = $request->query('async', false);

            $message = $this->sanitizeInput($validated['message']);
            $history = $validated['history'] ?? [];
            
            // Get user ID and session ID for A/B testing
            $userId = (auth() && auth()->check()) ? auth()->id() : null;
            $sessionId = $this->getSessionId();

            // If async processing is requested, dispatch job
            if ($async) {
                $requestId = uniqid();
                
                ProcessGeminiAIRequest::dispatch($message, $history, $requestId);

                return response()->json([
                    'success' => true,
                    'message' => 'Request queued for processing',
                    'request_id' => $requestId,
                    'status' => 'processing',
                ], 202);
            }

            // If stream parameter is true, use streaming response
            if ($stream) {
                $response = $this->chatbotService->generateResponse($message, $history, $userId, $sessionId);
                $text = $response['message'];

                // Return streaming response using Server-Sent Events
                return response()->stream(function () use ($text) {
                    $chars = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY);
                    set_time_limit(0);

                    foreach ($chars as $char) {
                        echo "data: " . json_encode(['chunk' => $char]) . "\n\n";
                        if (ob_get_level()) ob_flush();
                        flush();
                        usleep(30000);
                    }

                    echo "data: " . json_encode(['done' => true]) . "\n\n";
                    if (ob_get_level()) ob_flush();
                    flush();
                }, 200, [
                    'Content-Type' => 'text/event-stream',
                    'Cache-Control' => 'no-cache',
                    'Connection' => 'keep-alive',
                    'X-Accel-Buffering' => 'no',
                ]);
            }

            // Direct service call (non-streaming)
            $response = $this->chatbotService->generateResponse($message, [], $userId, $sessionId);

            return response()->json([
                'success' => true,
                'data' => new ChatResponseResource($response),
                'message' => 'Response generated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate response',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    private function sanitizeInput(string $input): string
    {
        // Remove HTML tags
        $input = strip_tags($input);
        
        // Trim whitespace
        $input = trim($input);
        
        // Remove potentially dangerous characters
        $input = preg_replace('/[<>"\']/', '', $input);
        
        return $input;
    }

    /**
     * Get session ID with guaranteed string return type
     * @return string
     */
    private function getSessionId(): string
    {
        $sessionId = session()?->getId() ?? '';
        if ($sessionId === null || $sessionId === '') {
            return uniqid('session_', true);
        }
        return $sessionId;
    }

    public function feedback(FeedbackRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $feedbackData = array_merge($validated, [
                'ip_address' => $request->ip(),
                'metadata' => [
                    'user_agent' => $request->userAgent(),
                ],
            ]);

            $stored = $this->feedbackService->storeFeedback($feedbackData);

            if ($stored) {
                return response()->json([
                    'success' => true,
                    'message' => 'Feedback recorded successfully'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to record feedback'
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process feedback',
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

    public function analytics(Request $request): JsonResponse
    {
        try {
            $analyticsService = app(\App\Services\AnalyticsService::class);

            $type = $request->query('type', 'summary');

            switch ($type) {
                case 'popular':
                    $limit = $request->query('limit', 10);
                    $data = $analyticsService->getPopularQuestions($limit);
                    break;
                case 'by_source':
                    $source = $request->query('source');
                    $limit = $request->query('limit', 20);
                    $data = $analyticsService->getQuestionsBySource($source, $limit);
                    break;
                case 'summary':
                default:
                    $data = $analyticsService->getAnalyticsSummary();
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

    public function chatStream(ChatRequest $request)
    {
        // Rate limiting
        $key = 'chatbot:stream:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 30)) {
            return response()->json([
                'success' => false,
                'message' => 'Too many requests. Please try again later.',
            ], 429);
        }

        RateLimiter::hit($key, 60);

        try {
            $validated = $request->validated();

            $message = $this->sanitizeInput($validated['message']);
            $history = $validated['history'] ?? [];

            // Generate response
            $response = $this->chatbotService->generateResponse($message, $history);
            $text = $response['message'];

            // Return streaming response using Server-Sent Events
            return response()->stream(function () use ($text) {
                $chars = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY);
                set_time_limit(0);

                foreach ($chars as $char) {
                    echo "data: " . json_encode(['chunk' => $char]) . "\n\n";
                    if (ob_get_level()) ob_flush();
                    flush();
                    usleep(30000);
                }

                echo "data: " . json_encode(['done' => true]) . "\n\n";
                if (ob_get_level()) ob_flush();
                flush();
            }, 200, [
                'Content-Type' => 'text/event-stream',
                'Cache-Control' => 'no-cache',
                'Connection' => 'keep-alive',
                'X-Accel-Buffering' => 'no',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate response',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function reloadKnowledgeBase(): JsonResponse
    {
        try {
            $kbService = app(\App\Services\KnowledgeBaseService::class);
            $kbService->reloadKnowledgeBase();
            
            return response()->json([
                'success' => true,
                'message' => 'Knowledge base reloaded successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reload knowledge base',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function apiKeyRotationStatus(): JsonResponse
    {
        try {
            $rotationService = app(\App\Services\GeminiApiKeyRotationService::class);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'rotation_enabled' => $rotationService->isRotationEnabled(),
                    'available_keys' => $rotationService->getAvailableKeysCount(),
                    'rotation_strategy' => config('services.gemini.rotation_strategy'),
                    'model' => config('services.gemini.model'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get rotation status',
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
                    'message' => 'HTTP pool service not available'
                ], 503);
            }

            $stats = $this->httpClientPool->getStats();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'pool_stats' => $stats,
                    'pool_enabled' => config('services.gemini.pool_enabled', true),
                    'pool_size' => config('services.gemini.pool_size', 5),
                    'timeout' => config('services.gemini.timeout', 30),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get pool statistics',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function cacheStats(): JsonResponse
    {
        try {
            $stats = $this->advancedCacheService->getStats();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'cache_stats' => $stats,
                    'configuration' => [
                        'default_ttl' => config('cache.default_ttl'),
                        'layers' => config('cache.layers'),
                        'warming_enabled' => config('cache.warming.enabled'),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get cache statistics',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function realTimeAnalytics(Request $request): JsonResponse
    {
        try {
            $type = $request->query('type', 'dashboard');
            $days = $request->query('days', 7);

            switch ($type) {
                case 'dashboard':
                    $data = $this->analyticsService->getDashboardMetrics();
                    break;
                case 'popular_questions':
                    $data = $this->analyticsService->getPopularQuestions(10, (int)$days);
                    break;
                case 'source_distribution':
                    $data = $this->analyticsService->getSourceDistribution((int)$days);
                    break;
                case 'performance':
                    $data = $this->analyticsService->getPerformanceMetrics(24);
                    break;
                case 'user_engagement':
                    $data = $this->analyticsService->getUserEngagementMetrics((int)$days);
                    break;
                case 'timeseries':
                    $metric = $request->query('metric', 'interactions');
                    $data = $this->analyticsService->getTimeSeriesData($metric, (int)$days);
                    break;
                case 'summary':
                    $data = $this->analyticsService->getAnalyticsSummary();
                    break;
                default:
                    $data = $this->analyticsService->getDashboardMetrics();
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

    public function trackAnalytics(Request $request): JsonResponse
    {
        try {
            $data = [
                'message' => $request->input('message'),
                'response_source' => $request->input('response_source'),
                'response_time' => $request->input('response_time', 0),
                'metadata' => $request->input('metadata', []),
            ];

            $success = $this->analyticsService->trackInteraction($data);

            return response()->json([
                'success' => $success,
                'message' => $success ? 'Analytics tracked successfully' : 'Failed to track analytics'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to track analytics',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function setLanguage(Request $request): JsonResponse
    {
        try {
            $language = $request->input('language', 'id');
            
            $this->translationService->setLanguage($language);
            $this->chatbotService->getKnowledgeBaseService()->setLanguage($language);

            return response()->json([
                'success' => true,
                'message' => 'Language set successfully',
                'language' => $language,
                'current_language' => $this->translationService->getCurrentLanguage(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to set language',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getSupportedLanguages(): JsonResponse
    {
        try {
            $languages = $this->translationService->getSupportedLanguages();
            $currentLanguage = $this->translationService->getCurrentLanguage();

            return response()->json([
                'success' => true,
                'data' => [
                    'supported_languages' => $languages,
                    'current_language' => $currentLanguage,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get supported languages',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function translate(Request $request): JsonResponse
    {
        try {
            $key = $request->input('key');
            $params = $request->input('params', []);
            $language = $request->input('language');

            $translation = $this->translationService->translate($key, $params, $language);

            return response()->json([
                'success' => true,
                'data' => [
                    'translation' => $translation,
                    'key' => $key,
                    'language' => $language ?? $this->translationService->getCurrentLanguage(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to translate',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function analyzeSentiment(Request $request): JsonResponse
    {
        try {
            $message = $request->input('message');
            $language = $request->input('language', 'id');
            $useAI = $request->input('use_ai', false);

            if (empty($message)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Message is required'
                ], 400);
            }

            $result = $this->sentimentAnalysisService->analyzeSentiment($message, $language, $useAI);

            // Add sentiment label
            $result['sentiment_label'] = $this->sentimentAnalysisService->getSentimentLabel(
                $result['sentiment'],
                $language
            );

            return response()->json([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to analyze sentiment',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function batchAnalyzeSentiment(Request $request): JsonResponse
    {
        try {
            $messages = $request->input('messages', []);
            $language = $request->input('language', 'id');
            $useAI = $request->input('use_ai', false);

            if (!is_array($messages) || empty($messages)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Messages array is required'
                ], 400);
            }

            $results = $this->sentimentAnalysisService->batchAnalyze($messages, $language, $useAI);

            // Add sentiment labels
            foreach ($results as &$result) {
                $result['sentiment_label'] = $this->sentimentAnalysisService->getSentimentLabel(
                    $result['sentiment'],
                    $language
                );
            }

            // Calculate statistics
            $statistics = $this->sentimentAnalysisService->getSentimentStatistics($results);

            return response()->json([
                'success' => true,
                'data' => [
                    'results' => $results,
                    'statistics' => $statistics
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to batch analyze sentiment',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getSentimentStatistics(Request $request): JsonResponse
    {
        try {
            // Get recent interactions from analytics service
            $limit = $request->input('limit', 100);
            $interactions = $this->analyticsService->getRecentInteractions($limit);

            if (empty($interactions)) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'total' => 0,
                        'positive' => 0,
                        'neutral' => 0,
                        'negative' => 0,
                        'positive_percentage' => 0,
                        'neutral_percentage' => 0,
                        'negative_percentage' => 0,
                        'average_confidence' => 0,
                        'average_score' => 0
                    ]
                ]);
            }

            // Extract messages from interactions
            $messages = array_map(fn($item) => $item['message'] ?? '', $interactions);
            $messages = array_filter($messages, fn($msg) => !empty($msg));

            if (empty($messages)) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'total' => 0,
                        'positive' => 0,
                        'neutral' => 0,
                        'negative' => 0,
                        'positive_percentage' => 0,
                        'neutral_percentage' => 0,
                        'negative_percentage' => 0,
                        'average_confidence' => 0,
                        'average_score' => 0
                    ]
                ]);
            }

            // Analyze sentiment for all messages
            $language = $request->input('language', 'id');
            $useAI = $request->input('use_ai', false);
            $results = $this->sentimentAnalysisService->batchAnalyze($messages, $language, $useAI);

            // Get statistics
            $statistics = $this->sentimentAnalysisService->getSentimentStatistics($results);

            return response()->json([
                'success' => true,
                'data' => $statistics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get sentiment statistics',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function clearSentimentCache(Request $request): JsonResponse
    {
        try {
            $success = $this->sentimentAnalysisService->clearCache();

            return response()->json([
                'success' => $success,
                'message' => $success ? 'Sentiment cache cleared successfully' : 'Failed to clear sentiment cache'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear sentiment cache',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function runMonitoringChecks(Request $request): JsonResponse
    {
        try {
            $results = $this->monitoringService->runAllChecks();

            return response()->json([
                'success' => true,
                'data' => $results
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
            $health = $this->monitoringService->getHealthStatus();

            return response()->json([
                'success' => true,
                'data' => $health
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
                'data' => [
                    'alerts' => $alerts,
                    'count' => count($alerts)
                ]
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
                'data' => [
                    'alerts' => $history,
                    'count' => count($history)
                ]
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
            $metrics = $this->monitoringService->getMetricsHistory($limit);

            return response()->json([
                'success' => true,
                'data' => [
                    'metrics' => $metrics,
                    'count' => count($metrics)
                ]
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
            $alertKey = $request->input('alert_key');

            if (empty($alertKey)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Alert key is required'
                ], 400);
            }

            $success = $this->monitoringService->resolveAlert($alertKey);

            return response()->json([
                'success' => $success,
                'message' => $success ? 'Alert resolved successfully' : 'Failed to resolve alert'
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
            $success = $this->monitoringService->clearAllAlerts();

            return response()->json([
                'success' => $success,
                'message' => $success ? 'All alerts cleared successfully' : 'Failed to clear alerts'
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
            $rules = $request->input('rules', []);

            if (empty($rules)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Rules data is required'
                ], 400);
            }

            $success = $this->monitoringService->updateAlertRules($rules);

            return response()->json([
                'success' => $success,
                'message' => $success ? 'Alert rules updated successfully' : 'Failed to update alert rules'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update alert rules',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    // A/B Testing Endpoints

    public function createABTestCampaign(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after:start_date',
                'target_conditions' => 'nullable|array',
                'traffic_split' => 'nullable|numeric|min:0|max:1',
                'sample_size' => 'nullable|integer|min:1',
                'success_metric' => 'nullable|string|in:engagement,conversion',
                'variants' => 'required|array|min:2',
                'variants.*.name' => 'required|string|max:255',
                'variants.*.description' => 'nullable|string',
                'variants.*.response_template' => 'nullable|string',
                'variants.*.response_config' => 'nullable|array',
                'variants.*.allocation' => 'nullable|numeric|min:0|max:1',
                'metadata' => 'nullable|array',
            ]);

            $campaignId = $this->abTestingService->createCampaign($data);

            return response()->json([
                'success' => true,
                'message' => 'A/B test campaign created successfully',
                'data' => ['campaign_id' => $campaignId]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create A/B test campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function startABTestCampaign(Request $request, int $campaignId): JsonResponse
    {
        try {
            $success = $this->abTestingService->startCampaign($campaignId);

            return response()->json([
                'success' => $success,
                'message' => $success ? 'A/B test campaign started successfully' : 'Failed to start campaign'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start A/B test campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function pauseABTestCampaign(Request $request, int $campaignId): JsonResponse
    {
        try {
            $success = $this->abTestingService->pauseCampaign($campaignId);

            return response()->json([
                'success' => $success,
                'message' => $success ? 'A/B test campaign paused successfully' : 'Failed to pause campaign'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to pause A/B test campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function completeABTestCampaign(Request $request, int $campaignId): JsonResponse
    {
        try {
            $winner = $this->abTestingService->completeCampaign($campaignId);

            return response()->json([
                'success' => $winner !== null,
                'message' => $winner ? 'A/B test campaign completed successfully' : 'Failed to complete campaign',
                'data' => ['winner' => $winner]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete A/B test campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getABTestCampaigns(Request $request): JsonResponse
    {
        try {
            $campaigns = $this->abTestingService->getAllCampaigns();

            return response()->json([
                'success' => true,
                'data' => $campaigns
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get A/B test campaigns',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getABTestCampaign(Request $request, int $campaignId): JsonResponse
    {
        try {
            $campaign = $this->abTestingService->getCampaign($campaignId);

            if (!$campaign) {
                return response()->json([
                    'success' => false,
                    'message' => 'Campaign not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $campaign
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get A/B test campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getABTestCampaignStats(Request $request, int $campaignId): JsonResponse
    {
        try {
            $stats = $this->abTestingService->getCampaignStats($campaignId);

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get A/B test campaign stats',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getABTestCampaignVariants(Request $request, int $campaignId): JsonResponse
    {
        try {
            $variants = $this->abTestingService->getCampaignVariants($campaignId);

            return response()->json([
                'success' => true,
                'data' => $variants
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get A/B test campaign variants',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function deleteABTestCampaign(Request $request, int $campaignId): JsonResponse
    {
        try {
            $success = $this->abTestingService->deleteCampaign($campaignId);

            return response()->json([
                'success' => $success,
                'message' => $success ? 'A/B test campaign deleted successfully' : 'Failed to delete campaign'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete A/B test campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function trackABTestEngagement(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'campaign_id' => 'required|integer',
                'user_identifier' => 'required|string',
                'engaged' => 'required|boolean',
                'rating' => 'nullable|integer|min:1|max:5',
                'feedback' => 'nullable|string',
            ]);

            $success = $this->abTestingService->trackEngagement(
                $data['campaign_id'],
                $data['user_identifier'],
                $data['engaged'],
                $data['rating'] ?? null,
                $data['feedback'] ?? null
            );

            return response()->json([
                'success' => $success,
                'message' => $success ? 'Engagement tracked successfully' : 'Failed to track engagement'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to track A/B test engagement',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function trackABTestConversion(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'campaign_id' => 'required|integer',
                'user_identifier' => 'required|string',
            ]);

            $success = $this->abTestingService->trackConversion(
                $data['campaign_id'],
                $data['user_identifier']
            );

            return response()->json([
                'success' => $success,
                'message' => $success ? 'Conversion tracked successfully' : 'Failed to track conversion'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to track A/B test conversion',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
