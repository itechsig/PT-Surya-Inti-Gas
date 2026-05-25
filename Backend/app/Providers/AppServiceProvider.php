<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register HTTP pool service as singleton if enabled
        if (config('services.gemini.pool_enabled', true)) {
            $this->app->singleton(\App\Services\HttpClientPoolService::class);
        }

        // Register advanced cache service as singleton
        $this->app->singleton(\App\Services\AdvancedCacheService::class);

        // Register real-time analytics service as singleton
        $this->app->singleton(\App\Services\RealTimeAnalyticsService::class);

        // Register translation service as singleton
        $this->app->singleton(\App\Services\TranslationService::class);

        // Register sentiment analysis service as singleton
        $this->app->singleton(\App\Services\SentimentAnalysisService::class);

        // Register monitoring service as singleton
        $this->app->singleton(\App\Services\MonitoringService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Custom validation rules
        \Illuminate\Support\Facades\Validator::extend('not_empty', function ($attribute, $value, $parameters) {
            return !empty(trim($value));
        });

        \Illuminate\Support\Facades\Validator::extend('no_html', function ($attribute, $value, $parameters) {
            return strip_tags($value) === $value;
        });

        \Illuminate\Support\Facades\Validator::extend('no_injection', function ($attribute, $value, $parameters) {
            // Check for common injection patterns
            $dangerousPatterns = [
                '/<script\b[^>]*>(.*?)<\/script>/is',
                '/javascript:/i',
                '/on\w+\s*=/i', // onclick=, onload=, etc.
                '/<\?php/',
                '/\${/',
            ];
            
            foreach ($dangerousPatterns as $pattern) {
                if (preg_match($pattern, $value)) {
                    return false;
                }
            }
            
            return true;
        });
    }
}
