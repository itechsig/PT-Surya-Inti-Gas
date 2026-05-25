<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VectorSearchService
{
    private GeminiApiKeyRotationService $apiKeyRotationService;

    public function __construct(GeminiApiKeyRotationService $apiKeyRotationService)
    {
        $this->apiKeyRotationService = $apiKeyRotationService;
    }

    /**
     * Generate embedding for a text using Gemini
     */
    public function generateEmbedding(string $text): ?array
    {
        try {
            $apiKey = $this->apiKeyRotationService->getCurrentApiKey();
            
            if (empty($apiKey)) {
                Log::error('Gemini API key is not configured');
                return null;
            }

            // Use Gemini's embedding API
            $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent";

            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'X-goog-api-key' => $apiKey,
                ])
                ->post($endpoint, [
                    'content' => [
                        'parts' => [
                            ['text' => $text]
                        ]
                    ],
                    'taskType' => 'RETRIEVAL_DOCUMENT',
                ]);

            if (!$response->successful()) {
                Log::error('Gemini embedding error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            $data = $response->json();
            
            if (isset($data['embedding']['values'])) {
                $this->apiKeyRotationService->recordKeyUsage($apiKey);
                return $data['embedding']['values'];
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Vector embedding generation error', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Store a document with its embedding
     */
    public function storeDocument(string $id, string $content, string $category, array $metadata = []): bool
    {
        try {
            $embedding = $this->generateEmbedding($content);
            
            if ($embedding === null) {
                return false;
            }

            // Store in database (assuming we have a documents table with vector support)
            // For now, we'll use a JSON approach if vector DB is not available
            DB::table('chatbot_documents')->updateOrInsert(
                ['document_id' => $id],
                [
                    'content' => $content,
                    'category' => $category,
                    'embedding' => json_encode($embedding),
                    'metadata' => json_encode($metadata),
                    'updated_at' => now(),
                ]
            );

            return true;
        } catch (\Exception $e) {
            Log::error('Document storage error', [
                'message' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Search for similar documents using semantic search
     */
    public function search(string $query, ?string $category = null, int $limit = 5): array
    {
        try {
            $queryEmbedding = $this->generateEmbedding($query);
            
            if ($queryEmbedding === null) {
                return [];
            }

            // Get all documents
            $documentsQuery = DB::table('chatbot_documents');
            
            if ($category !== null) {
                $documentsQuery->where('category', $category);
            }

            $documents = $documentsQuery->get();

            // Calculate similarity for each document
            $results = [];
            foreach ($documents as $doc) {
                $docEmbedding = json_decode($doc->embedding, true);
                
                if ($docEmbedding !== null) {
                    $similarity = $this->cosineSimilarity($queryEmbedding, $docEmbedding);
                    
                    $results[] = [
                        'content' => $doc->content,
                        'category' => $doc->category,
                        'similarity' => $similarity,
                        'metadata' => json_decode($doc->metadata, true) ?? [],
                    ];
                }
            }

            // Sort by similarity and limit results
            usort($results, function ($a, $b) {
                return $b['similarity'] <=> $a['similarity'];
            });

            return array_slice($results, 0, $limit);
        } catch (\Exception $e) {
            Log::error('Vector search error', [
                'message' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    private function cosineSimilarity(array $vectorA, array $vectorB): float
    {
        if (count($vectorA) !== count($vectorB)) {
            return 0.0;
        }

        $dotProduct = 0;
        $magnitudeA = 0;
        $magnitudeB = 0;

        for ($i = 0; $i < count($vectorA); $i++) {
            $dotProduct += $vectorA[$i] * $vectorB[$i];
            $magnitudeA += $vectorA[$i] * $vectorA[$i];
            $magnitudeB += $vectorB[$i] * $vectorB[$i];
        }

        $magnitudeA = sqrt($magnitudeA);
        $magnitudeB = sqrt($magnitudeB);

        if ($magnitudeA == 0 || $magnitudeB == 0) {
            return 0.0;
        }

        return $dotProduct / ($magnitudeA * $magnitudeB);
    }

    /**
     * Index knowledge base into vector store
     */
    public function indexKnowledgeBase(array $knowledgeBase): bool
    {
        try {
            foreach ($knowledgeBase as $category => $items) {
                if (is_array($items)) {
                    foreach ($items as $key => $content) {
                        if (is_string($content)) {
                            $id = "{$category}_{$key}";
                            $this->storeDocument($id, $content, $category, [
                                'key' => $key,
                            ]);
                        }
                    }
                }
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Knowledge base indexing error', [
                'message' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Check if vector search is available
     */
    public function isAvailable(): bool
    {
        try {
            // Check if any Gemini API key is configured
            return !empty($this->apiKeyRotationService->getCurrentApiKey());
        } catch (\Exception $e) {
            return false;
        }
    }
}
