<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CareerApplication extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'career_applications';

    protected $fillable = [
        'nama',
        'email',
        'no_hp',
        'alamat',
        'posisi',
        'pendidikan',
        'pengalaman',
        'cover_letter',
        'cv_path',
        'ip_address',
        'user_agent',
        'status',
        'ai_summary',
        'ai_score',
        'ai_insights',
        'notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'ai_insights' => 'array',
        'ai_score' => 'integer',
        'reviewed_at' => 'datetime',
    ];

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeReviewed($query)
    {
        return $query->where('status', 'reviewed');
    }

    public function scopeInterview($query)
    {
        return $query->where('status', 'interview');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeHired($query)
    {
        return $query->where('status', 'hired');
    }

    public function scopeByPosition($query, $position)
    {
        return $query->where('posisi', 'like', "%{$position}%");
    }

    public function scopeHighScore($query, $minScore = 70)
    {
        return $query->where('ai_score', '>=', $minScore);
    }
}
