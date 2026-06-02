<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

trait HandlesApiErrors
{
    /**
     * Handle API error with proper logging and user-friendly messages
     *
     * @param \Exception $e
     * @param string $userMessage
     * @param string $logContext
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function handleApiError(
        \Exception $e,
        string $userMessage = 'An error occurred',
        string $logContext = 'api_error',
        int $statusCode = 500
    ): JsonResponse {
        // Log detailed error for debugging
        Log::error($logContext, [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ]);

        // Return user-friendly error message
        return response()->json([
            'success' => false,
            'message' => $userMessage,
            'error' => config('app.debug') ? $e->getMessage() : 'An internal error occurred. Please try again later.'
        ], $statusCode);
    }

    /**
     * Handle validation error
     *
     * @param array $errors
     * @param string $message
     * @return JsonResponse
     */
    protected function handleValidationError(array $errors, string $message = 'Validation failed'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ], 422);
    }

    /**
     * Handle not found error
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function handleNotFoundError(string $message = 'Resource not found'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], 404);
    }

    /**
     * Handle unauthorized error
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function handleUnauthorizedError(string $message = 'Unauthorized access'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], 401);
    }

    /**
     * Handle forbidden error
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function handleForbiddenError(string $message = 'Access forbidden'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], 403);
    }
}