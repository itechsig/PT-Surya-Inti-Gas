<?php

namespace Tests\Unit\Controllers;

use Tests\TestCase;
use App\Http\Controllers\Api\ChatbotController;
use App\Services\ChatbotService;
use App\Services\FeedbackService;
use App\Services\GeminiApiKeyRotationService;
use App\Services\HttpClientPoolService;
use App\Services\AdvancedCacheService;
use App\Services\RealTimeAnalyticsService;
use App\Services\TranslationService;
use App\Services\SentimentAnalysisService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Config;

class ChatbotControllerTest extends TestCase
{
    private ChatbotController $controller;
    
    /** @var ChatbotService&\PHPUnit\Framework\MockObject\MockObject */
    private $chatbotService;
    
    /** @var FeedbackService&\PHPUnit\Framework\MockObject\MockObject */
    private $feedbackService;
    
    /** @var GeminiApiKeyRotationService&\PHPUnit\Framework\MockObject\MockObject */
    private $apiKeyRotationService;
    
    /** @var HttpClientPoolService&\PHPUnit\Framework\MockObject\MockObject */
    private $httpClientPool;
    
    /** @var AdvancedCacheService&\PHPUnit\Framework\MockObject\MockObject */
    private $advancedCacheService;
    
    /** @var RealTimeAnalyticsService&\PHPUnit\Framework\MockObject\MockObject */
    private $analyticsService;
    
    /** @var TranslationService&\PHPUnit\Framework\MockObject\MockObject */
    private $translationService;
    
    /** @var SentimentAnalysisService&\PHPUnit\Framework\MockObject\MockObject */
    private $sentimentAnalysisService;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->chatbotService = $this->createMock(ChatbotService::class);
        $this->feedbackService = $this->createMock(FeedbackService::class);
        $this->apiKeyRotationService = $this->createMock(GeminiApiKeyRotationService::class);
        $this->httpClientPool = $this->createMock(HttpClientPoolService::class);
        $this->advancedCacheService = $this->createMock(AdvancedCacheService::class);
        $this->analyticsService = $this->createMock(RealTimeAnalyticsService::class);
        $this->translationService = $this->createMock(TranslationService::class);
        $this->sentimentAnalysisService = $this->createMock(SentimentAnalysisService::class);
        
