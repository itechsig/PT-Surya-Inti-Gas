<?php

namespace App\Http\Requests\JobVacancy;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateJobVacancyRequest extends FormRequest
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
            'division_id' => 'sometimes|required|string|max:100',
            'division_en' => 'nullable|string|max:100',
            'division_zh' => 'nullable|string|max:100',
            'location_id' => 'sometimes|required|string|max:100',
            'location_en' => 'nullable|string|max:100',
            'location_zh' => 'nullable|string|max:100',
            'type_id' => 'nullable|string|max:50',
            'type_en' => 'nullable|string|max:50',
            'type_zh' => 'nullable|string|max:50',
            'level_id' => 'sometimes|required|string|max:50',
            'level_en' => 'nullable|string|max:50',
            'level_zh' => 'nullable|string|max:50',
            'description_id' => 'sometimes|required|string|max:1000',
            'description_en' => 'nullable|string|max:1000',
            'description_zh' => 'nullable|string|max:1000',
            'full_description_id' => 'nullable|string|max:5000',
            'full_description_en' => 'nullable|string|max:5000',
            'full_description_zh' => 'nullable|string|max:5000',
            'requirements_id' => 'nullable|array',
            'requirements_id.*' => 'string|max:500',
            'requirements_en' => 'nullable|array',
            'requirements_en.*' => 'string|max:500',
            'requirements_zh' => 'nullable|array',
            'requirements_zh.*' => 'string|max:500',
            'deadline' => 'sometimes|required|date',
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
