<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'name' => $this->name,
            'category' => $this->category,
            'location' => $this->location,
            'year' => $this->year,
            'image' => $this->image,
            'desc' => $this->description,
            'icon' => $this->icon,
            'stats' => $this->stats,
        ];
    }
}
