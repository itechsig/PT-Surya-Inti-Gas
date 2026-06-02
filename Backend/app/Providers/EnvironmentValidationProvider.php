<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;

class EnvironmentValidationProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register environment validation logic
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Validate critical environment variables
        $this->validateEnvironmentVariables();
    }

    /**
     * Validate critical environment variables
     */
    protected function validateEnvironmentVariables(): void
    {
        $requiredVariables = [
            'APP_KEY',
            'DB_CONNECTION',
            'DB_DATABASE',
        ];

        $warnings = [];

        foreach ($requiredVariables as $variable) {
            if (empty(env($variable))) {
                $warnings[] = "Environment variable {$variable} is not set";
            }
        }

        // Check for production-specific security settings
        if (app()->environment('production')) {
            if (env('APP_DEBUG') === true) {
                $warnings[] = "APP_DEBUG is enabled in production environment";
            }

            if (empty(env('APP_KEY')) || env('APP_KEY') === 'base64:...' || strlen(env('APP_KEY')) < 32) {
                $warnings[] = "APP_KEY is not properly set for production";
            }

            if (env('SESSION_SECURE_COOKIES') !== true) {
                $warnings[] = "SESSION_SECURE_COOKIES should be enabled in production";
            }

            if (empty(env('CORS_ALLOWED_ORIGINS'))) {
                $warnings[] = "CORS_ALLOWED_ORIGINS should be configured in production";
            }
        }

        // Log warnings if any
        if (!empty($warnings)) {
            foreach ($warnings as $warning) {
                \Illuminate\Support\Facades\Log::warning('Environment validation warning: ' . $warning);
            }

            // In production, throw exception for critical issues
            if (app()->environment('production') && count($warnings) > 0) {
                throw new \RuntimeException('Environment configuration validation failed: ' . implode(', ', $warnings));
            }
        }
    }
}