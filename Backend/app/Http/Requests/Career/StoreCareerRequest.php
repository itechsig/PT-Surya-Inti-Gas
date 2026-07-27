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
            'position' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'education' => 'required|string|max:255',
            'experience' => 'required|string|max:255',
            'cover_letter' => 'nullable|string|max:5000',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120',
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
            'position.max' => 'Posisi maksimal 255 karakter',
            'address.required' => 'Alamat wajib diisi',
            'address.max' => 'Alamat maksimal 500 karakter',
            'education.required' => 'Pendidikan wajib diisi',
            'education.max' => 'Pendidikan maksimal 255 karakter',
            'experience.required' => 'Pengalaman wajib diisi',
            'experience.max' => 'Pengalaman maksimal 255 karakter',
            'cover_letter.max' => 'Cover letter maksimal 5000 karakter',
            'resume.required' => 'Resume wajib diupload',
            'resume.file' => 'Resume harus berupa file',
            'resume.mimes' => 'Format resume harus pdf, doc, atau docx',
            'resume.max' => 'Ukuran resume maksimal 5MB',
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
