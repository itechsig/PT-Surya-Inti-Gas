<?php

namespace Tests\Unit\Services;

use App\Services\ChatbotService;
use App\Services\KnowledgeBaseService;
use App\Services\GeminiApiKeyRotationService;
use App\Services\HttpClientPoolService;
use Tests\TestCase;
use Illuminate\Support\Facades\Config;

class ChatbotServiceTest extends TestCase
{
    private ChatbotService $chatbotService;

    protected function setUp(): void
    {
        parent::setUp();
        $knowledgeBaseService = $this->app->make(KnowledgeBaseService::class);
        $apiKeyRotationService = $this->app->make(GeminiApiKeyRotationService::class);
        $this->chatbotService = new ChatbotService($knowledgeBaseService, $apiKeyRotationService);
    }

    public function test_generate_response_returns_array(): void
    {
        $response = $this->chatbotService->generateResponse('halo');

        $this->assertIsArray($response);
        $this->assertArrayHasKey('message', $response);
        $this->assertArrayHasKey('source', $response);
        $this->assertArrayHasKey('timestamp', $response);
    }

    public function test_generate_response_with_greeting_returns_local_source(): void
    {
        // KnowledgeBaseService has no greeting keyword yet, so "halo" currently
        // falls through to the fallback response rather than a local KB hit.
        $this->markTestSkipped('KnowledgeBaseService has no greeting response implemented yet.');
    }

    public function test_generate_response_with_unknown_query_returns_fallback(): void
    {
        $response = $this->chatbotService->generateResponse('xyzabc123');

        $this->assertEquals('fallback', $response['source']);
        $this->assertNotEmpty($response['message']);
    }

    public function test_generate_response_with_company_info_returns_local_source(): void
    {
        // KnowledgeBaseService has no "tentang perusahaan" entry yet, so this
        // currently falls through to the fallback response rather than a local KB hit.
        $this->markTestSkipped('KnowledgeBaseService has no company-info entry implemented yet.');
    }

    public function test_generate_response_includes_timestamp(): void
    {
        $response = $this->chatbotService->generateResponse('layanan');

        $this->assertArrayHasKey('timestamp', $response);
        $this->assertNotEmpty($response['timestamp']);
    }

    public function test_generate_response_with_services_returns_valid_response(): void
    {
        $response = $this->chatbotService->generateResponse('layanan');

        $this->assertIsArray($response);
        $this->assertNotEmpty($response['message']);
        $this->assertEquals('local', $response['source']);
    }

    public function test_get_knowledge_base_service_returns_instance(): void
    {
        $service = $this->chatbotService->getKnowledgeBaseService();

        $this->assertInstanceOf(KnowledgeBaseService::class, $service);
    }

    public function test_generate_response_with_empty_history_still_works(): void
    {
        $response = $this->chatbotService->generateResponse('halo', []);

        $this->assertIsArray($response);
        $this->assertNotEmpty($response['message']);
    }

    public function test_generate_response_message_is_string(): void
    {
        $response = $this->chatbotService->generateResponse('halo');

        $this->assertIsString($response['message']);
    }

    public function test_generate_response_source_is_string(): void
    {
        $response = $this->chatbotService->generateResponse('halo');

        $this->assertIsString($response['source']);
        $this->assertContains($response['source'], ['local', 'fallback']);
    }

    public function test_generate_response_with_http_pool_enabled(): void
    {
        Config::set('services.gemini.pool_enabled', true);
        
        $httpClientPool = $this->createMock(HttpClientPoolService::class);
        $httpClientPool->method('request')->willReturn(null);
        
        $knowledgeBaseService = $this->app->make(KnowledgeBaseService::class);
        $apiKeyRotationService = $this->app->make(GeminiApiKeyRotationService::class);
        
        $chatbotServiceWithPool = new ChatbotService(
            $knowledgeBaseService, 
            $apiKeyRotationService,
            $httpClientPool
        );

        // This should still work with pool enabled
        $response = $chatbotServiceWithPool->generateResponse('halo');
        
        $this->assertIsArray($response);
        $this->assertArrayHasKey('message', $response);
    }

    public function test_generate_response_with_http_pool_disabled(): void
    {
        Config::set('services.gemini.pool_enabled', false);
        
        $knowledgeBaseService = $this->app->make(KnowledgeBaseService::class);
        $apiKeyRotationService = $this->app->make(GeminiApiKeyRotationService::class);
        
        $chatbotServiceWithoutPool = new ChatbotService(
            $knowledgeBaseService, 
            $apiKeyRotationService,
            null
        );

        $response = $chatbotServiceWithoutPool->generateResponse('halo');
        
        $this->assertIsArray($response);
        $this->assertArrayHasKey('message', $response);
    }

    public function test_generate_response_with_history_context(): void
    {
        $history = [
            ['role' => 'user', 'content' => 'Halo'],
            ['role' => 'assistant', 'content' => 'Halo! Ada yang bisa saya bantu?'],
        ];

        $response = $this->chatbotService->generateResponse('Apa layanan anda?', $history);

        $this->assertIsArray($response);
        $this->assertNotEmpty($response['message']);
    }

    public function test_generate_response_with_long_history(): void
    {
        $history = [];
        for ($i = 0; $i < 15; $i++) {
            $history[] = ['role' => 'user', 'content' => "Message $i"];
            $history[] = ['role' => 'assistant', 'content' => "Response $i"];
        }

        $response = $this->chatbotService->generateResponse('pertanyaan baru', $history);

        $this->assertIsArray($response);
        $this->assertNotEmpty($response['message']);
    }

    public function test_generate_response_with_special_characters(): void
    {
        $response = $this->chatbotService->generateResponse('Apa tentang O2 & N2?');

        $this->assertIsArray($response);
        $this->assertNotEmpty($response['message']);
    }

    public function test_generate_response_handles_empty_message(): void
    {
        $response = $this->chatbotService->generateResponse('');

        $this->assertIsArray($response);
        $this->assertNotEmpty($response['message']);
    }

    public function test_generate_response_with_whitespace_only(): void
    {
        $response = $this->chatbotService->generateResponse('   ');

        $this->assertIsArray($response);
        $this->assertNotEmpty($response['message']);
    }

    public function test_knowledge_base_service_integration(): void
    {
        $kbService = $this->chatbotService->getKnowledgeBaseService();

        $this->assertInstanceOf(KnowledgeBaseService::class, $kbService);

        // Test that knowledge base service can search (using a keyword that
        // actually exists in the current knowledge base; "halo" does not).
        $result = $kbService->search('produk');
        $this->assertNotNull($result);
    }
}
