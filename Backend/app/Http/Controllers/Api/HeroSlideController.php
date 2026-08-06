<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\HeroSlide\StoreHeroSlideRequest;
use App\Http\Requests\HeroSlide\UpdateHeroSlideRequest;
use App\Models\HeroSlide;
use App\Support\ImageUrl;
use App\Traits\HandlesApiErrors;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HeroSlideController extends Controller
{
    use HandlesApiErrors;

    private const LANGUAGES = ['id', 'en', 'zh'];

    /**
     * Public: active slides, ordered, localized for the requested language.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $lang = in_array($request->input('lang'), self::LANGUAGES, true) ? $request->input('lang') : 'id';

            $slides = HeroSlide::where('is_active', true)
                ->orderBy('display_order')
                ->get()
                ->map(fn (HeroSlide $slide) => $this->toPublicArray($slide, $lang));

            return response()->json([
                'success' => true,
                'data' => $slides,
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve hero slides', 'hero_slides_public_index_failed');
        }
    }

    /**
     * Admin: all slides (active + inactive), with every language field, for the management table.
     */
    public function adminIndex(): JsonResponse
    {
        try {
            $slides = HeroSlide::orderBy('display_order')->get()->map(fn (HeroSlide $slide) => $this->toAdminArray($slide));

            return response()->json([
                'success' => true,
                'data' => $slides,
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve hero slides', 'hero_slides_admin_index_failed');
        }
    }

    public function show(HeroSlide $heroSlide): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->toAdminArray($heroSlide),
        ]);
    }

    public function store(StoreHeroSlideRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['image'] = $request->file('image')->store('hero-slides', 'public');
            $data['display_order'] = $data['display_order'] ?? ((HeroSlide::max('display_order') ?? -1) + 1);
            $data['is_active'] = $request->boolean('is_active', true);

            $slide = HeroSlide::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Hero slide created successfully',
                'data' => $this->toAdminArray($slide),
            ], 201);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to create hero slide', 'hero_slide_store_failed');
        }
    }

    public function update(UpdateHeroSlideRequest $request, HeroSlide $heroSlide): JsonResponse
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('image')) {
                Storage::disk('public')->delete($heroSlide->image);
                $data['image'] = $request->file('image')->store('hero-slides', 'public');
            }

            // 'nullable' rules populate validated() with null even when the field was never
            // sent; only touch is_active when the request actually included it, so a partial
            // edit doesn't silently reset the slide back to active/inactive.
            if ($request->has('is_active')) {
                $data['is_active'] = $request->boolean('is_active');
            } else {
                unset($data['is_active']);
            }

            $heroSlide->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Hero slide updated successfully',
                'data' => $this->toAdminArray($heroSlide),
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to update hero slide', 'hero_slide_update_failed');
        }
    }

    public function destroy(HeroSlide $heroSlide): JsonResponse
    {
        try {
            Storage::disk('public')->delete($heroSlide->image);
            $heroSlide->delete();

            return response()->json([
                'success' => true,
                'message' => 'Hero slide deleted successfully',
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to delete hero slide', 'hero_slide_destroy_failed');
        }
    }

    public function toggleActive(HeroSlide $heroSlide): JsonResponse
    {
        try {
            $heroSlide->update(['is_active' => !$heroSlide->is_active]);

            return response()->json([
                'success' => true,
                'message' => 'Hero slide status updated',
                'data' => $this->toAdminArray($heroSlide),
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to update hero slide status', 'hero_slide_toggle_failed');
        }
    }

    /**
     * Bulk-persist new display_order values after a drag-reorder in the admin UI.
     * Expects: { "order": [{"id": 3, "display_order": 0}, {"id": 1, "display_order": 1}, ...] }
     */
    public function reorder(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'order' => 'required|array',
                'order.*.id' => 'required|integer|exists:hero_slides,id',
                'order.*.display_order' => 'required|integer|min:0',
            ]);

            foreach ($request->input('order') as $item) {
                HeroSlide::where('id', $item['id'])->update(['display_order' => $item['display_order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Hero slide order updated',
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to reorder hero slides', 'hero_slide_reorder_failed');
        }
    }

    private function toPublicArray(HeroSlide $slide, string $lang): array
    {
        return [
            'id' => $slide->id,
            'image' => ImageUrl::resolve($slide->image),
            'title' => $slide->{"title_$lang"} ?: $slide->title_id,
            'subtitle' => $slide->{"subtitle_$lang"} ?: $slide->subtitle_id,
            'description' => $slide->{"description_$lang"} ?: $slide->description_id,
            'ctaPath' => $slide->cta_path,
            'durationMs' => $slide->duration_ms,
        ];
    }

    private function toAdminArray(HeroSlide $slide): array
    {
        return [
            'id' => $slide->id,
            'title_id' => $slide->title_id,
            'title_en' => $slide->title_en,
            'title_zh' => $slide->title_zh,
            'subtitle_id' => $slide->subtitle_id,
            'subtitle_en' => $slide->subtitle_en,
            'subtitle_zh' => $slide->subtitle_zh,
            'description_id' => $slide->description_id,
            'description_en' => $slide->description_en,
            'description_zh' => $slide->description_zh,
            'image' => ImageUrl::resolve($slide->image),
            'cta_path' => $slide->cta_path,
            'duration_ms' => $slide->duration_ms,
            'display_order' => $slide->display_order,
            'is_active' => $slide->is_active,
            'created_at' => $slide->created_at,
            'updated_at' => $slide->updated_at,
        ];
    }
}
