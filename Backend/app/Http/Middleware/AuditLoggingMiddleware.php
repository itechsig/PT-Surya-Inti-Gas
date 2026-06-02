<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class AuditLoggingMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        
        // Log admin actions
        if (\Illuminate\Support\Facades\Auth::check() && $this->isAdminRoute($request)) {
            $user = \Illuminate\Support\Facades\Auth::user();
            
            $logData = [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'action' => $request->method() . ' ' . $request->path(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'timestamp' => now()->toISOString(),
                'status_code' => $response->getStatusCode(),
            ];
            
            // Log the audit entry
            Log::channel('audit')->info('Admin action performed', $logData);
            
            // Store in database if you have an audit_logs table
            // \App\Models\AuditLog::create($logData);
        }
        
        return $response;
    }
    
    /**
     * Determine if the current route is an admin route
     */
    private function isAdminRoute(Request $request): bool
    {
        return str_starts_with($request->path(), 'admin') || 
               str_starts_with($request->path(), 'api/admin');
    }
}