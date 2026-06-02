<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IpWhitelistMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get allowed IPs from environment variable (comma-separated)
        $allowedIps = env('ADMIN_ALLOWED_IPS', '');
        
        // If no IPs are configured, allow all (for development)
        if (empty($allowedIps)) {
            return $next($request);
        }
        
        $allowedIpsArray = array_map('trim', explode(',', $allowedIps));
        $clientIp = $request->ip();
        
        // Check if client IP is in allowed list
        if (!in_array($clientIp, $allowedIpsArray)) {
            // Log the unauthorized access attempt
            \Illuminate\Support\Facades\Log::warning('Unauthorized admin access attempt from IP: ' . $clientIp, [
                'ip' => $clientIp,
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }
        
        return $next($request);
    }
}