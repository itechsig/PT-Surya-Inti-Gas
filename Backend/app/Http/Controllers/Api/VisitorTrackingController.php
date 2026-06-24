<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WebsiteVisitor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class VisitorTrackingController extends Controller
{
    /**
     * Track visitor information
     */
    public function track(Request $request): JsonResponse
    {
        // Add CORS headers directly
        $origin = $request->header('Origin') ?: '*';
        
        // Handle preflight OPTIONS request
        if ($request->isMethod('OPTIONS')) {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Max-Age', '86400');
        }
        
        try {
            $sessionId = $request->input('session_id') ?? $this->generateSessionId();
            $ipAddress = $request->ip();
            $userAgent = $request->userAgent();
            
            // Check if IP is blocked before tracking
            $isBlocked = \App\Models\BlockedUser::active()
                ->where('blockable_type', 'ip_address')
                ->where('blockable_value', $ipAddress)
                ->exists();
            
            if ($isBlocked) {
                Log::warning('Blocked IP attempted visitor tracking', [
                    'ip' => $ipAddress,
                    'session_id' => $sessionId,
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Your IP address has been blocked.',
                    'error_code' => 'IP_BLOCKED'
                ], 403)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept')
                ->header('Access-Control-Allow-Credentials', 'true');
            }
            
            // Parse user agent to get browser and OS
            $browserInfo = $this->parseUserAgent($userAgent);
            
            // Get geolocation (optional - requires external API)
            $location = $this->getGeolocation($ipAddress);
            
            // Check if this is a returning visitor
            $existingVisitor = WebsiteVisitor::where('session_id', $sessionId)->first();
            
            if ($existingVisitor) {
                // Update existing visitor
                $existingVisitor->update([
                    'last_visit' => now(),
                    'page_views' => $existingVisitor->page_views + 1,
                    'is_returning_visitor' => true,
                    'time_on_site' => $existingVisitor->time_on_site + $request->input('time_on_page', 0),
                    'pages_visited' => $this->updatePagesVisited($existingVisitor->pages_visited, $request->input('current_page')),
                ]);

                // Also trigger AI Agent monitoring for returning visitors
                $this->triggerAIMonitoring($existingVisitor);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Visitor tracked successfully',
                    'data' => [
                        'session_id' => $existingVisitor->session_id,
                        'is_returning' => true
                    ]
                ])
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept')
                ->header('Access-Control-Allow-Credentials', 'true');
            }
            
            // Create new visitor record
            $visitor = WebsiteVisitor::create([
                'session_id' => $sessionId,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'browser' => $browserInfo['browser'],
                'os' => $browserInfo['os'],
                'device_type' => $this->detectDeviceType($userAgent),
                'referrer' => $request->input('referrer'),
                'landing_page' => $request->input('current_page'),
                'exit_page' => $request->input('current_page'),
                'page_views' => 1,
                'time_on_site' => $request->input('time_on_page', 0),
                'first_visit' => now(),
                'last_visit' => now(),
                'is_returning_visitor' => false,
                'pages_visited' => [$request->input('current_page')],
                'country' => $location['country'] ?? null,
                'city' => $location['city'] ?? null,
            ]);

            // Trigger AI Agent monitoring for new visitor
            $this->triggerAIMonitoring($visitor);
            
            return response()->json([
                'success' => true,
                'message' => 'New visitor tracked successfully',
                'data' => [
                    'session_id' => $visitor->session_id,
                    'is_returning' => false
                ]
            ])
            ->header('Access-Control-Allow-Origin', $origin)
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept')
            ->header('Access-Control-Allow-Credentials', 'true');
            
        } catch (\Exception $e) {
            Log::error('Visitor tracking error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to track visitor'
            ], 500)
            ->header('Access-Control-Allow-Origin', $origin)
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept')
            ->header('Access-Control-Allow-Credentials', 'true');
        }
    }

    /**
     * Track individual page view
     */
    public function trackPageView(Request $request): JsonResponse
    {
        // Add CORS headers directly
        $origin = $request->header('Origin') ?: '*';
        
        // Handle preflight OPTIONS request
        if ($request->isMethod('OPTIONS')) {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Max-Age', '86400');
        }
        
        try {
            $sessionId = $request->input('session_id');
            
            if (!$sessionId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session ID required'
                ], 400)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept')
                ->header('Access-Control-Allow-Credentials', 'true');
            }
            
            $visitor = WebsiteVisitor::where('session_id', $sessionId)->first();
            
            if (!$visitor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Visitor not found'
                ], 404)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept')
                ->header('Access-Control-Allow-Credentials', 'true');
            }
            
            $currentPage = $request->input('current_page');
            $timeOnPage = $request->input('time_on_page', 0);
            
            // Update visitor with new page view
            $visitor->update([
                'last_visit' => now(),
                'page_views' => $visitor->page_views + 1,
                'exit_page' => $currentPage,
                'time_on_site' => $visitor->time_on_site + $timeOnPage,
                'pages_visited' => $this->updatePagesVisited($visitor->pages_visited, $currentPage),
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Page view tracked successfully'
            ])
            ->header('Access-Control-Allow-Origin', $origin)
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept')
            ->header('Access-Control-Allow-Credentials', 'true');
            
        } catch (\Exception $e) {
            Log::error('Page view tracking error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to track page view'
            ], 500)
            ->header('Access-Control-Allow-Origin', $origin)
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept')
            ->header('Access-Control-Allow-Credentials', 'true');
        }
    }

    /**
     * Generate a unique session ID
     */
    private function generateSessionId(): string
    {
        return md5(uniqid(rand(), true));
    }

    /**
     * Parse user agent to extract browser and OS information
     */
    private function parseUserAgent(string $userAgent): array
    {
        $browser = 'Unknown';
        $os = 'Unknown';
        
        // Browser detection
        if (preg_match('/Chrome/i', $userAgent) && !preg_match('/Edge|OPR/i', $userAgent)) {
            $browser = 'Chrome';
        } elseif (preg_match('/Firefox/i', $userAgent)) {
            $browser = 'Firefox';
        } elseif (preg_match('/Safari/i', $userAgent) && !preg_match('/Chrome/i', $userAgent)) {
            $browser = 'Safari';
        } elseif (preg_match('/Edge/i', $userAgent)) {
            $browser = 'Edge';
        } elseif (preg_match('/OPR/i', $userAgent)) {
            $browser = 'Opera';
        }
        
        // OS detection
        if (preg_match('/Windows/i', $userAgent)) {
            $os = 'Windows';
        } elseif (preg_match('/Mac OS X/i', $userAgent)) {
            $os = 'macOS';
        } elseif (preg_match('/Linux/i', $userAgent)) {
            $os = 'Linux';
        } elseif (preg_match('/Android/i', $userAgent)) {
            $os = 'Android';
        } elseif (preg_match('/iOS/i', $userAgent)) {
            $os = 'iOS';
        }
        
        return [
            'browser' => $browser,
            'os' => $os
        ];
    }

    /**
     * Detect device type from user agent
     */
    private function detectDeviceType(string $userAgent): string
    {
        if (preg_match('/Mobile|Android|iPhone|iPad/i', $userAgent)) {
            if (preg_match('/iPad/i', $userAgent)) {
                return 'tablet';
            }
            return 'mobile';
        }
        return 'desktop';
    }

    /**
     * Get geolocation information from IP address
     * Note: This is a basic implementation. For production, use a proper geolocation API
     */
    private function getGeolocation(string $ipAddress): array
    {
        try {
            // Skip localhost
            if (in_array($ipAddress, ['127.0.0.1', '::1', 'localhost'])) {
                return ['country' => null, 'city' => null];
            }
            
            // Use a free geolocation API or implement your own
            // For now, return null - you can integrate with services like:
            // - IPStack
            // - MaxMind GeoIP
            // - IPInfo
            // - FreeGeoIP
            
            // Example implementation (commented out - requires API key):
            // $response = Http::get("http://api.ipstack.com/{$ipAddress}?access_key=YOUR_API_KEY");
            // return $response->json();
            
            return ['country' => null, 'city' => null];
            
        } catch (\Exception $e) {
            Log::error('Geolocation error', [
                'error' => $e->getMessage(),
                'ip' => $ipAddress
            ]);
            
            return ['country' => null, 'city' => null];
        }
    }

    /**
     * Get current visitor IP address
     */
    public function getCurrentIP(Request $request): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        } catch (\Exception $e) {
            Log::error('Get current IP error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get current IP'
            ], 500);
        }
    }

    /**
     * Update pages visited array
     */
    private function updatePagesVisited(array|null $pagesVisited, string $currentPage): array
    {
        if (!is_array($pagesVisited)) {
            $pagesVisited = [];
        }
        
        if (!in_array($currentPage, $pagesVisited)) {
            $pagesVisited[] = $currentPage;
        }
        
        return $pagesVisited;
    }

    /**
     * Trigger AI Agent monitoring for visitor activity
     */
    private function triggerAIMonitoring($visitor): void
    {
        try {
            Log::info('Triggering AI Agent monitoring for visitor', [
                'visitor_id' => $visitor->id,
                'session_id' => $visitor->session_id,
                'ip_address' => $visitor->ip_address
            ]);
            
            \App\Services\AIAgentService::monitorVisitor($visitor);
            
            Log::info('AI Agent monitoring completed successfully', [
                'visitor_id' => $visitor->id
            ]);
        } catch (\Exception $e) {
            Log::error('AI Agent monitoring error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'visitor_id' => $visitor->id
            ]);
        }
    }
}
