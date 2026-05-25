<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'desc' => $this->description,
            'icon' => $this->icon,
            'color' => $this->color,
            'bg' => $this->bg_color,
            'details' => $this->details,
            'valid' => $this->valid_period,
            'scope' => $this->scope,
        ];
    }
}
