<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * One row per tracked event (page view or a contact-intent click) from the public site.
 * Append-only, same shape/spirit as ProductInteraction — new and isolated from it.
 */
class AnalyticsEvent extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'session_id',
        'event_type',
        'page',
        'label',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'referrer',
        'metadata',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function scopeType($query, string $type)
    {
        return $query->where('event_type', $type);
    }

    public function scopeBetween($query, $start, $end)
    {
        return $query->whereBetween('created_at', [$start, $end]);
    }
}
