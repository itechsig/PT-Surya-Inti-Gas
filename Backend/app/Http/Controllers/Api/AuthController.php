<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\HandlesApiErrors;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    use HandlesApiErrors;
    /**
     * Register a new user and create API token
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'confirmed',
                    'regex:/[a-z]/',      // lowercase
                    'regex:/[A-Z]/',      // uppercase
                    'regex:/[0-9]/',      // number
                    'regex:/[@$!%*#?&]/', // special char
                ],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                    'token' => $token,
                ]
            ], 201);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Registration failed', 'auth_registration_failed');
        }
    }

    /**
     * Login user and create API token
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

            // Revoke previous tokens
            $user->tokens()->delete();

            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
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
     */
    public function me(Request $request): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $request->user()->id,
                        'name' => $request->user()->name,
                        'email' => $request->user()->email,
                        'email_verified' => $request->user()->hasVerifiedEmail(),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to get user info', 'auth_get_user_failed');
        }
    }

    /**
     * Send email verification notification
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
