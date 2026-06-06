<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\BlockedUser;
use Illuminate\Support\Facades\Log;

class CheckBlockedUsers
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            $ipAddress = $request->ip();
            
            // Check if blocked_users table exists before querying
            if (!\Schema::hasTable('blocked_users')) {
                Log::warning('blocked_users table does not exist, skipping blocked user check');
                return $next($request);
            }
            
            // Log IP check for debugging
            Log::info('Checking blocked users', [
                'ip' => $ipAddress,
                'path' => $request->path(),
                'blocked_ips_in_db' => BlockedUser::active()->where('blockable_type', 'ip_address')->pluck('blockable_value')->toArray(),
            ]);
            
            // Check if IP is blocked (exact match or partial match for subnets)
            $blockedUsers = BlockedUser::active()
                ->where('blockable_type', 'ip_address')
                ->get();
            
            $isBlocked = false;
            $blockedUser = null;
            
            foreach ($blockedUsers as $blocked) {
                $blockedValue = $blocked->blockable_value;
                
                // Exact match
                if ($ipAddress === $blockedValue) {
                    $isBlocked = true;
                    $blockedUser = $blocked;
                    break;
                }
                
                // Partial match for subnets (e.g., 192.168.1. matches 192.168.1.100)
                if (strpos($ipAddress, $blockedValue) === 0) {
                    $isBlocked = true;
                    $blockedUser = $blocked;
                    break;
                }
            }
            
            if ($isBlocked && $blockedUser) {
                Log::warning('Blocked IP attempted access', [
                    'ip' => $ipAddress,
                    'blocked_user_id' => $blockedUser->id,
                    'blocked_value' => $blockedUser->blockable_value,
                    'reason' => $blockedUser->reason,
                    'path' => $request->path(),
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Your IP address has been blocked.',
                    'reason' => $blockedUser->reason,
                    'error_code' => 'IP_BLOCKED'
                ], 403);
            }
            
            // Check if email is blocked (if provided in request)
            $email = $request->input('email');
            if ($email) {
                $blockedEmail = BlockedUser::active()
                    ->where('blockable_type', 'email')
                    ->where('blockable_value', $email)
                    ->first();
                
                if ($blockedEmail) {
                    Log::warning('Blocked email attempted access', [
                        'email' => $email,
                        'ip' => $ipAddress,
                        'path' => $request->path(),
                    ]);
                    
                    return response()->json([
                        'success' => false,
                        'message' => 'Access denied. This email address has been blocked.',
                        'error_code' => 'EMAIL_BLOCKED'
                    ], 403);
                }
            }
            
            // Check if user ID is blocked (if authenticated)
            if (auth()->check()) {
                $blockedUser = BlockedUser::active()
                    ->where('blockable_type', 'user_id')
                    ->where('blockable_value', auth()->id())
                    ->first();
                
                if ($blockedUser) {
                    Log::warning('Blocked user attempted access', [
                        'user_id' => auth()->id(),
                        'ip' => $ipAddress,
                        'path' => $request->path(),
                    ]);
                    
                    auth()->logout();
                    
                    return response()->json([
                        'success' => false,
                        'message' => 'Access denied. Your account has been blocked.',
                        'error_code' => 'USER_BLOCKED'
                    ], 403);
                }
            }
            
            Log::info('Request allowed through blocking check', [
                'ip' => $ipAddress,
                'path' => $request->path(),
            ]);
            
            return $next($request);
            
        } catch (\Exception $e) {
            Log::error('Check blocked users middleware error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'ip' => $request->ip(),
            ]);
            
            // Allow request if middleware fails (fail-safe)
            return $next($request);
        }
    }
}
