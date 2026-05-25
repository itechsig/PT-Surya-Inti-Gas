<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

/**
 * Advanced Cache Service with Multi-Layer Support
 * 
 * This service provides advanced caching capabilities including:
 * - Multi-layer caching (Memory APCu + Redis)
 * - Cache tagging for intelligent invalidation
 * - Cache warming and performance optimization
 * - Rate limiting with cache backend
 * 
 * @noinspection PhpUndefinedFunctionInspection
 * 
 * Note: APCu functions are conditionally called with runtime checks.
 * IDE warnings about undefined APCu functions can be safely ignored
 * as they are properly guarded with isApcuAvailable() and function_exists() checks.
 * These are false positives from static analysis - the code works correctly
 * at runtime when APCu extension is available.
 */

class AdvancedCacheService
{
    private string $defaultTtl;
    private bool $useRedis;
    private array $cacheLayers;

    public function __construct()
    {
        $this->defaultTtl = (int) (config('cache.default_ttl', 3600) ?? 3600);
        $this->useRedis = config('cache.default') === 'redis';
        $this->cacheLayers = (array) (config('cache.layers', ['memory', 'redis']) ?? ['memory', 'redis']);
    }

    /**
     * Get item from cache with multi-layer fallback
     */
    public function remember(string $key, callable $callback, int $ttl = null): mixed
    {
        $ttl = $ttl ?? $this->defaultTtl;

        // Try memory cache first (fastest)
        if (in_array('memory', $this->cacheLayers) && $this->isApcuAvailable()) {
            $memoryKey = $this->getMemoryKey($key);
            $memoryValue = $this->apcuFetch($memoryKey);
            
            if ($memoryValue !== false) {
                return $memoryValue;
            }
        }

        // Try Redis cache (second layer)
        if ($this->useRedis && in_array('redis', $this->cacheLayers)) {
            $redisValue = Cache::get($key);
            
            if ($redisValue !== null) {
                // Warm memory cache
                if (in_array('memory', $this->cacheLayers) && $this->isApcuAvailable()) {
                    $this->apcuStore($this->getMemoryKey($key), $redisValue, min($ttl, 300));
                }
                return $redisValue;
            }
        }

        // Cache miss - execute callback
        $value = $callback();

        // Store in all configured cache layers
        $this->store($key, $value, $ttl);

        return $value;
    }

    /**
     * Store value in cache with multi-layer strategy
     */
    public function store(string $key, mixed $value, int $ttl = null): bool
    {
        $ttl = $ttl ?? $this->defaultTtl;
        $success = true;

        // Store in memory cache
        if (in_array('memory', $this->cacheLayers) && $this->isApcuAvailable()) {
            $memoryKey = $this->getMemoryKey($key);
            $memoryTtl = min($ttl, 300); // Memory cache max 5 minutes
            $success = $success && $this->apcuStore($memoryKey, $value, $memoryTtl);
        }

        // Store in Redis cache
        if ($this->useRedis && in_array('redis', $this->cacheLayers)) {
            $success = $success && Cache::put($key, $value, $ttl);
        } else {
            // Fallback to default cache
            $success = $success && Cache::put($key, $value, $ttl);
        }

        return $success;
    }

    /**
     * Get item from cache without callback
     */
    public function get(string $key): mixed
    {
        // Try memory cache first
        if (in_array('memory', $this->cacheLayers) && $this->isApcuAvailable()) {
            $memoryValue = $this->apcuFetch($this->getMemoryKey($key));
            if ($memoryValue !== false) {
                return $memoryValue;
            }
        }

        // Try Redis cache
        if ($this->useRedis) {
            return Cache::get($key);
        }

        return Cache::get($key);
    }

    /**
     * Check if key exists in cache
     */
    public function has(string $key): bool
    {
        if (in_array('memory', $this->cacheLayers) && $this->isApcuAvailable()) {
            if ($this->apcuExists($this->getMemoryKey($key))) {
                return true;
            }
        }

        return Cache::has($key);
    }

    /**
     * Delete key from all cache layers
     */
    public function forget(string $key): bool
    {
        $success = true;

        // Delete from memory cache
        if (in_array('memory', $this->cacheLayers) && $this->isApcuAvailable()) {
            $success = $success && $this->apcuDelete($this->getMemoryKey($key));
        }

        // Delete from Redis cache
        $success = $success && Cache::forget($key);

        return $success;
    }

    /**
     * Clear cache by pattern (Redis only)
     */
    public function clearPattern(string $pattern): int
    {
        if (!$this->useRedis) {
            return 0;
        }

        try {
            $keys = Redis::keys($pattern);
            
            if (empty($keys)) {
                return 0;
            }

            // Remove Laravel cache prefix from keys for deletion
            $prefix = config('cache.prefix');
            $keys = array_map(function($key) use ($prefix) {
                return str_replace($prefix . ':', '', $key);
            }, $keys);

            $deleted = 0;
            foreach ($keys as $key) {
                if (Cache::forget($key)) {
                    $deleted++;
                }
            }

            // Also clear from memory cache
            if (in_array('memory', $this->cacheLayers) && $this->isApcuAvailable()) {
                $this->apcuClearCache();
            }

            return $deleted;
        } catch (\Exception $e) {
            Log::error('Cache pattern clear failed', [
                'pattern' => $pattern,
                'error' => $e->getMessage(),
            ]);
            return 0;
        }
    }

