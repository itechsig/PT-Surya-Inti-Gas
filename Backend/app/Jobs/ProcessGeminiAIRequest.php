<?php

namespace App\Jobs;

use App\Services\ChatbotService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;

class ProcessGeminiAIRequest implements ShouldQueue
{
    use Dispatchable, Queueable;

    public string $message;
    public array $history;
    public string $requestId;

    public function __construct(string $message, array $history = [], string $requestId = '')
    {
        $this->message = $message;
        $this->history = $history;
        $this->requestId = $requestId ?: uniqid();
    }

    /**
     * Execute the job.
     */
    public function handle(ChatbotService $chatbotService): void
    {
        try {
            Log::info('Processing Gemini AI request', [
                'request_id' => $this->requestId,
                'message_length' => strlen($this->message),
            ]);

            // Process the request
            $response = $chatbotService->generateResponse($this->message, $this->history);

            Log::info('Gemini AI request completed', [
                'request_id' => $this->requestId,
                'source' => $response['source'] ?? 'unknown',
            ]);

        } catch (\Exception $e) {
            Log::error('Gemini AI request failed', [
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
        Log::error('Gemini AI job failed', [
            'request_id' => $this->requestId,
            'error' => $exception->getMessage(),
        ]);
    }
}
