<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\CertificationController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatbotAnalyticsController;
use App\Http\Controllers\Api\ChatbotMonitoringController;
use App\Http\Controllers\Api\ChatbotABTestingController;
use App\Http\Controllers\Api\ChatbotSettingsController;
use App\Http\Controllers\Api\CareerController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\VisitorTrackingController;
use App\Http\Controllers\Api\AIAgentController;
use App\Http\Controllers\Api\AIRecommendationController;
use App\Http\Controllers\Api\BlockedUserController;
use App\Http\Controllers\Api\CareerApplicationController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\UnmannedAgentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API Version 1 Routes
Route::prefix('v1')->group(function () {
    // PUBLIC ROUTES - Website Visitors (No Authentication Required)
    // Route::middleware(['api', 'request.response.log', 'check.blocked'])->group(function () {
        // Authentication Routes (Public - for admin login) - 100 req/min
        // Route::middleware(['throttle:api-user', 'brute.force'])->group(function () {
            Route::post('/auth/register', [AuthController::class, 'register']);
            Route::post('/auth/login', [AuthController::class, 'login']);
            Route::post('/auth/email/verification-notification', [AuthController::class, 'sendVerificationEmail']);
        // });

        // Content Endpoints (Public)
        // Team Members API (Public)
        Route::get('/team', [TeamController::class, 'index']);
        Route::get('/team/{teamMember}', [TeamController::class, 'show']);

        // Projects API (Public)
        Route::get('/projects', [ProjectController::class, 'index']);
        Route::get('/projects/{project}', [ProjectController::class, 'show']);

        // Certifications API (Public)
        Route::get('/certifications', [CertificationController::class, 'index']);
        Route::get('/certifications/{certification}', [CertificationController::class, 'show']);

        // Contact Form API (Public)
        Route::post('/contact', [ContactController::class, 'store']);

        // Career Application API (Public)
        Route::post('/career', [CareerController::class, 'store']);

        // Admin Dashboard API (Public for testing - will move to protected routes later)
        Route::get('/admin/dashboard/overview', [DashboardController::class, 'overview']);
        Route::get('/admin/dashboard/contacts', [DashboardController::class, 'contacts']);
        Route::get('/admin/dashboard/contacts/{id}', [DashboardController::class, 'contactDetails']);
        Route::put('/admin/dashboard/contacts/{id}', [DashboardController::class, 'updateContact']);

        // Visitor Tracking API (Public) - Track website visitors (no rate limiting for analytics)
        // Temporarily removed check.blocked middleware for troubleshooting
        // Route::withoutMiddleware(['check.blocked'])->group(function () {
            Route::post('/visitor/track', [VisitorTrackingController::class, 'track']);
            Route::post('/visitor/pageview', [VisitorTrackingController::class, 'trackPageView']);
            Route::get('/visitor/current-ip', [VisitorTrackingController::class, 'getCurrentIP']);
        // });

        // AI Agent API (Public for testing - will move to protected routes later)
        Route::get('/admin/ai-agent/status', [AIAgentController::class, 'getStatus']);
        Route::post('/admin/ai-agent/monitor', [AIAgentController::class, 'runMonitoring']);
        Route::post('/admin/ai-agent/monitor/contacts', [AIAgentController::class, 'monitorContacts']);
        Route::post('/admin/ai-agent/monitor/applications', [AIAgentController::class, 'monitorApplications']);
        Route::post('/admin/ai-agent/monitor/visitors', [AIAgentController::class, 'monitorVisitors']);
        Route::get('/admin/ai-agent/monitor/visitors', [AIAgentController::class, 'getActivities']);

        // AI Recommendations API (Public for testing - will move to protected routes later)
        Route::get('/admin/ai-recommendations', [AIRecommendationController::class, 'index']);
        Route::get('/admin/ai-recommendations/statistics', [AIRecommendationController::class, 'statistics']);
        Route::get('/admin/ai-recommendations/{id}', [AIRecommendationController::class, 'show']);
        Route::post('/admin/ai-recommendations/{id}/approve', [AIRecommendationController::class, 'approve']);
        Route::post('/admin/ai-recommendations/{id}/reject', [AIRecommendationController::class, 'reject']);

        // Blocked Users API (Public for testing - will move to protected routes later)
        Route::get('/admin/blocked-users', [BlockedUserController::class, 'index']);
        Route::get('/admin/blocked-users/statistics', [BlockedUserController::class, 'statistics']);
        Route::post('/admin/blocked-users', [BlockedUserController::class, 'store']);
        Route::post('/admin/blocked-users/{id}/unblock', [BlockedUserController::class, 'unblock']);
        Route::delete('/admin/blocked-users/{id}', [BlockedUserController::class, 'destroy']);
        Route::get('/admin/blocked-users/check', [BlockedUserController::class, 'checkBlocked']);

        // Career Applications API (Public for testing - will move to protected routes later)
        Route::get('/admin/career-applications', [CareerApplicationController::class, 'index']);
        Route::get('/admin/career-applications/statistics', [CareerApplicationController::class, 'statistics']);
        Route::get('/admin/career-applications/{id}', [CareerApplicationController::class, 'show']);
        Route::put('/admin/career-applications/{id}', [CareerApplicationController::class, 'update']);
        Route::delete('/admin/career-applications/{id}', [CareerApplicationController::class, 'destroy']);

        // Notifications API (Public for testing - will move to protected routes later)
        Route::get('/admin/notifications', [NotificationController::class, 'index']);
        Route::get('/admin/notifications/unread', [NotificationController::class, 'unread']);
        Route::get('/admin/notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::get('/admin/notifications/statistics', [NotificationController::class, 'statistics']);
        Route::post('/admin/notifications/{id}/mark-read', [NotificationController::class, 'markAsRead']);
        Route::post('/admin/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/admin/notifications/{id}', [NotificationController::class, 'destroy']);

        // Audit Logs API (Public for testing - will move to protected routes later)
        Route::get('/admin/audit-logs', [AuditLogController::class, 'index']);
        Route::get('/admin/audit-logs/recent', [AuditLogController::class, 'recent']);
        Route::get('/admin/audit-logs/statistics', [AuditLogController::class, 'statistics']);

        // Unmanned Agent API (Public for testing - will move to protected routes later)
        Route::get('/admin/unmanned/overview', [UnmannedAgentController::class, 'overview']);
        Route::get('/admin/unmanned/agents', [UnmannedAgentController::class, 'index']);
        Route::get('/admin/unmanned/missions', [UnmannedAgentController::class, 'missions']);
        Route::get('/admin/unmanned/alerts', [UnmannedAgentController::class, 'alerts']);
        Route::get('/admin/unmanned/agent-health', [UnmannedAgentController::class, 'agentHealth']);
        Route::get('/admin/unmanned/system-activity', [UnmannedAgentController::class, 'systemActivity']);
        Route::get('/admin/unmanned/operational-stats', [UnmannedAgentController::class, 'operationalStats']);
        Route::get('/admin/unmanned/map-data', [UnmannedAgentController::class, 'mapData']);

        // Chatbot - Public Info Endpoints
        // Note: reload-kb and rotation-status moved to admin-only for security

        // Chatbot API - Core Features (Public) - 30 req/min (API calls are expensive)
        // Route::middleware('throttle:60,1')->group(function () {
            Route::post('/chatbot', [ChatbotController::class, 'chat']);
            Route::post('/chatbot/async', [ChatbotController::class, 'chat']);
            Route::post('/chatbot/feedback', [ChatbotController::class, 'feedback']);
            Route::post('/chat/stream', [ChatbotController::class, 'chat']);
            Route::post('/chat/stream/legacy', [ChatbotController::class, 'chatStream']);
        // });
    // });

    // ADMIN ROUTES - Admin Panel (Authentication Required)
    Route::middleware(['audit.log'])->group(function () {
        // Authentication Routes (Protected)
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Chatbot Key Management (Admin Only) - Security sensitive
        Route::post('/admin/chatbot/reload-kb', [ChatbotController::class, 'reloadKnowledgeBase']);
        Route::get('/admin/chatbot/rotation-status', [ChatbotController::class, 'apiKeyRotationStatus']);

        // Chatbot Analytics (Admin Only)
        Route::get('/admin/chatbot/analytics', [ChatbotAnalyticsController::class, 'index']);
        Route::get('/admin/chatbot/analytics/summary', [ChatbotAnalyticsController::class, 'summary']);
        Route::get('/admin/chatbot/analytics/popular-topics', [ChatbotAnalyticsController::class, 'popularTopics']);
        Route::get('/admin/chatbot/analytics/sentiment', [ChatbotAnalyticsController::class, 'sentimentAnalysis']);
        Route::get('/admin/chatbot/analytics/conversation-flow', [ChatbotAnalyticsController::class, 'conversationFlow']);
        Route::get('/admin/chatbot/analytics/user-engagement', [ChatbotAnalyticsController::class, 'userEngagement']);
        Route::get('/admin/chatbot/analytics/response-times', [ChatbotAnalyticsController::class, 'responseTimes']);
        Route::get('/admin/chatbot/analytics/ab-testing', [ChatbotAnalyticsController::class, 'abTesting']);
        Route::get('/admin/chatbot/analytics/export', [ChatbotAnalyticsController::class, 'exportAnalytics']);

        // Chatbot Monitoring (Admin Only)
        Route::get('/admin/chatbot/monitoring/health', [ChatbotMonitoringController::class, 'health']);
        Route::get('/admin/chatbot/monitoring/performance', [ChatbotMonitoringController::class, 'performance']);
        Route::get('/admin/chatbot/monitoring/errors', [ChatbotMonitoringController::class, 'errors']);
        Route::get('/admin/chatbot/monitoring/usage', [ChatbotMonitoringController::class, 'usage']);
        Route::get('/admin/chatbot/monitoring/alerts', [ChatbotMonitoringController::class, 'alerts']);
        Route::post('/admin/chatbot/monitoring/test-connection', [ChatbotMonitoringController::class, 'testConnection']);

        // Chatbot A/B Testing (Admin Only)
        Route::get('/admin/chatbot/ab-testing/campaigns', [ChatbotABTestingController::class, 'campaigns']);
        Route::post('/admin/chatbot/ab-testing/campaigns', [ChatbotABTestingController::class, 'createCampaign']);
        Route::get('/admin/chatbot/ab-testing/campaigns/{id}', [ChatbotABTestingController::class, 'getCampaign']);
        Route::put('/admin/chatbot/ab-testing/campaigns/{id}', [ChatbotABTestingController::class, 'updateCampaign']);
        Route::delete('/admin/chatbot/ab-testing/campaigns/{id}', [ChatbotABTestingController::class, 'deleteCampaign']);
        Route::post('/admin/chatbot/ab-testing/campaigns/{id}/start', [ChatbotABTestingController::class, 'startCampaign']);
        Route::post('/admin/chatbot/ab-testing/campaigns/{id}/stop', [ChatbotABTestingController::class, 'stopCampaign']);
        Route::get('/admin/chatbot/ab-testing/results/{id}', [ChatbotABTestingController::class, 'getResults']);
        Route::get('/admin/chatbot/ab-testing/analytics', [ChatbotABTestingController::class, 'analytics']);

        // Chatbot Settings (Admin Only)
        Route::get('/admin/chatbot/settings', [ChatbotSettingsController::class, 'index']);
        Route::put('/admin/chatbot/settings', [ChatbotSettingsController::class, 'update']);
        Route::post('/admin/chatbot/settings/reset', [ChatbotSettingsController::class, 'reset']);
        Route::get('/admin/chatbot/settings/maintenance', [ChatbotSettingsController::class, 'maintenanceMode']);
        Route::post('/admin/chatbot/settings/maintenance', [ChatbotSettingsController::class, 'toggleMaintenance']);
    });
});
