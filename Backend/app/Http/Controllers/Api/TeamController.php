<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Http\Resources\TeamMemberResource;
use App\Http\Resources\TeamMemberCollection;
use App\Services\TeamService;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    public function __construct(
        private TeamService $teamService
    ) {}

    /**
     * Get all active team members
     * 
     * @OA\Get(
     *     path="/api/v1/team",
     *     summary="Get all active team members",
     *     description="Returns a list of all active team members ordered by display order",
     *     tags={"Team"},
     *     @OA\Response(
     *         response=200,
     *         description="Team members retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="role", type="string"),
     *                 @OA\Property(property="image", type="string"),
     *                 @OA\Property(property="bio", type="string"),
     *                 @OA\Property(property="display_order", type="integer")
     *             )),
     *             @OA\Property(property="message", type="string", example="Team members retrieved successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error"
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        try {
            $teamMembers = $this->teamService->getActiveMembers();

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

    /**
     * Get a specific team member by ID
     * 
     * @OA\Get(
     *     path="/api/v1/team/{id}",
     *     summary="Get team member by ID",
     *     description="Returns details of a specific active team member",
     *     tags={"Team"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Team member ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Team member retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="role", type="string"),
     *                 @OA\Property(property="image", type="string"),
     *                 @OA\Property(property="bio", type="string"),
     *                 @OA\Property(property="linkedin_url", type="string")
     *             ),
     *             @OA\Property(property="message", type="string", example="Team member retrieved successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Team member not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Team member not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error"
     *     )
     * )
     */
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
