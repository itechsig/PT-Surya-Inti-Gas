<?php

namespace App\Services\Analytics;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * GA4 Data API integration — scaffold for future use. Not consumed by any dashboard
 * section yet: Traffic Trend/Source currently run on this app's own first-party visitor
 * tracking (the only pipeline with real data today, since no GA4 property/credentials
 * exist yet). Ready to wire in as an additional/alternate data source once configured.
 */
class GoogleAnalyticsService
{
    private const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

    public function isConfigured(): bool
    {
        return (bool) config('services.ga4.property_id')
            && (bool) config('services.ga4.credentials_path');
    }

    public function isConnected(): bool
    {
        if (!$this->isConfigured()) {
            return false;
        }

        return (bool) GoogleServiceAccountAuth::getAccessToken(
            config('services.ga4.credentials_path'),
            [self::SCOPE]
        );
    }

    /**
     * Thin passthrough to GA4's runReport, for future use.
     * @param string[] $dimensions
     * @param string[] $metrics
     */
    public function runReport(array $dimensions, array $metrics, \DateTimeInterface $start, \DateTimeInterface $end): ?array
    {
        if (!$this->isConfigured()) {
            return null;
        }

        $token = GoogleServiceAccountAuth::getAccessToken(
            config('services.ga4.credentials_path'),
            [self::SCOPE]
        );

        if (!$token) {
            return null;
        }

        try {
            $propertyId = config('services.ga4.property_id');
            $endpoint = "https://analyticsdata.googleapis.com/v1beta/properties/{$propertyId}:runReport";

            $response = Http::withToken($token)->post($endpoint, [
                'dateRanges' => [['startDate' => $start->format('Y-m-d'), 'endDate' => $end->format('Y-m-d')]],
                'dimensions' => array_map(static fn (string $d) => ['name' => $d], $dimensions),
                'metrics' => array_map(static fn (string $m) => ['name' => $m], $metrics),
            ]);

            if (!$response->successful()) {
                Log::warning('GA4 runReport failed', ['status' => $response->status()]);
                return null;
            }

            return $response->json();
        } catch (\Throwable $e) {
            Log::warning('GA4 runReport error', ['error' => $e->getMessage()]);
            return null;
        }
    }
}
