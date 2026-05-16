<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $teamMembers = TeamMember::active()
                ->ordered()
                ->get()
                ->map(function ($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'role' => $member->role,
                        'experience' => $member->experience,
                        'expertise' => $member->expertise,
                        'image' => $member->image,
                        'bio' => $member->bio,
                        'icon' => $member->icon,
                        'stats' => $member->stats,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $teamMembers,
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
                'data' => [
                    'id' => $teamMember->id,
                    'name' => $teamMember->name,
                    'role' => $teamMember->role,
                    'experience' => $teamMember->experience,
                    'expertise' => $teamMember->expertise,
                    'image' => $teamMember->image,
                    'bio' => $teamMember->bio,
                    'icon' => $teamMember->icon,
                    'stats' => $teamMember->stats,
                ],
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
