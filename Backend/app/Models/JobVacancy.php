<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobVacancy extends Model
{
    protected $fillable = [
        'title_id', 'title_en', 'title_zh',
        'division_id', 'division_en', 'division_zh',
        'location_id', 'location_en', 'location_zh',
        'type_id', 'type_en', 'type_zh',
        'level_id', 'level_en', 'level_zh',
        'description_id', 'description_en', 'description_zh',
        'full_description_id', 'full_description_en', 'full_description_zh',
        'requirements_id', 'requirements_en', 'requirements_zh',
        'deadline', 'display_order', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'display_order' => 'integer',
            'deadline' => 'date',
            'requirements_id' => 'array',
            'requirements_en' => 'array',
            'requirements_zh' => 'array',
        ];
    }
}
