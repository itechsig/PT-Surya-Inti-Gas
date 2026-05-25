<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotService
{
    private KnowledgeBaseService $knowledgeBaseService;
    private GeminiApiKeyRotationService $apiKeyRotationService;
    private ?HttpClientPoolService $httpClientPool;
    private TranslationService $translationService;
    private ?ABTestingService $abTestingService;

    public function __construct(
        KnowledgeBaseService $knowledgeBaseService,
        GeminiApiKeyRotationService $apiKeyRotationService,
        HttpClientPoolService $httpClientPool = null,
        TranslationService $translationService = null,
        ABTestingService $abTestingService = null
    ) {
        $this->knowledgeBaseService = $knowledgeBaseService;
        $this->apiKeyRotationService = $apiKeyRotationService;
        $this->httpClientPool = $httpClientPool;
        $this->translationService = $translationService ?? app(TranslationService::class);
        $this->abTestingService = $abTestingService ?? app(ABTestingService::class);
    }

    public function generateResponse(string $message, array $history = [], ?string $userId = null, ?string $sessionId = null): array
    {
        // Check for active A/B tests
        $abTestAssignment = null;
        $activeCampaigns = $this->abTestingService->getActiveCampaigns();
        
        if (!empty($activeCampaigns)) {
            foreach ($activeCampaigns as $campaign) {
                $assignment = $this->abTestingService->assignUserToVariant(
                    $campaign->id,
                    $userId,
                    $sessionId,
                    $message
                );
                
                if ($assignment && $assignment['is_new_assignment']) {
                    $abTestAssignment = $assignment;
                    break;
                }
            }
        }

        // Check local knowledge base first (fastest - no database, no external calls)
        $localResponse = $this->knowledgeBaseService->search($message);

        if ($localResponse !== null) {
            return [
                'message' => $localResponse,
                'source' => 'local',
                'timestamp' => now()->toISOString(),
                'ab_test' => $abTestAssignment,
            ];
        }

        // Apply A/B test configuration if assigned
        $aiConfig = [];
        if ($abTestAssignment && !empty($abTestAssignment['response_config'])) {
            $aiConfig = $abTestAssignment['response_config'];
        }

        // Try Gemini AI if API key is configured
        $currentApiKey = $this->apiKeyRotationService->getCurrentApiKey();
        if (!empty($currentApiKey)) {
            try {
                $geminiResponse = $this->callGeminiAI($message, $history, $currentApiKey, $aiConfig);
                
                if ($geminiResponse !== null) {
                    $this->apiKeyRotationService->recordKeyUsage($currentApiKey);
                    
                    return [
                        'message' => $geminiResponse,
                        'source' => 'gemini',
                        'timestamp' => now()->toISOString(),
                        'rotation_enabled' => $this->apiKeyRotationService->isRotationEnabled(),
                        'available_keys' => $this->apiKeyRotationService->getAvailableKeysCount(),
                        'ab_test' => $abTestAssignment,
                    ];
                }
            } catch (\Exception $e) {
                // Mark current key as failed and try next
                $this->apiKeyRotationService->markKeyAsFailed($currentApiKey);
                Log::error('Gemini API Error: ' . $e->getMessage());
            }
        }

        // Fallback to default response with translation
        $fallbackResponse = $this->translationService->translate('chatbot.fallback');
        $fallbackResponses = [$fallbackResponse];
        
        // Add additional context-specific fallbacks
        $fallbackResponses[] = $this->translationService->translate('chatbot.no_results');
        
        return [
            'message' => $fallbackResponses[array_rand($fallbackResponses)],
            'source' => 'fallback',
            'timestamp' => now()->toISOString(),
            'ab_test' => $abTestAssignment,
        ];
    }

    /**
     * Call Gemini AI API for response generation
     */
    private function callGeminiAI(string $message, array $history = [], string $apiKey = '', array $aiConfig = []): ?string
    {
        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

        // Build the prompt with context - allow override from A/B test config
        $systemInstruction = $aiConfig['system_prompt'] ?? "You are a helpful customer service assistant for PT Surya Inti Gas, a gas company. Provide professional, friendly, and accurate responses about the company's services, products. Always answer questions based on the information available on the website. If the information is not available on the website, politely inform the user that you don't have that specific information and suggest they contact customer service. Respond in Indonesian language.";

        // Format conversation history - matching official Gemini API format
        $contents = [];

        // Add history context
        foreach ($history as $item) {
            $role = $item['role'] ?? 'user';
            $content = $item['content'] ?? '';
            $contents[] = [
                'role' => $role === 'assistant' ? 'model' : 'user',
                'parts' => [['text' => $content]]
            ];
        }

        // Add current message
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $message]]
        ];

        // If no history, use simple format (matching official example)
        if (empty($history)) {
            $contents = [
                [
                    'parts' => [['text' => $message]]
                ]
            ];
        }

        // Generation config with A/B test overrides
        $generationConfig = [
            'temperature' => $aiConfig['temperature'] ?? 0.7,
            'topK' => $aiConfig['top_k'] ?? 40,
            'topP' => $aiConfig['top_p'] ?? 0.95,
            'maxOutputTokens' => $aiConfig['max_output_tokens'] ?? 1024,
        ];

        // Build request body matching official Gemini API format
        $requestBody = [
            'contents' => $contents,
            'generationConfig' => $generationConfig,
        ];

        // Add system instruction if available (for multi-turn conversations)
        if (!empty($history)) {
            $requestBody['systemInstruction'] = [
                'parts' => [['text' => $systemInstruction]]
            ];
        } else {
            // For single-turn, prepend system instruction to user message
            $contents[0]['parts'][0]['text'] = $systemInstruction . "\n\n" . $message;
            $requestBody['contents'] = $contents;
        }

        try {
            // Use HTTP pool if enabled and available
            // Temporarily disabled to ensure SSL certificate configuration works
            if ($this->httpClientPool && config('services.gemini.pool_enabled', false)) {
                $poolResponse = $this->httpClientPool->request('post', $endpoint, [
                    'headers' => [
                        'Content-Type' => 'application/json',
                        'X-goog-api-key' => $apiKey,
                    ],
                    'json' => $requestBody,
                ]);
                
                if ($poolResponse && $poolResponse['success']) {
                    $data = $poolResponse['data'];
                    
                    if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                        return $data['candidates'][0]['content']['parts'][0]['text'];
                    }
                }
                
                return null;
            }

            // Fallback to regular HTTP client
            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'X-goog-api-key' => $apiKey,
                ])
                ->post($endpoint, $requestBody);

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    return $data['candidates'][0]['content']['parts'][0]['text'];
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Gemini API call failed: ' . $e->getMessage());
            return null;
        }
    }
    
    public function getKnowledgeBaseService(): KnowledgeBaseService
    {
        return $this->knowledgeBaseService;
    }

    /**
     * Enhance message with intent context for better AI responses
     */
    private function enhanceMessageWithIntent(string $message, string $intent, array $entities): string
    {
        if ($intent === 'unknown' || empty($entities)) {
            return $message;
        }

        $context = "User intent: {$intent}. ";
        
        if (!empty($entities)) {
            $context .= "Detected entities: " . json_encode($entities) . ". ";
        }

        return $context . "User message: " . $message;
    }

    private function formatHistory(array $history): array
    {
        $formatted = [];
        
        foreach ($history as $item) {
            $formatted[] = [
                'role' => $item['role'] ?? 'user',
                'content' => $item['content'] ?? '',
            ];
        }

        // Limit history to last 10 messages to avoid context overflow
        return array_slice($formatted, -10);
    }
}
