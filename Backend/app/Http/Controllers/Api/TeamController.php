<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Http\Resources\TeamMemberResource;
use App\Http\Resources\TeamMemberCollection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $teamMembers = TeamMember::active()
                ->ordered()
                ->get();

            return response()->json([
                'success' => true,
                'data' => new TeamMemberCollection($teamMembers),
                'message' => 'Team members retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve team members',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function show(TeamMember $teamMember): JsonResponse
    {
        try {
            if (!$teamMember->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Team member not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new TeamMemberResource($teamMember),
                'message' => 'Team member retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve team member',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
