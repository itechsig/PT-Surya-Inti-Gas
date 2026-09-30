<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * Dashboard charts are visible to every admin role: the aggregate statistics/timeline
 * endpoints must work for a role without the module permission (editor), while the
 * module's detail data stays gated.
 */
class DashboardChartsAccessTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsEditor(): User
    {
        $user = User::factory()->create([
            'role' => User::ROLE_EDITOR,
            'is_active' => true,
            'must_change_password' => false,
        ]);

        $this->assertFalse($user->hasPermission('career_applications.manage'));
        $this->assertFalse($user->hasPermission('audit_logs.view'));

        Sanctum::actingAs($user);

        return $user;
    }

    public function test_editor_can_read_dashboard_chart_endpoints(): void
    {
        $this->actingAsEditor();

        foreach ([
            '/api/v1/admin/career-applications/statistics',
            '/api/v1/admin/career-applications/timeline',
            '/api/v1/admin/audit-logs/statistics',
            '/api/v1/admin/audit-logs/timeline',
        ] as $endpoint) {
            $this->getJson($endpoint)->assertOk()->assertJson(['success' => true]);
        }
    }

    public function test_editor_still_cannot_read_module_detail_data(): void
    {
        $this->actingAsEditor();

        $this->getJson('/api/v1/admin/career-applications')->assertForbidden();
        $this->getJson('/api/v1/admin/career-applications/1')->assertForbidden();
        $this->getJson('/api/v1/admin/audit-logs')->assertForbidden();
        $this->getJson('/api/v1/admin/audit-logs/recent')->assertForbidden();
    }

    public function test_guest_cannot_read_dashboard_chart_endpoints(): void
    {
        $this->getJson('/api/v1/admin/career-applications/statistics')->assertUnauthorized();
        $this->getJson('/api/v1/admin/audit-logs/statistics')->assertUnauthorized();
    }
}
