<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nama',
        'email',
        'no_hp',
        'pesan',
        'ip_address',
        'user_agent',
        'status',
        'notes',
        'replied_at',
        'replied_by',
    ];

    protected $casts = [
        'replied_at' => 'datetime',
    ];

    public function repliedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'replied_by');
    }

    public function scopePending(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeRead(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->where('status', 'read');
    }

    public function scopeReplied(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->where('status', 'replied');
    }

    public function scopeArchived(\Illuminate\Database\Eloquent\Builder $query)
    {
        return $query->where('status', 'archived');
    }
}
