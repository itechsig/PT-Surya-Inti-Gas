<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class BruteForceProtectionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $email = $request->input('email');
        $ip = $request->ip();
        
        // Initialize email key if email is provided
        $emailKey = $email ? 'login_attempts:' . md5($email) : null;
        
        // Check for brute force attempts based on email
        if ($email) {
            $emailAttempts = Cache::get($emailKey, 0);
            
            if ($emailAttempts >= 5) {
                $remainingTime = Cache::get($emailKey . ':lockout') - time();
                
                Log::warning('Brute force attempt detected - Email blocked', [
                    'email' => $email,
                    'ip' => $ip,
                    'attempts' => $emailAttempts,
                    'remaining_lockout' => $remainingTime,
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Too many failed login attempts. Please try again in ' . $remainingTime . ' seconds.',
                ], 429);
            }
        }
        
        // Check for brute force attempts based on IP
        $ipKey = 'login_attempts_ip:' . $ip;
        $ipAttempts = Cache::get($ipKey, 0);
        
        if ($ipAttempts >= 10) {
            $remainingTime = Cache::get($ipKey . ':lockout') - time();
            
            Log::warning('Brute force attempt detected - IP blocked', [
                'ip' => $ip,
                'email' => $email,
                'attempts' => $ipAttempts,
                'remaining_lockout' => $remainingTime,
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Too many failed login attempts from your IP. Please try again in ' . $remainingTime . ' seconds.',
            ], 429);
        }
        
        $response = $next($request);
        
        // Track failed login attempts
        if ($response->getStatusCode() === 401 && ($request->path() === 'api/v1/auth/login' || $request->path() === 'api/auth/login')) {
            if ($email && $emailKey) {
                Cache::increment($emailKey);
                Cache::put($emailKey . ':lockout', time() + 900, 900); // 15 minutes lockout
                
                if (Cache::get($emailKey) >= 5) {
                    Cache::put($emailKey, 5, 900); // Reset to 5 for the lockout period
                } else {
                    Cache::put($emailKey, Cache::get($emailKey), 900); // Expire after 15 minutes
                }
            }
            
            Cache::increment($ipKey);
            Cache::put($ipKey . ':lockout', time() + 900, 900); // 15 minutes lockout
            
            if (Cache::get($ipKey) >= 10) {
                Cache::put($ipKey, 10, 900); // Reset to 10 for the lockout period
            } else {
                Cache::put($ipKey, Cache::get($ipKey), 900); // Expire after 15 minutes
            }
        }
        
        // Reset attempts on successful login
        if ($response->getStatusCode() === 200 && ($request->path() === 'api/v1/auth/login' || $request->path() === 'api/auth/login')) {
            if ($email && $emailKey) {
                Cache::forget($emailKey);
                Cache::forget($emailKey . ':lockout');
            }
            Cache::forget($ipKey);
            Cache::forget($ipKey . ':lockout');
        }
        
        return $response;
    }
}