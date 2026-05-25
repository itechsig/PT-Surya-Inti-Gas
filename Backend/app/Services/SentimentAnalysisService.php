<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * SentimentAnalysisService
 * 
 * Advanced NLP service for sentiment analysis of user messages.
 * Supports multiple analysis methods:
 * - AI-based sentiment analysis using Gemini
 * - Rule-based sentiment analysis (Indonesian & English)
 * - Sentiment caching for performance
 * - Confidence scoring
 * - Multi-language support
 * 
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class SentimentAnalysisService
{
    /**
     * Sentiment categories
     */
    public const SENTIMENT_POSITIVE = 'positive';
    public const SENTIMENT_NEUTRAL = 'neutral';
    public const SENTIMENT_NEGATIVE = 'negative';

    /**
     * Indonesian positive sentiment words
     */
    private const INDONESIAN_POSITIVE = [
        'bagus', 'baik', 'hebat', 'keren', 'luar biasa', 'mengagumkan',
        'suka', 'cinta', 'terima kasih', 'makasih', 'terima kasih banyak',
        'syukur', 'senang', 'gembira', 'happy', 'senyum', 'terbaik',
        'mantap', 'kencang', 'cepat', 'mudah', 'praktis', 'efisien',
        'hemat', 'murah', 'terjangkau', 'berkualitas', 'profesional',
        'ramah', 'sabot', 'menyenangkan', 'puas', 'terpuji', 'jempol',
        'sukses', 'berhasil', 'aman', 'nyaman', 'terpercaya', 'recommended',
        'top', 'okay', 'oke', 'okeh', 'mantapjiwa', 'slayer', 'juara'
    ];

    /**
     * Indonesian negative sentiment words
     */
    private const INDONESIAN_NEGATIVE = [
        'buruk', 'jelek', 'gagal', 'gagap', 'kesalahan', 'error',
        'marah', 'benci', 'dendam', 'kecewa', 'sedih', 'nangis',
        'cemas', 'khawatir', 'takut', 'takut', 'ngeri', 'malas',
        'lelah', 'capek', 'penat', 'bosan', 'sulit', 'rumit',
        'mahal', 'terlalu mahal', 'mahal sekali', 'harganya tinggi',
        'lambat', 'lemot', 'berat', 'berat sekali', 'menyesakkan',
        'berbahaya', 'tidak aman', 'risiko', 'bahaya', 'hancur',
        'rusak', 'gangguan', 'masalah', 'permasalahan', 'kendala',
        'kesulitan', 'kesalahan', 'salah', 'tidak benar', 'salah paham',
        'menyebalkan', 'menjengkelkan', 'membosankan', 'mengecewakan',
        'menakutkan', 'mengganggu', 'mengganggu sekali'
    ];

    /**
     * English positive sentiment words
     */
    private const ENGLISH_POSITIVE = [
        'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
        'awesome', 'love', 'like', 'thank', 'thanks', 'thank you',
        'grateful', 'happy', 'joy', 'delight', 'best', 'outstanding',
        'fast', 'quick', 'easy', 'simple', 'efficient', 'effective',
        'cheap', 'affordable', 'quality', 'professional', 'friendly',
        'helpful', 'enjoyable', 'satisfied', 'pleased', 'success',
        'successful', 'safe', 'secure', 'reliable', 'recommended',
        'perfect', 'brilliant', 'superb', 'magnificent', 'terrific',
        'okay', 'ok', 'nice', 'cool', 'beautiful', 'pleasant'
    ];

    /**
     * English negative sentiment words
     */
    private const ENGLISH_NEGATIVE = [
        'bad', 'terrible', 'awful', 'horrible', 'poor', 'worst',
        'fail', 'failure', 'error', 'mistake', 'angry', 'hate',
        'dislike', 'disappointed', 'sad', 'cry', 'worried', 'anxious',
        'fear', 'scary', 'lazy', 'tired', 'exhausted', 'boring',
        'difficult', 'complicated', 'expensive', 'overpriced', 'slow',
        'heavy', 'dangerous', 'unsafe', 'risk', 'broken', 'damage',
        'problem', 'issue', 'trouble', 'annoying', 'frustrating',
        'disappointing', 'scary', 'disturbing', 'unpleasant'
    ];

    /**
     * @var ChatbotService
     */
    private $chatbotService;

    /**
     * @var array
     */
    private $sentimentCache = [];

    /**
     * Constructor
     * 
     * @param ChatbotService $chatbotService
     */
    public function __construct(ChatbotService $chatbotService)
    {
        $this->chatbotService = $chatbotService;
    }

    /**
     * Analyze sentiment of a message
     * 
     * @param string $message The message to analyze
     * @param string $language Language code (id, en)
     * @param bool $useAI Use AI-based analysis (default: false for speed)
     * @return array Sentiment analysis result
     */
    public function analyzeSentiment(string $message, string $language = 'id', bool $useAI = false): array
    {
        try {
            // Check cache first
            $cacheKey = $this->getCacheKey($message, $language, $useAI);
            $cached = Cache::get($cacheKey);
            
            if ($cached !== null) {
                return $cached;
            }

            // Analyze sentiment
            if ($useAI) {
                $result = $this->analyzeWithAI($message, $language);
            } else {
                $result = $this->analyzeWithRules($message, $language);
            }

            // Cache the result for 1 hour
            Cache::put($cacheKey, $result, 3600);

            return $result;
        } catch (Exception $e) {
            Log::error('Sentiment analysis error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Return neutral sentiment as fallback
            return [
                'sentiment' => self::SENTIMENT_NEUTRAL,
                'confidence' => 0.5,
                'score' => 0,
                'method' => 'fallback'
            ];
        }
    }

    /**
     * Analyze sentiment using rule-based approach
     * 
     * @param string $message
     * @param string $language
     * @return array
     */
    private function analyzeWithRules(string $message, string $language): array
    {
        $message = strtolower($message);
        $words = explode(' ', $message);
        
        $positiveWords = $language === 'id' ? self::INDONESIAN_POSITIVE : self::ENGLISH_POSITIVE;
        $negativeWords = $language === 'id' ? self::INDONESIAN_NEGATIVE : self::ENGLISH_NEGATIVE;
        
        $positiveCount = 0;
        $negativeCount = 0;
        
        // Count positive and negative words
        foreach ($words as $word) {
            if (in_array($word, $positiveWords)) {
                $positiveCount++;
            } elseif (in_array($word, $negativeWords)) {
                $negativeCount++;
            }
        }
        
        // Check for negation words
        $negationWords = $language === 'id' ? ['tidak', 'bukan', 'tak', 'nggak'] : ['not', "don't", "doesn't", "didn't", "won't", "wouldn't"];
        foreach ($negationWords as $negation) {
            if (strpos($message, $negation) !== false) {
                // Reverse sentiment if negation is present
                $temp = $positiveCount;
                $positiveCount = $negativeCount;
                $negativeCount = $temp;
                break;
            }
        }
        
        // Calculate score (-1 to 1)
        $totalWords = count($words);
        if ($totalWords === 0) {
            return [
                'sentiment' => self::SENTIMENT_NEUTRAL,
                'confidence' => 1.0,
                'score' => 0,
                'method' => 'rule-based',
                'positive_words' => [],
                'negative_words' => []
            ];
        }
        
        $score = ($positiveCount - $negativeCount) / max($totalWords, 1);
        
        // Determine sentiment
        if ($score > 0.1) {
            $sentiment = self::SENTIMENT_POSITIVE;
        } elseif ($score < -0.1) {
            $sentiment = self::SENTIMENT_NEGATIVE;
        } else {
            $sentiment = self::SENTIMENT_NEUTRAL;
        }
        
        // Calculate confidence based on the number of sentiment words found
        $sentimentWords = $positiveCount + $negativeCount;
        $confidence = min(1.0, 0.3 + ($sentimentWords / $totalWords) * 0.7);
        
        // Get matched words
        $matchedPositive = array_filter($words, fn($word) => in_array($word, $positiveWords));
        $matchedNegative = array_filter($words, fn($word) => in_array($word, $negativeWords));
        
        return [
            'sentiment' => $sentiment,
            'confidence' => $confidence,
            'score' => $score,
            'method' => 'rule-based',
            'positive_words' => array_values($matchedPositive),
            'negative_words' => array_values($matchedNegative),
            'positive_count' => $positiveCount,
            'negative_count' => $negativeCount
        ];
    }

    /**
     * Analyze sentiment using AI (Gemini)
     * 
     * @param string $message
     * @param string $language
     * @return array
     */
    private function analyzeWithAI(string $message, string $language): array
    {
        try {
            $prompt = $this->buildAIPrompt($message, $language);
            
            $response = $this->chatbotService->generateResponse($prompt, []);
            
            if (!isset($response['message'])) {
                return $this->analyzeWithRules($message, $language);
            }
            
            // Parse AI response
            $sentimentData = $this->parseAIResponse($response['message']);
            
            return [
                'sentiment' => $sentimentData['sentiment'] ?? self::SENTIMENT_NEUTRAL,
                'confidence' => $sentimentData['confidence'] ?? 0.5,
                'score' => $sentimentData['score'] ?? 0,
                'method' => 'ai-based',
                'ai_response' => $response['message']
            ];
        } catch (Exception $e) {
            Log::error('AI sentiment analysis error, falling back to rule-based', [
                'message' => $e->getMessage()
            ]);
            
            return $this->analyzeWithRules($message, $language);
        }
    }

    /**
     * Build AI prompt for sentiment analysis
     * 
     * @param string $message
     * @param string $language
     * @return string
     */
    private function buildAIPrompt(string $message, string $language): string
    {
        if ($language === 'id') {
            return "Analisis sentimen dari pesan berikut ini. " .
                   "Jawab dalam format JSON dengan struktur: " .
                   "{\"sentiment\": \"positive|neutral|negative\", \"confidence\": 0.0-1.0, \"score\": -1.0 to 1.0}. " .
                   "Pesan: \"{$message}\"";
        } else {
            return "Analyze the sentiment of the following message. " .
                   "Answer in JSON format with structure: " .
                   "{\"sentiment\": \"positive|neutral|negative\", \"confidence\": 0.0-1.0, \"score\": -1.0 to 1.0}. " .
                   "Message: \"{$message}\"";
        }
    }

    /**
     * Parse AI response to extract sentiment data
     * 
     * @param string $response
     * @return array
     */
    private function parseAIResponse(string $response): array
    {
        try {
            // Try to extract JSON from response
            if (preg_match('/\{[^}]+\}/', $response, $matches)) {
                $json = json_decode($matches[0], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    return $json;
                }
            }
            
            // Fallback: analyze response text
            $response = strtolower($response);
            
            if (strpos($response, 'positive') !== false || strpos($response, 'positif') !== false) {
                return ['sentiment' => self::SENTIMENT_POSITIVE, 'confidence' => 0.8, 'score' => 0.8];
            } elseif (strpos($response, 'negative') !== false || strpos($response, 'negatif') !== false) {
                return ['sentiment' => self::SENTIMENT_NEGATIVE, 'confidence' => 0.8, 'score' => -0.8];
            } else {
                return ['sentiment' => self::SENTIMENT_NEUTRAL, 'confidence' => 0.6, 'score' => 0];
            }
        } catch (Exception $e) {
            Log::error('AI response parse error', ['message' => $e->getMessage()]);
            return ['sentiment' => self::SENTIMENT_NEUTRAL, 'confidence' => 0.5, 'score' => 0];
        }
    }

    /**
     * Get sentiment from score
     * 
     * @param float $score
     * @return string
     */
    public function getSentimentFromScore(float $score): string
    {
        if ($score > 0.1) {
            return self::SENTIMENT_POSITIVE;
        } elseif ($score < -0.1) {
            return self::SENTIMENT_NEGATIVE;
        } else {
            return self::SENTIMENT_NEUTRAL;
        }
    }

    /**
     * Batch analyze sentiment for multiple messages
     * 
     * @param array $messages Array of messages
     * @param string $language
     * @param bool $useAI
     * @return array Array of sentiment results
     */
    public function batchAnalyze(array $messages, string $language = 'id', bool $useAI = false): array
    {
        $results = [];
        
        foreach ($messages as $index => $message) {
            $results[$index] = $this->analyzeSentiment($message, $language, $useAI);
        }
        
        return $results;
    }

    /**
     * Get sentiment statistics from batch results
     * 
     * @param array $results Batch sentiment analysis results
     * @return array Statistics
     */
    public function getSentimentStatistics(array $results): array
    {
        $total = count($results);
        if ($total === 0) {
            return [
                'total' => 0,
                'positive' => 0,
                'neutral' => 0,
                'negative' => 0,
                'positive_percentage' => 0,
                'neutral_percentage' => 0,
                'negative_percentage' => 0,
                'average_confidence' => 0,
                'average_score' => 0
            ];
        }
        
        $positive = 0;
        $neutral = 0;
        $negative = 0;
        $totalConfidence = 0;
        $totalScore = 0;
        
        foreach ($results as $result) {
            if ($result['sentiment'] === self::SENTIMENT_POSITIVE) {
                $positive++;
            } elseif ($result['sentiment'] === self::SENTIMENT_NEGATIVE) {
                $negative++;
            } else {
                $neutral++;
            }
            
            $totalConfidence += $result['confidence'];
            $totalScore += $result['score'];
        }
        
        return [
            'total' => $total,
            'positive' => $positive,
            'neutral' => $neutral,
            'negative' => $negative,
            'positive_percentage' => ($positive / $total) * 100,
            'neutral_percentage' => ($neutral / $total) * 100,
            'negative_percentage' => ($negative / $total) * 100,
            'average_confidence' => $totalConfidence / $total,
            'average_score' => $totalScore / $total
        ];
    }

    /**
     * Get sentiment label in Indonesian
     * 
     * @param string $sentiment
     * @return string
     */
    public function getSentimentLabel(string $sentiment, string $language = 'id'): string
    {
        $labels = [
            'id' => [
                self::SENTIMENT_POSITIVE => 'Positif',
                self::SENTIMENT_NEUTRAL => 'Netral',
                self::SENTIMENT_NEGATIVE => 'Negatif'
            ],
            'en' => [
                self::SENTIMENT_POSITIVE => 'Positive',
                self::SENTIMENT_NEUTRAL => 'Neutral',
                self::SENTIMENT_NEGATIVE => 'Negative'
            ]
        ];
        
        return $labels[$language][$sentiment] ?? $sentiment;
    }

    /**
     * Check if sentiment is positive
     * 
     * @param array $result
     * @return bool
     */
    public function isPositive(array $result): bool
    {
        return $result['sentiment'] === self::SENTIMENT_POSITIVE;
    }

    /**
     * Check if sentiment is negative
     * 
     * @param array $result
     * @return bool
     */
    public function isNegative(array $result): bool
    {
        return $result['sentiment'] === self::SENTIMENT_NEGATIVE;
    }

    /**
     * Check if sentiment is neutral
     * 
     * @param array $result
     * @return bool
     */
    public function isNeutral(array $result): bool
    {
        return $result['sentiment'] === self::SENTIMENT_NEUTRAL;
    }

    /**
     * Clear sentiment cache
     * 
     * @return bool
     */
    public function clearCache(): bool
    {
        try {
            Cache::forget('sentiment-analysis-*');
            return true;
        } catch (Exception $e) {
            Log::error('Failed to clear sentiment cache', ['message' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Get cache key for sentiment analysis
     * 
     * @param string $message
     * @param string $language
     * @param bool $useAI
     * @return string
     */
    private function getCacheKey(string $message, string $language, bool $useAI): string
    {
        return 'sentiment-analysis:' . md5($message) . ':' . $language . ':' . ($useAI ? 'ai' : 'rule');
    }

    /**
     * Get supported languages
     * 
     * @return array
     */
    public function getSupportedLanguages(): array
    {
        return [
            'id' => 'Indonesian',
            'en' => 'English'
        ];
    }
}
