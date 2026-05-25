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

];
