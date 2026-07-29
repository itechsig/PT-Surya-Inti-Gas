<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get allowed origins from environment variable (comma-separated)
        $allowedOrigins = env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,https://suryaintigas.com');
        $originsArray = array_map('trim', explode(',', $allowedOrigins));
        $requestOrigin = $request->header('Origin');

        // Only reflect the origin back when it's actually on the allow-list. Falling back
        // to the first configured origin for unrecognized origins would advertise an
        // Access-Control-Allow-Origin that doesn't match the real request origin.
        $allowedOrigin = in_array($requestOrigin, $originsArray, true) ? $requestOrigin : null;

        // Handle preflight OPTIONS requests
        if ($request->isMethod('OPTIONS')) {
            $preflight = response('', 204)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept')
                ->header('Access-Control-Max-Age', '86400');

            if ($allowedOrigin !== null) {
                $preflight->header('Access-Control-Allow-Origin', $allowedOrigin)
                    ->header('Access-Control-Allow-Credentials', 'true');
            }

            return $preflight;
        }

        $response = $next($request);

        // Add CORS headers to all responses, only when the origin is recognized.
        if ($allowedOrigin !== null) {
            $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept');
        
        // Add CORS headers for images and static files
        $response->headers->set('Access-Control-Expose-Headers', 'Content-Length, Content-Type');

        return $response;
    }
}
