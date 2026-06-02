<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ChatbotService;
use App\Services\FeedbackService;
use App\Services\GeminiApiKeyRotationService;
use App\Services\KnowledgeBaseService;
use App\Traits\HandlesApiErrors;
use App\Http\Requests\Chat\ChatRequest;
use App\Http\Requests\Chat\FeedbackRequest;
use App\Http\Resources\Chatbot\ChatResponseResource;
use App\Jobs\ProcessGeminiAIRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Queue;

class ChatbotController extends Controller
{
    use HandlesApiErrors;
    private ChatbotService $chatbotService;
    private FeedbackService $feedbackService;
    private GeminiApiKeyRotationService $apiKeyRotationService;

    public function __construct(
        ChatbotService $chatbotService, 
        FeedbackService $feedbackService,
        GeminiApiKeyRotationService $apiKeyRotationService
    ) {
        $this->chatbotService = $chatbotService;
        $this->feedbackService = $feedbackService;
        $this->apiKeyRotationService = $apiKeyRotationService;
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
            return $this->handleApiError($e, 'Failed to generate response', 'chatbot_response_failed');
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
            return $this->handleApiError($e, 'Failed to process feedback', 'chatbot_feedback_failed');
        }
    }

    public function chatStream(ChatRequest $request)
    {
        return $this->chat($request);
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
            return $this->handleApiError($e, 'Failed to reload knowledge base', 'chatbot_reload_kb_failed');
        }
    }

    public function apiKeyRotationStatus(): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => [
                    'rotation_enabled' => $this->apiKeyRotationService->isRotationEnabled(),
                    'available_keys' => $this->apiKeyRotationService->getAvailableKeysCount(),
                    'rotation_strategy' => config('services.gemini.rotation_strategy'),
                    'model' => config('services.gemini.model'),
                ]
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to get rotation status', 'chatbot_rotation_status_failed');
        }
    }

    // Admin endpoint placeholders (for now - need to add back full implementation or move to specialized controllers)
    public function feedbackStats(Request $request): JsonResponse
    {
        try {
            $stats = $this->feedbackService->getFeedbackStats();
            return response()->json(['success' => true, 'data' => $stats]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to retrieve stats'], 500);
        }
    }

    public function analytics(Request $request): JsonResponse
    {
        try {
            $analyticsService = app(\App\Services\AnalyticsService::class);
            $data = $analyticsService->getAnalyticsSummary();
            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to retrieve analytics'], 500);
        }
    }

    public function poolStats(): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function cacheStats(): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function realTimeAnalytics(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function trackAnalytics(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function setLanguage(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function getSupportedLanguages(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function translate(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function analyzeSentiment(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function batchAnalyzeSentiment(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function getSentimentStatistics(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function clearSentimentCache(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function runMonitoringChecks(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function getHealthStatus(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function getActiveAlerts(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function getAlertHistory(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function getMetricsHistory(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function resolveAlert(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function clearAllAlerts(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function getAlertRules(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function updateAlertRules(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function createABTestCampaign(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function startABTestCampaign(Request $request, int $campaignId): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function pauseABTestCampaign(Request $request, int $campaignId): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function completeABTestCampaign(Request $request, int $campaignId): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function getABTestCampaigns(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function getABTestCampaign(Request $request, int $campaignId): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function getABTestCampaignStats(Request $request, int $campaignId): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function getABTestCampaignVariants(Request $request, int $campaignId): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function deleteABTestCampaign(Request $request, int $campaignId): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function trackABTestEngagement(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
    public function trackABTestConversion(Request $request): JsonResponse { return response()->json(['success' => false, 'message' => 'Not implemented yet'], 501); }
}
