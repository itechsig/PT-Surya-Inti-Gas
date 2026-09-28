<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CategoryPhoto;
use App\Support\ImageUrl;
use App\Traits\HandlesApiErrors;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

/**
 * Photos for the Product.tsx category/sub-category picker cards (replacing the lucide
 * icons). Rows are fixed by key (seeded in the create_category_photos_table migration) -
 * there is no create/list-of-arbitrary-keys here, only "upload/replace/clear the photo
 * for this known key".
 */
class CategoryPhotoController extends Controller
{
    use HandlesApiErrors, LogsActivity;

    /** Public: key -> resolved image URL (or null, so the frontend falls back to its icon). */
    public function index(): JsonResponse
    {
        try {
            $photos = CategoryPhoto::all()->mapWithKeys(
                fn (CategoryPhoto $p) => [$p->key => ImageUrl::resolve($p->image_path)]
            );

            return response()->json(['success' => true, 'data' => $photos])
                ->header('Cache-Control', 'public, max-age=60');
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve category photos', 'category_photos_public_index_failed');
        }
    }

    /** Admin: every known key with its current photo, for the management screen. */
    public function adminIndex(): JsonResponse
    {
        try {
            $photos = CategoryPhoto::orderBy('key')->get()->map(fn (CategoryPhoto $p) => [
                'key' => $p->key,
                'image' => ImageUrl::resolve($p->image_path),
                'updated_at' => $p->updated_at,
            ]);

            return response()->json(['success' => true, 'data' => $photos]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve category photos', 'category_photos_admin_index_failed');
        }
    }

    public function update(Request $request, CategoryPhoto $categoryPhoto): JsonResponse
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            ]);

            $oldPath = $categoryPhoto->image_path;
            $categoryPhoto->image_path = $request->file('image')->store('category-photos', 'public');
            $categoryPhoto->save();

            // Only remove the old file after the new one is safely stored, so a failed
            // upload never leaves the card without any photo at all.
            if ($oldPath) {
                Storage::disk('public')->delete($oldPath);
            }

            $this->logActivity(
                $request,
                'update_category_photo',
                'category_photo',
                $categoryPhoto->id,
                "Memperbarui foto kategori \"{$categoryPhoto->key}\""
            );

            return response()->json([
                'success' => true,
                'message' => 'Category photo updated successfully',
                'data' => [
                    'key' => $categoryPhoto->key,
                    'image' => ImageUrl::resolve($categoryPhoto->image_path),
                    'updated_at' => $categoryPhoto->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to update category photo', 'category_photo_update_failed');
        }
    }

    /** Clears the photo, reverting that card to its icon fallback on the frontend. */
    public function destroy(Request $request, CategoryPhoto $categoryPhoto): JsonResponse
    {
        try {
            if ($categoryPhoto->image_path) {
                Storage::disk('public')->delete($categoryPhoto->image_path);
            }
            $categoryPhoto->update(['image_path' => null]);

            $this->logActivity(
                $request,
                'clear_category_photo',
                'category_photo',
                $categoryPhoto->id,
                "Menghapus foto kategori \"{$categoryPhoto->key}\""
            );

            return response()->json(['success' => true, 'message' => 'Category photo cleared successfully']);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to clear category photo', 'category_photo_destroy_failed');
        }
    }
}
