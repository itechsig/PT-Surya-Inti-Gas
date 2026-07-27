<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobVacancy\StoreJobVacancyRequest;
use App\Http\Requests\JobVacancy\UpdateJobVacancyRequest;
use App\Models\JobVacancy;
use App\Traits\HandlesApiErrors;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class JobVacancyController extends Controller
{
    use HandlesApiErrors;

    private const LANGUAGES = ['id', 'en', 'zh'];

    /**
     * Public: active job vacancies, ordered, localized for the requested language.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $lang = in_array($request->input('lang'), self::LANGUAGES, true) ? $request->input('lang') : 'id';

            $jobs = JobVacancy::where('is_active', true)
                ->orderBy('display_order')
                ->get()
                ->map(fn (JobVacancy $job) => $this->toPublicArray($job, $lang));

            return response()->json([
                'success' => true,
                'data' => $jobs,
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve job vacancies', 'job_vacancies_public_index_failed');
        }
    }

    /**
     * Admin: all job vacancies (active + inactive), with every language field, for the management table.
     */
    public function adminIndex(): JsonResponse
    {
        try {
            $jobs = JobVacancy::orderBy('display_order')->get()->map(fn (JobVacancy $job) => $this->toAdminArray($job));

            return response()->json([
                'success' => true,
                'data' => $jobs,
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve job vacancies', 'job_vacancies_admin_index_failed');
        }
    }

    public function show(JobVacancy $jobVacancy): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->toAdminArray($jobVacancy),
        ]);
    }

    public function store(StoreJobVacancyRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['type_id'] = $data['type_id'] ?? 'Penuh Waktu';
            $data['display_order'] = $data['display_order'] ?? ((JobVacancy::max('display_order') ?? -1) + 1);
            $data['is_active'] = $request->boolean('is_active', true);

            $job = JobVacancy::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Job vacancy created successfully',
                'data' => $this->toAdminArray($job),
            ], 201);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to create job vacancy', 'job_vacancy_store_failed');
        }
    }

    public function update(UpdateJobVacancyRequest $request, JobVacancy $jobVacancy): JsonResponse
    {
        try {
            $data = $request->validated();

            // 'nullable' rules populate validated() with null even when the field was never
            // sent; only touch is_active when the request actually included it, so a partial
            // edit doesn't silently reset the listing back to active/inactive.
            if ($request->has('is_active')) {
                $data['is_active'] = $request->boolean('is_active');
            } else {
                unset($data['is_active']);
            }

            $jobVacancy->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Job vacancy updated successfully',
                'data' => $this->toAdminArray($jobVacancy),
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to update job vacancy', 'job_vacancy_update_failed');
        }
    }

    public function destroy(JobVacancy $jobVacancy): JsonResponse
    {
        try {
            $jobVacancy->delete();

            return response()->json([
                'success' => true,
                'message' => 'Job vacancy deleted successfully',
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to delete job vacancy', 'job_vacancy_destroy_failed');
        }
    }

    public function toggleActive(JobVacancy $jobVacancy): JsonResponse
    {
        try {
            $jobVacancy->update(['is_active' => !$jobVacancy->is_active]);

            return response()->json([
                'success' => true,
                'message' => 'Job vacancy status updated',
                'data' => $this->toAdminArray($jobVacancy),
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to update job vacancy status', 'job_vacancy_toggle_failed');
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
                'order.*.id' => 'required|integer|exists:job_vacancies,id',
                'order.*.display_order' => 'required|integer|min:0',
            ]);

            foreach ($request->input('order') as $item) {
                JobVacancy::where('id', $item['id'])->update(['display_order' => $item['display_order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Job vacancy order updated',
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to reorder job vacancies', 'job_vacancy_reorder_failed');
        }
    }

    private function toPublicArray(JobVacancy $job, string $lang): array
    {
        return [
            'id' => $job->id,
            'title' => $job->{"title_$lang"} ?: $job->title_id,
            'division' => $job->{"division_$lang"} ?: $job->division_id,
            'location' => $job->{"location_$lang"} ?: $job->location_id,
            'type' => $job->{"type_$lang"} ?: $job->type_id,
            'level' => $job->{"level_$lang"} ?: $job->level_id,
            'description' => $job->{"description_$lang"} ?: $job->description_id,
            'fullDescription' => $job->{"full_description_$lang"} ?: $job->full_description_id,
            'requirements' => $job->{"requirements_$lang"} ?: ($job->requirements_id ?? []),
            'deadline' => $job->deadline->format('Y-m-d'),
        ];
    }

    private function toAdminArray(JobVacancy $job): array
    {
        return [
            'id' => $job->id,
            'title_id' => $job->title_id,
            'title_en' => $job->title_en,
            'title_zh' => $job->title_zh,
            'division_id' => $job->division_id,
            'division_en' => $job->division_en,
            'division_zh' => $job->division_zh,
            'location_id' => $job->location_id,
            'location_en' => $job->location_en,
            'location_zh' => $job->location_zh,
            'type_id' => $job->type_id,
            'type_en' => $job->type_en,
            'type_zh' => $job->type_zh,
            'level_id' => $job->level_id,
            'level_en' => $job->level_en,
            'level_zh' => $job->level_zh,
            'description_id' => $job->description_id,
            'description_en' => $job->description_en,
            'description_zh' => $job->description_zh,
            'full_description_id' => $job->full_description_id,
            'full_description_en' => $job->full_description_en,
            'full_description_zh' => $job->full_description_zh,
            'requirements_id' => $job->requirements_id ?? [],
            'requirements_en' => $job->requirements_en ?? [],
            'requirements_zh' => $job->requirements_zh ?? [],
            'deadline' => $job->deadline->format('Y-m-d'),
            'display_order' => $job->display_order,
            'is_active' => $job->is_active,
            'created_at' => $job->created_at,
            'updated_at' => $job->updated_at,
        ];
    }
}
