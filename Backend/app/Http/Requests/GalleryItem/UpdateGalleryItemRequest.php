<?php

namespace App\Http\Requests\GalleryItem;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateGalleryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title_id' => 'sometimes|required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'title_zh' => 'nullable|string|max:255',
            'description_id' => 'sometimes|required|string|max:500',
            'description_en' => 'nullable|string|max:500',
            'description_zh' => 'nullable|string|max:500',
            'detailed_description_id' => 'nullable|string|max:3000',
            'detailed_description_en' => 'nullable|string|max:3000',
            'detailed_description_zh' => 'nullable|string|max:3000',
            'category' => 'sometimes|required|string|in:products,equipment,facility,activities,projects',
            'year' => 'sometimes|required|integer|min:2000|max:2100',
            'size' => 'nullable|string|in:small,medium,large,wide,tall',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
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
