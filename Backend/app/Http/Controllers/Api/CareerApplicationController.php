<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CareerApplication;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CareerApplicationController extends Controller
{
    /**
     * Get all career applications with filtering
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = CareerApplication::with(['reviewedBy']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            // Filter by position
            if ($request->has('position')) {
                $query->where('posisi', 'like', "%{$request->input('position')}%");
            }

            // Search by name or email
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filter by AI score
            if ($request->has('min_score')) {
                $query->where('ai_score', '>=', $request->input('min_score'));
            }

            // Date range
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('created_at', [
                    $request->input('start_date'),
                    $request->input('end_date')
                ]);
            }

            // Pagination
            $perPage = $request->input('per_page', 20);
            $applications = $query->latest()->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $applications
            ]);
        } catch (\Exception $e) {
            Log::error('Career applications error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get career applications'
            ], 500);
        }
    }

    /**
     * Get single application details
     */
    public function show(string|int $id): JsonResponse
    {
        try {
            $application = CareerApplication::with(['reviewedBy'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $application
            ]);
        } catch (\Exception $e) {
            Log::error('Career application details error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Application not found'
            ], 404);
        }
    }

    /**
     * Update application status and notes
     */
    public function update(Request $request, string|int $id): JsonResponse
    {
        try {
            $application = CareerApplication::findOrFail($id);

            $application->update([
                'status' => $request->input('status', $application->status),
                'notes' => $request->input('notes', $application->notes ?? ''),
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Application updated successfully',
                'data' => $application->load('reviewedBy')
            ]);
        } catch (\Exception $e) {
            Log::error('Update career application error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update application'
            ], 500);
        }
    }

    /**
     * Get application statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => CareerApplication::count(),
                'pending' => CareerApplication::pending()->count(),
                'reviewed' => CareerApplication::reviewed()->count(),
                'interview' => CareerApplication::interview()->count(),
                'rejected' => CareerApplication::rejected()->count(),
                'hired' => CareerApplication::hired()->count(),
                'high_quality' => CareerApplication::highScore()->count(),
            ];

            // Get applications by position
            $byPosition = CareerApplication::select('posisi')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('posisi')
                ->orderByDesc('count')
                ->get();

            return response()->json([
                'success' => true,
                'data' => array_merge($stats, ['by_position' => $byPosition])
            ]);
        } catch (\Exception $e) {
            Log::error('Career application statistics error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get statistics'
            ], 500);
        }
    }

    /**
     * Download the applicant's CV/resume.
     */
    public function downloadCv(string|int $id): StreamedResponse|JsonResponse
    {
        try {
            $application = CareerApplication::findOrFail($id);

            if (!$application->cv_path || !Storage::disk('local')->exists($application->cv_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File CV tidak ditemukan',
                ], 404);
            }

            $extension = pathinfo($application->cv_path, PATHINFO_EXTENSION);
            $downloadName = 'CV_' . str_replace(' ', '_', $application->nama) . '.' . $extension;

            return Storage::disk('local')->download($application->cv_path, $downloadName);
        } catch (\Exception $e) {
            Log::error('Career application CV download error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to download CV'
            ], 404);
        }
    }

    /**
     * Delete application (soft delete)
     */
    public function destroy(string|int $id): JsonResponse
    {
        try {
            $application = CareerApplication::findOrFail($id);
            $application->delete();

            return response()->json([
                'success' => true,
                'message' => 'Application deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Delete career application error', [
                'error' => $e->getMessage(),
                'id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete application'
            ], 500);
        }
    }
}
