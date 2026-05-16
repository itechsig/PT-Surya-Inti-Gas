<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'location',
        'year',
        'image',
        'description',
        'icon',
        'stats',
        'order',
        'is_active'
    ];

    protected $casts = [
        'stats' => 'array',
        'is_active' => 'boolean',
    ];

    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->orderBy('order', 'asc')->orderBy('id', 'asc');
    }

    public function scopeByCategory(\Illuminate\Database\Eloquent\Builder $query, string $category): \Illuminate\Database\Eloquent\Builder
    {
        if ($category === 'All') {
            return $query;
        }
        return $query->where('category', $category);
    }
}
