<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Blocks access to admin endpoints until a user with a Super-Admin-issued temporary
 * password (must_change_password) has set their own. Only the handful of self-service
 * auth routes needed to actually change the password stay reachable.
 */
class RequirePasswordChangeMiddleware
{
    private const EXEMPT_PATHS = [
        'api/v1/auth/password',
        'api/v1/auth/logout',
        'api/v1/auth/me',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->must_change_password && !$request->is(self::EXEMPT_PATHS)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda harus mengganti kata sandi sebelum melanjutkan',
                'error_code' => 'PASSWORD_CHANGE_REQUIRED',
            ], 403);
        }

        return $next($request);
    }
}
