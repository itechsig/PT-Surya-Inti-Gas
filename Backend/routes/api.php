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

// PUBLIC ROUTES - Website Visitors (No Authentication Required)
Route::middleware('api')->group(function () {
    // Authentication Routes (Public - for admin login) - 100 req/min
    Route::middleware('throttle:100,1')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login', [AuthController::class, 'login']);
    });

    // Content Endpoints (Public) - 100 req/min
    Route::middleware('throttle:100,1')->group(function () {
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

        // Chatbot - Public Info Endpoints
        Route::post('/chatbot/reload-kb', [ChatbotController::class, 'reloadKnowledgeBase']);
        Route::get('/chatbot/rotation-status', [ChatbotController::class, 'apiKeyRotationStatus']);
    });

    // Chatbot API - Core Features (Public) - 30 req/min (API calls are expensive)
    Route::middleware('throttle:30,1')->group(function () {
        Route::post('/chatbot', [ChatbotController::class, 'chat']);
        Route::post('/chatbot/async', [ChatbotController::class, 'chat']);
        Route::post('/chatbot/feedback', [ChatbotController::class, 'feedback']);
        Route::post('/chat/stream', [ChatbotController::class, 'chat']);
        Route::post('/chat/stream/legacy', [ChatbotController::class, 'chatStream']);
    });
});

// ADMIN ROUTES - Admin Panel (Authentication Required)
Route::middleware(['auth:sanctum', 'throttle:120,1'])->group(function () {
    // Authentication Routes (Protected)
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Chatbot Analytics (Admin Only)
    Route::get('/admin/chatbot/feedback/stats', [ChatbotAnalyticsController::class, 'feedbackStats']);
    Route::get('/admin/chatbot/analytics', [ChatbotAnalyticsController::class, 'analytics']);
    Route::get('/admin/chatbot/pool-stats', [ChatbotAnalyticsController::class, 'poolStats']);
    Route::get('/admin/chatbot/cache-stats', [ChatbotAnalyticsController::class, 'cacheStats']);
    Route::get('/admin/chatbot/real-time-analytics', [ChatbotAnalyticsController::class, 'realTimeAnalytics']);
    Route::post('/admin/chatbot/track-analytics', [ChatbotAnalyticsController::class, 'trackAnalytics']);

    // Language Support & Sentiment Analysis (Admin Only)
    Route::post('/admin/chatbot/set-language', [ChatbotSettingsController::class, 'setLanguage']);
    Route::get('/admin/chatbot/supported-languages', [ChatbotSettingsController::class, 'getSupportedLanguages']);
    Route::post('/admin/chatbot/translate', [ChatbotSettingsController::class, 'translate']);
    Route::post('/admin/chatbot/analyze-sentiment', [ChatbotSettingsController::class, 'analyzeSentiment']);
    Route::post('/admin/chatbot/batch-analyze-sentiment', [ChatbotSettingsController::class, 'batchAnalyzeSentiment']);
    Route::get('/admin/chatbot/sentiment-statistics', [ChatbotSettingsController::class, 'getSentimentStatistics']);
    Route::post('/admin/chatbot/clear-sentiment-cache', [ChatbotSettingsController::class, 'clearSentimentCache']);

    // Monitoring and Alerting (Admin Only)
    Route::post('/admin/chatbot/run-monitoring-checks', [ChatbotMonitoringController::class, 'runMonitoringChecks']);
    Route::get('/admin/chatbot/health-status', [ChatbotMonitoringController::class, 'getHealthStatus']);
    Route::get('/admin/chatbot/active-alerts', [ChatbotMonitoringController::class, 'getActiveAlerts']);
    Route::get('/admin/chatbot/alert-history', [ChatbotMonitoringController::class, 'getAlertHistory']);
    Route::get('/admin/chatbot/metrics-history', [ChatbotMonitoringController::class, 'getMetricsHistory']);
    Route::post('/admin/chatbot/resolve-alert', [ChatbotMonitoringController::class, 'resolveAlert']);
    Route::post('/admin/chatbot/clear-all-alerts', [ChatbotMonitoringController::class, 'clearAllAlerts']);
    Route::get('/admin/chatbot/alert-rules', [ChatbotMonitoringController::class, 'getAlertRules']);
    Route::post('/admin/chatbot/update-alert-rules', [ChatbotMonitoringController::class, 'updateAlertRules']);

    // A/B Testing (Admin Only)
    Route::post('/admin/chatbot/ab-test/campaigns', [ChatbotABTestingController::class, 'createABTestCampaign']);
    Route::get('/admin/chatbot/ab-test/campaigns', [ChatbotABTestingController::class, 'getABTestCampaigns']);
    Route::get('/admin/chatbot/ab-test/campaigns/{campaignId}', [ChatbotABTestingController::class, 'getABTestCampaign']);
    Route::get('/admin/chatbot/ab-test/campaigns/{campaignId}/stats', [ChatbotABTestingController::class, 'getABTestCampaignStats']);
    Route::get('/admin/chatbot/ab-test/campaigns/{campaignId}/variants', [ChatbotABTestingController::class, 'getABTestCampaignVariants']);
    Route::post('/admin/chatbot/ab-test/campaigns/{campaignId}/start', [ChatbotABTestingController::class, 'startABTestCampaign']);
    Route::post('/admin/chatbot/ab-test/campaigns/{campaignId}/pause', [ChatbotABTestingController::class, 'pauseABTestCampaign']);
    Route::post('/admin/chatbot/ab-test/campaigns/{campaignId}/complete', [ChatbotABTestingController::class, 'completeABTestCampaign']);
    Route::delete('/admin/chatbot/ab-test/campaigns/{campaignId}', [ChatbotABTestingController::class, 'deleteABTestCampaign']);
    Route::post('/admin/chatbot/ab-test/track-engagement', [ChatbotABTestingController::class, 'trackABTestEngagement']);
    Route::post('/admin/chatbot/ab-test/track-conversion', [ChatbotABTestingController::class, 'trackABTestConversion']);
});

// HEALTH CHECK (Public)
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
});
