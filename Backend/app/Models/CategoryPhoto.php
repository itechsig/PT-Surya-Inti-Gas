<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryPhoto extends Model
{
    protected $fillable = ['key', 'image_path'];

    /** Looked up by its fixed string key (e.g. "main-gas"), not the numeric id. */
    public function getRouteKeyName(): string
    {
        return 'key';
    }
}
