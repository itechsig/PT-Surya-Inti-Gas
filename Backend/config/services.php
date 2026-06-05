<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'gemini' => [
        'api_keys' => env('GEMINI_API_KEYS', ''),
        'model' => env('GEMINI_MODEL', 'gemini-flash-latest'),
        'embedding_model' => env('GEMINI_EMBEDDING_MODEL', 'embedding-001'),
        'rotation_enabled' => env('GEMINI_ROTATION_ENABLED', true),
        'rotation_strategy' => env('GEMINI_ROTATION_STRATEGY', 'round_robin'), // round_robin, random, least_used
        'pool_enabled' => env('GEMINI_POOL_ENABLED', true),
        'pool_size' => env('GEMINI_POOL_SIZE', 5),
        'timeout' => env('GEMINI_TIMEOUT', 30),
    ],

    'chatbot' => [
        'fallback_responses' => [
            'Maaf, saya tidak dapat menemukan informasi yang Anda cari.',
            'Silakan hubungi customer service kami untuk informasi lebih lanjut.',
            'Terima kasih telah menghubungi PT Surya Inti Gas.',
        ],
        'max_history_length' => env('CHATBOT_MAX_HISTORY', 10),
        'response_timeout' => env('CHATBOT_TIMEOUT', 30),
        'enable_translation' => env('CHATBOT_ENABLE_TRANSLATION', true),
        'default_language' => env('CHATBOT_DEFAULT_LANGUAGE', 'id'),
        'supported_languages' => ['id', 'en', 'zh'],
        'enable_sentiment_analysis' => env('CHATBOT_ENABLE_SENTIMENT', true),
        'enable_ab_testing' => env('CHATBOT_ENABLE_AB_TESTING', true),
    ],

    'rate_limiting' => [
        'auth_endpoints' => env('RATE_LIMIT_AUTH', 100),
        'chatbot_endpoints' => env('RATE_LIMIT_CHATBOT', 60),
        'general_endpoints' => env('RATE_LIMIT_GENERAL', 1000),
        'visitor_tracking' => env('RATE_LIMIT_VISITOR', 1000), // No limit for analytics
    ],

    'analytics' => [
        'retention_days' => env('ANALYTICS_RETENTION_DAYS', 90),
        'enable_real_time' => env('ANALYTICS_REAL_TIME', true),
        'sampling_rate' => env('ANALYTICS_SAMPLING_RATE', 1.0),
        'enable_ip_geolocation' => env('ANALYTIPS_ENABLE_GEOLOCATION', true),
    ],

    'security' => [
        'brute_force_max_attempts_email' => env('BRUTE_FORCE_MAX_ATTEMPTS_EMAIL', 5),
        'brute_force_max_attempts_ip' => env('BRUTE_FORCE_MAX_ATTEMPTS_IP', 10),
        'brute_force_lockout_minutes' => env('BRUTE_FORCE_LOCKOUT_MINUTES', 15),
        'ip_whitelist_enabled' => env('IP_WHITELIST_ENABLED', false),
        'audit_logging_enabled' => env('AUDIT_LOGGING_ENABLED', true),
        'audit_log_retention_days' => env('AUDIT_LOG_RETENTION_DAYS', 90),
    ],

    'monitoring' => [
        'slack_webhook' => env('SLACK_WEBHOOK_URL', ''),
        'slack_enabled' => env('SLACK_MONITORING_ENABLED', false),
        'email_alerts_enabled' => env('EMAIL_ALERTS_ENABLED', false),
        'alert_email' => env('ALERT_EMAIL', ''),
        'health_check_interval' => env('HEALTH_CHECK_INTERVAL', 300), // 5 minutes
    ],

];
