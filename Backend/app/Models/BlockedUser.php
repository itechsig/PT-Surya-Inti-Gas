<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlockedUser extends Model
{
    use HasFactory;

    protected $table = 'blocked_users';

    protected $fillable = [
        'blockable_type',
        'blockable_value',
        'reason',
        'block_type',
        'blocked_at',
        'unblocked_at',
        'blocked_by',
        'unblocked_by',
        'ai_recommendation_id',
        'is_active',
        'warning_count',
        'evidence',
        'admin_notes',
    ];

    protected $casts = [
        'blocked_at' => 'datetime',
        'unblocked_at' => 'datetime',
        'evidence' => 'array',
    ];

    public function blockedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'blocked_by');
    }

    public function unblockedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'unblocked_by');
    }

    public function aiRecommendation(): BelongsTo
    {
        return $this->belongsTo(AIRecommendation::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    public function scopeTemporary($query)
    {
        return $query->where('block_type', 'temporary');
    }

    public function scopePermanent($query)
    {
        return $query->where('block_type', 'permanent');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('blockable_type', $type);
    }

    public function scopeByValue($query, $value)
    {
        return $query->where('blockable_value', $value);
    }
}
