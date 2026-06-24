<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withProviders([
        \App\Providers\EnvironmentValidationProvider::class,
    ])
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->validateCsrfTokens(except: [
            'api/chatbot',
            'api/chat/stream',
        ]);

        // Add CORS middleware for API routes (must come before security middleware)
        $middleware->append(\App\Http\Middleware\CorsMiddleware::class);

        // Add security headers middleware (CORS middleware handles API routes differently)
        $middleware->append(\App\Http\Middleware\SecurityHeadersMiddleware::class);

        // Register IP whitelist middleware
        $middleware->alias([
            'ip.whitelist' => \App\Http\Middleware\IpWhitelistMiddleware::class,
            'audit.log' => \App\Http\Middleware\AuditLoggingMiddleware::class,
            'request.response.log' => \App\Http\Middleware\RequestResponseLoggingMiddleware::class,
            'brute.force' => \App\Http\Middleware\BruteForceProtectionMiddleware::class,
            'check.blocked' => \App\Http\Middleware\CheckBlockedUsers::class,
        ]);

        // Disable EnsureFrontendRequestsAreStateful to prevent infinite loop/memory exhaustion
        // This middleware is only needed for SPA authentication with cookie-based sessions
        // For API tokens (which we're using for admin), it's not required
        // $middleware->api(prepend: [
        //     \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, \Illuminate\Http\Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ], 422);
            }
        });
    })->create();
