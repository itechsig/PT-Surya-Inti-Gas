<?php

namespace App\Services;

use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class TeamService
{
    private const CACHE_TTL = 3600; // 1 hour
    private const CACHE_KEY = 'team_members_active';
    private const CACHE_KEY_PREFIX = 'team_member_';

    /**
     * Get all active team members with caching
     */
    public function getActiveMembers(): Collection
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return TeamMember::active()
                ->ordered()
                ->get();
        });
    }

    /**
     * Clear team members cache
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Get a specific team member by ID with caching
     */
    public function getMemberById(int $id): ?array
    {
        return Cache::remember(self::CACHE_KEY_PREFIX . $id, self::CACHE_TTL, function () use ($id) {
            $member = TeamMember::active()->find($id);
            return $member ? $member->toArray() : null;
        });
    }

    /**
     * Clear specific team member cache
     */
    public function clearMemberCache(int $id): void
    {
        Cache::forget(self::CACHE_KEY_PREFIX . $id);
    }
}