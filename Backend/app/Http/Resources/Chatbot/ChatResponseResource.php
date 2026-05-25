<?php

namespace App\Http\Resources\Chatbot;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatResponseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'message' => $this->resource['message'] ?? null,
            'source' => $this->resource['source'] ?? 'fallback',
            'timestamp' => $this->resource['timestamp'] ?? now()->toISOString(),
        ];
    }
}
