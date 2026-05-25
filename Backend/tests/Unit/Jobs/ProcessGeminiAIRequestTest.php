<?php

namespace Tests\Unit\Jobs;

use Tests\TestCase;
use App\Jobs\ProcessGeminiAIRequest;
use App\Services\ChatbotService;
use Illuminate\Support\Facades\Queue;

class ProcessGeminiAIRequestTest extends TestCase
{

    public function test_job_implements_should_queue_interface()
    {
        $job = new ProcessGeminiAIRequest('test message', [], 'test-request-id');
        
        $this->assertInstanceOf(\Illuminate\Contracts\Queue\ShouldQueue::class, $job);
    }

    public function test_job_can_be_dispatched()
    {
        Queue::fake();
        
        ProcessGeminiAIRequest::dispatch('test message', [], 'test-request-id');
        
        Queue::assertPushed(ProcessGeminiAIRequest::class, function ($job) {
            return $job->message === 'test message' && 
                   $job->requestId === 'test-request-id';
        });
    }

    public function test_job_handle_calls_chatbot_service()
    {
        // Mock the ChatbotService
        $chatbotService = $this->createMock(ChatbotService::class);
        $chatbotService->expects($this->once())
            ->method('generateResponse')
            ->with('test message', [])
            ->willReturn([
                'message' => 'Test response',
                'source' => 'local',
                'timestamp' => now()->toISOString(),
            ]);

        $this->app->instance(ChatbotService::class, $chatbotService);

        $job = new ProcessGeminiAIRequest('test message', [], 'test-request-id');
        $job->handle($chatbotService);
    }

    public function test_job_with_history()
    {
        $history = [
            ['role' => 'user', 'content' => 'Previous message'],
            ['role' => 'assistant', 'content' => 'Previous response'],
        ];

        $chatbotService = $this->createMock(ChatbotService::class);
        $chatbotService->expects($this->once())
            ->method('generateResponse')
            ->with('test message', $history)
            ->willReturn([
                'message' => 'Test response',
                'source' => 'local',
                'timestamp' => now()->toISOString(),
            ]);

        $this->app->instance(ChatbotService::class, $chatbotService);

        $job = new ProcessGeminiAIRequest('test message', $history, 'test-request-id');
        $job->handle($chatbotService);
    }

    public function test_job_properties_are_set_correctly()
    {
        $message = 'Test message content';
        $history = [['role' => 'user', 'content' => 'Hello']];
        $requestId = 'unique-request-id-123';

        $job = new ProcessGeminiAIRequest($message, $history, $requestId);

        $this->assertEquals($message, $job->message);
        $this->assertEquals($history, $job->history);
        $this->assertEquals($requestId, $job->requestId);
    }

    public function test_job_has_default_queue_name()
    {
        $job = new ProcessGeminiAIRequest('test', [], 'test-id');
        
        // Check if the job has queue property
        $this->assertObjectHasProperty('queue', $job);
    }
}
