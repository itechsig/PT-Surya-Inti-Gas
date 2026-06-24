<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeadersMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Skip security headers for API routes to allow CORS
        if ($request->is('api/*')) {
            // Still apply basic security headers for API
            $response->headers->set('X-Content-Type-Options', 'nosniff');
            $response->headers->set('X-XSS-Protection', '1; mode=block');
            $response->headers->remove('Server');
            $response->headers->remove('X-Powered-By');
            return $response;
        }

        // Prevent clickjacking attacks
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Enable XSS protection
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Content Security Policy (enhanced security)
        // Generate nonce for inline scripts (remove 'unsafe-inline' and 'unsafe-eval')
        $nonce = base64_encode(random_bytes(16));

        // In production, customize this based on your actual requirements
        // For development, we keep some relaxed settings
        if (app()->environment('production')) {
            $csp = "default-src 'self'; " .
                    "script-src 'self' 'nonce-{$nonce}'; " .
                    "style-src 'self' 'nonce-{$nonce}'; " .
                    "img-src 'self' data: https:; " .
                    "font-src 'self' data:; " .
                    "connect-src 'self'; " .
                    "frame-ancestors 'self'; " .
                    "base-uri 'self'; " .
                    "form-action 'self';";
        } else {
            // Development: Allow 'unsafe-inline' for hot-reload and debugging
            $csp = "default-src 'self'; " .
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " .
                    "style-src 'self' 'unsafe-inline'; " .
                    "img-src 'self' data: https:; " .
                    "font-src 'self' data:; " .
                    "connect-src 'self'; " .
                    "frame-ancestors 'self';";
        }

        $response->headers->set('Content-Security-Policy', $csp);
        $response->headers->set('X-Content-Security-Policy-Nonce', $nonce);

        // HSTS (only in production with HTTPS)
        if (app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // Permissions Policy (formerly Feature Policy)
        $permissionsPolicy = "geolocation=(), " .
                           "microphone=(), " .
                           "camera=(), " .
                           "payment=(), " .
                           "usb=()";

        $response->headers->set('Permissions-Policy', $permissionsPolicy);

        // Additional security headers
        $response->headers->set('X-Permitted-Cross-Domain-Policies', 'none');
        $response->headers->set('Cross-Origin-Embedder-Policy', 'require-corp');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Cross-Origin-Resource-Policy', 'same-origin');

        // Remove server information
        $response->headers->remove('Server');
        $response->headers->remove('X-Powered-By');

        return $response;
    }
}