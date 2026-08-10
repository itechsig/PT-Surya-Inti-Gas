<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Portfolio\StorePortfolioRequest;
use App\Http\Requests\Portfolio\UpdatePortfolioRequest;
use App\Models\Industry;
use App\Models\Portfolio;
use App\Models\PortfolioImage;
use App\Models\ServiceType;
use App\Support\ImageUrl;
use App\Traits\HandlesApiErrors;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    use HandlesApiErrors;

    private const LANGUAGES = ['id', 'en', 'zh'];

    /**
     * Public: paginated, filterable, searchable portfolio listing.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $lang = $this->resolveLang($request);

            $query = Portfolio::with(['industry', 'serviceType'])->where('is_published', true);

            if ($request->filled('industry')) {
                $query->whereHas('industry', fn ($q) => $q->where('slug', $request->input('industry')));
            }
            if ($request->filled('service')) {
                $query->whereHas('serviceType', fn ($q) => $q->where('slug', $request->input('service')));
            }
            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('title_id', 'like', "%{$search}%")
                        ->orWhere('title_en', 'like', "%{$search}%")
                        ->orWhere('title_zh', 'like', "%{$search}%")
                        ->orWhere('location_id', 'like', "%{$search}%")
                        ->orWhere('location_en', 'like', "%{$search}%")
                        ->orWhere('product_solution_id', 'like', "%{$search}%")
                        ->orWhere('product_solution_en', 'like', "%{$search}%")
                        ->orWhereHas('industry', fn ($iq) => $iq->where('name_id', 'like', "%{$search}%")->orWhere('name_en', 'like', "%{$search}%"))
                        ->orWhereHas('serviceType', fn ($sq) => $sq->where('name_id', 'like', "%{$search}%")->orWhere('name_en', 'like', "%{$search}%"));
                });
            }

            $perPage = min((int) $request->input('per_page', 9), 50);
            $portfolios = $query->orderByDesc('is_featured')->orderBy('display_order')
                ->paginate($perPage)
                ->through(fn (Portfolio $p) => $this->toPublicPortfolio($p, $lang));

            return response()->json(['success' => true, 'data' => $portfolios]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve portfolios', 'portfolios_public_index_failed');
        }
    }

    /**
     * Public: a single published portfolio by slug, with gallery.
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        try {
            $lang = $this->resolveLang($request);
            $portfolio = Portfolio::with(['industry', 'serviceType', 'images'])
                ->where('slug', $slug)->where('is_published', true)->first();

            if (!$portfolio) {
                return response()->json(['success' => false, 'message' => 'Portfolio not found'], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $this->toPublicPortfolio($portfolio, $lang, full: true),
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve portfolio', 'portfolio_public_show_failed');
        }
    }

    public function adminIndex(): JsonResponse
    {
        try {
            $portfolios = Portfolio::with(['industry', 'serviceType'])->orderBy('display_order')->get()
                ->map(fn (Portfolio $p) => $this->toAdminArray($p));

            return response()->json(['success' => true, 'data' => $portfolios]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve portfolios', 'portfolios_admin_index_failed');
        }
    }

    public function adminShow(Portfolio $portfolio): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $this->toAdminArray($portfolio->load(['industry', 'serviceType', 'images']))]);
    }

    public function store(StorePortfolioRequest $request): JsonResponse
    {
        try {
            $data = $this->resolveTaxonomyIds($request->validated());
            $data['thumbnail'] = $request->file('thumbnail')->store('portfolios', 'public');
            $data['display_order'] = $data['display_order'] ?? ((Portfolio::max('display_order') ?? -1) + 1);
            $data['is_featured'] = $request->boolean('is_featured', false);
            $data['is_published'] = $request->boolean('is_published', true);

            $portfolio = Portfolio::create($data);

            if ($request->hasFile('gallery')) {
                $this->attachGalleryFiles($portfolio, $request->file('gallery'));
            }

            return response()->json([
                'success' => true,
                'message' => 'Portfolio created successfully',
                'data' => $this->toAdminArray($portfolio->load(['industry', 'serviceType', 'images'])),
            ], 201);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to create portfolio', 'portfolio_store_failed');
        }
    }

    public function update(UpdatePortfolioRequest $request, Portfolio $portfolio): JsonResponse
    {
        try {
            $data = $this->resolveTaxonomyIds($request->validated());

            if ($request->hasFile('thumbnail')) {
                Storage::disk('public')->delete($portfolio->thumbnail);
                $data['thumbnail'] = $request->file('thumbnail')->store('portfolios', 'public');
            }

            // 'nullable' rules populate validated() with null even when the field was never sent;
            // only touch these when the request actually included them, so a partial edit
            // doesn't silently reset featured/published flags.
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

            $portfolio->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Portfolio updated successfully',
                'data' => $this->toAdminArray($portfolio->load(['industry', 'serviceType', 'images'])),
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to update portfolio', 'portfolio_update_failed');
        }
    }

    public function destroy(Portfolio $portfolio): JsonResponse
    {
        try {
            Storage::disk('public')->delete($portfolio->thumbnail);
            foreach ($portfolio->images as $image) {
                Storage::disk('public')->delete($image->image);
            }
            $portfolio->delete();

            return response()->json(['success' => true, 'message' => 'Portfolio deleted successfully']);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to delete portfolio', 'portfolio_destroy_failed');
        }
    }

    public function toggleFeatured(Portfolio $portfolio): JsonResponse
    {
        $portfolio->update(['is_featured' => !$portfolio->is_featured]);
        return response()->json(['success' => true, 'data' => $this->toAdminArray($portfolio->load(['industry', 'serviceType', 'images']))]);
    }

    public function togglePublished(Portfolio $portfolio): JsonResponse
    {
        $portfolio->update(['is_published' => !$portfolio->is_published]);
        return response()->json(['success' => true, 'data' => $this->toAdminArray($portfolio->load(['industry', 'serviceType', 'images']))]);
    }

    public function reorder(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'order' => 'required|array',
                'order.*.id' => 'required|integer|exists:portfolios,id',
                'order.*.display_order' => 'required|integer|min:0',
            ]);

            foreach ($request->input('order') as $item) {
                Portfolio::where('id', $item['id'])->update(['display_order' => $item['display_order']]);
            }

            return response()->json(['success' => true, 'message' => 'Portfolio order updated']);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to reorder portfolios', 'portfolio_reorder_failed');
        }
    }

    /** Add one or more gallery images to an existing portfolio. */
    public function storeImages(Request $request, Portfolio $portfolio): JsonResponse
    {
        try {
            $request->validate([
                'images' => 'required|array|min:1',
                'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            ]);

            $this->attachGalleryFiles($portfolio, $request->file('images'));

            return response()->json(['success' => true, 'data' => $portfolio->images()->get()->map(fn (PortfolioImage $i) => $this->toImageArray($i))]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to upload portfolio images', 'portfolio_images_store_failed');
        }
    }

    public function reorderImages(Request $request, Portfolio $portfolio): JsonResponse
    {
        try {
            $request->validate([
                'order' => 'required|array',
                'order.*.id' => 'required|integer|exists:portfolio_images,id',
                'order.*.display_order' => 'required|integer|min:0',
            ]);

            foreach ($request->input('order') as $item) {
                PortfolioImage::where('id', $item['id'])->where('portfolio_id', $portfolio->id)
                    ->update(['display_order' => $item['display_order']]);
            }

            return response()->json(['success' => true, 'message' => 'Gallery order updated']);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to reorder gallery', 'portfolio_images_reorder_failed');
        }
    }

    public function destroyImage(Portfolio $portfolio, PortfolioImage $image): JsonResponse
    {
        try {
            if ($image->portfolio_id !== $portfolio->id) {
                return response()->json(['success' => false, 'message' => 'Image does not belong to this portfolio'], 404);
            }

            Storage::disk('public')->delete($image->image);
            $image->delete();

            return response()->json(['success' => true, 'message' => 'Gallery image deleted']);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to delete gallery image', 'portfolio_image_destroy_failed');
        }
    }

    /** Industry list for the filter UI / admin picker. */
    public function industries(): JsonResponse
    {
        $industries = Industry::orderBy('display_order')->get()->map(fn (Industry $i) => [
            'id' => $i->id,
            'slug' => $i->slug,
            'name_id' => $i->name_id,
            'name_en' => $i->name_en,
            'name_zh' => $i->name_zh,
        ]);

        return response()->json(['success' => true, 'data' => $industries]);
    }

    /** Service type list for the filter UI / admin picker. */
    public function serviceTypes(): JsonResponse
    {
        $serviceTypes = ServiceType::orderBy('display_order')->get()->map(fn (ServiceType $s) => [
            'id' => $s->id,
            'slug' => $s->slug,
            'name_id' => $s->name_id,
            'name_en' => $s->name_en,
            'name_zh' => $s->name_zh,
        ]);

        return response()->json(['success' => true, 'data' => $serviceTypes]);
    }

    /**
     * The admin form's industry/service-type fields are a combobox: pick an existing option
     * (sends *_id) or type a new one (sends *_name). Turns a *_name into a real row - reusing
     * one that already matches case-insensitively rather than creating a duplicate - and
     * leaves *_id data untouched. Strips both *_name keys so they never reach Portfolio::create/update.
     */
    private function resolveTaxonomyIds(array $data): array
    {
        if (!empty($data['industry_name'])) {
            $data['industry_id'] = $this->findOrCreateTaxonomy(Industry::class, $data['industry_name']);
        }
        unset($data['industry_name']);

        if (!empty($data['service_type_name'])) {
            $data['service_type_id'] = $this->findOrCreateTaxonomy(ServiceType::class, $data['service_type_name']);
        }
        unset($data['service_type_name']);

        return $data;
    }

    /** @param class-string<Industry|ServiceType> $model */
    private function findOrCreateTaxonomy(string $model, string $name): int
    {
        $existing = $model::whereRaw('LOWER(name_id) = ?', [mb_strtolower($name)])->first();
        if ($existing) {
            return $existing->id;
        }

        $slug = \Illuminate\Support\Str::slug($name);
        $uniqueSlug = $slug;
        for ($suffix = 2; $model::where('slug', $uniqueSlug)->exists(); $suffix++) {
            $uniqueSlug = "{$slug}-{$suffix}";
        }

        return $model::create([
            'slug' => $uniqueSlug,
            'name_id' => $name,
            'display_order' => ($model::max('display_order') ?? -1) + 1,
        ])->id;
    }

    private function resolveLang(Request $request): string
    {
        return in_array($request->input('lang'), self::LANGUAGES, true) ? $request->input('lang') : 'id';
    }

    private const MONTH_NAMES = [
        'id' => ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
        'en' => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        'zh' => ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    ];

    /** Formats a completion date as "Juni 2026" / "June 2026" / "2026年6月", localized per language. */
    private function formatMonthYear(\Illuminate\Support\Carbon $date, string $lang): string
    {
        $month = self::MONTH_NAMES[$lang][$date->month - 1];
        return $lang === 'zh' ? "{$date->year}年{$month}" : "{$month} {$date->year}";
    }

    private function attachGalleryFiles(Portfolio $portfolio, array $files): void
    {
        $nextOrder = ($portfolio->images()->max('display_order') ?? -1) + 1;

        foreach ($files as $file) {
            PortfolioImage::create([
                'portfolio_id' => $portfolio->id,
                'image' => $file->store('portfolios/gallery', 'public'),
                'display_order' => $nextOrder++,
            ]);
        }
    }

    private function toImageArray(PortfolioImage $image): array
    {
        return [
            'id' => $image->id,
            'image' => ImageUrl::resolve($image->image),
            'caption' => $image->caption,
            'display_order' => $image->display_order,
        ];
    }

    private function toPublicPortfolio(Portfolio $p, string $lang, bool $full = false): array
    {
        $data = [
            'id' => $p->slug,
            'title' => $p->{"title_$lang"} ?: $p->title_id,
            'industry' => $p->industry ? [
                'slug' => $p->industry->slug,
                'name' => $p->industry->{"name_$lang"} ?: $p->industry->name_id,
            ] : null,
            'serviceType' => $p->serviceType ? [
                'slug' => $p->serviceType->slug,
                'name' => $p->serviceType->{"name_$lang"} ?: $p->serviceType->name_id,
            ] : null,
            'productSolution' => $p->{"product_solution_$lang"} ?: $p->product_solution_id,
            'location' => $p->{"location_$lang"} ?: $p->location_id,
            'completionDate' => $this->formatMonthYear($p->completion_date, $lang),
            'thumbnail' => ImageUrl::resolve($p->thumbnail),
            'isFeatured' => $p->is_featured,
        ];

        if ($full) {
            $data['summary'] = $p->{"summary_$lang"} ?: $p->summary_id;
            $data['gallery'] = $p->relationLoaded('images')
                ? $p->images->map(fn (PortfolioImage $i) => ['image' => ImageUrl::resolve($i->image), 'caption' => $i->caption])->values()
                : [];
        }

        return $data;
    }

    private function toAdminArray(Portfolio $p): array
    {
        return [
            'id' => $p->id,
            'industry_id' => $p->industry_id,
            'industry' => $p->industry ? ['id' => $p->industry->id, 'slug' => $p->industry->slug, 'name_id' => $p->industry->name_id] : null,
            'service_type_id' => $p->service_type_id,
            'service_type' => $p->serviceType ? ['id' => $p->serviceType->id, 'slug' => $p->serviceType->slug, 'name_id' => $p->serviceType->name_id] : null,
            'slug' => $p->slug,
            'title_id' => $p->title_id, 'title_en' => $p->title_en, 'title_zh' => $p->title_zh,
            'location_id' => $p->location_id, 'location_en' => $p->location_en, 'location_zh' => $p->location_zh,
            'completion_date' => $p->completion_date->format('Y-m-d'),
            'product_solution_id' => $p->product_solution_id, 'product_solution_en' => $p->product_solution_en, 'product_solution_zh' => $p->product_solution_zh,
            'summary_id' => $p->summary_id, 'summary_en' => $p->summary_en, 'summary_zh' => $p->summary_zh,
            'thumbnail' => ImageUrl::resolve($p->thumbnail),
            'gallery' => $p->relationLoaded('images')
                ? $p->images->map(fn (PortfolioImage $i) => $this->toImageArray($i))->values()
                : [],
            'is_featured' => $p->is_featured,
            'is_published' => $p->is_published,
            'display_order' => $p->display_order,
            'created_at' => $p->created_at,
            'updated_at' => $p->updated_at,
        ];
    }
}
