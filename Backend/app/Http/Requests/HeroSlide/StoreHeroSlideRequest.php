<?php

namespace App\Http\Requests\HeroSlide;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreHeroSlideRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title_id' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'title_zh' => 'nullable|string|max:255',
            'subtitle_id' => 'required|string|max:255',
            'subtitle_en' => 'nullable|string|max:255',
            'subtitle_zh' => 'nullable|string|max:255',
            'description_id' => 'required|string|max:2000',
            'description_en' => 'nullable|string|max:2000',
            'description_zh' => 'nullable|string|max:2000',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'cta_path' => 'nullable|string|max:255',
            'duration_ms' => 'nullable|integer|min:1000|max:60000',
            'display_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}
