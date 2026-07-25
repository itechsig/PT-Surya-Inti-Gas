<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'product_category_id', 'slug',
        'name_id', 'name_en', 'name_zh',
        'description_id', 'description_en', 'description_zh',
        'full_description_id', 'full_description_en', 'full_description_zh',
        'image', 'gallery', 'specifications',
        'is_featured', 'display_order', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'gallery' => 'array',
            'specifications' => 'array',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }
}
