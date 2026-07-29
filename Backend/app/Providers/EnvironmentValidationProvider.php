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
        // Skip validation during console operations (like composer install)
        if ($this->app->runningInConsole()) {
            return;
        }

        // Validate critical environment variables
        $this->validateEnvironmentVariables();
    }

    /**
     * Validate critical environment variables
     */
    protected function validateEnvironmentVariables(): void
    {
        $warnings = [];

        // Check critical config values
        if (empty(config('app.key'))) {
            $warnings[] = "Environment variable APP_KEY is not set";
        }

        if (empty(config('database.default'))) {
            $warnings[] = "Environment variable DB_CONNECTION is not set";
        }

        if (empty(config('database.connections.' . config('database.default') . '.database'))) {
            $warnings[] = "Environment variable DB_DATABASE is not set";
        }

        // Check for production-specific security settings
        if (app()->environment('production')) {
            if (config('app.debug') === true) {
                $warnings[] = "APP_DEBUG is enabled in production environment";
            }

            if (empty(config('app.key')) || config('app.key') === 'base64:...' || strlen(config('app.key')) < 32) {
                $warnings[] = "APP_KEY is not properly set for production";
            }

            if (config('session.secure_cookies') !== true) {
                $warnings[] = "SESSION_SECURE_COOKIES should be enabled in production";
            }

            if (empty(config('cors.allowed_origins'))) {
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