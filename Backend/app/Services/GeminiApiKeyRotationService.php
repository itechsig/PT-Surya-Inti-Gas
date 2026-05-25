<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GeminiApiKeyRotationService
{
    private array $apiKeys;
    private string $rotationStrategy;
    private bool $rotationEnabled;
    
    // Cache keys for tracking usage
    private const CACHE_KEY_PREFIX = 'gemini_key_usage_';
    private const ROTATION_CACHE_KEY = 'gemini_current_key_index';

    public function __construct()
    {
        $this->apiKeys = $this->parseApiKeys();
        $this->rotationStrategy = (string) config('services.gemini.rotation_strategy', 'round_robin');
        $this->rotationEnabled = (bool) config('services.gemini.rotation_enabled', true);
    }

    /**
     * Parse API keys from configuration
     */
    private function parseApiKeys(): array
    {
        $keysString = config('services.gemini.api_keys', '');
        
        if (empty($keysString)) {
            // Fallback to single key for backward compatibility
            $singleKey = env('GEMINI_API_KEY', '');
            return $singleKey ? [$singleKey] : [];
        }

        // Support comma-separated keys or array format
        if (is_string($keysString)) {
            return array_filter(array_map('trim', explode(',', $keysString)));
        }

        return (array) $keysString;
    }

    /**
     * Get current API key based on rotation strategy
     */
    public function getCurrentApiKey(): string
    {
        if (empty($this->apiKeys)) {
            Log::warning('No Gemini API keys configured');
            return '';
        }

        // If rotation is disabled or only one key, return the first one
        if (!$this->rotationEnabled || count($this->apiKeys) === 1) {
            return $this->apiKeys[0];
        }

        return match ($this->rotationStrategy) {
            'round_robin' => $this->getRoundRobinKey(),
            'random' => $this->getRandomKey(),
            'least_used' => $this->getLeastUsedKey(),
            default => $this->getRoundRobinKey(),
        };
    }

    /**
     * Get key using round-robin strategy
     */
    private function getRoundRobinKey(): string
    {
        $currentIndex = Cache::get(self::ROTATION_CACHE_KEY, 0);
        $nextIndex = ($currentIndex + 1) % count($this->apiKeys);
        
        Cache::put(self::ROTATION_CACHE_KEY, $nextIndex, now()->addDay());
        
        return $this->apiKeys[$nextIndex];
    }

    /**
     * Get random key
     */
    private function getRandomKey(): string
    {
        $randomIndex = array_rand($this->apiKeys);
        return $this->apiKeys[$randomIndex];
    }

    /**
     * Get least used key
     */
    private function getLeastUsedKey(): string
    {
        $usageCounts = [];
        
        foreach ($this->apiKeys as $index => $key) {
            $cacheKey = self::CACHE_KEY_PREFIX . md5($key);
            $usageCounts[$index] = (int) Cache::get($cacheKey, 0);
        }

        // Sort by usage count (ascending)
        asort($usageCounts);
        
        // Get the key with lowest usage
        $leastUsedIndex = array_key_first($usageCounts);
        
        // Increment usage counter
        $cacheKey = self::CACHE_KEY_PREFIX . md5($this->apiKeys[$leastUsedIndex]);
        Cache::increment($cacheKey);
        Cache::expire($cacheKey, now()->addHour());
        
        return $this->apiKeys[$leastUsedIndex];
    }

    /**
     * Record API key usage for tracking
     */
    public function recordKeyUsage(string $apiKey): void
    {
        if (!$this->rotationEnabled || $this->rotationStrategy !== 'least_used') {
            return;
        }

        $cacheKey = self::CACHE_KEY_PREFIX . md5($apiKey);
        Cache::increment($cacheKey);
        Cache::expire($cacheKey, now()->addHour());
    }

    /**
     * Mark API key as failed (for fallback to next key)
     */
    public function markKeyAsFailed(string $apiKey): void
    {
        Log::warning('Gemini API key marked as failed', ['key_hash' => md5($apiKey)]);
        
        // In production, you might want to temporarily disable this key
        // and rotate to the next available key
        if ($this->rotationStrategy === 'round_robin') {
            $currentIndex = Cache::get(self::ROTATION_CACHE_KEY, 0);
            $nextIndex = ($currentIndex + 1) % count($this->apiKeys);
            Cache::put(self::ROTATION_CACHE_KEY, $nextIndex, now()->addDay());
        }
    }

    /**
     * Get all available API keys count
     */
    public function getAvailableKeysCount(): int
    {
        return count($this->apiKeys);
    }

    /**
     * Check if rotation is enabled
     */
    public function isRotationEnabled(): bool
    {
        return $this->rotationEnabled && count($this->apiKeys) > 1;
    }
}