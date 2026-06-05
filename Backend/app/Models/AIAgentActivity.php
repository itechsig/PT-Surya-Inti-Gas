<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AIAgentActivity extends Model
{
    use HasFactory;

    protected $table = 'ai_agent_activities';

    protected $fillable = [
        'activity_type',
        'source',
        'source_id',
        'source_type',
        'description',
        'metadata',
        'status',
        'error_message',
        'executed_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'executed_at' => 'datetime',
    ];

    public function source(): BelongsTo
    {
        return $this->morphTo();
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeMonitoring($query)
    {
        return $query->where('activity_type', 'monitoring');
    }

    public function scopeAnalysis($query)
    {
        return $query->where('activity_type', 'analysis');
    }

    public function scopeRiskDetection($query)
    {
        return $query->where('activity_type', 'risk_detection');
    }

    public function scopeRecommendation($query)
    {
        return $query->where('activity_type', 'recommendation');
    }
}
