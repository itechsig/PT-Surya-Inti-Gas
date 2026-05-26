<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TranslationService;
use App\Services\SentimentAnalysisService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChatbotSettingsController extends Controller
{
    private TranslationService $translationService;
    private SentimentAnalysisService $sentimentAnalysisService;

    public function __construct(
        TranslationService $translationService,
        SentimentAnalysisService $sentimentAnalysisService
    ) {
        $this->translationService = $translationService;
        $this->sentimentAnalysisService = $sentimentAnalysisService;
    }

    public function setLanguage(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'language' => 'required|string|in:en,id,es,fr,de,ja,zh',
            ]);

            $this->translationService->setLanguage($validated['language']);
            $currentLanguage = $this->translationService->getCurrentLanguage();

            return response()->json([
                'success' => true,
                'message' => 'Language set successfully',
                'data' => ['language' => $currentLanguage]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to set language',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getSupportedLanguages(Request $request): JsonResponse
    {
        try {
            $languages = $this->translationService->getSupportedLanguages();

            return response()->json([
                'success' => true,
                'data' => $languages
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get supported languages',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function translate(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'text' => 'required|string',
                'target_language' => 'required|string|in:en,id,es,fr,de,ja,zh',
            ]);

            $translation = $this->translationService->translate(
                $validated['text'],
                $validated['target_language']
            );

            return response()->json([
                'success' => true,
                'data' => $translation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to translate text',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function analyzeSentiment(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'text' => 'required|string',
            ]);

            $sentiment = $this->sentimentAnalysisService->analyzeSentiment($validated['text']);

            return response()->json([
                'success' => true,
                'data' => $sentiment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to analyze sentiment',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function batchAnalyzeSentiment(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'texts' => 'required|array|min:1|max:100',
                'texts.*' => 'required|string',
            ]);

            $results = [];
            foreach ($validated['texts'] as $index => $text) {
                $results[$index] = $this->sentimentAnalysisService->analyzeSentiment($text);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'results' => $results,
                    'total_analyzed' => count($results)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to batch analyze sentiment',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getSentimentStatistics(Request $request): JsonResponse
    {
        try {
            // For now, return empty statistics as this would require historical data
            // The actual service method getSentimentStatistics() expects an array of analysis results
            $stats = [
                'total_analyzed' => 0,
                'positive_count' => 0,
                'negative_count' => 0,
                'neutral_count' => 0,
                'average_confidence' => 0,
                'period' => $request->query('period', '24h')
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get sentiment statistics',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function clearSentimentCache(Request $request): JsonResponse
    {
        try {
            $result = $this->sentimentAnalysisService->clearCache();

            return response()->json([
                'success' => true,
                'message' => 'Sentiment cache cleared successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear sentiment cache',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
