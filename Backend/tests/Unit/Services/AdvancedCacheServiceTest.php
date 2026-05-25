<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\AdvancedCacheService;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Cache;

class AdvancedCacheServiceTest extends TestCase
{
    private AdvancedCacheService $cacheService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Configure test settings - disable memory cache if APCu not available
        Config::set('cache.default', 'array');
        Config::set('cache.layers', ['array']); // Use array instead of memory for testing
        Config::set('cache.default_ttl', 60);
        
        $this->cacheService = new AdvancedCacheService();
    }

    public function test_cache_service_initialization()
    {
        $this->assertInstanceOf(AdvancedCacheService::class, $this->cacheService);
    }

    public function test_remember_stores_and_retrieves_value()
    {
        $key = 'test_key';
        $value = 'test_value';
        
        $result = $this->cacheService->remember($key, function() use ($value) {
            return $value;
        });

        $this->assertEquals($value, $result);
        $this->assertEquals($value, $this->cacheService->get($key));
    }

    public function test_store_and_get()
    {
        $key = 'store_test';
        $value = ['data' => 'test'];
        
        $this->cacheService->store($key, $value);
        
        $this->assertEquals($value, $this->cacheService->get($key));
    }

    public function test_has_checks_key_existence()
    {
        $key = 'has_test';
        
        $this->assertFalse($this->cacheService->has($key));
        
        $this->cacheService->store($key, 'value');
        
        $this->assertTrue($this->cacheService->has($key));
    }

    public function test_forget_removes_key()
    {
        $key = 'forget_test';
        
        $this->cacheService->store($key, 'value');
        $this->assertTrue($this->cacheService->has($key));
        
        $this->cacheService->forget($key);
        $this->assertFalse($this->cacheService->has($key));
    }

    public function test_remember_with_custom_ttl()
    {
        $key = 'ttl_test';
        $value = 'ttl_value';
        
        $result = $this->cacheService->remember($key, function() use ($value) {
            return $value;
        }, 120); // 2 minutes

        $this->assertEquals($value, $result);
    }

    public function test_rate_limiting()
    {
        $identifier = 'test_user';
        $maxAttempts = 3;
        $decaySeconds = 60;

        // First 3 attempts should succeed
        for ($i = 0; $i < $maxAttempts; $i++) {
            $this->assertTrue($this->cacheService->rateLimit($identifier, $maxAttempts, $decaySeconds));
        }

        // 4th attempt should fail
        $this->assertFalse($this->cacheService->rateLimit($identifier, $maxAttempts, $decaySeconds));
    }

    public function test_tagged_caching()
    {
        $key = 'tagged_key';
        $tags = ['products', 'featured'];
        $value = 'tagged_value';

        $result = $this->cacheService->rememberTagged($key, $tags, function() use ($value) {
            return $value;
        });

        $this->assertEquals($value, $result);
        $this->assertEquals($value, $this->cacheService->get($key));
    }

    public function test_tag_invalidation()
    {
        $key = 'invalidate_test';
        $tag = 'test_tag';
        $value = 'invalidate_value';

        $this->cacheService->rememberTagged($key, [$tag], function() use ($value) {
            return $value;
        });

        $this->assertEquals($value, $this->cacheService->get($key));

        // Invalidate by tag
        $deleted = $this->cacheService->invalidateTag($tag);
        
        $this->assertGreaterThan(0, $deleted);
        $this->assertFalse($this->cacheService->has($key));
    }

    public function test_cache_stats_returns_structure()
    {
        $stats = $this->cacheService->getStats();
        
        $this->assertIsArray($stats);
        $this->assertArrayHasKey('driver', $stats);
        $this->assertArrayHasKey('layers', $stats);
        $this->assertArrayHasKey('redis_available', $stats);
        $this->assertArrayHasKey('memory_cache_available', $stats);
    }

    public function test_warm_cache()
    {
        $keys = [
            'warm_key1' => function() { return 'value1'; },
            'warm_key2' => function() { return 'value2'; },
        ];

        $results = $this->cacheService->warmCache($keys);

        $this->assertIsArray($results);
        $this->assertCount(2, $results);
        $this->assertTrue($results['warm_key1']);
        $this->assertTrue($results['warm_key2']);

        // Verify keys are cached
        $this->assertEquals('value1', $this->cacheService->get('warm_key1'));
        $this->assertEquals('value2', $this->cacheService->get('warm_key2'));
    }

    public function test_flush_clears_all_cache()
    {
        // Store some values
        $this->cacheService->store('flush_test1', 'value1');
        $this->cacheService->store('flush_test2', 'value2');

        // Verify they exist
        $this->assertTrue($this->cacheService->has('flush_test1'));
        $this->assertTrue($this->cacheService->has('flush_test2'));

        // Flush cache
        $result = $this->cacheService->flush();

        // Verify they're gone
        $this->assertFalse($this->cacheService->has('flush_test1'));
        $this->assertFalse($this->cacheService->has('flush_test2'));
    }

    public function test_get_stats_configuration()
    {
        Config::set('cache.default_ttl', 1800);
        Config::set('cache.layers', ['array']); // Use array for testing

        $cacheService = new AdvancedCacheService();
        $stats = $cacheService->getStats();

        $this->assertEquals(['array'], $stats['layers']);
    }

    public function test_complex_data_types()
    {
        $key = 'complex_test';
        $complexValue = [
            'string' => 'test',
            'number' => 123,
            'array' => [1, 2, 3],
            'object' => (object)['prop' => 'value'],
        ];

        $this->cacheService->store($key, $complexValue);
        $retrieved = $this->cacheService->get($key);

        $this->assertEquals($complexValue['string'], $retrieved['string']);
        $this->assertEquals($complexValue['number'], $retrieved['number']);
    }
}
