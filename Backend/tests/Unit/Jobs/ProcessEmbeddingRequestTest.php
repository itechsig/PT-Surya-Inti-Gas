<?php

namespace Tests\Unit\Jobs;

use Tests\TestCase;
use App\Jobs\ProcessEmbeddingRequest;
use App\Services\VectorSearchService;
use Illuminate\Support\Facades\Queue;

class ProcessEmbeddingRequestTest extends TestCase
{

    public function test_job_implements_should_queue_interface()
    {
        $job = new ProcessEmbeddingRequest('test text', 'doc-123', 'test-request-id');
        
        $this->assertInstanceOf(\Illuminate\Contracts\Queue\ShouldQueue::class, $job);
    }

    public function test_job_can_be_dispatched()
    {
        Queue::fake();
        
        $text = 'Sample text for embedding';
        $documentId = 'doc-123';
        $callbackUrl = 'https://example.com/callback';
        
        ProcessEmbeddingRequest::dispatch($text, $documentId, $callbackUrl);
        
        Queue::assertPushed(ProcessEmbeddingRequest::class, function ($job) use ($text, $documentId) {
            return $job->text === $text && 
                   $job->documentId === $documentId;
        });
    }

    public function test_job_handle_calls_vector_search_service()
    {
        // Mock the VectorSearchService
        $vectorSearchService = $this->createMock(VectorSearchService::class);
        $vectorSearchService->expects($this->once())
            ->method('generateEmbedding')
            ->with('text1')
            ->willReturn([0.1, 0.2, 0.3]);
        
        $vectorSearchService->expects($this->once())
            ->method('storeDocument')
            ->with('doc-123', 'text1', 'general', ['job_processed' => true])
            ->willReturn(true);

        $this->app->instance(VectorSearchService::class, $vectorSearchService);

        $job = new ProcessEmbeddingRequest('text1', 'doc-123', 'callback-url');
        $job->handle($vectorSearchService);
    }

    public function test_job_with_single_text()
    {
        $vectorSearchService = $this->createMock(VectorSearchService::class);
        $vectorSearchService->expects($this->once())
            ->method('generateEmbedding')
            ->with('single text')
            ->willReturn([0.1, 0.2, 0.3]);
        
        $vectorSearchService->expects($this->once())
            ->method('storeDocument')
            ->with('doc-456', 'single text', 'general', ['job_processed' => true])
            ->willReturn(true);

        $this->app->instance(VectorSearchService::class, $vectorSearchService);

        $job = new ProcessEmbeddingRequest('single text', 'doc-456', 'callback-url');
        $job->handle($vectorSearchService);
    }

    public function test_job_properties_are_set_correctly()
    {
        $text = 'Sample text';
        $documentId = 'doc-789';
        $requestId = 'unique-request-id-123';

        $job = new ProcessEmbeddingRequest($text, $documentId, $requestId);

        $this->assertEquals($text, $job->text);
        $this->assertEquals($documentId, $job->documentId);
        $this->assertEquals($requestId, $job->requestId);
    }

    public function test_job_has_default_queue_name()
    {
        $job = new ProcessEmbeddingRequest('test', 'doc-1', 'callback-url');
        
        // Check if the job has queue property
        $this->assertObjectHasProperty('queue', $job);
    }

    public function test_job_handles_embedding_failure()
    {
        $vectorSearchService = $this->createMock(VectorSearchService::class);
        $vectorSearchService->expects($this->once())
            ->method('generateEmbedding')
            ->with('error text')
            ->willReturn(null); // Simulate failure

        $this->app->instance(VectorSearchService::class, $vectorSearchService);

        $job = new ProcessEmbeddingRequest('error text', 'doc-error', 'callback-url');
        $job->handle($vectorSearchService);
        
        // Should not throw exception, just log warning
        $this->assertTrue(true);
    }
}
