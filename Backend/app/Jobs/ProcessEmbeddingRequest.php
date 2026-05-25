<?php

namespace App\Jobs;

use App\Services\VectorSearchService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;

class ProcessEmbeddingRequest implements ShouldQueue
{
    use Dispatchable, Queueable;

    public string $text;
    public string $documentId;
    public string $requestId;

    public function __construct(string $text, string $documentId, string $requestId = '')
    {
        $this->text = $text;
        $this->documentId = $documentId;
        $this->requestId = $requestId ?: uniqid();
    }

    /**
     * Execute the job.
     */
    public function handle(VectorSearchService $vectorSearchService): void
    {
        try {
            Log::info('Processing embedding request', [
                'request_id' => $this->requestId,
                'document_id' => $this->documentId,
            ]);

            // Generate embedding
            $embedding = $vectorSearchService->generateEmbedding($this->text);

            if ($embedding !== null) {
                // Store document with embedding
                $vectorSearchService->storeDocument(
                    $this->documentId,
                    $this->text,
                    'general',
                    ['job_processed' => true]
                );

                Log::info('Embedding generated successfully', [
                    'request_id' => $this->requestId,
                    'embedding_dimension' => count($embedding),
                ]);
            } else {
                Log::warning('Embedding generation failed', [
                    'request_id' => $this->requestId,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Embedding job failed', [
                'request_id' => $this->requestId,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Handle job failure
     */
    public function failed(\Exception $exception): void
    {
        Log::error('Embedding job failed', [
            'request_id' => $this->requestId,
            'error' => $exception->getMessage(),
        ]);
    }
}
