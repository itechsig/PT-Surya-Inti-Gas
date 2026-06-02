<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DashboardAnalytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'total_visitors',
        'unique_visitors',
        'page_views',
        'new_contacts',
        'pending_contacts',
        'resolved_contacts',
        'chatbot_interactions',
        'avg_time_on_site',
        'bounce_rate',
        'top_pages',
        'top_referrers',
        'visitor_devices',
        'visitor_locations',
    ];

    protected $casts = [
        'date' => 'date',
        'top_pages' => 'array',
        'top_referrers' => 'array',
        'visitor_devices' => 'array',
        'visitor_locations' => 'array',
    ];

    public function scopeToday(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->whereDate('date', today());
    }

    public function scopeThisWeek(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->whereBetween('date', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    public function scopeThisMonth(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->whereMonth('date', now()->month)
                     ->whereYear('date', now()->year);
    }

    public function scopeLast30Days(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->whereBetween('date', [now()->subDays(30), now()]);
    }
}