        $this->controller = new ChatbotController(
            $this->chatbotService,
            $this->feedbackService,
            $this->apiKeyRotationService,
            $this->httpClientPool,
            $this->advancedCacheService,
            $this->analyticsService,
            $this->translationService,
            $this->sentimentAnalysisService
        );
    }

    public function test_controller_instantiation()
    {
        $this->assertInstanceOf(ChatbotController::class, $this->controller);
    }

    public function test_pool_stats_endpoint()
    {
        $this->httpClientPool->method('getStats')->willReturn([
            'total_connections' => 3,
            'active_connections' => 1,
            'available_connections' => 2,
            'max_connections' => 5,
            'pool_utilization' => 20.0,
        ]);

        Config::set('services.gemini.pool_enabled', true);
        Config::set('services.gemini.pool_size', 5);
        Config::set('services.gemini.timeout', 30);

        $response = $this->controller->poolStats();

        $this->assertInstanceOf(JsonResponse::class, $response);
        $data = json_decode($response->getContent(), true);
        
        $this->assertTrue($data['success']);
        $this->assertArrayHasKey('pool_stats', $data['data']);
        $this->assertArrayHasKey('pool_enabled', $data['data']);
        $this->assertArrayHasKey('pool_size', $data['data']);
        $this->assertEquals(3, $data['data']['pool_stats']['total_connections']);
    }

    public function test_pool_stats_without_pool_service()
    {
        $controllerWithoutPool = new ChatbotController(
            $this->chatbotService,
            $this->feedbackService,
            $this->apiKeyRotationService,
            null,
            $this->advancedCacheService,
            $this->analyticsService,
            $this->translationService,
            $this->sentimentAnalysisService
        );

        $response = $controllerWithoutPool->poolStats();

        $this->assertInstanceOf(JsonResponse::class, $response);
        $data = json_decode($response->getContent(), true);
        
        $this->assertFalse($data['success']);
        $this->assertEquals(503, $response->getStatusCode());
    }

    public function test_api_key_rotation_status()
    {
        $this->apiKeyRotationService->method('isRotationEnabled')->willReturn(true);
        $this->apiKeyRotationService->method('getAvailableKeysCount')->willReturn(3);

        Config::set('services.gemini.rotation_strategy', 'round_robin');
        Config::set('services.gemini.model', 'gemini-flash-latest');

        $response = $this->controller->apiKeyRotationStatus();

        $this->assertInstanceOf(JsonResponse::class, $response);
        $data = json_decode($response->getContent(), true);
        
        // Just check that we get a valid response structure
        $this->assertArrayHasKey('success', $data);
        $this->assertArrayHasKey('data', $data);
    }

    public function test_reload_knowledge_base()
    {
        $kbService = $this->createMock(\App\Services\KnowledgeBaseService::class);
        $kbService->method('reloadKnowledgeBase')->willReturn([]);
        
        $this->app->instance(\App\Services\KnowledgeBaseService::class, $kbService);

        $response = $this->controller->reloadKnowledgeBase();

        $this->assertInstanceOf(JsonResponse::class, $response);
        $data = json_decode($response->getContent(), true);
        
        $this->assertTrue($data['success']);
        $this->assertEquals('Knowledge base reloaded successfully', $data['message']);
    }

    public function test_feedback_stats()
    {
        $this->feedbackService->method('getFeedbackStats')->willReturn([
            'total' => 100,
            'positive' => 80,
            'negative' => 20,
        ]);

        $response = $this->controller->feedbackStats(new Request());

        $this->assertInstanceOf(JsonResponse::class, $response);
        $data = json_decode($response->getContent(), true);
        
        $this->assertTrue($data['success']);
        $this->assertArrayHasKey('data', $data);
        $this->assertEquals(100, $data['data']['total']);
    }

    public function test_analytics_summary()
    {
        $analyticsService = $this->createMock(\App\Services\AnalyticsService::class);
        $analyticsService->method('getAnalyticsSummary')->willReturn([
            'total_questions' => 500,
            'unique_users' => 100,
        ]);

        $this->app->instance(\App\Services\AnalyticsService::class, $analyticsService);

        $request = new Request(['type' => 'summary']);
        $response = $this->controller->analytics($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $data = json_decode($response->getContent(), true);
        
        $this->assertTrue($data['success']);
        $this->assertArrayHasKey('data', $data);
    }

    public function test_sanitize_input_method()
    {
        // Use reflection to test private method
        $reflection = new \ReflectionClass($this->controller);
        $method = $reflection->getMethod('sanitizeInput');
        $method->setAccessible(true);

        $input = '<script>alert("test")</script>Hello';
        $sanitized = $method->invoke($this->controller, $input);

        $this->assertStringNotContainsString('<script>', $sanitized);
        $this->assertStringContainsString('Hello', $sanitized);
    }

    public function test_sanitize_input_removes_dangerous_chars()
    {
        $reflection = new \ReflectionClass($this->controller);
        $method = $reflection->getMethod('sanitizeInput');
        $method->setAccessible(true);

        $input = 'Test with "quotes" and <angle> brackets';
        $sanitized = $method->invoke($this->controller, $input);

        $this->assertStringNotContainsString('"', $sanitized);
        $this->assertStringNotContainsString('<', $sanitized);
        $this->assertStringNotContainsString('>', $sanitized);
    }

    public function test_sanitize_input_trims_whitespace()
    {
        $reflection = new \ReflectionClass($this->controller);
        $method = $reflection->getMethod('sanitizeInput');
        $method->setAccessible(true);

        $input = '  Hello World  ';
        $sanitized = $method->invoke($this->controller, $input);

        $this->assertEquals('Hello World', $sanitized);
    }
}
