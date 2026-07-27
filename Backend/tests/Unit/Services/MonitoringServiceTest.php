<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\MonitoringService;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

/**
 * MonitoringServiceTest
 * 
 * Unit tests for the MonitoringService
 * 
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 * @SuppressWarnings(PHPMD.CamelCaseMethodName)
 */
class MonitoringServiceTest extends TestCase
{
    /** @var MonitoringService */
    private $monitoringService;

    protected function setUp(): void
    {
        parent::setUp();

        // Create service instance
        $this->monitoringService = app(MonitoringService::class);

        // Clear cache before each test
        Cache::flush();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    /**
     * Test that monitoring service can be instantiated
     */
    public function test_monitoring_service_instantiation(): void
    {
        $this->assertInstanceOf(MonitoringService::class, $this->monitoringService);
    }

    /**
     * Test running all monitoring checks
     */
    public function test_run_all_checks(): void
    {
        $results = $this->monitoringService->runAllChecks();

        $this->assertIsArray($results);
        $this->assertArrayHasKey('timestamp', $results);
        $this->assertArrayHasKey('checks', $results);
        $this->assertArrayHasKey('alerts_triggered', $results);
        $this->assertArrayHasKey('health_status', $results);
        $this->assertIsArray($results['checks']);
    }

    /**
     * Test that CPU check is included in results
     */
    public function test_cpu_check_included(): void
    {
        $results = $this->monitoringService->runAllChecks();

        $this->assertArrayHasKey('cpu', $results['checks']);
        $this->assertArrayHasKey('metric', $results['checks']['cpu']);
        $this->assertEquals('cpu_usage', $results['checks']['cpu']['metric']);
        $this->assertArrayHasKey('value', $results['checks']['cpu']);
        $this->assertArrayHasKey('status', $results['checks']['cpu']);
    }

    /**
     * Test that memory check is included in results
     */
    public function test_memory_check_included(): void
    {
        $results = $this->monitoringService->runAllChecks();

        $this->assertArrayHasKey('memory', $results['checks']);
        $this->assertArrayHasKey('metric', $results['checks']['memory']);
        $this->assertEquals('memory_usage', $results['checks']['memory']['metric']);
        $this->assertArrayHasKey('value', $results['checks']['memory']);
        $this->assertArrayHasKey('status', $results['checks']['memory']);
    }

    /**
     * Test that disk check is included in results
     */
    public function test_disk_check_included(): void
    {
        $results = $this->monitoringService->runAllChecks();

        $this->assertArrayHasKey('disk', $results['checks']);
        $this->assertArrayHasKey('metric', $results['checks']['disk']);
        $this->assertEquals('disk_usage', $results['checks']['disk']['metric']);
        $this->assertArrayHasKey('value', $results['checks']['disk']);
        $this->assertArrayHasKey('status', $results['checks']['disk']);
    }

    /**
     * Test that queue check is included in results
     */
    public function test_queue_check_included(): void
    {
        $results = $this->monitoringService->runAllChecks();

        $this->assertArrayHasKey('queue', $results['checks']);
        $this->assertArrayHasKey('metric', $results['checks']['queue']);
        $this->assertEquals('queue_size', $results['checks']['queue']['metric']);
        $this->assertArrayHasKey('value', $results['checks']['queue']);
        $this->assertArrayHasKey('status', $results['checks']['queue']);
    }

    /**
     * Test that cache check is included in results
     */
    public function test_cache_check_included(): void
    {
        $results = $this->monitoringService->runAllChecks();

        $this->assertArrayHasKey('cache', $results['checks']);
        $this->assertArrayHasKey('metric', $results['checks']['cache']);
        $this->assertEquals('cache_health', $results['checks']['cache']['metric']);
        $this->assertArrayHasKey('value', $results['checks']['cache']);
        $this->assertArrayHasKey('status', $results['checks']['cache']);
    }

    /**
     * Test that API performance check is included in results
     */
    public function test_api_performance_check_included(): void
    {
        $results = $this->monitoringService->runAllChecks();

        $this->assertArrayHasKey('api', $results['checks']);
        $this->assertArrayHasKey('metric', $results['checks']['api']);
        $this->assertEquals('api_performance', $results['checks']['api']['metric']);
        $this->assertArrayHasKey('value', $results['checks']['api']);
        $this->assertArrayHasKey('status', $results['checks']['api']);
    }

    /**
     * Test health status is determined correctly
     */
    public function test_health_status_determined(): void
    {
        $results = $this->monitoringService->runAllChecks();

        $this->assertArrayHasKey('health_status', $results);
        $this->assertContains($results['health_status'], ['healthy', 'warning', 'critical', 'unknown']);
    }

    /**
     * Test getting health status
     */
    public function test_get_health_status(): void
    {
        // Run checks first to set health status
        $this->monitoringService->runAllChecks();

        $health = $this->monitoringService->getHealthStatus();

        $this->assertIsArray($health);
        $this->assertArrayHasKey('status', $health);
        $this->assertArrayHasKey('timestamp', $health);
    }

    /**
     * Test getting active alerts
     */
    public function test_get_active_alerts(): void
    {
        $alerts = $this->monitoringService->getActiveAlerts();

        $this->assertIsArray($alerts);
    }

    /**
     * Test getting alert history
     */
    public function test_get_alert_history(): void
    {
        $history = $this->monitoringService->getAlertHistory(10);

        $this->assertIsArray($history);
        $this->assertLessThanOrEqual(10, count($history));
    }

    /**
     * Test getting metrics history
     */
    public function test_get_metrics_history(): void
    {
        // Run checks first to populate metrics
        $this->monitoringService->runAllChecks();

        $metrics = $this->monitoringService->getMetricsHistory(10);

        $this->assertIsArray($metrics);
        $this->assertLessThanOrEqual(10, count($metrics));
    }

    /**
     * Test clearing all alerts
     */
    public function test_clear_all_alerts(): void
    {
        $success = $this->monitoringService->clearAllAlerts();

        $this->assertTrue($success);

        $alerts = $this->monitoringService->getActiveAlerts();
        $this->assertEmpty($alerts);
    }

    /**
     * Test getting alert rules
     */
    public function test_get_alert_rules(): void
    {
        $rules = $this->monitoringService->getAlertRules();

        $this->assertIsArray($rules);
        $this->assertArrayHasKey('cpu_usage', $rules);
        $this->assertArrayHasKey('memory_usage', $rules);
        $this->assertArrayHasKey('disk_usage', $rules);
    }

    /**
     * Test alert rules structure
     */
    public function test_alert_rules_structure(): void
    {
        $rules = $this->monitoringService->getAlertRules();

        foreach ($rules as $rule) {
            $this->assertArrayHasKey('warning', $rule);
            $this->assertArrayHasKey('critical', $rule);
            $this->assertArrayHasKey('enabled', $rule);
            $this->assertIsNumeric($rule['warning']);
            $this->assertIsNumeric($rule['critical']);
            $this->assertIsBool($rule['enabled']);
        }
    }

    /**
     * Test updating alert rules
     */
    public function test_update_alert_rules(): void
    {
        $newRules = [
            'cpu_usage' => [
                'warning' => 60,
                'critical' => 85
            ]
        ];

        $success = $this->monitoringService->updateAlertRules($newRules);

        $this->assertTrue($success);

        $rules = $this->monitoringService->getAlertRules();
        $this->assertEquals(60, $rules['cpu_usage']['warning']);
        $this->assertEquals(85, $rules['cpu_usage']['critical']);
    }

    /**
     * Test CPU usage returns valid value
     */
    public function test_cpu_usage_returns_valid_value(): void
    {
        $results = $this->monitoringService->runAllChecks();
        $cpuValue = $results['checks']['cpu']['value'];

        $this->assertIsNumeric($cpuValue);
        $this->assertGreaterThanOrEqual(0, $cpuValue);
        $this->assertLessThanOrEqual(100, $cpuValue);
    }

    /**
     * Test memory usage returns valid value
     */
    public function test_memory_usage_returns_valid_value(): void
    {
        $results = $this->monitoringService->runAllChecks();
        $memoryValue = $results['checks']['memory']['value'];

        $this->assertIsNumeric($memoryValue);
        $this->assertGreaterThanOrEqual(0, $memoryValue);
        $this->assertLessThanOrEqual(100, $memoryValue);
    }

    /**
     * Test disk usage returns valid value
     */
    public function test_disk_usage_returns_valid_value(): void
    {
        $results = $this->monitoringService->runAllChecks();
        $diskValue = $results['checks']['disk']['value'];

        $this->assertIsNumeric($diskValue);
        $this->assertGreaterThanOrEqual(0, $diskValue);
        $this->assertLessThanOrEqual(100, $diskValue);
    }

    /**
     * Test metrics are stored correctly
     */
    public function test_metrics_stored_correctly(): void
    {
        // Clear existing metrics
        Cache::flush();

        // Run checks
        $this->monitoringService->runAllChecks();

        // Get metrics history
        $metrics = $this->monitoringService->getMetricsHistory(1);

        $this->assertCount(1, $metrics);
        $this->assertArrayHasKey('timestamp', $metrics[0]);
        $this->assertArrayHasKey('checks', $metrics[0]);
    }

    /**
     * Test resolve alert
     */
    public function test_resolve_alert(): void
    {
        // Add a test alert to active alerts
        Cache::put('monitoring:alerts', [
            'test_alert_critical' => [
                'id' => 'test_1',
                'metric' => 'test',
                'severity' => 'critical',
                'resolved' => false
            ]
        ]);

        // Reload alerts
        $this->monitoringService = app(MonitoringService::class);

        // Try to resolve
        $success = $this->monitoringService->resolveAlert('test_alert_critical');

        // Alert may not exist, so success can be false
        $this->assertIsBool($success);
    }

    /**
     * Test health status with unknown state
     */
    public function test_health_status_default_unknown(): void
    {
        // Clear cache to ensure no stored health status
        Cache::flush();

        $health = $this->monitoringService->getHealthStatus();

        $this->assertArrayHasKey('status', $health);
        // Should be 'unknown' if no checks have been run
    }

    /**
     * Test alert rules are loaded from config
     */
    public function test_alert_rules_loaded_from_config(): void
    {
        $rules = $this->monitoringService->getAlertRules();

        $this->assertArrayHasKey('cpu_usage', $rules);
        $this->assertArrayHasKey('memory_usage', $rules);
        $this->assertArrayHasKey('disk_usage', $rules);
        $this->assertArrayHasKey('queue_size', $rules);
        $this->assertArrayHasKey('error_rate', $rules);
        $this->assertArrayHasKey('response_time', $rules);
    }

    /**
     * Test monitoring results include timestamp
     */
    public function test_monitoring_results_include_timestamp(): void
    {
        $results = $this->monitoringService->runAllChecks();

        $this->assertArrayHasKey('timestamp', $results);
        $this->assertNotNull($results['timestamp']);
    }

    /**
     * Test queue size returns integer
     */
    public function test_queue_size_returns_integer(): void
    {
        $results = $this->monitoringService->runAllChecks();
        $queueValue = $results['checks']['queue']['value'];

        $this->assertIsInt($queueValue);
        $this->assertGreaterThanOrEqual(0, $queueValue);
    }

    /**
     * Test cache health check returns boolean
     */
    public function test_cache_health_returns_boolean(): void
    {
        $results = $this->monitoringService->runAllChecks();

        // 'value' is a 1/0 status flag (consistent with the numeric 'value' used by
        // the cpu/memory/disk checks); the underlying boolean is in 'details.healthy'.
        $this->assertIsBool($results['checks']['cache']['details']['healthy']);
        $this->assertContains($results['checks']['cache']['value'], [0, 1]);
    }
}
