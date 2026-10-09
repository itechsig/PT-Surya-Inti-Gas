<?php

namespace Tests\Feature;

use App\Services\IndexNowService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SeoDiscoveryTest extends TestCase
{
    use RefreshDatabase;

    public function test_indexnow_submission_carries_host_key_and_urls(): void
    {
        Http::fake(['api.indexnow.org/*' => Http::response('', 202)]);
        $key = config('services.indexnow.key');

        $status = app(IndexNowService::class)->submit([
            'https://suryaintigas.com/id/supplier-gas-industri',
            'https://suryaintigas.com/id/supplier-gas-industri',
        ]);

        $this->assertSame(202, $status);
        Http::assertSent(fn (Request $r) => $r->url() === 'https://api.indexnow.org/indexnow'
            && $r['host'] === 'suryaintigas.com'
            && $r['key'] === $key
            && $r['keyLocation'] === "https://suryaintigas.com/$key.txt"
            && $r['urlList'] === ['https://suryaintigas.com/id/supplier-gas-industri']);
    }

    public function test_indexnow_key_file_matches_configured_key(): void
    {
        $key = config('services.indexnow.key');
        $file = base_path("../Frontend/public/$key.txt");

        $this->assertFileExists($file);
        $this->assertSame($key, trim(file_get_contents($file)));
    }

    public function test_sitemap_lists_landing_pages_in_indonesian_only(): void
    {
        $xml = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertStringContainsString('<loc>https://suryaintigas.com/id/supplier-gas-industri</loc>', $xml);
        $this->assertStringNotContainsString('/en/supplier-gas-industri', $xml);
        // Translated pages keep their hreflang alternates.
        $this->assertStringContainsString('hreflang="en" href="https://suryaintigas.com/en/produk"', $xml);
    }
}