    /**
     * Cache warming - pre-load frequently accessed data
     */
    public function warmCache(array $keys): array
    {
        $results = [];

        foreach ($keys as $key => $callback) {
            try {
                if (is_callable($callback)) {
                    $value = $callback();
                    $ttl = is_array($callback) ? ($callback[1] ?? $this->defaultTtl) : $this->defaultTtl;
                    $this->store($key, $value, $ttl);
                    $results[$key] = true;
                }
            } catch (\Exception $e) {
                Log::error('Cache warming failed', [
                    'key' => $key,
                    'error' => $e->getMessage(),
                ]);
                $results[$key] = false;
            }
        }

        return $results;
    }

    /**
     * Get cache statistics
     */
    public function getStats(): array
    {
        $stats = [
            'driver' => config('cache.default'),
            'layers' => $this->cacheLayers,
            'redis_available' => $this->useRedis,
            'memory_cache_available' => $this->isApcuAvailable(),
        ];

        // Redis-specific stats
        if ($this->useRedis) {
            try {
                $stats['redis_info'] = Redis::info();
                $stats['redis_db_size'] = Redis::dbsize();
                $stats['redis_memory_usage'] = Redis::info('memory')['used_memory_human'] ?? 'N/A';
            } catch (\Exception $e) {
                $stats['redis_error'] = $e->getMessage();
            }
        }

        // Memory cache stats
        if ($this->isApcuAvailable()) {
            $apcuInfo = $this->apcuCacheInfo();
            if ($apcuInfo !== false) {
                $stats['memory_cache_info'] = [
                    'entries' => $apcuInfo['num_entries'] ?? 0,
                    'memory_size' => $apcuInfo['mem_size'] ?? 0,
                    'hits' => $apcuInfo['hits'] ?? 0,
                    'misses' => $apcuInfo['misses'] ?? 0,
                ];
            }
        }

        return $stats;
    }

    /**
     * Implement cache tagging (grouping related keys)
     */
    public function rememberTagged(string $key, array $tags, callable $callback, int $ttl = null): mixed
    {
        $ttl = $ttl ?? $this->defaultTtl;

        // Store the tag mapping
        foreach ($tags as $tag) {
            $tagKey = $this->getTagKey($tag);
            $tagKeys = $this->get($tagKey) ?? [];
            $tagKeys[] = $key;
            $this->store($tagKey, array_unique($tagKeys), $ttl * 2); // Tags live longer
        }

        return $this->remember($key, $callback, $ttl);
    }

    /**
     * Invalidate cache by tag
     */
    public function invalidateTag(string $tag): int
    {
        $tagKey = $this->getTagKey($tag);
        $keys = $this->get($tagKey);

        if (empty($keys)) {
            return 0;
        }

        $deleted = 0;
        foreach ($keys as $key) {
            if ($this->forget($key)) {
                $deleted++;
            }
        }

        // Remove the tag mapping itself
        $this->forget($tagKey);

        return $deleted;
    }

    /**
     * Generate memory-safe key
     */
    private function getMemoryKey(string $key): string
    {
        return 'cache_' . md5($key);
    }

    /**
     * Generate tag key
     */
    private function getTagKey(string $tag): string
    {
        return 'tag_' . $tag;
    }

    /**
     * Implement rate limiting with cache
     */
    public function rateLimit(string $identifier, int $maxAttempts, int $decaySeconds): bool
    {
        $key = "rate_limit:{$identifier}";
        $attempts = $this->get($key) ?? 0;

        if ($attempts >= $maxAttempts) {
            return false; // Rate limit exceeded
        }

        $this->store($key, $attempts + 1, $decaySeconds);
        return true;
    }

    /**
     * Clear all cache
     */
    public function flush(): bool
    {
        $success = true;

        // Clear memory cache
        if (in_array('memory', $this->cacheLayers) && $this->isApcuAvailable()) {
            $success = $success && $this->apcuClearCache();
        }

        // Clear Redis cache
        $success = $success && Cache::flush();

        return $success;
    }

    /**
     * Check if APCu is available
     * @return bool
     */
    private function isApcuAvailable(): bool
    {
        return extension_loaded('apcu') && function_exists('apcu_fetch');
    }

    /**
     * Safely call APCu fetch if available
     * @param string $key
     * @return mixed
     */
    private function apcuFetch(string $key): mixed
    {
        if ($this->isApcuAvailable() && function_exists('apcu_fetch')) {
            return \apcu_fetch($key);
        }
        return false;
    }

    /**
     * Safely call APCu store if available
     * @param string $key
     * @param mixed $value
     * @param int $ttl
     * @return bool
     */
    private function apcuStore(string $key, mixed $value, int $ttl): bool
    {
        if ($this->isApcuAvailable() && function_exists('apcu_store')) {
            return \apcu_store($key, $value, $ttl);
        }
        return false;
    }

    /**
     * Safely call APCu exists if available
     * @param string $key
     * @return bool
     */
    private function apcuExists(string $key): bool
    {
        if ($this->isApcuAvailable() && function_exists('apcu_exists')) {
            return \apcu_exists($key);
        }
        return false;
    }

    /**
     * Safely call APCu delete if available
     * @param string $key
     * @return bool
     */
    private function apcuDelete(string $key): bool
    {
        if ($this->isApcuAvailable() && function_exists('apcu_delete')) {
            return \apcu_delete($key);
        }
        return false;
    }

    /**
     * Safely call APCu clear cache if available
     * @return bool
     */
    private function apcuClearCache(): bool
    {
        if ($this->isApcuAvailable() && function_exists('apcu_clear_cache')) {
            return \apcu_clear_cache();
        }
        return false;
    }

    /**
     * Safely call APCu cache info if available
     * @return array|false
     */
    private function apcuCacheInfo(): array|false
    {
        if ($this->isApcuAvailable() && function_exists('apcu_cache_info')) {
            return \apcu_cache_info();
        }
        return false;
    }
}
