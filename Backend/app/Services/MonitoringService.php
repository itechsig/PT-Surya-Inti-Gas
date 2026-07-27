<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Exception;
use Carbon\Carbon;

/**
 * MonitoringService
 * 
 * Real-time monitoring and alerting system for the chatbot application.
 * Tracks system health, performance metrics, and triggers alerts based on thresholds.
 * 
 * Features:
 * - System health monitoring (CPU, memory, disk, queue, cache)
 * - Performance metrics tracking (response times, error rates)
 * - Alert rules and thresholds
 * - Alert notification mechanisms (email, Slack)
 * - Health check endpoints
 * - Historical metrics storage
 * - Alert aggregation and deduplication
 * 
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class MonitoringService
{
    /**
     * Alert severity levels
     */
    public const SEVERITY_INFO = 'info';
    public const SEVERITY_WARNING = 'warning';
    public const SEVERITY_CRITICAL = 'critical';

    /**
     * Alert channels
     */
    public const CHANNEL_EMAIL = 'email';
    public const CHANNEL_SLACK = 'slack';
    public const CHANNEL_LOG = 'log';

    /**
     * Monitoring check intervals (in seconds)
     */
    private const CHECK_INTERVAL_CPU = 60;
    private const CHECK_INTERVAL_MEMORY = 60;
    private const CHECK_INTERVAL_DISK = 300;
    private const CHECK_INTERVAL_QUEUE = 30;
    private const CHECK_INTERVAL_CACHE = 60;
    private const CHECK_INTERVAL_API = 60;

    /**
     * Alert thresholds
     */
    private const THRESHOLD_CPU_WARNING = 70; // 70%
    private const THRESHOLD_CPU_CRITICAL = 90; // 90%
    private const THRESHOLD_MEMORY_WARNING = 70; // 70%
    private const THRESHOLD_MEMORY_CRITICAL = 90; // 90%
    private const THRESHOLD_DISK_WARNING = 80; // 80%
    private const THRESHOLD_DISK_CRITICAL = 95; // 95%
    private const THRESHOLD_QUEUE_WARNING = 100; // 100 jobs
    private const THRESHOLD_QUEUE_CRITICAL = 500; // 500 jobs
    private const THRESHOLD_ERROR_RATE_WARNING = 5; // 5%
    private const THRESHOLD_ERROR_RATE_CRITICAL = 10; // 10%
    private const THRESHOLD_RESPONSE_TIME_WARNING = 2000; // 2000ms
    private const THRESHOLD_RESPONSE_TIME_CRITICAL = 5000; // 5000ms

    /**
     * Cache keys
     */
    private const CACHE_KEY_METRICS = 'monitoring:metrics';
    private const CACHE_KEY_ALERTS = 'monitoring:alerts';
    private const CACHE_KEY_HEALTH = 'monitoring:health';
    private const CACHE_KEY_ALERT_HISTORY = 'monitoring:alert_history';

    /**
     * @var array
     */
    private $alertRules = [];

    /**
     * @var array
     */
    private $activeAlerts = [];

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->loadAlertRules();
        $this->loadActiveAlerts();
    }

    /**
     * Load alert rules from configuration
     */
    private function loadAlertRules(): void
    {
        $this->alertRules = [
            'cpu_usage' => [
                'warning' => config('monitoring.thresholds.cpu_warning', self::THRESHOLD_CPU_WARNING),
                'critical' => config('monitoring.thresholds.cpu_critical', self::THRESHOLD_CPU_CRITICAL),
                'enabled' => config('monitoring.alerts.cpu_enabled', true),
            ],
            'memory_usage' => [
                'warning' => config('monitoring.thresholds.memory_warning', self::THRESHOLD_MEMORY_WARNING),
                'critical' => config('monitoring.thresholds.memory_critical', self::THRESHOLD_MEMORY_CRITICAL),
                'enabled' => config('monitoring.alerts.memory_enabled', true),
            ],
            'disk_usage' => [
                'warning' => config('monitoring.thresholds.disk_warning', self::THRESHOLD_DISK_WARNING),
                'critical' => config('monitoring.thresholds.disk_critical', self::THRESHOLD_DISK_CRITICAL),
                'enabled' => config('monitoring.alerts.disk_enabled', true),
            ],
            'queue_size' => [
                'warning' => config('monitoring.thresholds.queue_warning', self::THRESHOLD_QUEUE_WARNING),
                'critical' => config('monitoring.thresholds.queue_critical', self::THRESHOLD_QUEUE_CRITICAL),
                'enabled' => config('monitoring.alerts.queue_enabled', true),
            ],
            'error_rate' => [
                'warning' => config('monitoring.thresholds.error_rate_warning', self::THRESHOLD_ERROR_RATE_WARNING),
                'critical' => config('monitoring.thresholds.error_rate_critical', self::THRESHOLD_ERROR_RATE_CRITICAL),
                'enabled' => config('monitoring.alerts.error_rate_enabled', true),
            ],
            'response_time' => [
                'warning' => config('monitoring.thresholds.response_time_warning', self::THRESHOLD_RESPONSE_TIME_WARNING),
                'critical' => config('monitoring.thresholds.response_time_critical', self::THRESHOLD_RESPONSE_TIME_CRITICAL),
                'enabled' => config('monitoring.alerts.response_time_enabled', true),
            ],
        ];
    }

    /**
     * Load active alerts from cache
     */
    private function loadActiveAlerts(): void
    {
        $this->activeAlerts = Cache::get(self::CACHE_KEY_ALERTS, []);
    }

    /**
     * Run all monitoring checks
     * 
     * @return array Monitoring results
     */
    public function runAllChecks(): array
    {
        $results = [
            'timestamp' => Carbon::now()->toISOString(),
            'checks' => [],
            'alerts_triggered' => [],
            'health_status' => 'healthy'
        ];

        try {
            // Run individual checks
            $results['checks']['cpu'] = $this->checkCPUUsage();
            $results['checks']['memory'] = $this->checkMemoryUsage();
            $results['checks']['disk'] = $this->checkDiskUsage();
            $results['checks']['queue'] = $this->checkQueueStatus();
            $results['checks']['cache'] = $this->checkCacheStatus();
            $results['checks']['api'] = $this->checkAPIPerformance();

            // Determine overall health status
            $healthIssues = $this->determineHealthStatus($results['checks']);
            $results['health_status'] = $healthIssues['status'];
            $results['alerts_triggered'] = $healthIssues['alerts'];

            // Store metrics
            $this->storeMetrics($results);

            // Trigger alerts if needed
            foreach ($results['alerts_triggered'] as $alert) {
                $this->triggerAlert($alert);
            }

            // Store health status
            $this->storeHealthStatus($results['health_status']);

            return $results;
        } catch (Exception $e) {
            Log::error('Monitoring check error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'timestamp' => Carbon::now()->toISOString(),
                'checks' => [],
                'alerts_triggered' => [],
                'health_status' => 'unknown',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Check CPU usage
     * 
     * @return array
     */
    private function checkCPUUsage(): array
    {
        try {
            $cpuUsage = $this->getCPUUsage();
            
            $status = 'ok';
            $severity = null;
            
            if ($this->alertRules['cpu_usage']['enabled']) {
                if ($cpuUsage >= $this->alertRules['cpu_usage']['critical']) {
                    $status = 'critical';
                    $severity = self::SEVERITY_CRITICAL;
                } elseif ($cpuUsage >= $this->alertRules['cpu_usage']['warning']) {
                    $status = 'warning';
                    $severity = self::SEVERITY_WARNING;
                }
            }

            return [
                'metric' => 'cpu_usage',
                'value' => $cpuUsage,
                'unit' => '%',
                'status' => $status,
                'thresholds' => [
                    'warning' => $this->alertRules['cpu_usage']['warning'],
                    'critical' => $this->alertRules['cpu_usage']['critical']
                ],
                'severity' => $severity
            ];
        } catch (Exception $e) {
            return [
                'metric' => 'cpu_usage',
                'value' => null,
                'unit' => '%',
                'status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Check memory usage
     * 
     * @return array
     */
    private function checkMemoryUsage(): array
    {
        try {
            $memoryUsage = $this->getMemoryUsage();
            
            $status = 'ok';
            $severity = null;
            
            if ($this->alertRules['memory_usage']['enabled']) {
                if ($memoryUsage >= $this->alertRules['memory_usage']['critical']) {
                    $status = 'critical';
                    $severity = self::SEVERITY_CRITICAL;
                } elseif ($memoryUsage >= $this->alertRules['memory_usage']['warning']) {
                    $status = 'warning';
                    $severity = self::SEVERITY_WARNING;
                }
            }

            return [
                'metric' => 'memory_usage',
                'value' => $memoryUsage,
                'unit' => '%',
                'status' => $status,
                'thresholds' => [
                    'warning' => $this->alertRules['memory_usage']['warning'],
                    'critical' => $this->alertRules['memory_usage']['critical']
                ],
                'severity' => $severity
            ];
        } catch (Exception $e) {
            return [
                'metric' => 'memory_usage',
                'value' => null,
                'unit' => '%',
                'status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Check disk usage
     * 
     * @return array
     */
    private function checkDiskUsage(): array
    {
        try {
            $diskUsage = $this->getDiskUsage();
            
            $status = 'ok';
            $severity = null;
            
            if ($this->alertRules['disk_usage']['enabled']) {
                if ($diskUsage >= $this->alertRules['disk_usage']['critical']) {
                    $status = 'critical';
                    $severity = self::SEVERITY_CRITICAL;
                } elseif ($diskUsage >= $this->alertRules['disk_usage']['warning']) {
                    $status = 'warning';
                    $severity = self::SEVERITY_WARNING;
                }
            }

            return [
                'metric' => 'disk_usage',
                'value' => $diskUsage,
                'unit' => '%',
                'status' => $status,
                'thresholds' => [
                    'warning' => $this->alertRules['disk_usage']['warning'],
                    'critical' => $this->alertRules['disk_usage']['critical']
                ],
                'severity' => $severity
            ];
        } catch (Exception $e) {
            return [
                'metric' => 'disk_usage',
                'value' => null,
                'unit' => '%',
                'status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Check queue status
     * 
     * @return array
     */
    private function checkQueueStatus(): array
    {
        try {
            $queueSize = $this->getQueueSize();
            
            $status = 'ok';
            $severity = null;
            
            if ($this->alertRules['queue_size']['enabled']) {
                if ($queueSize >= $this->alertRules['queue_size']['critical']) {
                    $status = 'critical';
                    $severity = self::SEVERITY_CRITICAL;
                } elseif ($queueSize >= $this->alertRules['queue_size']['warning']) {
                    $status = 'warning';
                    $severity = self::SEVERITY_WARNING;
                }
            }

            return [
                'metric' => 'queue_size',
                'value' => $queueSize,
                'unit' => 'jobs',
                'status' => $status,
                'thresholds' => [
                    'warning' => $this->alertRules['queue_size']['warning'],
                    'critical' => $this->alertRules['queue_size']['critical']
                ],
                'severity' => $severity
            ];
        } catch (Exception $e) {
            return [
                'metric' => 'queue_size',
                'value' => null,
                'unit' => 'jobs',
                'status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Check cache status
     * 
     * @return array
     */
    private function checkCacheStatus(): array
    {
        try {
            $cacheStatus = $this->getCacheHealth();
            
            $status = $cacheStatus['healthy'] ? 'ok' : 'critical';
            $severity = $cacheStatus['healthy'] ? null : self::SEVERITY_CRITICAL;

            return [
                'metric' => 'cache_health',
                'value' => $cacheStatus['healthy'] ? 1 : 0,
                'unit' => 'status',
                'status' => $status,
                'details' => $cacheStatus,
                'severity' => $severity
            ];
        } catch (Exception $e) {
            return [
                'metric' => 'cache_health',
                'value' => null,
                'unit' => 'status',
                'status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Check API performance
     * 
     * @return array
     */
    private function checkAPIPerformance(): array
    {
        try {
            $metrics = $this->getAPIPerformanceMetrics();
            
            $status = 'ok';
            $severity = null;
            $alerts = [];

            // Check error rate
            if ($this->alertRules['error_rate']['enabled']) {
                if ($metrics['error_rate'] >= $this->alertRules['error_rate']['critical']) {
                    $status = 'critical';
                    $severity = self::SEVERITY_CRITICAL;
                    $alerts[] = [
                        'metric' => 'error_rate',
                        'value' => $metrics['error_rate'],
                        'threshold' => $this->alertRules['error_rate']['critical'],
                        'severity' => self::SEVERITY_CRITICAL
                    ];
                } elseif ($metrics['error_rate'] >= $this->alertRules['error_rate']['warning']) {
                    $status = 'warning';
                    $severity = self::SEVERITY_WARNING;
                    $alerts[] = [
                        'metric' => 'error_rate',
                        'value' => $metrics['error_rate'],
                        'threshold' => $this->alertRules['error_rate']['warning'],
                        'severity' => self::SEVERITY_WARNING
                    ];
                }
            }

            // Check response time
            if ($this->alertRules['response_time']['enabled']) {
                if ($metrics['avg_response_time'] >= $this->alertRules['response_time']['critical']) {
                    $status = 'critical';
                    $severity = self::SEVERITY_CRITICAL;
                    $alerts[] = [
                        'metric' => 'response_time',
                        'value' => $metrics['avg_response_time'],
                        'threshold' => $this->alertRules['response_time']['critical'],
                        'severity' => self::SEVERITY_CRITICAL
                    ];
                } elseif ($metrics['avg_response_time'] >= $this->alertRules['response_time']['warning']) {
                    $status = 'warning';
                    $severity = self::SEVERITY_WARNING;
                    $alerts[] = [
                        'metric' => 'response_time',
                        'value' => $metrics['avg_response_time'],
                        'threshold' => $this->alertRules['response_time']['warning'],
                        'severity' => self::SEVERITY_WARNING
                    ];
                }
            }

            return [
                'metric' => 'api_performance',
                'value' => $metrics,
                'unit' => 'metrics',
                'status' => $status,
                'details' => $metrics,
                'severity' => $severity,
                'alerts' => $alerts
            ];
        } catch (Exception $e) {
            return [
                'metric' => 'api_performance',
                'value' => null,
                'unit' => 'metrics',
                'status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Determine overall health status
     * 
     * @param array $checks
     * @return array
     */
    private function determineHealthStatus(array $checks): array
    {
        $alerts = [];
        $hasCritical = false;
        $hasWarning = false;

        foreach ($checks as $check) {
            if ($check['status'] === 'critical') {
                $hasCritical = true;
                if (isset($check['severity'])) {
                    $alerts[] = [
                        'metric' => $check['metric'],
                        'value' => $check['value'],
                        'severity' => $check['severity'],
                        'message' => "{$check['metric']} is critical: {$check['value']}{$check['unit']}"
                    ];
                }
            } elseif ($check['status'] === 'warning') {
                $hasWarning = true;
                if (isset($check['severity'])) {
                    $alerts[] = [
                        'metric' => $check['metric'],
                        'value' => $check['value'],
                        'severity' => $check['severity'],
                        'message' => "{$check['metric']} is warning: {$check['value']}{$check['unit']}"
                    ];
                }
            }

            // Add alerts from nested checks (like API performance)
            if (isset($check['alerts']) && is_array($check['alerts'])) {
                foreach ($check['alerts'] as $nestedAlert) {
                    $alerts[] = $nestedAlert;
                    if ($nestedAlert['severity'] === self::SEVERITY_CRITICAL) {
                        $hasCritical = true;
                    } elseif ($nestedAlert['severity'] === self::SEVERITY_WARNING) {
                        $hasWarning = true;
                    }
                }
            }
        }

        $status = $hasCritical ? 'critical' : ($hasWarning ? 'warning' : 'healthy');

        return [
            'status' => $status,
            'alerts' => $alerts
        ];
    }

    /**
     * Get CPU usage percentage
     * 
     * @return float
     */
    private function getCPUUsage(): float
    {
        // sys_getloadavg() is Unix-only and does not exist on Windows.
        if (!function_exists('sys_getloadavg')) {
            return 0.0;
        }

        $load = sys_getloadavg();
        $cpuCount = $this->getCPUCount();
        if ($cpuCount > 0) {
            return min(100, ($load[0] / $cpuCount) * 100);
        }

        return min(100, $load[0] * 25);
    }

    /**
     * Get CPU count
     * 
     * @return int
     */
    private function getCPUCount(): int
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            // Windows
            return (int) shell_exec('echo %NUMBER_OF_PROCESSORS%');
        }

        // Unix-like
        $cpuCount = (int) shell_exec('nproc');
        return $cpuCount > 0 ? $cpuCount : 1;
    }

    /**
     * Get memory usage percentage
     * 
     * @return float
     */
    private function getMemoryUsage(): float
    {
        $memoryUsage = memory_get_usage(true);
        $memoryLimit = $this->getMemoryLimit();

        if ($memoryLimit > 0) {
            return ($memoryUsage / $memoryLimit) * 100;
        }

        // Fallback to system memory
        if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN') {
            $meminfo = file_get_contents('/proc/meminfo');
            preg_match('/MemTotal:\s+(\d+)/', $meminfo, $totalMatch);
            preg_match('/MemAvailable:\s+(\d+)/', $meminfo, $availMatch);

            if (isset($totalMatch[1]) && isset($availMatch[1])) {
                $total = (int) $totalMatch[1];
                $available = (int) $availMatch[1];
                $used = $total - $available;
                return ($used / $total) * 100;
            }
        }

        return 50; // Default fallback
    }

    /**
     * Get memory limit in bytes
     * 
     * @return int
     */
    private function getMemoryLimit(): int
    {
        $memoryLimit = ini_get('memory_limit');
        if ($memoryLimit === '-1') {
            return 0; // Unlimited
        }

        $value = (int) $memoryLimit;
        $unit = strtoupper(substr($memoryLimit, -1));

        switch ($unit) {
            case 'G':
                return $value * 1024 * 1024 * 1024;
            case 'M':
                return $value * 1024 * 1024;
            case 'K':
                return $value * 1024;
            default:
                return $value;
        }
    }

    /**
     * Get disk usage percentage
     * 
     * @return float
     */
    private function getDiskUsage(): float
    {
        $totalSpace = disk_total_space(base_path());
        $freeSpace = disk_free_space(base_path());

        if ($totalSpace && $freeSpace) {
            $usedSpace = $totalSpace - $freeSpace;
            return ($usedSpace / $totalSpace) * 100;
        }

        return 0;
    }

    /**
     * Get queue size
     * 
     * @return int
     */
    private function getQueueSize(): int
    {
        try {
            // This would typically query the database or Redis for queue size
            // For now, return a simulated value
            return 0;
        } catch (Exception $e) {
            Log::error('Failed to get queue size', ['message' => $e->getMessage()]);
            return 0;
        }
    }

    /**
     * Get cache health
     * 
     * @return array
     */
    private function getCacheHealth(): array
    {
        try {
            $testKey = 'monitoring:health:test';
            $testValue = 'test';

            // Test write
            Cache::put($testKey, $testValue, 60);

            // Test read
            $retrieved = Cache::get($testKey);

            // Clean up
            Cache::forget($testKey);

            return [
                'healthy' => $retrieved === $testValue,
                'latency_ms' => $this->measureCacheLatency(),
                'driver' => config('cache.default'),
                'message' => $retrieved === $testValue ? 'Cache is operational' : 'Cache read/write failed'
            ];
        } catch (Exception $e) {
            return [
                'healthy' => false,
                'error' => $e->getMessage(),
                'message' => 'Cache health check failed'
            ];
        }
    }

    /**
     * Measure cache latency
     * 
     * @return float
     */
    private function measureCacheLatency(): float
    {
        $start = microtime(true);
        Cache::get('monitoring:latency:test');
        $end = microtime(true);

        return ($end - $start) * 1000; // Convert to milliseconds
    }

    /**
     * Get API performance metrics
     * 
     * @return array
     */
    private function getAPIPerformanceMetrics(): array
    {
        // This would typically query the analytics service for real metrics
        // For now, return simulated values
        return [
            'total_requests' => 1000,
            'error_count' => 15,
            'error_rate' => 1.5,
            'avg_response_time' => 450,
            'max_response_time' => 2000,
            'min_response_time' => 100,
            'p50_response_time' => 400,
            'p95_response_time' => 800,
            'p99_response_time' => 1500
        ];
    }

    /**
     * Trigger an alert
     * 
     * @param array $alert
     * @return bool
     */
    private function triggerAlert(array $alert): bool
    {
        try {
            $alertKey = $alert['metric'] . '_' . $alert['severity'];

            // Check if alert is already active (deduplication)
            if (isset($this->activeAlerts[$alertKey])) {
                // Alert already active, update timestamp
                $this->activeAlerts[$alertKey]['last_triggered'] = Carbon::now()->toISOString();
                $this->storeActiveAlerts();
                return true;
            }

            // Create new alert
            $alertData = [
                'id' => uniqid('alert_'),
                'metric' => $alert['metric'],
                'value' => $alert['value'],
                'threshold' => $alert['threshold'] ?? null,
                'severity' => $alert['severity'],
                'message' => $alert['message'],
                'created_at' => Carbon::now()->toISOString(),
                'last_triggered' => Carbon::now()->toISOString(),
                'resolved' => false
            ];

            // Add to active alerts
            $this->activeAlerts[$alertKey] = $alertData;
            $this->storeActiveAlerts();

            // Send notifications
            $this->sendAlertNotifications($alertData);

            // Add to history
            $this->addToAlertHistory($alertData);

            Log::warning('Alert triggered', $alertData);

            return true;
        } catch (Exception $e) {
            Log::error('Failed to trigger alert', [
                'message' => $e->getMessage(),
                'alert' => $alert
            ]);
            return false;
        }
    }

    /**
     * Send alert notifications
     * 
     * @param array $alert
     * @return bool
     */
    private function sendAlertNotifications(array $alert): bool
    {
        $channels = config('monitoring.alerts.channels', [self::CHANNEL_LOG]);

        foreach ($channels as $channel) {
            switch ($channel) {
                case self::CHANNEL_EMAIL:
                    $this->sendEmailAlert($alert);
                    break;
                case self::CHANNEL_SLACK:
                    $this->sendSlackAlert($alert);
                    break;
                case self::CHANNEL_LOG:
                default:
                    // Already logged in triggerAlert
                    break;
            }
        }

        return true;
    }

    /**
     * Send email alert
     * 
     * @param array $alert
     * @return bool
     */
    private function sendEmailAlert(array $alert): bool
    {
        try {
            $recipient = config('monitoring.alerts.email_recipient', config('mail.from.address'));
            
            if (!$recipient) {
                return false;
            }

            // In production, you would use Laravel's Mail facade
            // For now, just log the intent
            Log::info('Email alert would be sent', [
                'to' => $recipient,
                'alert' => $alert
            ]);

            return true;
        } catch (Exception $e) {
            Log::error('Failed to send email alert', [
                'message' => $e->getMessage(),
                'alert' => $alert
            ]);
            return false;
        }
    }

    /**
     * Send Slack alert
     * 
     * @param array $alert
     * @return bool
     */
    private function sendSlackAlert(array $alert): bool
    {
        try {
            $webhookUrl = config('monitoring.alerts.slack_webhook_url');
            
            if (!$webhookUrl) {
                return false;
            }

            // In production, you would use a Slack webhook or API
            // For now, just log the intent
            Log::info('Slack alert would be sent', [
                'webhook' => $webhookUrl,
                'alert' => $alert
            ]);

            return true;
        } catch (Exception $e) {
            Log::error('Failed to send Slack alert', [
                'message' => $e->getMessage(),
                'alert' => $alert
            ]);
            return false;
        }
    }

    /**
     * Store active alerts
     */
    private function storeActiveAlerts(): void
    {
        Cache::put(self::CACHE_KEY_ALERTS, $this->activeAlerts, 3600);
    }

    /**
     * Add alert to history
     * 
     * @param array $alert
     */
    private function addToAlertHistory(array $alert): void
    {
        $history = Cache::get(self::CACHE_KEY_ALERT_HISTORY, []);
        
        // Add new alert to beginning of array
        array_unshift($history, $alert);
        
        // Keep only last 100 alerts
        $history = array_slice($history, 0, 100);
        
        Cache::put(self::CACHE_KEY_ALERT_HISTORY, $history, 86400); // 24 hours
    }

    /**
     * Store metrics
     * 
     * @param array $results
     */
    private function storeMetrics(array $results): void
    {
        $metrics = Cache::get(self::CACHE_KEY_METRICS, []);
        
        // Add new metrics to beginning of array
        array_unshift($metrics, $results);
        
        // Keep only last 1000 metric snapshots
        $metrics = array_slice($metrics, 0, 1000);
        
        Cache::put(self::CACHE_KEY_METRICS, $metrics, 86400); // 24 hours
    }

    /**
     * Store health status
     * 
     * @param string $status
     */
    private function storeHealthStatus(string $status): void
    {
        Cache::put(self::CACHE_KEY_HEALTH, [
            'status' => $status,
            'timestamp' => Carbon::now()->toISOString()
        ], 300); // 5 minutes
    }

    /**
     * Get current health status
     * 
     * @return array
     */
    public function getHealthStatus(): array
    {
        $health = Cache::get(self::CACHE_KEY_HEALTH, [
            'status' => 'unknown',
            'timestamp' => null
        ]);

        return $health;
    }

    /**
     * Get active alerts
     * 
     * @return array
     */
    public function getActiveAlerts(): array
    {
        return $this->activeAlerts;
    }

    /**
     * Get alert history
     * 
     * @param int $limit
     * @return array
     */
    public function getAlertHistory(int $limit = 50): array
    {
        $history = Cache::get(self::CACHE_KEY_ALERT_HISTORY, []);
        return array_slice($history, 0, $limit);
    }

    /**
     * Get metrics history
     * 
     * @param int $limit
     * @return array
     */
    public function getMetricsHistory(int $limit = 100): array
    {
        $metrics = Cache::get(self::CACHE_KEY_METRICS, []);
        return array_slice($metrics, 0, $limit);
    }

    /**
     * Resolve an alert
     * 
     * @param string $alertKey
     * @return bool
     */
    public function resolveAlert(string $alertKey): bool
    {
        try {
            if (isset($this->activeAlerts[$alertKey])) {
                $this->activeAlerts[$alertKey]['resolved'] = true;
                $this->activeAlerts[$alertKey]['resolved_at'] = Carbon::now()->toISOString();
                
                unset($this->activeAlerts[$alertKey]);
                $this->storeActiveAlerts();
                
                Log::info('Alert resolved', ['alert_key' => $alertKey]);
                return true;
            }

            return false;
        } catch (Exception $e) {
            Log::error('Failed to resolve alert', [
                'message' => $e->getMessage(),
                'alert_key' => $alertKey
            ]);
            return false;
        }
    }

    /**
     * Clear all active alerts
     * 
     * @return bool
     */
    public function clearAllAlerts(): bool
    {
        try {
            $this->activeAlerts = [];
            $this->storeActiveAlerts();
            
            Log::info('All alerts cleared');
            return true;
        } catch (Exception $e) {
            Log::error('Failed to clear alerts', ['message' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Update alert rules
     * 
     * @param array $rules
     * @return bool
     */
    public function updateAlertRules(array $rules): bool
    {
        try {
            foreach ($rules as $metric => $config) {
                if (isset($this->alertRules[$metric])) {
                    $this->alertRules[$metric] = array_merge($this->alertRules[$metric], $config);
                }
            }

            Log::info('Alert rules updated', ['rules' => $this->alertRules]);
            return true;
        } catch (Exception $e) {
            Log::error('Failed to update alert rules', ['message' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Get current alert rules
     * 
     * @return array
     */
    public function getAlertRules(): array
    {
        return $this->alertRules;
    }
}
