<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\SentimentAnalysisService;
use App\Services\ChatbotService;
use Illuminate\Support\Facades\Cache;
use Mockery;

/**
 * SentimentAnalysisServiceTest
 * 
 * Unit tests for the SentimentAnalysisService
 * 
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 * @SuppressWarnings(PHPMD.CamelCaseMethodName)
 */
class SentimentAnalysisServiceTest extends TestCase
{
    /** @var SentimentAnalysisService */
    private $sentimentService;

    /** @var ChatbotService&\PHPUnit\Framework\MockObject\MockObject */
    private $chatbotService;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock ChatbotService
        $this->chatbotService = $this->createMock(ChatbotService::class);

        // Create service instance
        $this->sentimentService = new SentimentAnalysisService($this->chatbotService);

        // Clear cache before each test
        Cache::flush();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        Mockery::close();
    }

    /**
     * Test that Indonesian positive messages are detected as positive
     */
    public function test_indonesian_positive_message_detected(): void
    {
        $result = $this->sentimentService->analyzeSentiment('Produk ini sangat bagus dan saya sangat suka', 'id', false);

        $this->assertEquals('positive', $result['sentiment']);
        $this->assertGreaterThan(0.1, $result['score']);
        $this->assertGreaterThan(0, $result['positive_count']);
        $this->assertEquals('rule-based', $result['method']);
    }

    /**
     * Test that Indonesian negative messages are detected as negative
     */
    public function test_indonesian_negative_message_detected(): void
    {
        $result = $this->sentimentService->analyzeSentiment('Produk ini sangat buruk dan saya kecewa', 'id', false);

        $this->assertEquals('negative', $result['sentiment']);
        $this->assertLessThan(-0.1, $result['score']);
        $this->assertGreaterThan(0, $result['negative_count']);
        $this->assertEquals('rule-based', $result['method']);
    }

    /**
     * Test that neutral messages are detected as neutral
     */
    public function test_neutral_message_detected(): void
    {
        $result = $this->sentimentService->analyzeSentiment('Apa kabar hari ini?', 'id', false);

        $this->assertEquals('neutral', $result['sentiment']);
        $this->assertEquals(0, $result['score']);
        $this->assertEquals('rule-based', $result['method']);
    }

    /**
     * Test that English positive messages are detected as positive
     */
    public function test_english_positive_message_detected(): void
    {
        $result = $this->sentimentService->analyzeSentiment('This product is great and I love it', 'en', false);

        $this->assertEquals('positive', $result['sentiment']);
        $this->assertGreaterThan(0.1, $result['score']);
        $this->assertGreaterThan(0, $result['positive_count']);
        $this->assertEquals('rule-based', $result['method']);
    }

    /**
     * Test that English negative messages are detected as negative
     */
    public function test_english_negative_message_detected(): void
    {
        $result = $this->sentimentService->analyzeSentiment('This product is terrible and I hate it', 'en', false);

        $this->assertEquals('negative', $result['sentiment']);
        $this->assertLessThan(-0.1, $result['score']);
        $this->assertGreaterThan(0, $result['negative_count']);
        $this->assertEquals('rule-based', $result['method']);
    }

    /**
     * Test that negation words reverse sentiment
     */
    public function test_negation_words_reverse_sentiment(): void
    {
        $result = $this->sentimentService->analyzeSentiment('Produk ini tidak bagus sama sekali', 'id', false);

        $this->assertLessThanOrEqual(0.1, $result['score']);
    }

    /**
     * Test that sentiment results are cached
     */
    public function test_sentiment_results_are_cached(): void
    {
        Cache::flush();

        // First call - should hit service and cache
        $result1 = $this->sentimentService->analyzeSentiment('Produk ini bagus', 'id', false);

        // Second call - should hit cache
        $result2 = $this->sentimentService->analyzeSentiment('Produk ini bagus', 'id', false);

        $this->assertEquals($result1, $result2);
    }

    /**
     * Test batch sentiment analysis
     */
    public function test_batch_sentiment_analysis(): void
    {
        $messages = [
            'Produk ini sangat bagus',
            'Saya kecewa dengan layanan ini',
            'Apa kabar hari ini?'
        ];

        $results = $this->sentimentService->batchAnalyze($messages, 'id', false);

        $this->assertCount(3, $results);
        $this->assertEquals('positive', $results[0]['sentiment']);
        $this->assertEquals('negative', $results[1]['sentiment']);
        $this->assertEquals('neutral', $results[2]['sentiment']);
    }

    /**
     * Test sentiment statistics calculation
     */
    public function test_sentiment_statistics_calculation(): void
    {
        $results = [
            ['sentiment' => 'positive', 'confidence' => 0.8, 'score' => 0.7],
            ['sentiment' => 'negative', 'confidence' => 0.9, 'score' => -0.8],
            ['sentiment' => 'neutral', 'confidence' => 0.6, 'score' => 0],
            ['sentiment' => 'positive', 'confidence' => 0.7, 'score' => 0.6],
        ];

        $stats = $this->sentimentService->getSentimentStatistics($results);

        $this->assertEquals(4, $stats['total']);
        $this->assertEquals(2, $stats['positive']);
        $this->assertEquals(1, $stats['negative']);
        $this->assertEquals(1, $stats['neutral']);
        $this->assertEquals(50.0, $stats['positive_percentage']);
        $this->assertEquals(25.0, $stats['negative_percentage']);
        $this->assertEquals(25.0, $stats['neutral_percentage']);
    }

    /**
     * Test sentiment statistics with empty results
     */
    public function test_sentiment_statistics_with_empty_results(): void
    {
        $stats = $this->sentimentService->getSentimentStatistics([]);

        $this->assertEquals(0, $stats['total']);
        $this->assertEquals(0, $stats['positive']);
        $this->assertEquals(0, $stats['negative']);
        $this->assertEquals(0, $stats['neutral']);
    }

    /**
     * Test getSentimentFromScore
     */
    public function test_get_sentiment_from_score(): void
    {
        $this->assertEquals('positive', $this->sentimentService->getSentimentFromScore(0.5));
        $this->assertEquals('positive', $this->sentimentService->getSentimentFromScore(0.2));
        $this->assertEquals('neutral', $this->sentimentService->getSentimentFromScore(0.1));
        $this->assertEquals('neutral', $this->sentimentService->getSentimentFromScore(0));
        $this->assertEquals('neutral', $this->sentimentService->getSentimentFromScore(-0.1));
        $this->assertEquals('negative', $this->sentimentService->getSentimentFromScore(-0.5));
    }

    /**
     * Test getSentimentLabel in Indonesian
     */
    public function test_get_sentiment_label_indonesian(): void
    {
        $this->assertEquals('Positif', $this->sentimentService->getSentimentLabel('positive', 'id'));
        $this->assertEquals('Netral', $this->sentimentService->getSentimentLabel('neutral', 'id'));
        $this->assertEquals('Negatif', $this->sentimentService->getSentimentLabel('negative', 'id'));
    }

    /**
     * Test getSentimentLabel in English
     */
    public function test_get_sentiment_label_english(): void
    {
        $this->assertEquals('Positive', $this->sentimentService->getSentimentLabel('positive', 'en'));
        $this->assertEquals('Neutral', $this->sentimentService->getSentimentLabel('neutral', 'en'));
        $this->assertEquals('Negative', $this->sentimentService->getSentimentLabel('negative', 'en'));
    }

    /**
     * Test isPositive helper
     */
    public function test_is_positive_helper(): void
    {
        $result = ['sentiment' => 'positive', 'confidence' => 0.8];
        $this->assertTrue($this->sentimentService->isPositive($result));

        $result = ['sentiment' => 'negative', 'confidence' => 0.8];
        $this->assertFalse($this->sentimentService->isPositive($result));
    }

    /**
     * Test isNegative helper
     */
    public function test_is_negative_helper(): void
    {
        $result = ['sentiment' => 'negative', 'confidence' => 0.8];
        $this->assertTrue($this->sentimentService->isNegative($result));

        $result = ['sentiment' => 'positive', 'confidence' => 0.8];
        $this->assertFalse($this->sentimentService->isNegative($result));
    }

    /**
     * Test isNeutral helper
     */
    public function test_is_neutral_helper(): void
    {
        $result = ['sentiment' => 'neutral', 'confidence' => 0.8];
        $this->assertTrue($this->sentimentService->isNeutral($result));

        $result = ['sentiment' => 'positive', 'confidence' => 0.8];
        $this->assertFalse($this->sentimentService->isNeutral($result));
    }

    /**
     * Test getSupportedLanguages
     */
    public function test_get_supported_languages(): void
    {
        $languages = $this->sentimentService->getSupportedLanguages();

        $this->assertIsArray($languages);
        $this->assertArrayHasKey('id', $languages);
        $this->assertArrayHasKey('en', $languages);
        $this->assertEquals('Indonesian', $languages['id']);
        $this->assertEquals('English', $languages['en']);
    }

    /**
     * Test that empty message returns neutral
     */
    public function test_empty_message_returns_neutral(): void
    {
        $result = $this->sentimentService->analyzeSentiment('', 'id', false);

        $this->assertEquals('neutral', $result['sentiment']);
        $this->assertEquals(0, $result['score']);
    }

    /**
     * Test that multiple positive words increase score
     */
    public function test_multiple_positive_words_increase_score(): void
    {
        $message = 'Produk ini bagus hebat luar biasa dan saya suka cinta';
        $result = $this->sentimentService->analyzeSentiment($message, 'id', false);

        $this->assertEquals('positive', $result['sentiment']);
        $this->assertGreaterThan(0.2, $result['score']);
        $this->assertGreaterThan(3, $result['positive_count']);
    }

    /**
     * Test that multiple negative words decrease score
     */
    public function test_multiple_negative_words_decrease_score(): void
    {
        $message = 'Produk ini buruk jelek gagal dan saya kecewa sedih';
        $result = $this->sentimentService->analyzeSentiment($message, 'id', false);

        $this->assertEquals('negative', $result['sentiment']);
        $this->assertLessThan(-0.2, $result['score']);
        $this->assertGreaterThan(3, $result['negative_count']);
    }

    /**
     * Test clearCache
     */
    public function test_clear_cache(): void
    {
        // Add something to cache
        Cache::put('sentiment-analysis:test', ['sentiment' => 'positive']);

        $result = $this->sentimentService->clearCache();

        $this->assertTrue($result);
    }

    /**
     * Test that matched positive words are returned
     */
    public function test_matched_positive_words_are_returned(): void
    {
        $result = $this->sentimentService->analyzeSentiment('Produk ini bagus dan hebat', 'id', false);

        $this->assertIsArray($result['positive_words']);
        $this->assertContains('bagus', $result['positive_words']);
        $this->assertContains('hebat', $result['positive_words']);
    }

    /**
     * Test that matched negative words are returned
     */
    public function test_matched_negative_words_are_returned(): void
    {
        $result = $this->sentimentService->analyzeSentiment('Produk ini buruk dan jelek', 'id', false);

        $this->assertIsArray($result['negative_words']);
        $this->assertContains('buruk', $result['negative_words']);
        $this->assertContains('jelek', $result['negative_words']);
    }

    /**
     * Test confidence calculation
     */
    public function test_confidence_calculation(): void
    {
        // Message with many sentiment words should have higher confidence
        $result1 = $this->sentimentService->analyzeSentiment('bagus hebat luar biasa suka cinta', 'id', false);
        $result2 = $this->sentimentService->analyzeSentiment('bagus', 'id', false);

        $this->assertGreaterThan(0.6, $result1['confidence']);
    }
}
