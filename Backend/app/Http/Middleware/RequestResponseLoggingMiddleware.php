<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class RequestResponseLoggingMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        
        // Log request
        $this->logRequest($request);
        
        $response = $next($request);
        
        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;
        
        // Log response
        $this->logResponse($request, $response, $executionTime);
        
        return $response;
    }
    
    /**
     * Log request details
     */
    private function logRequest(Request $request): void
    {
        // Don't log health check endpoint
        if ($request->path() === 'health') {
            return;
        }
        
        $requestData = [
            'method' => $request->method(),
            'path' => $request->path(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => \Illuminate\Support\Facades\Auth::id(),
            'headers' => $this->filterSensitiveHeaders($request->headers->all()),
        ];
        
        // Log query parameters (excluding sensitive ones)
        if ($request->query()) {
            $requestData['query'] = $this->filterSensitiveData($request->query());
        }
        
        Log::channel('stack')->info('API Request', $requestData);
    }
    
    /**
     * Log response details
     */
    private function logResponse(Request $request, Response $response, float $executionTime): void
    {
        // Don't log health check endpoint
        if ($request->path() === 'health') {
            return;
        }
        
        $responseData = [
            'method' => $request->method(),
            'path' => $request->path(),
            'status' => $response->getStatusCode(),
            'execution_time' => round($executionTime * 1000, 2) . 'ms',
            'user_id' => \Illuminate\Support\Facades\Auth::id(),
        ];
        
        // Only log response size for non-streaming responses
        if (!$response->headers->get('Content-Type') || !str_contains($response->headers->get('Content-Type'), 'event-stream')) {
            $responseData['size'] = strlen($response->getContent()) . ' bytes';
        }
        
        // Log warnings for slow responses
        if ($executionTime > 2.0) {
            Log::channel('stack')->warning('Slow API Response', $responseData);
        } else {
            Log::channel('stack')->info('API Response', $responseData);
        }
    }
    
    /**
     * Filter sensitive headers
     */
    private function filterSensitiveHeaders(array $headers): array
    {
        $sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
        
        foreach ($sensitiveHeaders as $header) {
            if (isset($headers[$header])) {
                $headers[$header] = ['[FILTERED]'];
            }
        }
        
        return $headers;
    }
    
    /**
     * Filter sensitive data from arrays
     */
    private function filterSensitiveData(array $data): array
    {
        $sensitiveKeys = ['password', 'password_confirmation', 'token', 'api_key', 'secret', 'credit_card'];
        
        foreach ($sensitiveKeys as $key) {
            if (isset($data[$key])) {
                $data[$key] = '[FILTERED]';
            }
        }
        
        return $data;
    }
}