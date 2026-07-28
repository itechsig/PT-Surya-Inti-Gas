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
        // This is an API-only app with no 'login' route. Laravel's ApplicationBuilder sets a
        // default redirectGuestsTo(fn () => route('login')) unconditionally; for any request
        // that doesn't send an explicit Accept: application/json header, an unauthenticated
        // hit on a protected route would call route('login'), throw RouteNotFoundException,
        // and surface as an uncaught 500 instead of a 401. Overriding it to null makes
        // Authenticate::unauthenticated() always throw a plain AuthenticationException instead.
        $middleware->redirectGuestsTo(fn () => null);

        $middleware->validateCsrfTokens(except: [
            'api/chatbot',
            'api/chat/stream',
        ]);

        // Laravel's default HandleCors ships with no config/cors.php in this app, so it falls back to the
        // framework's own defaults (allowed_origins: ['*']) and runs after our CorsMiddleware in the response
        // chain, silently overwriting its whitelisted Access-Control-Allow-Origin back to a wildcard. Remove
        // it so our whitelist-based CorsMiddleware below is the only thing setting CORS headers.
        $middleware->remove(\Illuminate\Http\Middleware\HandleCors::class);

        // Add CORS middleware for API routes
        $middleware->append(\App\Http\Middleware\CorsMiddleware::class);

        // Add security headers middleware
        $middleware->append(\App\Http\Middleware\SecurityHeadersMiddleware::class);

        // Register IP whitelist middleware
        $middleware->alias([
            'ip.whitelist' => \App\Http\Middleware\IpWhitelistMiddleware::class,
            'audit.log' => \App\Http\Middleware\AuditLoggingMiddleware::class,
            'request.response.log' => \App\Http\Middleware\RequestResponseLoggingMiddleware::class,
            'brute.force' => \App\Http\Middleware\BruteForceProtectionMiddleware::class,
            'check.blocked' => \App\Http\Middleware\CheckBlockedUsers::class,
            'cors' => \App\Http\Middleware\CorsMiddleware::class,
            'role' => \App\Http\Middleware\EnsureRole::class,
            'password.change' => \App\Http\Middleware\RequirePasswordChangeMiddleware::class,
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

        // This is an API-only app with no 'login' route, so Laravel's default unauthenticated
        // handling (which tries to redirect non-JSON-expecting requests to route('login')) throws
        // RouteNotFoundException and surfaces as an uncaught 500 instead of a clean 401 whenever a
        // client doesn't send an explicit Accept: application/json header.
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, \Illuminate\Http\Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        });
    })->create();
