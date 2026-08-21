<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Support\ImageUrl;
use App\Traits\HandlesApiErrors;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    use HandlesApiErrors, LogsActivity;

    private const LANGUAGES = ['id', 'en', 'zh'];

    /** Fields snapshotted for the activity log's before/after preview. */
    private const AUDIT_FIELDS = ['product_category_id', 'slug', 'name_id', 'description_id', 'is_featured', 'is_published'];

    /**
     * Public: published products grouped by main category -> subcategory slug,
     * mirroring the shape the frontend previously built from the static structure file.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $lang = $this->resolveLang($request);

            $categories = ProductCategory::with(['products' => function ($q) {
                $q->where('is_published', true)->orderBy('display_order');
            }])->orderBy('display_order')->get();

            $result = ['gas' => [], 'package' => [], 'services' => [], 'equipment' => []];
            foreach ($categories as $category) {
                // Ensure the main category key exists
                if (!isset($result[$category->main_category])) {
                    $result[$category->main_category] = [];
                }
                
                $result[$category->main_category][$category->slug] = [
                    'title' => $category->{"name_$lang"} ?: $category->name_id,
                    'products' => $category->products->map(fn (Product $p) => $this->toPublicProduct($p, $lang))->values(),
                ];
            }

            return response()->json(['success' => true, 'data' => $result]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve products', 'products_public_index_failed');
        }
    }

    /**
     * Public: a single published product by slug (legacy "id" query param), with gallery + specs.
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        try {
            $lang = $this->resolveLang($request);
            $product = Product::with('category')->where('slug', $slug)->where('is_published', true)->first();

            if (!$product) {
                return response()->json(['success' => false, 'message' => 'Product not found'], 404);
            }

            if (!$product->category) {
                return response()->json(['success' => false, 'message' => 'Product category not found'], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'product' => $this->toPublicProduct($product, $lang, full: true),
                    'mainCategory' => $product->category->main_category,
                    'subCategory' => $product->category->slug,
                    'subCategoryTitle' => $product->category->{"name_$lang"} ?: $product->category->name_id,
                ],
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve product', 'product_public_show_failed');
        }
    }

    /**
     * Admin: flat list of every product (published + draft), with category info, for the management table.
     */
    public function adminIndex(): JsonResponse
    {
        try {
            $products = Product::with('category')->orderBy('display_order')->get()
                ->map(fn (Product $p) => $this->toAdminArray($p));

            return response()->json(['success' => true, 'data' => $products]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve products', 'products_admin_index_failed');
        }
    }

    public function adminShow(Product $product): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $this->toAdminArray($product->load('category'))]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['image'] = $this->storeProductImage($request->file('image'), $data['slug']);
            $data['gallery'] = $this->storeGalleryFiles($request);
            $data['specifications'] = $request->filled('specifications') ? json_decode($request->input('specifications'), true) : null;
            $data['display_order'] = $data['display_order'] ?? ((Product::max('display_order') ?? -1) + 1);
            $data['is_featured'] = $request->boolean('is_featured', false);
            $data['is_published'] = $request->boolean('is_published', true);

            $product = Product::create($data);

            $this->logActivity(
                $request,
                'create_product',
                'product',
                $product->id,
                "Membuat produk baru \"{$product->name_id}\"",
                new: $product->only(self::AUDIT_FIELDS)
            );

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $this->toAdminArray($product->load('category')),
            ], 201);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to create product', 'product_store_failed');
        }
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('image')) {
                $oldImage = $product->image;
                $data['image'] = $this->storeProductImage($request->file('image'), $data['slug'] ?? $product->slug);
                // Only remove the old file after the new one is safely stored, so a failed
                // upload never leaves the product without any image at all.
                Storage::disk('public')->delete($oldImage);
            }

            $keptGallery = $request->filled('existing_gallery')
                ? collect(json_decode($request->input('existing_gallery'), true))->map(fn ($url) => $this->galleryUrlToPath($url))->all()
                : ($product->gallery ?? []);
            $removedGallery = array_diff($product->gallery ?? [], $keptGallery);
            foreach ($removedGallery as $path) {
                Storage::disk('public')->delete($path);
            }
            $newGalleryFiles = $this->storeGalleryFiles($request);
            $data['gallery'] = array_values(array_merge($keptGallery, $newGalleryFiles));

            if (array_key_exists('specifications', $data)) {
                $data['specifications'] = $data['specifications'] ? json_decode($data['specifications'], true) : null;
            }
            unset($data['existing_gallery']);

            // 'nullable' rules populate validated() with null even when the field was never sent;
            // only touch these when the request actually included them, so a partial edit
            // (e.g. renaming a product) doesn't silently reset featured/published flags.
            if ($request->has('is_featured')) {
                $data['is_featured'] = $request->boolean('is_featured');
            } else {
                unset($data['is_featured']);
            }
            if ($request->has('is_published')) {
                $data['is_published'] = $request->boolean('is_published');
            } else {
                unset($data['is_published']);
            }

            $old = $product->only(self::AUDIT_FIELDS);

            $product->update($data);

            $this->logActivity(
                $request,
                'update_product',
                'product',
                $product->id,
                "Memperbarui produk \"{$product->name_id}\"",
                old: $old,
                new: $product->only(self::AUDIT_FIELDS)
            );

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $this->toAdminArray($product->load('category')),
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to update product', 'product_update_failed');
        }
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        try {
            $name = $product->name_id;
            $old = $product->only(self::AUDIT_FIELDS);
            $productId = $product->id;

            Storage::disk('public')->delete($product->image);
            foreach ($product->gallery ?? [] as $path) {
                Storage::disk('public')->delete($path);
            }
            $product->delete();

            $this->logActivity($request, 'delete_product', 'product', $productId, "Menghapus produk \"{$name}\"", old: $old);

            return response()->json(['success' => true, 'message' => 'Product deleted successfully']);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to delete product', 'product_destroy_failed');
        }
    }

    public function toggleFeatured(Product $product): JsonResponse
    {
        $product->update(['is_featured' => !$product->is_featured]);
        return response()->json(['success' => true, 'data' => $this->toAdminArray($product->load('category'))]);
    }

    public function togglePublished(Product $product): JsonResponse
    {
        $product->update(['is_published' => !$product->is_published]);
        return response()->json(['success' => true, 'data' => $this->toAdminArray($product->load('category'))]);
    }

    public function reorder(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'order' => 'required|array',
                'order.*.id' => 'required|integer|exists:products,id',
                'order.*.display_order' => 'required|integer|min:0',
            ]);

            foreach ($request->input('order') as $item) {
                Product::where('id', $item['id'])->update(['display_order' => $item['display_order']]);
            }

            return response()->json(['success' => true, 'message' => 'Product order updated']);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to reorder products', 'product_reorder_failed');
        }
    }

    /** Categories for the admin product form's category picker. */
    public function categories(): JsonResponse
    {
        $categories = ProductCategory::orderBy('main_category')->orderBy('display_order')->get()->map(fn (ProductCategory $c) => [
            'id' => $c->id,
            'main_category' => $c->main_category,
            'slug' => $c->slug,
            'name_id' => $c->name_id,
            'name_en' => $c->name_en,
            'name_zh' => $c->name_zh,
        ]);

        return response()->json(['success' => true, 'data' => $categories]);
    }

    private function resolveLang(Request $request): string
    {
        return in_array($request->input('lang'), self::LANGUAGES, true) ? $request->input('lang') : 'id';
    }

    /**
     * Stores a product image under a readable, debuggable name - "{slug}-{original-filename}.{ext}"
     * (e.g. "mixed-gas-Mix_gas.webp") - instead of Laravel's default random hashName(). Collision-safe:
     * if that exact filename is already taken, appends "-2", "-3", ... rather than silently overwriting
     * another product's file or falling back to a random hash.
     */
    private function storeProductImage(UploadedFile $file, string $slug, string $directory = 'products'): string
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeName = trim(preg_replace('/[^A-Za-z0-9_-]+/', '_', $originalName) ?? '', '_');
        $safeName = $safeName !== '' ? $safeName : 'image';
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'jpg');

        $base = "{$slug}-{$safeName}";
        $filename = "{$base}.{$extension}";
        for ($suffix = 2; Storage::disk('public')->exists("{$directory}/{$filename}"); $suffix++) {
            $filename = "{$base}-{$suffix}.{$extension}";
        }

        return $file->storeAs($directory, $filename, 'public');
    }

    private function galleryUrlToPath(string $url): string
    {
        $marker = '/storage/';
        $pos = strpos($url, $marker);
        return $pos !== false ? substr($url, $pos + strlen($marker)) : $url;
    }

    private function storeGalleryFiles(Request $request, string $disk = 'public'): array
    {
        if (!$request->hasFile('gallery')) {
            return [];
        }

        return collect($request->file('gallery'))
            ->map(fn ($file) => $file->store('products/gallery', $disk))
            ->values()
            ->all();
    }

    private function toPublicProduct(Product $p, string $lang, bool $full = false): array
    {
        $description = $p->{"description_$lang"} ?: $p->description_id;

        $data = [
            'id' => $p->slug,
            'title' => $p->{"name_$lang"} ?: $p->name_id,
            'description' => $description,
            'fullDescription' => $p->{"full_description_$lang"} ?: $p->full_description_id ?: $description,
            'image' => ImageUrl::resolve($p->image),
        ];

        if ($full) {
            $data['gallery'] = collect($p->gallery ?? [])->map(fn ($path) => ImageUrl::resolve($path))->values();
            $data['specifications'] = $p->specifications ?? [];
            $data['isFeatured'] = $p->is_featured;
        }

        return $data;
    }

    private function toAdminArray(Product $p): array
    {
        return [
            'id' => $p->id,
            'product_category_id' => $p->product_category_id,
            'category' => $p->category ? [
                'id' => $p->category->id,
                'main_category' => $p->category->main_category,
                'slug' => $p->category->slug,
                'name_id' => $p->category->name_id,
            ] : null,
            'slug' => $p->slug,
            'name_id' => $p->name_id, 'name_en' => $p->name_en, 'name_zh' => $p->name_zh,
            'description_id' => $p->description_id, 'description_en' => $p->description_en, 'description_zh' => $p->description_zh,
            'full_description_id' => $p->full_description_id, 'full_description_en' => $p->full_description_en, 'full_description_zh' => $p->full_description_zh,
            'image' => ImageUrl::resolve($p->image),
            'gallery' => collect($p->gallery ?? [])->map(fn ($path) => ImageUrl::resolve($path))->values(),
            'specifications' => $p->specifications ?? [],
            'is_featured' => $p->is_featured,
            'display_order' => $p->display_order,
            'is_published' => $p->is_published,
            'created_at' => $p->created_at,
            'updated_at' => $p->updated_at,
        ];
    }
}
