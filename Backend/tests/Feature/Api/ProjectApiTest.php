<?php

namespace Tests\Feature\Api;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_projects_returns_successful_response(): void
    {
        Project::factory()->count(3)->create();

        $response = $this->getJson('/api/projects');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data',
                     'categories',
                     'message'
                 ])
                 ->assertJson(['success' => true]);
    }

    public function test_get_projects_returns_only_active_projects(): void
    {
        Project::factory()->create(['is_active' => true]);
        Project::factory()->create(['is_active' => false]);

        $response = $this->getJson('/api/projects');

        $response->assertStatus(200);
        $responseData = $response->json('data');

        $this->assertCount(1, $responseData);
    }

    public function test_get_projects_filters_by_category(): void
    {
        Project::factory()->create(['category' => 'Industrial', 'is_active' => true]);
        Project::factory()->create(['category' => 'Commercial', 'is_active' => true]);

        $response = $this->getJson('/api/projects?category=Industrial');

        $response->assertStatus(200);
        $responseData = $response->json('data');

        $this->assertCount(1, $responseData);
        $this->assertEquals('Industrial', $responseData[0]['category']);
    }

    public function test_get_single_project_returns_successful_response(): void
    {
        $project = Project::factory()->create(['is_active' => true]);

        $response = $this->getJson("/api/projects/{$project->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'id' => $project->id,
                         'name' => $project->name,
                     ]
                 ]);
    }

    public function test_get_single_inactive_project_returns_404(): void
    {
        $project = Project::factory()->create(['is_active' => false]);

        $response = $this->getJson("/api/projects/{$project->id}");

        $response->assertStatus(404)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Project not found'
                 ]);
    }

    public function test_get_projects_returns_categories(): void
    {
        Project::factory()->create(['category' => 'Industrial', 'is_active' => true]);
        Project::factory()->create(['category' => 'Commercial', 'is_active' => true]);

        $response = $this->getJson('/api/projects');

        $response->assertStatus(200);
        $categories = $response->json('categories');

        $this->assertContains('All', $categories);
        $this->assertContains('Industrial', $categories);
        $this->assertContains('Commercial', $categories);
    }
}
