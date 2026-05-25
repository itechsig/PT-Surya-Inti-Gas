<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class RealTimeAnalyticsService
{
    private AdvancedCacheService $cacheService;

    public function __construct(AdvancedCacheService $cacheService = null)
    {
        $this->cacheService = $cacheService ?? app(AdvancedCacheService::class);
    }

    /**
     * Track user interaction for analytics
     */
    public function trackInteraction(array $data): bool
    {
        try {
            $sessionId = $data['session_id'] ?? $this->getSessionId();
            
            $interaction = [
                'user_id' => $data['user_id'] ?? null,
                'session_id' => $sessionId,
                'message' => $data['message'] ?? '',
                'response_source' => $data['response_source'] ?? 'unknown',
                'response_time' => $data['response_time'] ?? 0,
                'timestamp' => now()->toISOString(),
                'metadata' => $data['metadata'] ?? [],
            ];

            // Store in database for long-term analytics
            DB::table('analytics_interactions')->insert($interaction);

            // Update real-time metrics in cache
            $this->updateRealTimeMetrics($interaction);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to track interaction', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Update real-time metrics in cache
     */
    private function updateRealTimeMetrics(array $interaction): void
    {
        $today = now()->format('Y-m-d');
        $metricsKey = "analytics_metrics_{$today}";

        $metrics = $this->cacheService->get($metricsKey) ?? [
            'total_interactions' => 0,
            'unique_users' => [],
            'response_sources' => [],
            'avg_response_time' => 0,
            'peak_hour' => 0,
            'hourly_distribution' => [],
        ];

        // Update total interactions
        $metrics['total_interactions']++;

        // Track unique users
        if ($interaction['user_id']) {
            $metrics['unique_users'][$interaction['user_id']] = true;
        } else {
            $metrics['unique_users'][$interaction['session_id']] = true;
        }

        // Track response sources
        $source = $interaction['response_source'];
        $metrics['response_sources'][$source] = ($metrics['response_sources'][$source] ?? 0) + 1;

        // Update average response time
        $currentAvg = $metrics['avg_response_time'];
        $newResponseTime = $interaction['response_time'];
        $metrics['avg_response_time'] = (($currentAvg * ($metrics['total_interactions'] - 1)) + $newResponseTime) / $metrics['total_interactions'];

        // Track hourly distribution
        $hour = now()->hour;
        $metrics['hourly_distribution'][$hour] = ($metrics['hourly_distribution'][$hour] ?? 0) + 1;

        // Update peak hour
        if ($metrics['hourly_distribution'][$hour] > ($metrics['hourly_distribution'][$metrics['peak_hour']] ?? 0)) {
            $metrics['peak_hour'] = $hour;
        }

        // Store updated metrics with tag for easy invalidation
        $this->cacheService->store($metricsKey, $metrics, 86400); // 24 hours
    }

    /**
     * Get real-time dashboard metrics
     */
    public function getDashboardMetrics(): array
    {
        $today = now()->format('Y-m-d');
        $metricsKey = "analytics_metrics_{$today}";

        $metrics = $this->cacheService->get($metricsKey);

        if (!$metrics) {
            return $this->getEmptyMetrics();
        }

        return [
            'total_interactions' => $metrics['total_interactions'],
            'unique_users' => count($metrics['unique_users']),
            'response_sources' => $metrics['response_sources'],
            'avg_response_time' => round($metrics['avg_response_time'], 2),
            'peak_hour' => $metrics['peak_hour'],
            'hourly_distribution' => $metrics['hourly_distribution'],
            'trend_comparison' => $this->getTrendComparison(),
        ];
    }

    /**
     * Get trend comparison with previous period
     */
    private function getTrendComparison(): array
    {
        $today = now()->format('Y-m-d');
        $yesterday = now()->subDay()->format('Y-m-d');

        $todayMetrics = $this->cacheService->get("analytics_metrics_{$today}");
        $yesterdayMetrics = $this->cacheService->get("analytics_metrics_{$yesterday}");

        if (!$todayMetrics || !$yesterdayMetrics) {
            return [
                'interactions_change' => 0,
                'interactions_percentage' => 0,
                'users_change' => 0,
                'users_percentage' => 0,
            ];
        }

        $interactionsChange = $todayMetrics['total_interactions'] - $yesterdayMetrics['total_interactions'];
        $interactionsPercentage = $yesterdayMetrics['total_interactions'] > 0 
            ? round(($interactionsChange / $yesterdayMetrics['total_interactions']) * 100, 2) 
            : 0;

        $usersChange = count($todayMetrics['unique_users']) - count($yesterdayMetrics['unique_users']);
        $usersPercentage = count($yesterdayMetrics['unique_users']) > 0 
            ? round(($usersChange / count($yesterdayMetrics['unique_users'])) * 100, 2) 
            : 0;

        return [
            'interactions_change' => $interactionsChange,
            'interactions_percentage' => $interactionsPercentage,
            'users_change' => $usersChange,
            'users_percentage' => $usersPercentage,
        ];
    }

    /**
     * Get popular questions
     */
    public function getPopularQuestions(int $limit = 10, int $days = 7): array
    {
        $cacheKey = "popular_questions_{$days}_{$limit}";
        
        return $this->cacheService->remember($cacheKey, function () use ($limit, $days) {
            return DB::table('analytics_interactions')
                ->select('message', DB::raw('COUNT(*) as count'))
                ->where('timestamp', '>=', now()->subDays($days)->toDateTimeString())
                ->groupBy('message')
                ->orderByDesc('count')
                ->limit($limit)
                ->get()
                ->map(function ($item) {
                    return [
                        'question' => $item->message,
                        'count' => $item->count,
                        'category' => $this->categorizeQuestion($item->message),
                    ];
                })
                ->toArray();
        }, 3600); // Cache for 1 hour
    }

    /**
     * Categorize question based on keywords
     */
    public function categorizeQuestion(string $question): string
    {
        $question = strtolower($question);

        if (preg_match('/(halo|hai|hello|selamat)/i', $question)) {
            return 'greeting';
        }
        if (preg_match('/(produk|barang|item|jual)/i', $question)) {
            return 'products';
        }
        if (preg_match('/(layanan|service|jasa)/i', $question)) {
            return 'services';
        }
        if (preg_match('/(kontak|hubungi|alamat|lokasi)/i', $question)) {
            return 'contact';
        }
        if (preg_match('/(perusahaan|tentang|profil)/i', $question)) {
            return 'company';
        }
        if (preg_match('/(harga|price|biaya)/i', $question)) {
            return 'pricing';
        }

        return 'other';
    }

    /**
     * Get recent interactions from database
     */
    public function getRecentInteractions(int $limit = 100): array
    {
        try {
            return DB::table('analytics_interactions')
                ->orderBy('timestamp', 'desc')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            Log::error('Failed to get recent interactions', ['error' => $e->getMessage()]);
            return [];
        }
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

    /**
     * Get response source distribution
     */
    public function getSourceDistribution(int $days = 7): array
    {
        $cacheKey = "source_distribution_{$days}";
        
        return $this->cacheService->remember($cacheKey, function () use ($days) {
            return DB::table('analytics_interactions')
                ->select('response_source', DB::raw('COUNT(*) as count'))
                ->where('timestamp', '>=', now()->subDays($days)->toDateTimeString())
                ->groupBy('response_source')
                ->get()
                ->pluck('count', 'response_source')
                ->toArray();
        }, 3600);
    }

    /**
     * Get performance metrics
     */
    public function getPerformanceMetrics(int $hours = 24): array
    {
        $cacheKey = "performance_metrics_{$hours}";
        
        return $this->cacheService->remember($cacheKey, function () use ($hours) {
            $metrics = DB::table('analytics_interactions')
                ->select(
                    DB::raw('AVG(response_time) as avg_response_time'),
                    DB::raw('MAX(response_time) as max_response_time'),
                    DB::raw('MIN(response_time) as min_response_time'),
                    DB::raw('COUNT(*) as total_requests')
                )
                ->where('timestamp', '>=', now()->subHours($hours)->toDateTimeString())
                ->first();

            return [
                'avg_response_time' => round($metrics->avg_response_time ?? 0, 2),
                'max_response_time' => round($metrics->max_response_time ?? 0, 2),
                'min_response_time' => round($metrics->min_response_time ?? 0, 2),
                'total_requests' => $metrics->total_requests ?? 0,
                'requests_per_hour' => round(($metrics->total_requests ?? 0) / $hours, 2),
            ];
        }, 1800); // Cache for 30 minutes
    }

    /**
     * Get user engagement metrics
     */
    public function getUserEngagementMetrics(int $days = 7): array
    {
        $cacheKey = "user_engagement_{$days}";
        
        return $this->cacheService->remember($cacheKey, function () use ($days) {
            $metrics = DB::table('analytics_interactions')
                ->select(
                    DB::raw('COUNT(DISTINCT session_id) as total_sessions'),
                    DB::raw('COUNT(DISTINCT user_id) as total_users'),
                    DB::raw('COUNT(*) as total_interactions'),
                    DB::raw('COUNT(*) / COUNT(DISTINCT session_id) as avg_interactions_per_session')
                )
                ->where('timestamp', '>=', now()->subDays($days)->toDateTimeString())
                ->first();

            return [
                'total_sessions' => $metrics->total_sessions ?? 0,
                'total_users' => $metrics->total_users ?? 0,
                'total_interactions' => $metrics->total_interactions ?? 0,
                'avg_interactions_per_session' => round($metrics->avg_interactions_per_session ?? 0, 2),
            ];
        }, 3600);
    }

    /**
     * Get time-series data for charts
     */
    public function getTimeSeriesData(string $metric, int $days = 7): array
    {
        $cacheKey = "timeseries_{$metric}_{$days}";
        
        return $this->cacheService->remember($cacheKey, function () use ($metric, $days) {
            $data = DB::table('analytics_interactions')
                ->select(
                    DB::raw('DATE(timestamp) as date'),
                    DB::raw('COUNT(*) as count'),
                    DB::raw('AVG(response_time) as avg_response_time')
                )
                ->where('timestamp', '>=', now()->subDays($days)->toDateTimeString())
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function ($item) use ($metric) {
                    return [
                        'date' => $item->date,
                        'value' => $metric === 'response_time' ? round($item->avg_response_time, 2) : $item->count,
                    ];
                })
                ->toArray();

            return $data;
        }, 3600);
    }

    /**
     * Get comprehensive analytics summary
     */
    public function getAnalyticsSummary(): array
    {
        return [
            'dashboard' => $this->getDashboardMetrics(),
            'popular_questions' => $this->getPopularQuestions(10),
            'source_distribution' => $this->getSourceDistribution(),
            'performance' => $this->getPerformanceMetrics(),
            'user_engagement' => $this->getUserEngagementMetrics(),
            'time_series' => [
                'interactions' => $this->getTimeSeriesData('interactions', 7),
                'response_time' => $this->getTimeSeriesData('response_time', 7),
            ],
        ];
    }

    /**
     * Export analytics data
     * @return array|string
     */
    public function exportData(string $startDate, string $endDate, string $format = 'json'): array|string
    {
        $data = DB::table('analytics_interactions')
            ->whereBetween('timestamp', [$startDate, $endDate])
            ->orderBy('timestamp')
            ->get()
            ->toArray();

        if ($format === 'csv') {
            return $this->convertToCsv($data);
        }

        return $data;
    }

    /**
     * Convert data to CSV format
     */
    private function convertToCsv(array $data): string
    {
        if (empty($data)) {
            return '';
        }

        $headers = array_keys((array) $data[0]);
        $csv = implode(',', $headers) . "\n";

        foreach ($data as $row) {
            $row = (array) $row;
            $csv .= implode(',', array_map(function($value) {
                return is_array($value) ? json_encode($value) : $value;
            }, $row)) . "\n";
        }

        return $csv;
    }

    /**
     * Get empty metrics structure
     */
    private function getEmptyMetrics(): array
    {
        return [
            'total_interactions' => 0,
            'unique_users' => 0,
            'response_sources' => [],
            'avg_response_time' => 0,
            'peak_hour' => 0,
            'hourly_distribution' => [],
            'trend_comparison' => [
                'interactions_change' => 0,
                'interactions_percentage' => 0,
                'users_change' => 0,
                'users_percentage' => 0,
            ],
        ];
    }

    /**
     * Clear analytics cache
     */
    public function clearCache(): bool
    {
        return $this->cacheService->clearPattern('analytics_*');
    }
}
