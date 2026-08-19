<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductInteraction;
use App\Traits\HandlesApiErrors;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductInteractionController extends Controller
{
    use HandlesApiErrors;

    private const TOP_LIMIT = 8;

    /**
     * Public: record a product view or a "order via WhatsApp" click.
     * Fire-and-forget from the frontend — kept intentionally tolerant of bad input.
     */
    public function track(Request $request, string $slug): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'type' => 'required|in:view,whatsapp_click',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'message' => 'Invalid interaction type'], 422);
            }

            ProductInteraction::create([
                'product_slug' => $slug,
                'type' => $request->input('type'),
                'created_at' => now(),
            ]);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to record interaction', 'product_interaction_track_failed');
        }
    }

    /**
     * Admin: top products by view count and by WhatsApp-order-click count.
     */
    public function statistics(): JsonResponse
    {
        try {
            $topByType = function (string $type) {
                return ProductInteraction::type($type)
                    ->select('product_slug')
                    ->selectRaw('COUNT(*) as count')
                    ->groupBy('product_slug')
                    ->orderByDesc('count')
                    ->limit(self::TOP_LIMIT)
                    ->get();
            };

            return response()->json([
                'success' => true,
                'data' => [
                    'views' => $topByType('view'),
                    'whatsapp_clicks' => $topByType('whatsapp_click'),
                ],
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to get product interaction statistics', 'product_interaction_statistics_failed');
        }
    }
}
