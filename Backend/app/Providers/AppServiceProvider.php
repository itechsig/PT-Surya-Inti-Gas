<?php

namespace App\Providers;

use App\Models\JobVacancy;
use App\Models\Portfolio;
use App\Models\Product;
use App\Services\IndexNowService;
use App\Support\SiteUrls;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schedule;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // One instance per request so URLs from several saves go out in one IndexNow call.
        $this->app->singleton(IndexNowService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register custom validation rules
        $this->registerCustomValidationRules();

        $this->registerIndexNowHooks();

        // Dashboard Agent Schedule
        Schedule::command('dashboard:agent monitor-contacts')->hourly();
        Schedule::command('dashboard:agent monitor-visitors')->hourly();
        Schedule::command('dashboard:agent generate-analytics')->dailyAt('00:01');
        Schedule::command('dashboard:agent send-reports')->dailyAt('08:00');
        Schedule::command('dashboard:agent cleanup')->weekly();
    }

    /**
     * Announce public content changes made in the admin CMS to IndexNow search engines.
     * A page is submitted when it is (or just stopped being) public, and when deleted,
     * so engines drop it as well as pick up new and edited pages.
     */
    private function registerIndexNowHooks(): void
    {
        $watch = function (string $model, string $flag, callable $path): void {
            $submit = function (Model $record, bool $deleted) use ($flag, $path): void {
                if ($record->{$flag} || $record->wasChanged($flag) || $deleted) {
                    $paths = [$path($record)];
                    // A renamed slug leaves the old URL behind; tell engines it is gone.
                    if ($record->wasChanged('slug') && $record->getOriginal('slug')) {
                        $paths[] = $path($record, $record->getOriginal('slug'));
                    }
                    $urls = array_merge(...array_map(fn ($p) => SiteUrls::localized($p), $paths));
                    app(IndexNowService::class)->queue($urls);
                }
            };
            $model::saved(fn (Model $record) => $submit($record, false));
            $model::deleted(fn (Model $record) => $submit($record, true));
        };

        $watch(Product::class, 'is_published', fn ($p, $slug = null) => SiteUrls::productPath($slug ?? $p->slug));
        $watch(Portfolio::class, 'is_published', fn ($p, $slug = null) => SiteUrls::portfolioPath($slug ?? $p->slug));
        $watch(JobVacancy::class, 'is_active', fn ($j) => SiteUrls::jobPath($j->id));
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
