<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Http\Resources\CertificationResource;
use App\Http\Resources\CertificationCollection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CertificationController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $certifications = Certification::active()
                ->ordered()
                ->get();

            return response()->json([
                'success' => true,
                'data' => new CertificationCollection($certifications),
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
                'data' => new CertificationResource($certification),
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
