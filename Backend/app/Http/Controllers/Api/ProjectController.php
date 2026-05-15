<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $category = $request->get('category', 'All');
            
            $projects = Project::active()
                ->byCategory($category)
                ->ordered()
                ->get()
                ->map(function ($project) {
                    return [
                        'id' => $project->id,
                        'name' => $project->name,
                        'category' => $project->category,
                        'location' => $project->location,
                        'year' => $project->year,
                        'image' => $project->image,
                        'desc' => $project->description,
                        'icon' => $project->icon,
                        'stats' => $project->stats,
                    ];
                });

            $categories = Project::active()
                ->distinct()
                ->pluck('category')
                ->prepend('All')
                ->values();

            return response()->json([
                'success' => true,
                'data' => $projects,
                'categories' => $categories,
                'message' => 'Projects retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve projects',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function show(Project $project): JsonResponse
    {
        try {
            if (!$project->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $project->id,
                    'name' => $project->name,
                    'category' => $project->category,
                    'location' => $project->location,
                    'year' => $project->year,
                    'image' => $project->image,
                    'desc' => $project->description,
                    'icon' => $project->icon,
                    'stats' => $project->stats,
                ],
                'message' => 'Project retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve project',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
