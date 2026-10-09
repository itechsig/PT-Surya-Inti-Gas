<?php

namespace App\Services;

use App\Support\SiteUrls;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * IndexNow (https://www.indexnow.org): tells Bing, Yandex, Naver, Seznam and Yep
 * that a URL was added, changed or removed, so they recrawl it within minutes
 * instead of waiting for their next sitemap visit. One submission to the shared
 * endpoint reaches every participating engine. Google does not use IndexNow; it
 * picks changes up from the sitemap.
 *
 * Ownership is proven by the key file at https://suryaintigas.com/{key}.txt
 * (Frontend/public/{key}.txt, copied into Backend/public by the Hostinger build).
 */
class IndexNowService
{
    private const ENDPOINT = 'https://api.indexnow.org/indexnow';

    /** @var array<string, true> */
    private array $pending = [];

    private bool $flushScheduled = false;

    /**
     * Queue URLs changed during this request; they are sent in one call after the
     * response has gone out, so admin saves never wait on the search engines.
     * Only requests served by the live site submit: a local or staging copy shares
     * the same database models and must not announce production URLs.
     */
    public function queue(array $urls): void
    {
        if (!$this->enabled() || app()->runningInConsole()) {
            return;
        }
        if (request()->getHost() !== parse_url(SiteUrls::SITE, PHP_URL_HOST)) {
            return;
        }

        foreach ($urls as $url) {
            $this->pending[$url] = true;
        }

        if (!$this->flushScheduled) {
            $this->flushScheduled = true;
            app()->terminating(fn () => $this->flush());
        }
    }

    public function flush(): void
    {
        $urls = array_keys($this->pending);
        $this->pending = [];
        if ($urls) {
            $this->submit($urls);
        }
    }

    /**
     * Submit URLs right away. Returns the HTTP status (200/202 = accepted), or null
     * if the request could not be made.
     */
    public function submit(array $urls): ?int
    {
        $key = config('services.indexnow.key');
        if (!$key || !$urls) {
            return null;
        }

        try {
            $response = Http::timeout(10)->acceptJson()->post(self::ENDPOINT, [
                'host' => parse_url(SiteUrls::SITE, PHP_URL_HOST),
                'key' => $key,
                'keyLocation' => SiteUrls::SITE . "/$key.txt",
                'urlList' => array_values(array_unique($urls)),
            ]);

            if (!$response->successful()) {
                Log::warning('IndexNow submission rejected', [
                    'status' => $response->status(),
                    'body' => mb_substr($response->body(), 0, 500),
                    'count' => count($urls),
                ]);
            }

            return $response->status();
        } catch (\Throwable $e) {
            Log::warning('IndexNow submission failed: ' . $e->getMessage());
            return null;
        }
    }

    private function enabled(): bool
    {
        return (bool) config('services.indexnow.enabled') && (bool) config('services.indexnow.key');
    }
}
