<?php

namespace App\Http\Requests\Portfolio;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePortfolioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'industry_id' => 'required|integer|exists:industries,id',
            'service_type_id' => 'required|integer|exists:service_types,id',
            'slug' => 'required|string|max:255|alpha_dash|unique:portfolios,slug',

            'title_id' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'title_zh' => 'nullable|string|max:255',

            'location_id' => 'required|string|max:255',
            'location_en' => 'nullable|string|max:255',
            'location_zh' => 'nullable|string|max:255',

            'completion_date' => 'required|date',

            'product_solution_id' => 'required|string|max:500',
            'product_solution_en' => 'nullable|string|max:500',
            'product_solution_zh' => 'nullable|string|max:500',

            'summary_id' => 'required|string|max:2000',
            'summary_en' => 'nullable|string|max:2000',
            'summary_zh' => 'nullable|string|max:2000',

            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',

            'is_featured' => 'nullable|boolean',
            'is_published' => 'nullable|boolean',
            'display_order' => 'nullable|integer|min:0',
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
