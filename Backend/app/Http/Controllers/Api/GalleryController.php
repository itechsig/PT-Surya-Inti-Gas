<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GalleryItem\StoreGalleryItemRequest;
use App\Http\Requests\GalleryItem\UpdateGalleryItemRequest;
use App\Models\GalleryItem;
use App\Support\ImageUrl;
use App\Traits\HandlesApiErrors;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    use HandlesApiErrors;

    private const LANGUAGES = ['id', 'en', 'zh'];

    /**
     * Public: active gallery items, ordered, localized for the requested language.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $lang = in_array($request->input('lang'), self::LANGUAGES, true) ? $request->input('lang') : 'id';

            $items = GalleryItem::where('is_active', true)
                ->orderBy('display_order')
                ->get()
                ->map(fn (GalleryItem $item) => $this->toPublicArray($item, $lang));

            return response()->json([
                'success' => true,
                'data' => $items,
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve gallery items', 'gallery_public_index_failed');
        }
    }

    /**
     * Admin: all gallery items (active + inactive), with every language field, for the management table.
     */
    public function adminIndex(): JsonResponse
    {
        try {
            $items = GalleryItem::orderBy('display_order')->get()->map(fn (GalleryItem $item) => $this->toAdminArray($item));

            return response()->json([
                'success' => true,
                'data' => $items,
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve gallery items', 'gallery_admin_index_failed');
        }
    }

    public function show(GalleryItem $galleryItem): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->toAdminArray($galleryItem),
        ]);
    }

    public function store(StoreGalleryItemRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['image'] = $request->file('image')->store('gallery', 'public');
            $data['display_order'] = $data['display_order'] ?? ((GalleryItem::max('display_order') ?? -1) + 1);
            $data['size'] = $data['size'] ?? 'medium';
            $data['is_active'] = $request->boolean('is_active', true);

            $item = GalleryItem::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Gallery item created successfully',
                'data' => $this->toAdminArray($item),
            ], 201);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to create gallery item', 'gallery_store_failed');
        }
    }

    public function update(UpdateGalleryItemRequest $request, GalleryItem $galleryItem): JsonResponse
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('image')) {
                if (!str_starts_with($galleryItem->image, 'http')) {
                    Storage::disk('public')->delete($galleryItem->image);
                }
                $data['image'] = $request->file('image')->store('gallery', 'public');
            }

            // 'nullable' rules populate validated() with null even when the field was never
            // sent; only touch is_active when the request actually included it, so a partial
            // edit doesn't silently reset the item back to active/inactive.
            if ($request->has('is_active')) {
                $data['is_active'] = $request->boolean('is_active');
            } else {
                unset($data['is_active']);
            }

            $galleryItem->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Gallery item updated successfully',
                'data' => $this->toAdminArray($galleryItem),
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to update gallery item', 'gallery_update_failed');
        }
    }

    public function destroy(GalleryItem $galleryItem): JsonResponse
    {
        try {
            if (!str_starts_with($galleryItem->image, 'http')) {
                Storage::disk('public')->delete($galleryItem->image);
            }
            $galleryItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gallery item deleted successfully',
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to delete gallery item', 'gallery_destroy_failed');
        }
    }

    public function toggleActive(GalleryItem $galleryItem): JsonResponse
    {
        try {
            $galleryItem->update(['is_active' => !$galleryItem->is_active]);

            return response()->json([
                'success' => true,
                'message' => 'Gallery item status updated',
                'data' => $this->toAdminArray($galleryItem),
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to update gallery item status', 'gallery_toggle_failed');
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
                'order.*.id' => 'required|integer|exists:gallery_items,id',
                'order.*.display_order' => 'required|integer|min:0',
            ]);

            foreach ($request->input('order') as $item) {
                GalleryItem::where('id', $item['id'])->update(['display_order' => $item['display_order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Gallery order updated',
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to reorder gallery items', 'gallery_reorder_failed');
        }
    }

    private function toPublicArray(GalleryItem $item, string $lang): array
    {
        $title = $item->{"title_$lang"} ?: $item->title_id;
        $imageUrl = ImageUrl::resolve($item->image);

        return [
            'id' => (string) $item->id,
            'thumbnail' => $imageUrl,
            'fullSize' => $imageUrl,
            'alt' => $title,
            'title' => $title,
            'description' => $item->{"description_$lang"} ?: $item->description_id,
            'detailedDescription' => $item->{"detailed_description_$lang"} ?: $item->detailed_description_id,
            'category' => $item->category,
            'year' => $item->year,
            'size' => $item->size,
        ];
    }

    private function toAdminArray(GalleryItem $item): array
    {
        return [
            'id' => $item->id,
            'title_id' => $item->title_id,
            'title_en' => $item->title_en,
            'title_zh' => $item->title_zh,
            'description_id' => $item->description_id,
            'description_en' => $item->description_en,
            'description_zh' => $item->description_zh,
            'detailed_description_id' => $item->detailed_description_id,
            'detailed_description_en' => $item->detailed_description_en,
            'detailed_description_zh' => $item->detailed_description_zh,
            'category' => $item->category,
            'year' => $item->year,
            'size' => $item->size,
            'image' => ImageUrl::resolve($item->image),
            'display_order' => $item->display_order,
            'is_active' => $item->is_active,
            'created_at' => $item->created_at,
            'updated_at' => $item->updated_at,
        ];
    }
}
