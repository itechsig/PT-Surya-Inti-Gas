<?php

namespace Tests\Feature\Api;

use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TeamTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    public function test_get_active_team_members_successfully(): void
    {
        TeamMember::factory()->count(3)->active()->create();
        TeamMember::factory()->count(2)->inactive()->create();

        $response = $this->getJson('/api/v1/team');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'message'
            ]);

        // Should return only active members (3)
        $responseData = json_decode($response->getContent(), true);
        $this->assertCount(3, $responseData['data']);
    }

    public function test_get_team_member_by_id_successfully(): void
    {
        $teamMember = TeamMember::factory()->active()->create();

        $response = $this->getJson("/api/v1/team/{$teamMember->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Team member retrieved successfully'
            ]);
    }

    public function test_cannot_get_inactive_team_member(): void
    {
        $teamMember = TeamMember::factory()->inactive()->create();

        $response = $this->getJson("/api/v1/team/{$teamMember->id}");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Team member not found'
            ]);
    }

    public function test_cannot_get_nonexistent_team_member(): void
    {
        $response = $this->getJson('/api/v1/team/999999');

        $response->assertStatus(404);
    }

    public function test_team_members_are_ordered_by_display_order(): void
    {
        $member1 = TeamMember::factory()->active()->create(['display_order' => 3]);
        $member2 = TeamMember::factory()->active()->create(['display_order' => 1]);
        $member3 = TeamMember::factory()->active()->create(['display_order' => 2]);

        $response = $this->getJson('/api/v1/team');

        $responseData = json_decode($response->getContent(), true);
        
        // Verify ordering: member2 (1), member3 (2), member1 (3)
        $this->assertEquals($member2->id, $responseData['data'][0]['id']);
        $this->assertEquals($member3->id, $responseData['data'][1]['id']);
        $this->assertEquals($member1->id, $responseData['data'][2]['id']);
    }

    public function test_team_api_response_has_required_fields(): void
    {
        TeamMember::factory()->active()->create();

        $response = $this->getJson('/api/v1/team');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'role',
                        'image',
                        'bio',
                        'display_order'
                    ]
                ],
                'message'
            ]);
    }

    public function test_empty_team_returns_empty_array(): void
    {
        TeamMember::query()->delete();

        $response = $this->getJson('/api/v1/team');

        $response->assertStatus(200);
        $responseData = json_decode($response->getContent(), true);
        
        $this->assertIsArray($responseData['data']);
        $this->assertEmpty($responseData['data']);
    }
}