<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

/**
 * ABTestingService
 * 
 * A/B testing service for chatbot responses.
 * Allows testing different response variations to determine optimal configurations.
 * 
 * Features:
 * - Campaign management (create, start, pause, complete)
 * - Variant management with different response configurations
 * - User assignment to variants with consistent hashing
 * - Performance tracking (impressions, engagements, conversions)
 * - Statistical analysis and winner determination
 * - Real-time metrics calculation
 */
class ABTestingService
{
    /**
     * Cache keys
     */
    private const CACHE_KEY_ACTIVE_CAMPAIGNS = 'ab_testing:active_campaigns';
    private const CACHE_KEY_USER_ASSIGNMENT = 'ab_testing:user_assignment:';
    private const CACHE_KEY_CAMPAIGN_STATS = 'ab_testing:campaign_stats:';
    private const CACHE_TTL_SECONDS = 3600; // 1 hour

    /**
     * Create a new A/B test campaign
     */
    public function createCampaign(array $data): int
    {
        try {
            $campaignId = DB::table('ab_test_campaigns')->insertGetId([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'status' => 'draft',
                'start_date' => $data['start_date'] ?? null,
                'end_date' => $data['end_date'] ?? null,
                'target_conditions' => $data['target_conditions'] ?? null,
                'traffic_split' => $data['traffic_split'] ?? 0.5,
                'sample_size' => $data['sample_size'] ?? null,
                'success_metric' => $data['success_metric'] ?? 'engagement',
                'metadata' => $data['metadata'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create variants for the campaign
            if (isset($data['variants']) && is_array($data['variants'])) {
                foreach ($data['variants'] as $index => $variant) {
                    $this->createVariant($campaignId, $variant, $index === 0);
                }
            }

            $this->clearActiveCampaignsCache();
            Log::info("A/B test campaign created", ['campaign_id' => $campaignId]);

            return $campaignId;
        } catch (\Exception $e) {
            Log::error('Failed to create A/B test campaign', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Create a variant for a campaign
     */
    private function createVariant(int $campaignId, array $data, bool $isControl = false): int
    {
        return DB::table('ab_test_variants')->insertGetId([
            'campaign_id' => $campaignId,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'response_template' => $data['response_template'] ?? null,
            'response_config' => $data['response_config'] ?? null,
            'allocation' => $data['allocation'] ?? 0.5,
            'is_control' => $isControl,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Start a campaign
     */
    public function startCampaign(int $campaignId): bool
    {
        try {
            DB::table('ab_test_campaigns')
                ->where('id', $campaignId)
                ->update([
                    'status' => 'active',
                    'start_date' => now(),
                    'updated_at' => now(),
                ]);

            $this->clearActiveCampaignsCache();
            Log::info("A/B test campaign started", ['campaign_id' => $campaignId]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to start A/B test campaign', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Pause a campaign
     */
    public function pauseCampaign(int $campaignId): bool
    {
        try {
            DB::table('ab_test_campaigns')
                ->where('id', $campaignId)
                ->update([
                    'status' => 'paused',
                    'updated_at' => now(),
                ]);

            $this->clearActiveCampaignsCache();
            Log::info("A/B test campaign paused", ['campaign_id' => $campaignId]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to pause A/B test campaign', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Complete a campaign and determine winner
     */
    public function completeCampaign(int $campaignId): ?array
    {
        try {
            $winner = $this->determineWinner($campaignId);

            if ($winner) {
                DB::table('ab_test_campaigns')
                    ->where('id', $campaignId)
                    ->update([
                        'status' => 'completed',
                        'winner_variant' => $winner['variant_id'],
                        'end_date' => now(),
                        'updated_at' => now(),
                    ]);

                $this->clearActiveCampaignsCache();
                Log::info("A/B test campaign completed", ['campaign_id' => $campaignId, 'winner' => $winner]);

                return $winner;
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Failed to complete A/B test campaign', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Get active campaigns
     */
    public function getActiveCampaigns(): array
    {
        return Cache::remember(self::CACHE_KEY_ACTIVE_CAMPAIGNS, self::CACHE_TTL_SECONDS, function () {
            return DB::table('ab_test_campaigns')
                ->where('status', 'active')
                ->where(function ($query) {
                    $query->whereNull('start_date')
                          ->orWhere('start_date', '<=', now());
                })
                ->where(function ($query) {
                    $query->whereNull('end_date')
                          ->orWhere('end_date', '>', now());
                })
                ->get()
                ->toArray();
        });
    }

    /**
     * Assign user to variant for a campaign
     */
    public function assignUserToVariant(int $campaignId, ?string $userId, ?string $sessionId, string $question): ?array
    {
        try {
            // Check if user/session already has an assignment
            $identifier = $userId ?? $sessionId;
            
            $existingAssignment = DB::table('ab_test_assignments')
                ->where('campaign_id', $campaignId)
                ->where('user_identifier', $identifier)
                ->where('question', $question)
                ->first();

            if ($existingAssignment) {
                $variant = DB::table('ab_test_variants')
                    ->where('id', $existingAssignment->variant_id)
                    ->first();

                return [
                    'variant_id' => $variant->id,
                    'variant_name' => $variant->name,
                    'response_config' => $variant->response_config,
                    'response_template' => $variant->response_template,
                    'is_new_assignment' => false,
                ];
            }

            // Get active variants for the campaign
            $variants = DB::table('ab_test_variants')
                ->where('campaign_id', $campaignId)
                ->where('is_active', true)
                ->get()
                ->toArray();

            if (empty($variants)) {
                return null;
            }

            // Select variant based on allocation
            $selectedVariant = $this->selectVariantByAllocation($variants, $identifier);

            // Record assignment
            $assignmentId = DB::table('ab_test_assignments')->insertGetId([
                'campaign_id' => $campaignId,
                'variant_id' => $selectedVariant->id,
                'user_identifier' => $identifier,
                'session_id' => $sessionId,
                'question' => $question,
                'assigned_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Update variant impressions
            DB::table('ab_test_variants')
                ->where('id', $selectedVariant->id)
                ->increment('impressions');

            // Cache assignment
            $cacheKey = self::CACHE_KEY_USER_ASSIGNMENT . $campaignId . ':' . $identifier;
            Cache::put($cacheKey, $selectedVariant->id, self::CACHE_TTL_SECONDS);

            return [
                'variant_id' => $selectedVariant->id,
                'variant_name' => $selectedVariant->name,
                'response_config' => $selectedVariant->response_config,
                'response_template' => $selectedVariant->response_template,
                'is_new_assignment' => true,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to assign user to variant', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Select variant based on allocation using consistent hashing
     */
    private function selectVariantByAllocation(array $variants, string $identifier): object
    {
        // Use hash for consistent assignment
        $hash = crc32($identifier);
        $maxHash = 4294967295; // Max CRC32 value
        $normalizedHash = $hash / $maxHash;

        $cumulativeAllocation = 0;
        foreach ($variants as $variant) {
            $cumulativeAllocation += $variant->allocation;
            if ($normalizedHash <= $cumulativeAllocation) {
                return $variant;
            }
        }

        // Fallback to first variant
        return $variants[0];
    }

    /**
     * Track engagement for an assignment
     */
    public function trackEngagement(int $campaignId, string $identifier, bool $engaged, ?int $rating = null, ?string $feedback = null): bool
    {
        try {
            $assignment = DB::table('ab_test_assignments')
                ->where('campaign_id', $campaignId)
                ->where('user_identifier', $identifier)
                ->whereNull('engaged_at')
                ->first();

            if (!$assignment) {
                return false;
            }

            DB::table('ab_test_assignments')
                ->where('id', $assignment->id)
                ->update([
                    'engaged' => $engaged,
                    'rating' => $rating,
                    'feedback' => $feedback,
                    'engaged_at' => now(),
                    'updated_at' => now(),
                ]);

            // Update variant metrics
            if ($engaged) {
                DB::table('ab_test_variants')
                    ->where('id', $assignment->variant_id)
                    ->increment('engagements');
            }

            $this->updateVariantMetrics($assignment->variant_id);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to track engagement', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Track conversion for an assignment
     */
    public function trackConversion(int $campaignId, string $identifier): bool
    {
        try {
            $assignment = DB::table('ab_test_assignments')
                ->where('campaign_id', $campaignId)
                ->where('user_identifier', $identifier)
                ->first();

            if (!$assignment) {
                return false;
            }

            DB::table('ab_test_assignments')
                ->where('id', $assignment->id)
                ->update([
                    'converted' => true,
                    'updated_at' => now(),
                ]);

            // Update variant metrics
            DB::table('ab_test_variants')
                ->where('id', $assignment->variant_id)
                ->increment('conversions');

            $this->updateVariantMetrics($assignment->variant_id);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to track conversion', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Update variant metrics
     */
    private function updateVariantMetrics(int $variantId): void
    {
        $variant = DB::table('ab_test_variants')->where('id', $variantId)->first();

        if ($variant) {
            $conversionRate = $variant->impressions > 0 
                ? ($variant->conversions / $variant->impressions) * 100 
                : 0;
            
            $engagementRate = $variant->impressions > 0 
                ? ($variant->engagements / $variant->impressions) * 100 
                : 0;

            DB::table('ab_test_variants')
                ->where('id', $variantId)
                ->update([
                    'conversion_rate' => $conversionRate,
                    'engagement_rate' => $engagementRate,
                    'updated_at' => now(),
                ]);
        }
    }

    /**
     * Get campaign statistics
     */
    public function getCampaignStats(int $campaignId): array
    {
        $cacheKey = self::CACHE_KEY_CAMPAIGN_STATS . $campaignId;

        return Cache::remember($cacheKey, self::CACHE_TTL_SECONDS, function () use ($campaignId) {
            $campaign = DB::table('ab_test_campaigns')->where('id', $campaignId)->first();
            
            if (!$campaign) {
                return [];
            }

            $variants = DB::table('ab_test_variants')
                ->where('campaign_id', $campaignId)
                ->get()
                ->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'name' => $variant->name,
                        'is_control' => $variant->is_control,
                        'impressions' => $variant->impressions,
                        'engagements' => $variant->engagements,
                        'conversions' => $variant->conversions,
                        'conversion_rate' => $variant->conversion_rate,
                        'engagement_rate' => $variant->engagement_rate,
                        'allocation' => $variant->allocation,
                    ];
                })
                ->toArray();

            $totalImpressions = array_sum(array_column($variants, 'impressions'));
            $totalEngagements = array_sum(array_column($variants, 'engagements'));
            $totalConversions = array_sum(array_column($variants, 'conversions'));

            return [
                'campaign' => [
                    'id' => $campaign->id,
                    'name' => $campaign->name,
                    'status' => $campaign->status,
                    'start_date' => $campaign->start_date,
                    'end_date' => $campaign->end_date,
                    'success_metric' => $campaign->success_metric,
                    'winner_variant' => $campaign->winner_variant,
                ],
                'variants' => $variants,
                'summary' => [
                    'total_impressions' => $totalImpressions,
                    'total_engagements' => $totalEngagements,
                    'total_conversions' => $totalConversions,
                    'overall_engagement_rate' => $totalImpressions > 0 ? ($totalEngagements / $totalImpressions) * 100 : 0,
                    'overall_conversion_rate' => $totalImpressions > 0 ? ($totalConversions / $totalImpressions) * 100 : 0,
                ],
            ];
        });
    }

    /**
     * Determine winner based on success metric
     */
    public function determineWinner(int $campaignId): ?array
    {
        $stats = $this->getCampaignStats($campaignId);

        if (empty($stats) || empty($stats['variants'])) {
            return null;
        }

        $campaign = $stats['campaign'];
        $variants = $stats['variants'];

        $winner = null;
        $bestScore = -1;

        foreach ($variants as $variant) {
            $score = 0;

            switch ($campaign['success_metric']) {
                case 'conversion':
                    $score = $variant['conversion_rate'];
                    break;
                case 'engagement':
                default:
                    $score = $variant['engagement_rate'];
                    break;
            }

            if ($score > $bestScore) {
                $bestScore = $score;
                $winner = $variant;
            }
        }

        return $winner;
    }

    /**
     * Clear active campaigns cache
     */
    private function clearActiveCampaignsCache(): void
    {
        Cache::forget(self::CACHE_KEY_ACTIVE_CAMPAIGNS);
    }

    /**
     * Get all campaigns
     */
    public function getAllCampaigns(): array
    {
        return DB::table('ab_test_campaigns')
            ->orderBy('created_at', 'desc')
            ->get()
            ->toArray();
    }

    /**
     * Get campaign by ID
     */
    public function getCampaign(int $campaignId): ?array
    {
        $campaign = DB::table('ab_test_campaigns')->where('id', $campaignId)->first();

        if (!$campaign) {
            return null;
        }

        return (array) $campaign;
    }

    /**
     * Get variants for a campaign
     */
    public function getCampaignVariants(int $campaignId): array
    {
        return DB::table('ab_test_variants')
            ->where('campaign_id', $campaignId)
            ->get()
            ->toArray();
    }

    /**
     * Delete campaign
     */
    public function deleteCampaign(int $campaignId): bool
    {
        try {
            DB::table('ab_test_campaigns')->where('id', $campaignId)->delete();
            $this->clearActiveCampaignsCache();
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to delete campaign', ['error' => $e->getMessage()]);
            return false;
        }
    }
}