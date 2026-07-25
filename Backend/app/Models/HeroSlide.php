<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = [
        'title_id', 'title_en', 'title_zh',
        'subtitle_id', 'subtitle_en', 'subtitle_zh',
        'description_id', 'description_en', 'description_zh',
        'image', 'cta_path', 'duration_ms', 'display_order', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'duration_ms' => 'integer',
            'display_order' => 'integer',
        ];
    }
}
