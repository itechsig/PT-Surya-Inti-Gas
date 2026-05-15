<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CertificationController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $certifications = Certification::active()
                ->ordered()
                ->get()
                ->map(function ($cert) {
                    return [
                        'id' => $cert->id,
                        'title' => $cert->title,
                        'desc' => $cert->description,
                        'icon' => $cert->icon,
                        'color' => $cert->color,
                        'bg' => $cert->bg_color,
                        'details' => $cert->details,
                        'valid' => $cert->valid_period,
                        'scope' => $cert->scope,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $certifications,
                'message' => 'Certifications retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve certifications',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function show(Certification $certification): JsonResponse
    {
        try {
            if (!$certification->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Certification not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $certification->id,
                    'title' => $certification->title,
                    'desc' => $certification->description,
                    'icon' => $certification->icon,
                    'color' => $certification->color,
                    'bg' => $certification->bg_color,
                    'details' => $certification->details,
                    'valid' => $certification->valid_period,
                    'scope' => $certification->scope,
                ],
                'message' => 'Certification retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve certification',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
