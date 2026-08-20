<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Traits\HandlesApiErrors;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class RoleController extends Controller
{
    use HandlesApiErrors;

    public function index(): JsonResponse
    {
        try {
            $roles = Role::withCount('users')->with('permissions:id,slug,name,group')->orderBy('name')->get();

            return response()->json(['success' => true, 'data' => $roles]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve roles', 'roles_index_failed');
        }
    }

    /** All permissions available to grant, for the role form's checkbox picker. */
    public function permissions(): JsonResponse
    {
        try {
            $permissions = Permission::orderBy('group')->orderBy('name')->get(['id', 'slug', 'name', 'group']);

            return response()->json(['success' => true, 'data' => $permissions]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to retrieve permissions', 'permissions_index_failed');
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:100',
                'permissions' => 'array',
                'permissions.*' => 'integer|exists:permissions,id',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $validator->errors()], 422);
            }

            $slug = $this->uniqueSlug($request->input('name'));

            $role = DB::transaction(function () use ($request, $slug) {
                $role = Role::create([
                    'slug' => $slug,
                    'name' => $request->input('name'),
                    'is_system' => false,
                ]);
                $role->permissions()->sync($request->input('permissions', []));

                return $role;
            });

            return response()->json([
                'success' => true,
                'message' => 'Role berhasil dibuat',
                'data' => $role->load('permissions:id,slug,name,group'),
            ], 201);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to create role', 'roles_store_failed');
        }
    }

    public function update(Request $request, Role $role): JsonResponse
    {
        try {
            if ($role->is_system) {
                return response()->json(['success' => false, 'message' => 'Role sistem tidak dapat diubah'], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:100',
                'permissions' => 'array',
                'permissions.*' => 'integer|exists:permissions,id',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $validator->errors()], 422);
            }

            DB::transaction(function () use ($request, $role) {
                $role->update(['name' => $request->input('name')]);
                $role->permissions()->sync($request->input('permissions', []));
            });

            return response()->json([
                'success' => true,
                'message' => 'Role berhasil diperbarui',
                'data' => $role->fresh()->load('permissions:id,slug,name,group'),
            ]);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to update role', 'roles_update_failed');
        }
    }

    public function destroy(Role $role): JsonResponse
    {
        try {
            if ($role->is_system) {
                return response()->json(['success' => false, 'message' => 'Role sistem tidak dapat dihapus'], 403);
            }

            $usersWithRole = User::where('role', $role->slug)->count();
            if ($usersWithRole > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Tidak dapat menghapus role yang masih dipakai oleh {$usersWithRole} pengguna. Pindahkan pengguna tersebut ke role lain terlebih dahulu.",
                ], 422);
            }

            $role->delete();

            return response()->json(['success' => true, 'message' => 'Role berhasil dihapus']);
        } catch (\Exception $e) {
            return $this->handleApiError($e, 'Failed to delete role', 'roles_destroy_failed');
        }
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name, '_') ?: 'role';
        $slug = $base;
        $suffix = 1;

        while (Role::where('slug', $slug)->exists()) {
            $suffix++;
            $slug = "{$base}_{$suffix}";
        }

        return $slug;
    }
}
