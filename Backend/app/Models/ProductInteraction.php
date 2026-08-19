<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductInteraction extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'product_slug',
        'type',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function scopeType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
