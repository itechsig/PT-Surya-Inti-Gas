<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApprovalWorkflow extends Model
{
    use HasFactory;

    protected $table = 'approval_workflows';

    protected $fillable = [
        'ai_recommendation_id',
        'requested_by',
        'approved_by',
        'status',
        'action_taken',
        'action_details',
        'requested_at',
        'approved_at',
        'completed_at',
        'rejection_reason',
        'admin_notes',
    ];

    protected $casts = [
        'action_details' => 'array',
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function aiRecommendation(): BelongsTo
    {
        return $this->belongsTo(AIRecommendation::class);
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}
