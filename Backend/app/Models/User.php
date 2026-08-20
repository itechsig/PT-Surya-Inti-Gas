<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'is_active', 'must_change_password', 'last_login_at', 'two_factor_secret', 'two_factor_enabled'])]
#[Hidden(['password', 'remember_token', 'two_factor_secret'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    public const ROLE_SUPER_ADMIN = 'super_admin';
    public const ROLE_ADMIN = 'admin';
    public const ROLE_EDITOR = 'editor';
    public const ROLE_HR = 'hr';

    public const ROLES = [
        self::ROLE_SUPER_ADMIN,
        self::ROLE_ADMIN,
        self::ROLE_EDITOR,
        self::ROLE_HR,
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'must_change_password' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    public function hasRole(string|array $role): bool
    {
        $roles = is_array($role) ? $role : [$role];

        return in_array($this->role, $roles, true);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }

    /** The Role record backing this user's `role` slug — the source of truth for its permissions. */
    public function roleRecord(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role', 'slug');
    }

    public function hasPermission(string $permissionSlug): bool
    {
        // Super admin is the trust anchor the permission system hangs off of — never gated by
        // whatever happens to be assigned in the `permission_role` table, so it can't be locked
        // out of its own admin panel by a misconfigured or emptied role.
        if ($this->isSuperAdmin()) {
            return true;
        }

        return $this->roleRecord?->permissions->contains('slug', $permissionSlug) ?? false;
    }

    /** @return string[] */
    public function permissionSlugs(): array
    {
        if ($this->isSuperAdmin()) {
            return Permission::pluck('slug')->all();
        }

        return $this->roleRecord?->permissions->pluck('slug')->all() ?? [];
    }
}
