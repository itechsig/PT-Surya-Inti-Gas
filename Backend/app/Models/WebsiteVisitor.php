<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebsiteVisitor extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'ip_address',
        'user_agent',
        'browser',
        'os',
        'device_type',
        'referrer',
        'landing_page',
        'exit_page',
        'page_views',
        'time_on_site',
        'first_visit',
        'last_visit',
        'is_returning_visitor',
        'pages_visited',
        'country',
        'city',
    ];

    protected $casts = [
        'first_visit' => 'datetime',
        'last_visit' => 'datetime',
        'is_returning_visitor' => 'boolean',
        'pages_visited' => 'array',
    ];

    public function scopeUnique(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->where('is_returning_visitor', false);
    }

    public function scopeReturning(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->where('is_returning_visitor', true);
    }

    public function scopeMobile(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->where('device_type', 'mobile');
    }

    public function scopeDesktop(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->where('device_type', 'desktop');
    }

    public function scopeTablet(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->where('device_type', 'tablet');
    }

    public function scopeToday(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->whereDate('first_visit', today());
    }

    public function scopeThisWeek(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->whereBetween('first_visit', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    public function scopeThisMonth(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->whereMonth('first_visit', now()->month)
                     ->whereYear('first_visit', now()->year);
    }
}
