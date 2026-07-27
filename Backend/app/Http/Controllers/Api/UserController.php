<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use App\Traits\HandlesApiErrors;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

/**
 * Admin user management (Super Admin only). Distinct from AuthController, which only
 * handles the currently authenticated user's own session/profile/password.
 */
class UserController extends Controller
{
    use HandlesApiErrors;

    private function present(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => $user->is_active,
            'must_change_password' => $user->must_change_password,
            'last_login_at' => $user->last_login_at,
            'created_at' => $user->created_at,
        ];
    }

    /** Records a user-management action to the audit_logs table (Super Admin's "View activity logs"). */
    private function logActivity(Request $request, string $actionType, ?User $target, string $description, array $old = [], array $new = []): void
    {
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action_type' => $actionType,
            'entity_type' => 'user',
            'entity_id' => $target?->id,
            'description' => $description,
            'old_values' => $old ?: null,
            'new_values' => $new ?: null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::query();

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            if ($request->filled('role') && $request->input('role') !== 'all') {
                $query->where('role', $request->input('role'));
            }

            if ($request->filled('status') && $request->input('status') !== 'all') {
                $query->where('is_active', $request->input('status') === 'active');
            }

            $sortBy = in_array($request->input('sort_by'), ['name', 'created_at'], true)
                ? $request->input('sort_by')
                : 'name';
            $sortDir = $request->input('sort_dir') === 'desc' ? 'desc' : 'asc';
            $query->orderBy($sortBy, $sortDir);

            $perPage = min((int) $request->input('per_page', 15), 100);
            $users = $query->paginate($perPage);
            $users->getCollection()->transform(fn (User $user) => $this->present($user));

            return response()->json([
                'success' => true,
                'data' => $users,
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Gagal mengambil daftar user', 'user_index_failed');
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'role' => ['required', Rule::in(User::ROLES)],
                'is_active' => 'sometimes|boolean',
                'force_password_change' => 'sometimes|boolean',
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

            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'role' => $request->input('role'),
                'is_active' => $request->boolean('is_active', true),
                'must_change_password' => $request->boolean('force_password_change'),
                'password' => Hash::make($request->input('password')),
                'email_verified_at' => now(),
            ]);

            $this->logActivity(
                $request,
                'create_user',
                $user,
                "Membuat user baru \"{$user->name}\" ({$user->email}) dengan peran {$user->role}",
                new: ['name' => $user->name, 'email' => $user->email, 'role' => $user->role]
            );

            return response()->json([
                'success' => true,
                'message' => 'User berhasil dibuat',
                'data' => $this->present($user),
            ], 201);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Gagal membuat user', 'user_store_failed');
        }
    }

    public function update(Request $request, User $user): JsonResponse
    {
        try {
            // Self-service changes (name/email/password) go through /auth/profile and /auth/password,
            // which require the current password. Blocking self-edits here prevents a Super Admin from
            // accidentally locking themselves out (e.g. demoting their own role) with no confirmation step.
            if ($user->id === $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gunakan menu Edit Profil untuk mengubah akun Anda sendiri',
                ], 422);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
                'role' => ['required', Rule::in(User::ROLES)],
                'is_active' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            if (
                $user->role === User::ROLE_SUPER_ADMIN
                && $request->input('role') !== User::ROLE_SUPER_ADMIN
                && User::where('role', User::ROLE_SUPER_ADMIN)->count() <= 1
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak dapat mengubah peran Super Admin terakhir',
                ], 422);
            }

            $old = ['name' => $user->name, 'email' => $user->email, 'role' => $user->role];
            $roleChanged = $request->input('role') !== $user->role;

            $data = [
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'role' => $request->input('role'),
            ];
            if ($request->has('is_active')) {
                $data['is_active'] = $request->boolean('is_active');
            }

            $user->update($data);

            $new = ['name' => $user->name, 'email' => $user->email, 'role' => $user->role];
            if ($roleChanged) {
                $this->logActivity(
                    $request,
                    'change_role',
                    $user,
                    "Mengubah peran \"{$user->name}\" dari {$old['role']} menjadi {$user->role}",
                    old: $old,
                    new: $new
                );
            } else {
                $this->logActivity(
                    $request,
                    'update_user',
                    $user,
                    "Memperbarui data user \"{$user->name}\"",
                    old: $old,
                    new: $new
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'User berhasil diperbarui',
                'data' => $this->present($user),
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Gagal memperbarui user', 'user_update_failed');
        }
    }

    /** Super-Admin-initiated password reset. Separate from self-service /auth/password on purpose. */
    public function resetPassword(Request $request, User $user): JsonResponse
    {
        try {
            if ($user->id === $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gunakan menu Edit Profil untuk mengganti kata sandi Anda sendiri',
                ], 422);
            }

            $validator = Validator::make($request->all(), [
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
                'force_change' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $user->update([
                'password' => Hash::make($request->input('password')),
                'must_change_password' => $request->boolean('force_change'),
            ]);

            // A password reset should invalidate every existing session immediately.
            $user->tokens()->delete();

            $this->logActivity(
                $request,
                'reset_password',
                $user,
                "Mereset kata sandi untuk \"{$user->name}\""
            );

            return response()->json([
                'success' => true,
                'message' => 'Kata sandi user berhasil direset',
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Gagal mereset kata sandi', 'user_reset_password_failed');
        }
    }

    /** Toggles is_active. Deactivating revokes every session immediately. */
    public function toggleStatus(Request $request, User $user): JsonResponse
    {
        try {
            if ($user->id === $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak dapat menonaktifkan akun Anda sendiri',
                ], 422);
            }

            $activating = !$user->is_active;

            if (
                !$activating
                && $user->role === User::ROLE_SUPER_ADMIN
                && User::where('role', User::ROLE_SUPER_ADMIN)->where('is_active', true)->count() <= 1
            ) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak dapat menonaktifkan Super Admin aktif terakhir',
                ], 422);
            }

            $user->update(['is_active' => $activating]);

            if (!$activating) {
                $user->tokens()->delete();
            }

            $this->logActivity(
                $request,
                $activating ? 'activate_user' : 'deactivate_user',
                $user,
                ($activating ? 'Mengaktifkan' : 'Menonaktifkan') . " user \"{$user->name}\""
            );

            return response()->json([
                'success' => true,
                'message' => $activating ? 'User berhasil diaktifkan' : 'User berhasil dinonaktifkan',
                'data' => $this->present($user),
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Gagal mengubah status user', 'user_toggle_status_failed');
        }
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        try {
            if ($user->id === $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak dapat menghapus akun Anda sendiri',
                ], 422);
            }

            if ($user->role === User::ROLE_SUPER_ADMIN && User::where('role', User::ROLE_SUPER_ADMIN)->count() <= 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak dapat menghapus Super Admin terakhir',
                ], 422);
            }

            $name = $user->name;
            $email = $user->email;

            $user->tokens()->delete();
            $user->delete();

            // $user's PHP object (incl. ->id) is still intact after ->delete() — only the DB row is gone —
            // so the audit entry can still reference which user id this was.
            $this->logActivity(
                $request,
                'delete_user',
                $user,
                "Menghapus user \"{$name}\" ({$email})",
                old: ['name' => $name, 'email' => $email]
            );

            return response()->json([
                'success' => true,
                'message' => 'User berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Gagal menghapus user', 'user_destroy_failed');
        }
    }
}
