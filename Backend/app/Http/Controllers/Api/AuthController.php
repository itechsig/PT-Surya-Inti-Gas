<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\HandlesApiErrors;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    use HandlesApiErrors;

    /**
     * Login user and create API token
     * 
     * @OA\Post(
     *     path="/api/v1/auth/login",
     *     summary="Login user",
     *     description="Authenticate user and generate API token",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Login successful"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="email", type="string")
     *                 ),
     *                 @OA\Property(property="token", type="string")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid credentials",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Invalid credentials")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akun Anda telah dinonaktifkan. Hubungi Super Admin untuk informasi lebih lanjut.',
                ], 403);
            }

            // Revoke previous tokens
            $user->tokens()->delete();

            $token = $user->createToken('api-token')->plainTextToken;

            $user->forceFill(['last_login_at' => now()])->save();

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => $this->toUserPayload($user) + [
                        'must_change_password' => $user->must_change_password,
                    ],
                    'token' => $token,
                ]
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Login failed', 'auth_login_failed');
        }
    }

    /**
     * Logout user and revoke token
     * 
     * @OA\Post(
     *     path="/api/v1/auth/logout",
     *     summary="Logout user",
     *     description="Revoke the current user's API token",
     *     tags={"Authentication"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Logout successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Logged out successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthorized")
     *         )
     *     )
     * )
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Logout failed', 'auth_logout_failed');
        }
    }

    /**
     * Get authenticated user info
     * 
     * @OA\Get(
     *     path="/api/v1/auth/me",
     *     summary="Get current user info",
     *     description="Get information about the currently authenticated user",
     *     tags={"Authentication"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="User info retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="email", type="string"),
     *                     @OA\Property(property="email_verified", type="boolean")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthorized")
     *         )
     *     )
     * )
     */
    public function me(Request $request): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $this->toUserPayload($request->user()) + [
                        'must_change_password' => $request->user()->must_change_password,
                        'email_verified' => $request->user()->hasVerifiedEmail(),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to get user info', 'auth_get_user_failed');
        }
    }

    /**
     * Update the authenticated user's name and email.
     * Requires the current password to prevent account takeover if a session token is compromised.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
                'current_password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            if (!Hash::check($request->input('current_password'), $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kata sandi saat ini tidak sesuai',
                ], 422);
            }

            $user->update([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diperbarui',
                'data' => [
                    'user' => $this->toUserPayload($user->fresh()) + [
                        'must_change_password' => $user->must_change_password,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Gagal memperbarui profil', 'auth_update_profile_failed');
        }
    }

    /** Shared shape for the `user` object every auth endpoint returns, now that role permissions are dynamic. */
    private function toUserPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'role_label' => $user->roleRecord?->name ?? $user->role,
            'permissions' => $user->permissionSlugs(),
        ];
    }

    /**
     * Update the authenticated user's password and revoke every other active session.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'confirmed',
                    'regex:/[a-z]/',
                    'regex:/[A-Z]/',
                    'regex:/[0-9]/',
                    'regex:/[@$!%*#?&]/',
                ],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            if (!Hash::check($request->input('current_password'), $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kata sandi saat ini tidak sesuai',
                ], 422);
            }

            $user->update([
                'password' => Hash::make($request->input('password')),
                'must_change_password' => false,
            ]);

            // Revoke every other token so a stolen session can't outlive a password change.
            $currentTokenId = $user->currentAccessToken()?->id;
            $user->tokens()->when($currentTokenId, fn ($query) => $query->where('id', '!=', $currentTokenId))->delete();

            return response()->json([
                'success' => true,
                'message' => 'Kata sandi berhasil diperbarui',
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Gagal memperbarui kata sandi', 'auth_update_password_failed');
        }
    }

    /**
     * Send email verification notification
     * 
     * @OA\Post(
     *     path="/api/v1/auth/email/verification-notification",
     *     summary="Send email verification",
     *     description="Send email verification notification to authenticated user",
     *     tags={"Authentication"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Verification email sent successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Verification email sent successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="User not authenticated")
     *         )
     *     )
     * )
     */
    public function sendVerificationEmail(Request $request): JsonResponse
    {
        try {
            if (!env('EMAIL_VERIFICATION_ENABLED', false)) {
                return response()->json([
                    'success' => true,
                    'message' => 'Email verification is not enabled'
                ]);
            }

            if (!$request->user()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            if ($request->user()->hasVerifiedEmail()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Email already verified'
                ]);
            }

            $request->user()->sendEmailVerificationNotification();

            return response()->json([
                'success' => true,
                'message' => 'Verification email sent successfully'
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to send verification email', 'auth_verification_failed');
        }
    }
}
