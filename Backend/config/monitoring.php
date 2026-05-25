<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Monitoring Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the monitoring and alerting system.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Alert Thresholds
    |--------------------------------------------------------------------------
    |
    | Define threshold values for triggering alerts.
    | CPU and Memory are in percentage.
    | Response time is in milliseconds.
    | Queue size is in number of jobs.
    |
    */
    'thresholds' => [
        'cpu_warning' => env('MONITORING_CPU_WARNING', 70),
        'cpu_critical' => env('MONITORING_CPU_CRITICAL', 90),
        'memory_warning' => env('MONITORING_MEMORY_WARNING', 70),
        'memory_critical' => env('MONITORING_MEMORY_CRITICAL', 90),
        'disk_warning' => env('MONITORING_DISK_WARNING', 80),
        'disk_critical' => env('MONITORING_DISK_CRITICAL', 95),
        'queue_warning' => env('MONITORING_QUEUE_WARNING', 100),
        'queue_critical' => env('MONITORING_QUEUE_CRITICAL', 500),
        'error_rate_warning' => env('MONITORING_ERROR_RATE_WARNING', 5),
        'error_rate_critical' => env('MONITORING_ERROR_RATE_CRITICAL', 10),
        'response_time_warning' => env('MONITORING_RESPONSE_TIME_WARNING', 2000),
        'response_time_critical' => env('MONITORING_RESPONSE_TIME_CRITICAL', 5000),
    ],

    /*
    |--------------------------------------------------------------------------
    | Alert Settings
    |--------------------------------------------------------------------------
    |
    | Configure which alerts are enabled and notification channels.
    |
    */
    'alerts' => [
        'cpu_enabled' => env('MONITORING_CPU_ALERTS_ENABLED', true),
        'memory_enabled' => env('MONITORING_MEMORY_ALERTS_ENABLED', true),
        'disk_enabled' => env('MONITORING_DISK_ALERTS_ENABLED', true),
        'queue_enabled' => env('MONITORING_QUEUE_ALERTS_ENABLED', true),
        'error_rate_enabled' => env('MONITORING_ERROR_RATE_ALERTS_ENABLED', true),
        'response_time_enabled' => env('MONITORING_RESPONSE_TIME_ALERTS_ENABLED', true),
        
        'channels' => explode(',', env('MONITORING_ALERT_CHANNELS', 'log')),
        
        'email_recipient' => env('MONITORING_EMAIL_RECIPIENT'),
        'slack_webhook_url' => env('MONITORING_SLACK_WEBHOOK_URL'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Check Intervals
    |--------------------------------------------------------------------------
    |
    | Define how often monitoring checks should run (in seconds).
    |
    */
    'intervals' => [
        'cpu' => env('MONITORING_CPU_INTERVAL', 60),
        'memory' => env('MONITORING_MEMORY_INTERVAL', 60),
        'disk' => env('MONITORING_DISK_INTERVAL', 300),
        'queue' => env('MONITORING_QUEUE_INTERVAL', 30),
        'cache' => env('MONITORING_CACHE_INTERVAL', 60),
        'api' => env('MONITORING_API_INTERVAL', 60),
    ],

    /*
    |--------------------------------------------------------------------------
    | Data Retention
    |--------------------------------------------------------------------------
    |
    | How long to keep monitoring data (in seconds).
    |
    */
    'retention' => [
        'metrics' => env('MONITORING_METRICS_RETENTION', 86400), // 24 hours
        'alerts' => env('MONITORING_ALERTS_RETENTION', 604800), // 7 days
        'health' => env('MONITORING_HEALTH_RETENTION', 300), // 5 minutes
    ],
];
