<?php

namespace App\Services\Analytics;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Google Search Console (Search Analytics) integration for the "Google Search
 * Performance" dashboard section. Returns connected=false, with no network call,
 * whenever GOOGLE_SEARCH_CONSOLE_SITE_URL / _CREDENTIALS_PATH aren't configured — the
 * dashboard then renders its normal "not connected" empty state, never fabricated data.
 */
class SearchConsoleService
{
    private const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

    public function isConfigured(): bool
    {
        return (bool) config('services.search_console.site_url')
            && (bool) config('services.search_console.credentials_path');
    }

    /**
     * @return array{connected: bool, clicks?: int, impressions?: int, ctr?: float, position?: float, queries?: array<int, array<string, mixed>>}
     */
    public function getSummary(\DateTimeInterface $start, \DateTimeInterface $end): array
    {
        if (!$this->isConfigured()) {
            return ['connected' => false];
        }

        $token = GoogleServiceAccountAuth::getAccessToken(
            config('services.search_console.credentials_path'),
            [self::SCOPE]
        );

        if (!$token) {
            return ['connected' => false];
        }

        try {
            $siteUrl = config('services.search_console.site_url');
            $endpoint = 'https://www.googleapis.com/webmasters/v3/sites/' . rawurlencode($siteUrl) . '/searchAnalytics/query';

            $response = Http::withToken($token)->post($endpoint, [
                'startDate' => $start->format('Y-m-d'),
                'endDate' => $end->format('Y-m-d'),
                'dimensions' => ['query'],
                'rowLimit' => 25,
            ]);

            if (!$response->successful()) {
                Log::warning('Search Console query failed', ['status' => $response->status()]);
                return ['connected' => false];
            }

            $rows = $response->json('rows') ?? [];

            $queries = array_map(static fn (array $row) => [
                'query' => $row['keys'][0] ?? '',
                'clicks' => (int) ($row['clicks'] ?? 0),
                'impressions' => (int) ($row['impressions'] ?? 0),
                'ctr' => round((float) ($row['ctr'] ?? 0) * 100, 2),
                'position' => round((float) ($row['position'] ?? 0), 1),
            ], $rows);

            $totalClicks = (int) array_sum(array_column($queries, 'clicks'));
            $totalImpressions = (int) array_sum(array_column($queries, 'impressions'));

            return [
                'connected' => true,
                'clicks' => $totalClicks,
                'impressions' => $totalImpressions,
                'ctr' => $totalImpressions > 0 ? round($totalClicks / $totalImpressions * 100, 2) : 0.0,
                'position' => count($queries) > 0 ? round(array_sum(array_column($queries, 'position')) / count($queries), 1) : 0.0,
                'queries' => $queries,
            ];
        } catch (\Throwable $e) {
            Log::warning('Search Console summary error', ['error' => $e->getMessage()]);
            return ['connected' => false];
        }
    }
}
