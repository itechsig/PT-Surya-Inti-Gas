<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ABTestingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChatbotABTestingController extends Controller
{
    private ABTestingService $abTestingService;

    public function __construct(ABTestingService $abTestingService)
    {
        $this->abTestingService = $abTestingService;
    }

    public function createABTestCampaign(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'variants' => 'required|array|min:2',
                'variants.*.name' => 'required|string',
                'variants.*.config' => 'required|array',
            ]);

            $campaign = $this->abTestingService->createCampaign($validated);

            return response()->json([
                'success' => true,
                'message' => 'A/B test campaign created successfully',
                'data' => $campaign
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create A/B test campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getABTestCampaigns(Request $request): JsonResponse
    {
        try {
            $status = $request->query('status', 'all');
            $campaigns = $this->abTestingService->getActiveCampaigns();

            return response()->json([
                'success' => true,
                'data' => $campaigns
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get A/B test campaigns',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getABTestCampaign(Request $request, int $campaignId): JsonResponse
    {
        try {
            $campaign = $this->abTestingService->getCampaign($campaignId);

            if (!$campaign) {
                return response()->json([
                    'success' => false,
                    'message' => 'A/B test campaign not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $campaign
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get A/B test campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getABTestCampaignStats(Request $request, int $campaignId): JsonResponse
    {
        try {
            $stats = $this->abTestingService->getCampaignStats($campaignId);

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get A/B test campaign stats',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function getABTestCampaignVariants(Request $request, int $campaignId): JsonResponse
    {
        try {
            $variants = $this->abTestingService->getCampaignVariants($campaignId);

            return response()->json([
                'success' => true,
                'data' => $variants
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get A/B test campaign variants',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function startABTestCampaign(Request $request, int $campaignId): JsonResponse
    {
        try {
            $result = $this->abTestingService->startCampaign($campaignId);

            return response()->json([
                'success' => true,
                'message' => 'A/B test campaign started successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start A/B test campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function pauseABTestCampaign(Request $request, int $campaignId): JsonResponse
    {
        try {
            $result = $this->abTestingService->pauseCampaign($campaignId);

            return response()->json([
                'success' => true,
                'message' => 'A/B test campaign paused successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to pause A/B test campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function completeABTestCampaign(Request $request, int $campaignId): JsonResponse
    {
        try {
            $result = $this->abTestingService->completeCampaign($campaignId);

            return response()->json([
                'success' => true,
                'message' => 'A/B test campaign completed successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete A/B test campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function deleteABTestCampaign(Request $request, int $campaignId): JsonResponse
    {
        try {
            $result = $this->abTestingService->deleteCampaign($campaignId);

            return response()->json([
                'success' => true,
                'message' => 'A/B test campaign deleted successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete A/B test campaign',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function trackABTestEngagement(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'campaign_id' => 'required|integer',
                'identifier' => 'required|string',
                'engaged' => 'required|boolean',
                'rating' => 'nullable|integer',
                'feedback' => 'nullable|string',
            ]);

            $result = $this->abTestingService->trackEngagement(
                $validated['campaign_id'],
                $validated['identifier'],
                $validated['engaged'],
                $validated['rating'] ?? null,
                $validated['feedback'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Engagement tracked successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to track engagement',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function trackABTestConversion(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'campaign_id' => 'required|integer',
                'identifier' => 'required|string',
            ]);

            $result = $this->abTestingService->trackConversion(
                $validated['campaign_id'],
                $validated['identifier']
            );

            return response()->json([
                'success' => true,
                'message' => 'Conversion tracked successfully',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to track conversion',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
