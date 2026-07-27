<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    protected $fillable = [
        'title_id', 'title_en', 'title_zh',
        'description_id', 'description_en', 'description_zh',
        'detailed_description_id', 'detailed_description_en', 'detailed_description_zh',
        'category', 'year', 'size', 'image', 'display_order', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'year' => 'integer',
            'display_order' => 'integer',
        ];
    }
}
