<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FeedbackService
{
    /**
     * Store user feedback for a chatbot response
     */
    public function storeFeedback(array $data): bool
    {
        try {
            DB::table('chatbot_feedback')->insert([
                'user_message' => $data['user_message'] ?? '',
                'bot_response' => $data['bot_response'] ?? '',
                'source' => $data['source'] ?? 'unknown',
                'intent' => $data['intent'] ?? null,
                'confidence' => $data['confidence'] ?? 0.0,
                'rating' => $data['rating'] ?? null,
                'comment' => $data['comment'] ?? null,
                'helpful' => $data['helpful'] ?? null,
                'metadata' => isset($data['metadata']) ? json_encode($data['metadata']) : null,
                'session_id' => $data['session_id'] ?? null,
                'ip_address' => $data['ip_address'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Feedback storage error', [
                'message' => $e->getMessage(),
                'data' => $data,
            ]);
            return false;
        }
    }

    /**
     * Get feedback statistics
     */
    public function getFeedbackStats(): array
    {
        try {
            $total = DB::table('chatbot_feedback')->count();
            $helpful = DB::table('chatbot_feedback')->where('helpful', true)->count();
            $notHelpful = DB::table('chatbot_feedback')->where('helpful', false)->count();
            
            $averageRating = DB::table('chatbot_feedback')
                ->whereNotNull('rating')
                ->avg('rating');

            $bySource = DB::table('chatbot_feedback')
                ->select('source', DB::raw('COUNT(*) as count'))
                ->groupBy('source')
                ->get()
                ->pluck('count', 'source')
                ->toArray();

            $byIntent = DB::table('chatbot_feedback')
                ->select('intent', DB::raw('COUNT(*) as count'))
                ->whereNotNull('intent')
                ->groupBy('intent')
                ->get()
                ->pluck('count', 'intent')
                ->toArray();

            return [
                'total_feedback' => $total,
                'helpful_count' => $helpful,
                'not_helpful_count' => $notHelpful,
                'helpful_percentage' => $total > 0 ? round(($helpful / $total) * 100, 2) : 0,
                'average_rating' => $averageRating ? round($averageRating, 2) : null,
                'by_source' => $bySource,
                'by_intent' => $byIntent,
            ];
        } catch (\Exception $e) {
            Log::error('Feedback stats error', [
                'message' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Get problematic responses (low ratings or not helpful)
     */
    public function getProblematicResponses(int $limit = 20): array
    {
        try {
            return DB::table('chatbot_feedback')
                ->where(function ($query) {
                    $query->where('helpful', false)
                        ->orWhere('rating', '<=', 2);
                })
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            Log::error('Get problematic responses error', [
                'message' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Get common unanswered questions (fallback responses with negative feedback)
     */
    public function getUnansweredQuestions(int $limit = 20): array
    {
        try {
            return DB::table('chatbot_feedback')
                ->where('source', 'fallback')
                ->where(function ($query) {
                    $query->where('helpful', false)
                        ->orWhere('rating', '<=', 2);
                })
                ->select('user_message', DB::raw('COUNT(*) as count'))
                ->groupBy('user_message')
                ->orderBy('count', 'desc')
                ->limit($limit)
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            Log::error('Get unanswered questions error', [
                'message' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Analyze feedback and suggest improvements
     */
    public function analyzeAndSuggest(): array
    {
        try {
            $stats = $this->getFeedbackStats();
            $problematic = $this->getProblematicResponses(10);
            $unanswered = $this->getUnansweredQuestions(10);

            $suggestions = [];

            // Check if helpful percentage is low
            if ($stats['helpful_percentage'] < 70) {
                $suggestions[] = [
                    'type' => 'overall_quality',
                    'priority' => 'high',
                    'message' => 'Overall helpful percentage is below 70%. Consider improving knowledge base or AI responses.',
                ];
            }

            // Check specific sources with issues
            if (isset($stats['by_source']['fallback']) && $stats['by_source']['fallback'] > 10) {
                $suggestions[] = [
                    'type' => 'knowledge_base',
                    'priority' => 'high',
                    'message' => 'High number of fallback responses. Expand knowledge base with common questions.',
                ];
            }

            // Check AI source issues
            if (isset($stats['by_source']['ai']) && $stats['average_rating'] < 3) {
                $suggestions[] = [
                    'type' => 'ai_model',
                    'priority' => 'medium',
                    'message' => 'AI responses have low ratings. Consider adjusting system prompt or using a better model.',
                ];
            }

            // Suggest adding unanswered questions to KB
            if (!empty($unanswered)) {
                $suggestions[] = [
                    'type' => 'new_patterns',
                    'priority' => 'high',
                    'message' => count($unanswered) . ' common questions are going unanswered. Add these to knowledge base.',
                    'data' => $unanswered,
                ];
            }

            return [
                'stats' => $stats,
                'problematic_responses' => $problematic,
                'unanswered_questions' => $unanswered,
                'suggestions' => $suggestions,
            ];
        } catch (\Exception $e) {
            Log::error('Feedback analysis error', [
                'message' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Export feedback for external analysis
     */
    public function exportFeedback(array $filters = []): array
    {
        try {
            $query = DB::table('chatbot_feedback');

            if (isset($filters['source'])) {
                $query->where('source', $filters['source']);
            }

            if (isset($filters['intent'])) {
                $query->where('intent', $filters['intent']);
            }

            if (isset($filters['rating_from'])) {
                $query->where('rating', '>=', $filters['rating_from']);
            }

            if (isset($filters['rating_to'])) {
                $query->where('rating', '<=', $filters['rating_to']);
            }

            if (isset($filters['date_from'])) {
                $query->where('created_at', '>=', $filters['date_from']);
            }

            if (isset($filters['date_to'])) {
                $query->where('created_at', '<=', $filters['date_to']);
            }

            return $query->orderBy('created_at', 'desc')->get()->toArray();
        } catch (\Exception $e) {
            Log::error('Feedback export error', [
                'message' => $e->getMessage(),
            ]);
            return [];
        }
    }
}
