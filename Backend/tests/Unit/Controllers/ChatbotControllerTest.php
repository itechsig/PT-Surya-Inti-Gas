<?php

namespace Tests\Unit\Controllers;

use Tests\TestCase;
use App\Http\Controllers\Api\ChatbotController;
use App\Services\ChatbotService;
use App\Services\FeedbackService;
use App\Services\GeminiApiKeyRotationService;
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

    protected function setUp(): void
    {
        parent::setUp();

        $this->chatbotService = $this->createMock(ChatbotService::class);
        $this->feedbackService = $this->createMock(FeedbackService::class);
        $this->apiKeyRotationService = $this->createMock(GeminiApiKeyRotationService::class);

        $this->controller = new ChatbotController(
            $this->chatbotService,
            $this->feedbackService,
            $this->apiKeyRotationService
        );
    }

    public function test_controller_instantiation()
    {
        $this->assertInstanceOf(ChatbotController::class, $this->controller);
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
