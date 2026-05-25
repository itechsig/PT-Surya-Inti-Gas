<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AnalyticsService
{
    /**
     * Track a chatbot interaction
     */
    public function trackInteraction(string $question, string $answer, string $source, ?float $similarity, string $intent, ?float $confidence): void
    {
        try {
            // Check if question already exists
            $existing = DB::table('chatbot_analytics')
                ->where('question', $question)
                ->where('answer', $answer)
                ->where('source', $source)
                ->first();

            if ($existing) {
                // Update count and last asked timestamp
                DB::table('chatbot_analytics')
                    ->where('id', $existing->id)
                    ->update([
                        'count' => $existing->count + 1,
                        'last_asked_at' => now(),
                        'similarity' => $similarity,
                        'intent' => $intent,
                        'confidence' => $confidence,
                    ]);
            } else {
                // Insert new record
                DB::table('chatbot_analytics')->insert([
                    'question' => $question,
                    'answer' => $answer,
                    'source' => $source,
                    'similarity' => $similarity,
                    'intent' => $intent,
                    'confidence' => $confidence,
                    'count' => 1,
                    'last_asked_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Analytics tracking error', [
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Get popular questions
     */
    public function getPopularQuestions(int $limit = 10): array
    {
        try {
            return DB::table('chatbot_analytics')
                ->orderBy('count', 'desc')
                ->orderBy('last_asked_at', 'desc')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            Log::error('Get popular questions error', [
                'message' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Get analytics summary
     */
    public function getAnalyticsSummary(): array
    {
        try {
            $totalInteractions = DB::table('chatbot_analytics')->sum('count');
            $uniqueQuestions = DB::table('chatbot_analytics')->count();
            
            $sourceDistribution = DB::table('chatbot_analytics')
                ->select('source', DB::raw('SUM(count) as total'))
                ->groupBy('source')
                ->get()
                ->keyBy('source')
                ->toArray();

            $avgSimilarity = DB::table('chatbot_analytics')
                ->whereNotNull('similarity')
                ->avg('similarity');

            return [
                'total_interactions' => $totalInteractions,
                'unique_questions' => $uniqueQuestions,
                'source_distribution' => $sourceDistribution,
                'avg_similarity' => $avgSimilarity,
            ];
        } catch (\Exception $e) {
            Log::error('Get analytics summary error', [
                'message' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Get questions by source
     */
    public function getQuestionsBySource(string $source, int $limit = 20): array
    {
        try {
            return DB::table('chatbot_analytics')
                ->where('source', $source)
                ->orderBy('count', 'desc')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            Log::error('Get questions by source error', [
                'message' => $e->getMessage(),
            ]);
            return [];
        }
    }
}
