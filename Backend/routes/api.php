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
use App\Http\Controllers\Api\HeroSlideController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\JobVacancyController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\ImageController;

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
        // Authentication Routes (Public - login only; account creation is admin-only)
        Route::middleware(['throttle:10,1', 'brute.force'])->group(function () {
            Route::post('/auth/login', [AuthController::class, 'login']);
            Route::post('/auth/email/verification-notification', [AuthController::class, 'sendVerificationEmail']);
        });

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

        // Hero Slides API (Public)
        Route::get('/hero-slides', [HeroSlideController::class, 'index']);

        // Products API (Public)
        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/products/{slug}', [ProductController::class, 'show']);

        // Gallery API (Public)
        Route::get('/gallery', [GalleryController::class, 'index']);

        // Job Vacancies API (Public)
        Route::get('/job-vacancies', [JobVacancyController::class, 'index']);

        // Portfolio API (Public)
        Route::get('/industries', [PortfolioController::class, 'industries']);
        Route::get('/service-types', [PortfolioController::class, 'serviceTypes']);
        Route::get('/portfolios', [PortfolioController::class, 'index']);
        Route::get('/portfolios/{slug}', [PortfolioController::class, 'show']);

        // Image serving API (to work around Railway storage link issues)
        Route::get('/image/{path}', [ImageController::class, 'serve'])->where('path', '.*');

        // Contact Form API (Public)
        Route::post('/contact', [ContactController::class, 'store']);

        // Career Application API (Public)
        Route::post('/career', [CareerController::class, 'store']);

        // Visitor Tracking API (Public) - Track website visitors (no rate limiting for analytics)
        // Temporarily removed check.blocked middleware for troubleshooting
        // Route::withoutMiddleware(['check.blocked'])->group(function () {
            Route::post('/visitor/track', [VisitorTrackingController::class, 'track']);
            Route::post('/visitor/pageview', [VisitorTrackingController::class, 'trackPageView']);
            Route::get('/visitor/current-ip', [VisitorTrackingController::class, 'getCurrentIP']);
        // });

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
    Route::middleware(['auth:sanctum', 'audit.log', 'password.change'])->group(function () {
        // Authentication Routes (Protected)
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::middleware(['throttle:5,1'])->put('/auth/password', [AuthController::class, 'updatePassword']);

        // User Management (Super Admin Only)
        Route::middleware(['role:super_admin'])->group(function () {
            Route::get('/admin/users', [UserController::class, 'index']);
            Route::post('/admin/users', [UserController::class, 'store']);
            Route::put('/admin/users/{user}', [UserController::class, 'update']);
            Route::delete('/admin/users/{user}', [UserController::class, 'destroy']);
            Route::patch('/admin/users/{user}/reset-password', [UserController::class, 'resetPassword']);
            Route::patch('/admin/users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
        });

        // Hero Slides API (Admin)
        Route::get('/admin/hero-slides', [HeroSlideController::class, 'adminIndex']);
        Route::get('/admin/hero-slides/{heroSlide}', [HeroSlideController::class, 'show']);
        Route::middleware(['role:super_admin,admin,editor'])->group(function () {
            Route::post('/admin/hero-slides', [HeroSlideController::class, 'store']);
            Route::put('/admin/hero-slides/{heroSlide}', [HeroSlideController::class, 'update']); // frontend POSTs with _method=PUT (multipart/form-data can't send real PUT)
            Route::patch('/admin/hero-slides/{heroSlide}/toggle-active', [HeroSlideController::class, 'toggleActive']);
            Route::delete('/admin/hero-slides/{heroSlide}', [HeroSlideController::class, 'destroy']);
            Route::post('/admin/hero-slides/reorder', [HeroSlideController::class, 'reorder']);
        });

        // Products API (Admin)
        Route::get('/admin/product-categories', [ProductController::class, 'categories']);
        Route::get('/admin/products', [ProductController::class, 'adminIndex']);
        Route::get('/admin/products/{product}', [ProductController::class, 'adminShow']);
        Route::middleware(['role:super_admin,admin,editor'])->group(function () {
            Route::post('/admin/products', [ProductController::class, 'store']);
            Route::put('/admin/products/{product}', [ProductController::class, 'update']); // frontend POSTs with _method=PUT (multipart)
            Route::patch('/admin/products/{product}/toggle-featured', [ProductController::class, 'toggleFeatured']);
            Route::patch('/admin/products/{product}/toggle-published', [ProductController::class, 'togglePublished']);
            Route::delete('/admin/products/{product}', [ProductController::class, 'destroy']);
            Route::post('/admin/products/reorder', [ProductController::class, 'reorder']);
        });
        // Gallery API (Admin)
        Route::get('/admin/gallery', [GalleryController::class, 'adminIndex']);
        Route::get('/admin/gallery/{galleryItem}', [GalleryController::class, 'show']);
        Route::middleware(['role:super_admin,admin,editor'])->group(function () {
            Route::post('/admin/gallery', [GalleryController::class, 'store']);
            Route::put('/admin/gallery/{galleryItem}', [GalleryController::class, 'update']); // frontend POSTs with _method=PUT (multipart)
            Route::patch('/admin/gallery/{galleryItem}/toggle-active', [GalleryController::class, 'toggleActive']);
            Route::delete('/admin/gallery/{galleryItem}', [GalleryController::class, 'destroy']);
            Route::post('/admin/gallery/reorder', [GalleryController::class, 'reorder']);
        });

        // Portfolio API (Admin)
        Route::get('/admin/industries', [PortfolioController::class, 'industries']);
        Route::get('/admin/service-types', [PortfolioController::class, 'serviceTypes']);
        Route::get('/admin/portfolios', [PortfolioController::class, 'adminIndex']);
        Route::get('/admin/portfolios/{portfolio}', [PortfolioController::class, 'adminShow']);
        Route::middleware(['role:super_admin,admin,editor'])->group(function () {
            Route::post('/admin/portfolios', [PortfolioController::class, 'store']);
            Route::put('/admin/portfolios/{portfolio}', [PortfolioController::class, 'update']); // frontend POSTs with _method=PUT (multipart)
            Route::patch('/admin/portfolios/{portfolio}/toggle-featured', [PortfolioController::class, 'toggleFeatured']);
            Route::patch('/admin/portfolios/{portfolio}/toggle-published', [PortfolioController::class, 'togglePublished']);
            Route::delete('/admin/portfolios/{portfolio}', [PortfolioController::class, 'destroy']);
            Route::post('/admin/portfolios/reorder', [PortfolioController::class, 'reorder']);
            Route::post('/admin/portfolios/{portfolio}/images', [PortfolioController::class, 'storeImages']);
            Route::post('/admin/portfolios/{portfolio}/images/reorder', [PortfolioController::class, 'reorderImages']);
            Route::delete('/admin/portfolios/{portfolio}/images/{image}', [PortfolioController::class, 'destroyImage']);
        });

        // Job Vacancies API (Admin) - Editor has no access to this module; HR manages it instead
        Route::middleware(['role:super_admin,admin,hr'])->group(function () {
            Route::get('/admin/job-vacancies', [JobVacancyController::class, 'adminIndex']);
            Route::get('/admin/job-vacancies/{jobVacancy}', [JobVacancyController::class, 'show']);
            Route::post('/admin/job-vacancies', [JobVacancyController::class, 'store']);
            Route::put('/admin/job-vacancies/{jobVacancy}', [JobVacancyController::class, 'update']);
            Route::patch('/admin/job-vacancies/{jobVacancy}/toggle-active', [JobVacancyController::class, 'toggleActive']);
            Route::delete('/admin/job-vacancies/{jobVacancy}', [JobVacancyController::class, 'destroy']);
            Route::post('/admin/job-vacancies/reorder', [JobVacancyController::class, 'reorder']);
        });

        // Admin Dashboard API
        Route::get('/admin/dashboard/overview', [DashboardController::class, 'overview']);
        Route::get('/admin/dashboard/contacts', [DashboardController::class, 'contacts']);
        Route::get('/admin/dashboard/contacts/{id}', [DashboardController::class, 'contactDetails']);
        Route::put('/admin/dashboard/contacts/{id}', [DashboardController::class, 'updateContact']);

        // AI Agent API
        Route::get('/admin/ai-agent/status', [AIAgentController::class, 'getStatus']);
        Route::post('/admin/ai-agent/monitor', [AIAgentController::class, 'runMonitoring']);
        Route::post('/admin/ai-agent/monitor/contacts', [AIAgentController::class, 'monitorContacts']);
        Route::post('/admin/ai-agent/monitor/applications', [AIAgentController::class, 'monitorApplications']);
        Route::post('/admin/ai-agent/monitor/visitors', [AIAgentController::class, 'monitorVisitors']);
        Route::get('/admin/ai-agent/monitor/visitors', [AIAgentController::class, 'getActivities']);

        // AI Recommendations API
        Route::get('/admin/ai-recommendations', [AIRecommendationController::class, 'index']);
        Route::get('/admin/ai-recommendations/statistics', [AIRecommendationController::class, 'statistics']);
        Route::get('/admin/ai-recommendations/{id}', [AIRecommendationController::class, 'show']);
        Route::post('/admin/ai-recommendations/{id}/approve', [AIRecommendationController::class, 'approve']);
        Route::post('/admin/ai-recommendations/{id}/reject', [AIRecommendationController::class, 'reject']);

        // Blocked Users API (Super Admin Only - security sensitive)
        Route::middleware(['role:super_admin'])->group(function () {
            Route::get('/admin/blocked-users', [BlockedUserController::class, 'index']);
            Route::get('/admin/blocked-users/statistics', [BlockedUserController::class, 'statistics']);
            Route::post('/admin/blocked-users', [BlockedUserController::class, 'store']);
            Route::post('/admin/blocked-users/{id}/unblock', [BlockedUserController::class, 'unblock']);
            Route::delete('/admin/blocked-users/{id}', [BlockedUserController::class, 'destroy']);
            Route::get('/admin/blocked-users/check', [BlockedUserController::class, 'checkBlocked']);
        });

        // Career Applications API - Editor has no access to this module
        Route::middleware(['role:super_admin,admin,hr'])->group(function () {
            Route::get('/admin/career-applications', [CareerApplicationController::class, 'index']);
            Route::get('/admin/career-applications/statistics', [CareerApplicationController::class, 'statistics']);
            Route::get('/admin/career-applications/{id}', [CareerApplicationController::class, 'show']);
            Route::get('/admin/career-applications/{id}/cv', [CareerApplicationController::class, 'downloadCv']);
            Route::put('/admin/career-applications/{id}', [CareerApplicationController::class, 'update']);
            Route::delete('/admin/career-applications/{id}', [CareerApplicationController::class, 'destroy']);
        });

        // Notifications API
        Route::get('/admin/notifications', [NotificationController::class, 'index']);
        Route::get('/admin/notifications/unread', [NotificationController::class, 'unread']);
        Route::get('/admin/notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::get('/admin/notifications/statistics', [NotificationController::class, 'statistics']);
        Route::post('/admin/notifications/{id}/mark-read', [NotificationController::class, 'markAsRead']);
        Route::post('/admin/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/admin/notifications/{id}', [NotificationController::class, 'destroy']);

        // Audit Logs API (Super Admin Only)
        Route::middleware(['role:super_admin'])->group(function () {
            Route::get('/admin/audit-logs', [AuditLogController::class, 'index']);
            Route::get('/admin/audit-logs/recent', [AuditLogController::class, 'recent']);
            Route::get('/admin/audit-logs/statistics', [AuditLogController::class, 'statistics']);
        });

        // Unmanned Agent API
        Route::get('/admin/unmanned/overview', [UnmannedAgentController::class, 'overview']);
        Route::get('/admin/unmanned/agents', [UnmannedAgentController::class, 'index']);
        Route::get('/admin/unmanned/missions', [UnmannedAgentController::class, 'missions']);
        Route::get('/admin/unmanned/alerts', [UnmannedAgentController::class, 'alerts']);
        Route::get('/admin/unmanned/agent-health', [UnmannedAgentController::class, 'agentHealth']);
        Route::get('/admin/unmanned/system-activity', [UnmannedAgentController::class, 'systemActivity']);
        Route::get('/admin/unmanned/operational-stats', [UnmannedAgentController::class, 'operationalStats']);
        Route::get('/admin/unmanned/map-data', [UnmannedAgentController::class, 'mapData']);

        // Chatbot Key Management (Super Admin Only) - Security sensitive
        Route::middleware(['role:super_admin'])->group(function () {
            Route::post('/admin/chatbot/reload-kb', [ChatbotController::class, 'reloadKnowledgeBase']);
            Route::get('/admin/chatbot/rotation-status', [ChatbotController::class, 'apiKeyRotationStatus']);
        });

        // Chatbot Analytics
        // NOTE: previously routed to method names (index/summary/popularTopics/sentimentAnalysis/
        // conversationFlow/userEngagement/responseTimes/abTesting/exportAnalytics) that do not exist
        // on ChatbotAnalyticsController, causing a fatal "Call to undefined method" on every hit.
        // Re-wired to the controller's actual methods; unimplemented sub-features were dropped
        // rather than fabricated.
        Route::get('/admin/chatbot/analytics', [ChatbotAnalyticsController::class, 'analytics']);
        Route::get('/admin/chatbot/analytics/feedback', [ChatbotAnalyticsController::class, 'feedbackStats']);
        Route::get('/admin/chatbot/analytics/pool-stats', [ChatbotAnalyticsController::class, 'poolStats']);
        Route::get('/admin/chatbot/analytics/cache-stats', [ChatbotAnalyticsController::class, 'cacheStats']);
        Route::get('/admin/chatbot/analytics/realtime', [ChatbotAnalyticsController::class, 'realTimeAnalytics']);
        Route::post('/admin/chatbot/analytics/track', [ChatbotAnalyticsController::class, 'trackAnalytics']);

        // Chatbot Monitoring
        // NOTE: previously routed to nonexistent methods (health/performance/errors/usage/alerts/
        // testConnection); re-wired to ChatbotMonitoringController's real methods.
        Route::post('/admin/chatbot/monitoring/run-checks', [ChatbotMonitoringController::class, 'runMonitoringChecks']);
        Route::get('/admin/chatbot/monitoring/health', [ChatbotMonitoringController::class, 'getHealthStatus']);
        Route::get('/admin/chatbot/monitoring/alerts', [ChatbotMonitoringController::class, 'getActiveAlerts']);
        Route::get('/admin/chatbot/monitoring/alerts/history', [ChatbotMonitoringController::class, 'getAlertHistory']);
        Route::get('/admin/chatbot/monitoring/metrics', [ChatbotMonitoringController::class, 'getMetricsHistory']);
        Route::post('/admin/chatbot/monitoring/alerts/resolve', [ChatbotMonitoringController::class, 'resolveAlert']);
        Route::post('/admin/chatbot/monitoring/alerts/clear', [ChatbotMonitoringController::class, 'clearAllAlerts']);
        Route::get('/admin/chatbot/monitoring/alert-rules', [ChatbotMonitoringController::class, 'getAlertRules']);
        Route::put('/admin/chatbot/monitoring/alert-rules', [ChatbotMonitoringController::class, 'updateAlertRules']);

        // Chatbot A/B Testing
        // NOTE: previously routed to nonexistent methods (campaigns/createCampaign/getCampaign/
        // updateCampaign/stopCampaign/getResults/analytics); re-wired to ChatbotABTestingController's
        // real methods. No "update campaign" method exists on the service, so that route was dropped.
        Route::get('/admin/chatbot/ab-testing/campaigns', [ChatbotABTestingController::class, 'getABTestCampaigns']);
        Route::post('/admin/chatbot/ab-testing/campaigns', [ChatbotABTestingController::class, 'createABTestCampaign']);
        Route::get('/admin/chatbot/ab-testing/campaigns/{id}', [ChatbotABTestingController::class, 'getABTestCampaign']);
        Route::delete('/admin/chatbot/ab-testing/campaigns/{id}', [ChatbotABTestingController::class, 'deleteABTestCampaign']);
        Route::get('/admin/chatbot/ab-testing/campaigns/{id}/stats', [ChatbotABTestingController::class, 'getABTestCampaignStats']);
        Route::get('/admin/chatbot/ab-testing/campaigns/{id}/variants', [ChatbotABTestingController::class, 'getABTestCampaignVariants']);
        Route::post('/admin/chatbot/ab-testing/campaigns/{id}/start', [ChatbotABTestingController::class, 'startABTestCampaign']);
        Route::post('/admin/chatbot/ab-testing/campaigns/{id}/pause', [ChatbotABTestingController::class, 'pauseABTestCampaign']);
        Route::post('/admin/chatbot/ab-testing/campaigns/{id}/complete', [ChatbotABTestingController::class, 'completeABTestCampaign']);
        Route::post('/admin/chatbot/ab-testing/engagement', [ChatbotABTestingController::class, 'trackABTestEngagement']);
        Route::post('/admin/chatbot/ab-testing/conversion', [ChatbotABTestingController::class, 'trackABTestConversion']);

        // Chatbot Language & Sentiment (Super Admin Only)
        // NOTE: previously routed to nonexistent methods (index/update/reset/maintenanceMode/
        // toggleMaintenance) — ChatbotSettingsController actually wraps TranslationService and
        // SentimentAnalysisService, not a maintenance-mode toggle. Re-wired to its real methods
        // under URL paths that reflect what the code does.
        Route::middleware(['role:super_admin'])->group(function () {
            Route::post('/admin/chatbot/language', [ChatbotSettingsController::class, 'setLanguage']);
            Route::get('/admin/chatbot/language/supported', [ChatbotSettingsController::class, 'getSupportedLanguages']);
            Route::post('/admin/chatbot/translate', [ChatbotSettingsController::class, 'translate']);
            Route::post('/admin/chatbot/sentiment/analyze', [ChatbotSettingsController::class, 'analyzeSentiment']);
            Route::post('/admin/chatbot/sentiment/batch-analyze', [ChatbotSettingsController::class, 'batchAnalyzeSentiment']);
            Route::get('/admin/chatbot/sentiment/statistics', [ChatbotSettingsController::class, 'getSentimentStatistics']);
            Route::post('/admin/chatbot/sentiment/clear-cache', [ChatbotSettingsController::class, 'clearSentimentCache']);
        });
    });
});
