<?php

namespace Tests\Unit\Services;

use App\Services\KnowledgeBaseService;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class KnowledgeBaseServiceTest extends TestCase
{
    private KnowledgeBaseService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new KnowledgeBaseService();
        Cache::flush();
    }

    public function test_get_knowledge_base_returns_array(): void
    {
        $knowledgeBase = $this->service->getKnowledgeBase();

        $this->assertIsArray($knowledgeBase);
        $this->assertArrayHasKey('company', $knowledgeBase);
        $this->assertArrayHasKey('services', $knowledgeBase);
        $this->assertArrayHasKey('products', $knowledgeBase);
    }

    public function test_search_with_greeting_returns_greeting_response(): void
    {
        $response = $this->service->search('halo');

        $this->assertNotNull($response);
        // Check that it's a greeting response (may contain "Halo" or "Hai")
        $this->assertMatchesRegularExpression('/(Halo|Hai|Selamat)/i', $response);
    }

    public function test_search_with_company_info_returns_company_description(): void
    {
        $response = $this->service->search('tentang perusahaan');

        $this->assertNotNull($response);
        $this->assertNotEmpty($response);
    }

    public function test_search_with_vision_returns_vision(): void
    {
        $response = $this->service->search('visi perusahaan');

        $this->assertNotNull($response);
        $this->assertStringContainsString('Visi', $response);
    }

    public function test_search_with_mission_returns_mission(): void
    {
        $response = $this->service->search('misi perusahaan');

        $this->assertNotNull($response);
        $this->assertStringContainsString('Misi', $response);
    }

    public function test_search_with_services_returns_services(): void
    {
        $response = $this->service->search('layanan');

        $this->assertNotNull($response);
        $this->assertStringContainsString('Layanan', $response);
    }

    public function test_search_with_products_returns_products(): void
    {
        $response = $this->service->search('produk');

        $this->assertNotNull($response);
        $this->assertStringContainsString('Produk', $response);
    }

    public function test_search_with_contact_returns_contact_info(): void
    {
        $response = $this->service->search('kontak');

        $this->assertNotNull($response);
        $this->assertNotEmpty($response);
    }

    public function test_search_with_unknown_query_returns_null(): void
    {
        $response = $this->service->search('xyzabc123');

        $this->assertNull($response);
    }

    public function test_search_response_is_cached(): void
    {
        $query = 'layanan';

        $firstResponse = $this->service->search($query);
        $secondResponse = $this->service->search($query);

        $this->assertEquals($firstResponse, $secondResponse);
    }

    public function test_search_is_case_insensitive(): void
    {
        $lowerResponse = $this->service->search('halo');
        $upperResponse = $this->service->search('HALO');
        $mixedResponse = $this->service->search('HaLo');

        $this->assertNotNull($lowerResponse);
        $this->assertNotNull($upperResponse);
        $this->assertNotNull($mixedResponse);
    }

    public function test_search_with_empty_string_returns_null(): void
    {
        $response = $this->service->search('');

        $this->assertNull($response);
    }

    public function test_search_with_whitespace_only_returns_null(): void
    {
        $response = $this->service->search('   ');

        $this->assertNull($response);
    }
}
