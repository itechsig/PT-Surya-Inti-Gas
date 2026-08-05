<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceType extends Model
{
    protected $fillable = [
        'slug', 'name_id', 'name_en', 'name_zh', 'display_order',
    ];

    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
        ];
    }

    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class);
    }
}
