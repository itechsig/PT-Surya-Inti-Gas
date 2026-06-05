<?php

namespace App\Http\Requests\Career;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreCareerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Public endpoint - no auth required
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20|regex:/^[0-9+\-\s]+$/',
            'position' => 'required|string|max:100',
            'cover_letter' => 'required|string|min:50|max:5000',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'expected_salary' => 'nullable|string|max:50',
            'linkedin_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi',
            'name.max' => 'Nama maksimal 255 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.max' => 'Email maksimal 255 karakter',
            'phone.required' => 'Nomor HP wajib diisi',
            'phone.regex' => 'Format nomor HP tidak valid',
            'phone.max' => 'Nomor HP maksimal 20 karakter',
            'position.required' => 'Posisi wajib diisi',
            'position.max' => 'Posisi maksimal 100 karakter',
            'cover_letter.required' => 'Cover letter wajib diisi',
            'cover_letter.min' => 'Cover letter minimal 50 karakter',
            'cover_letter.max' => 'Cover letter maksimal 5000 karakter',
            'resume.required' => 'Resume wajib diupload',
            'resume.file' => 'Resume harus berupa file',
            'resume.mimes' => 'Format resume harus pdf, doc, atau docx',
            'resume.max' => 'Ukuran resume maksimal 5MB',
            'experience_years.integer' => 'Pengalaman harus berupa angka',
            'experience_years.min' => 'Pengalaman tidak boleh negatif',
            'experience_years.max' => 'Pengalaman maksimal 50 tahun',
            'expected_salary.max' => 'Expected salary maksimal 50 karakter',
            'linkedin_url.url' => 'Format LinkedIn URL tidak valid',
            'linkedin_url.max' => 'LinkedIn URL maksimal 255 karakter',
            'portfolio_url.url' => 'Format portfolio URL tidak valid',
            'portfolio_url.max' => 'Portfolio URL maksimal 255 karakter',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422)
        );
    }
}