<?php

namespace App\Services;

use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Collection;

class TeamService
{
    /**
     * Get all active team members.
     *
     * Not cached: team_members is a small, rarely-changing table, and benchmarking showed
     * Cache::remember() via the "database" cache store added ~2x the response time of a
     * direct query (extra per-request cache-subsystem bootstrap + a round trip to the cache
     * table) for no benefit - every other public listing endpoint queries directly for the
     * same reason.
     */
    public function getActiveMembers(): Collection
    {
        return TeamMember::active()->ordered()->get();
    }
}
