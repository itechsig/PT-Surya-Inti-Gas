<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\CertificationController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\AuthController;

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

// Authentication routes (public)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('api')->group(function () {
    // Team Members API (public)
    Route::get('/team', [TeamController::class, 'index']);
    Route::get('/team/{teamMember}', [TeamController::class, 'show']);

    // Projects API (public)
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);

    // Certifications API (public)
    Route::get('/certifications', [CertificationController::class, 'index']);
    Route::get('/certifications/{certification}', [CertificationController::class, 'show']);

    // Contact Form API (public)
    Route::post('/contact', [ContactController::class, 'store']);

    // Chatbot API (public)
    Route::post('/chatbot', [ChatbotController::class, 'chat']);
    Route::post('/chatbot/async', [ChatbotController::class, 'chat']);
    Route::post('/chatbot/feedback', [ChatbotController::class, 'feedback']);
    Route::post('/chat/stream', [ChatbotController::class, 'chat']);
    Route::post('/chat/stream/legacy', [ChatbotController::class, 'chatStream']);
    Route::post('/chatbot/reload-kb', [ChatbotController::class, 'reloadKnowledgeBase']);
    Route::get('/chatbot/rotation-status', [ChatbotController::class, 'apiKeyRotationStatus']);
});

// Protected routes - require authentication
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Chatbot Analytics (protected)
    Route::get('/chatbot/feedback/stats', [ChatbotController::class, 'feedbackStats']);
    Route::get('/chatbot/analytics', [ChatbotController::class, 'analytics']);
    Route::get('/chatbot/pool-stats', [ChatbotController::class, 'poolStats']);
    Route::get('/chatbot/cache-stats', [ChatbotController::class, 'cacheStats']);
    Route::get('/chatbot/real-time-analytics', [ChatbotController::class, 'realTimeAnalytics']);
    Route::post('/chatbot/track-analytics', [ChatbotController::class, 'trackAnalytics']);

    // Language support (protected)
    Route::post('/chatbot/set-language', [ChatbotController::class, 'setLanguage']);
    Route::get('/chatbot/supported-languages', [ChatbotController::class, 'getSupportedLanguages']);
    Route::post('/chatbot/translate', [ChatbotController::class, 'translate']);

    // Sentiment analysis (protected)
    Route::post('/chatbot/analyze-sentiment', [ChatbotController::class, 'analyzeSentiment']);
    Route::post('/chatbot/batch-analyze-sentiment', [ChatbotController::class, 'batchAnalyzeSentiment']);
    Route::get('/chatbot/sentiment-statistics', [ChatbotController::class, 'getSentimentStatistics']);
    Route::post('/chatbot/clear-sentiment-cache', [ChatbotController::class, 'clearSentimentCache']);

    // Monitoring and alerting (protected)
    Route::post('/chatbot/run-monitoring-checks', [ChatbotController::class, 'runMonitoringChecks']);
    Route::get('/chatbot/health-status', [ChatbotController::class, 'getHealthStatus']);
    Route::get('/chatbot/active-alerts', [ChatbotController::class, 'getActiveAlerts']);
    Route::get('/chatbot/alert-history', [ChatbotController::class, 'getAlertHistory']);
    Route::get('/chatbot/metrics-history', [ChatbotController::class, 'getMetricsHistory']);
    Route::post('/chatbot/resolve-alert', [ChatbotController::class, 'resolveAlert']);
    Route::post('/chatbot/clear-all-alerts', [ChatbotController::class, 'clearAllAlerts']);
    Route::get('/chatbot/alert-rules', [ChatbotController::class, 'getAlertRules']);
    Route::post('/chatbot/update-alert-rules', [ChatbotController::class, 'updateAlertRules']);

    // A/B Testing (protected)
    Route::post('/chatbot/ab-test/campaigns', [ChatbotController::class, 'createABTestCampaign']);
    Route::get('/chatbot/ab-test/campaigns', [ChatbotController::class, 'getABTestCampaigns']);
    Route::get('/chatbot/ab-test/campaigns/{campaignId}', [ChatbotController::class, 'getABTestCampaign']);
    Route::get('/chatbot/ab-test/campaigns/{campaignId}/stats', [ChatbotController::class, 'getABTestCampaignStats']);
    Route::get('/chatbot/ab-test/campaigns/{campaignId}/variants', [ChatbotController::class, 'getABTestCampaignVariants']);
    Route::post('/chatbot/ab-test/campaigns/{campaignId}/start', [ChatbotController::class, 'startABTestCampaign']);
    Route::post('/chatbot/ab-test/campaigns/{campaignId}/pause', [ChatbotController::class, 'pauseABTestCampaign']);
    Route::post('/chatbot/ab-test/campaigns/{campaignId}/complete', [ChatbotController::class, 'completeABTestCampaign']);
    Route::delete('/chatbot/ab-test/campaigns/{campaignId}', [ChatbotController::class, 'deleteABTestCampaign']);
    Route::post('/chatbot/ab-test/track-engagement', [ChatbotController::class, 'trackABTestEngagement']);
    Route::post('/chatbot/ab-test/track-conversion', [ChatbotController::class, 'trackABTestConversion']);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
});
