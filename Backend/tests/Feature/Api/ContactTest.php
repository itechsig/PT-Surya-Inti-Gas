<?php

namespace Tests\Feature\Api;

use App\Models\Contact;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    public function test_contact_can_be_submitted_with_valid_data(): void
    {
        $contactData = [
            'nama' => 'John Doe',
            'email' => $this->faker->email(),
            'no_hp' => '08123456789',
            'pesan' => 'This is a test message with more than 10 characters to meet the validation requirements.',
        ];

        $response = $this->postJson('/api/v1/contact', $contactData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['nama', 'email']
            ]);

        $this->assertDatabaseHas('contacts', [
            'nama' => $contactData['nama'],
            'email' => $contactData['email'],
        ]);
    }

    public function test_contact_validation_requires_nama(): void
    {
        $contactData = [
            'email' => $this->faker->email(),
            'no_hp' => '08123456789',
            'pesan' => 'Test message with more than 10 characters.',
        ];

        $response = $this->postJson('/api/v1/contact', $contactData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nama']);
    }

    public function test_contact_validation_requires_valid_email(): void
    {
        $contactData = [
            'nama' => 'John Doe',
            'email' => 'invalid-email',
            'no_hp' => '08123456789',
            'pesan' => 'Test message with more than 10 characters.',
        ];

        $response = $this->postJson('/api/v1/contact', $contactData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_contact_validation_requires_valid_phone(): void
    {
        $contactData = [
            'nama' => 'John Doe',
            'email' => $this->faker->email(),
            'no_hp' => 'invalid-phone',
            'pesan' => 'Test message with more than 10 characters.',
        ];

        $response = $this->postJson('/api/v1/contact', $contactData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['no_hp']);
    }

    public function test_contact_validation_requires_minimum_message_length(): void
    {
        $contactData = [
            'nama' => 'John Doe',
            'email' => $this->faker->email(),
            'no_hp' => '08123456789',
            'pesan' => 'Short', // Less than 10 characters
        ];

        $response = $this->postJson('/api/v1/contact', $contactData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['pesan']);
    }

    public function test_contact_validation_requires_nama_max_length(): void
    {
        $contactData = [
            'nama' => str_repeat('a', 256), // More than 255 characters
            'email' => $this->faker->email(),
            'no_hp' => '08123456789',
            'pesan' => 'Test message with more than 10 characters.',
        ];

        $response = $this->postJson('/api/v1/contact', $contactData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nama']);
    }

    public function test_contact_stores_ip_address_and_user_agent(): void
    {
        $contactData = [
            'nama' => 'John Doe',
            'email' => $this->faker->email(),
            'no_hp' => '08123456789',
            'pesan' => 'Test message with more than 10 characters.',
        ];

        $response = $this->postJson('/api/v1/contact', $contactData);

        $contact = Contact::where('email', $contactData['email'])->first();

        $this->assertNotNull($contact->ip_address);
        $this->assertNotNull($contact->user_agent);
        $this->assertEquals('pending', $contact->status);
    }

    public function test_contact_rejects_empty_phone(): void
    {
        $contactData = [
            'nama' => 'John Doe',
            'email' => $this->faker->email(),
            'no_hp' => '',
            'pesan' => 'Test message with more than 10 characters.',
        ];

        $response = $this->postJson('/api/v1/contact', $contactData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['no_hp']);
    }
}