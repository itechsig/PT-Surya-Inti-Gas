<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schedule;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register custom validation rules
        $this->registerCustomValidationRules();

        // Dashboard Agent Schedule
        Schedule::command('dashboard:agent monitor-contacts')->hourly();
        Schedule::command('dashboard:agent monitor-visitors')->hourly();
        Schedule::command('dashboard:agent generate-analytics')->dailyAt('00:01');
        Schedule::command('dashboard:agent send-reports')->dailyAt('08:00');
        Schedule::command('dashboard:agent cleanup')->weekly();
    }

    /**
     * Register custom validation rules
     */
    private function registerCustomValidationRules(): void
    {
        // Rule to check if string is not empty after trimming
        \Illuminate\Support\Facades\Validator::extend('not_empty', function ($attribute, $value, $parameters, $validator) {
            return !empty(trim($value));
        });

        // Rule to check if string contains no HTML tags
        \Illuminate\Support\Facades\Validator::extend('no_html', function ($attribute, $value, $parameters, $validator) {
            return strip_tags($value) === $value;
        });

        // Rule to check for potential injection attacks
        \Illuminate\Support\Facades\Validator::extend('no_injection', function ($attribute, $value, $parameters, $validator) {
            // Check for common SQL injection patterns
            $sqlPatterns = ['/(\s|^)(OR|AND|XOR)(\s+)/i', '/(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC)(\s+)/i'];
            foreach ($sqlPatterns as $pattern) {
                if (preg_match($pattern, $value)) {
                    return false;
                }
            }

            // Check for common XSS patterns
            $xssPatterns = ['/<script[^>]*>/i', '/javascript:/i', '/on\w+\s*=/i'];
            foreach ($xssPatterns as $pattern) {
                if (preg_match($pattern, $value)) {
                    return false;
                }
            }

            return true;
        });
    }
}
