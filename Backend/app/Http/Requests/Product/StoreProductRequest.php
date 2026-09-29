<?php

namespace App\Http\Requests\Product;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_category_id' => 'required|integer|exists:product_categories,id',
            'slug' => 'required|string|max:255|alpha_dash|unique:products,slug',
            'name_id' => 'required|string|max:255',
            'name_en' => 'nullable|string|max:255',
            'name_zh' => 'nullable|string|max:255',
            'description_id' => 'required|string|max:1000',
            'description_en' => 'nullable|string|max:1000',
            'description_zh' => 'nullable|string|max:1000',
            'full_description_id' => 'nullable|string|max:5000',
            'full_description_en' => 'nullable|string|max:5000',
            'full_description_zh' => 'nullable|string|max:5000',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'specifications' => 'nullable|json',
            'quality' => 'nullable|array',
            'quality.*' => ['distinct', Rule::in(Product::QUALITIES)],
            'availability' => ['nullable', Rule::in(Product::AVAILABILITIES)],
            'is_featured' => 'nullable|boolean',
            'display_order' => 'nullable|integer|min:0',
            'is_published' => 'nullable|boolean',
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
