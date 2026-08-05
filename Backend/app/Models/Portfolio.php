<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Portfolio extends Model
{
    protected $fillable = [
        'industry_id', 'service_type_id', 'slug',
        'title_id', 'title_en', 'title_zh',
        'location_id', 'location_en', 'location_zh',
        'completion_date',
        'product_solution_id', 'product_solution_en', 'product_solution_zh',
        'summary_id', 'summary_en', 'summary_zh',
        'thumbnail',
        'is_featured', 'is_published', 'display_order',
    ];

    protected function casts(): array
    {
        return [
            'completion_date' => 'date',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(PortfolioImage::class)->orderBy('display_order');
    }
}
