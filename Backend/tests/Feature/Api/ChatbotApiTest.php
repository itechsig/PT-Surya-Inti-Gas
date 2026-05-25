<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatbotApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_chat_endpoint_returns_successful_response(): void
    {
        $response = $this->postJson('/api/chatbot', [
            'message' => 'halo',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'message',
                         'source',
                         'timestamp'
                     ],
                     'message'
                 ])
                 ->assertJson(['success' => true]);
    }

    public function test_chat_with_greeting_returns_valid_response(): void
    {
        $response = $this->postJson('/api/chatbot', [
            'message' => 'halo',
        ]);

        $response->assertStatus(200);
        $responseData = $response->json('data');

        $this->assertEquals('local', $responseData['source']);
        $this->assertNotEmpty($responseData['message']);
        $this->assertStringContainsString('Halo', $responseData['message']);
    }

    public function test_chat_requires_message(): void
    {
        $response = $this->postJson('/api/chatbot', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['message']);
    }

    public function test_chat_message_max_length(): void
    {
        $response = $this->postJson('/api/chatbot', [
            'message' => str_repeat('a', 1001),
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['message']);
    }

    public function test_chat_with_history_works(): void
    {
        $response = $this->postJson('/api/chatbot', [
            'message' => 'halo',
            'history' => [
                ['role' => 'user', 'content' => 'test'],
                ['role' => 'assistant', 'content' => 'response'],
            ],
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }

    public function test_chat_history_max_items(): void
    {
        $history = [];
        for ($i = 0; $i < 21; $i++) {
            $history[] = ['role' => 'user', 'content' => 'test'];
        }

        $response = $this->postJson('/api/chatbot', [
            'message' => 'halo',
            'history' => $history,
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['history']);
    }

    public function test_feedback_endpoint_returns_successful_response(): void
    {
        $response = $this->postJson('/api/chatbot/feedback', [
            'user_message' => 'test message',
            'bot_response' => 'test response',
            'source' => 'local',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }

    public function test_feedback_requires_required_fields(): void
    {
        $response = $this->postJson('/api/chatbot/feedback', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors([
                     'user_message',
                     'bot_response',
                     'source'
                 ]);
    }

    public function test_feedback_source_must_be_valid(): void
    {
        $response = $this->postJson('/api/chatbot/feedback', [
            'user_message' => 'test',
            'bot_response' => 'test',
            'source' => 'invalid_source',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['source']);
    }

    public function test_chat_stream_returns_successful_response(): void
    {
        $response = $this->postJson('/api/chat/stream', [
            'message' => 'halo',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'streaming' => false
                 ]);
    }

    public function test_analytics_endpoint_requires_authentication(): void
    {
        $response = $this->getJson('/api/chatbot/analytics');

        $response->assertStatus(401);
    }

    public function test_feedback_stats_endpoint_requires_authentication(): void
    {
        $response = $this->getJson('/api/chatbot/feedback/stats');

        $response->assertStatus(401);
    }
}
