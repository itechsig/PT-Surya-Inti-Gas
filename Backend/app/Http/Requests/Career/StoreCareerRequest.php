<?php

namespace App\Http\Requests\Career;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCareerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'position' => 'required|string|max:255',
            'division' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'cv_file' => 'required|file|max:5120',
            'csrf_token' => 'required|string'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi',
            'name.max' => 'Nama maksimal 255 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.max' => 'Email maksimal 255 karakter',
            'phone.required' => 'No WhatsApp wajib diisi',
            'phone.max' => 'No WhatsApp maksimal 20 karakter',
            'position.required' => 'Posisi wajib diisi',
            'position.max' => 'Posisi maksimal 255 karakter',
            'division.required' => 'Divisi wajib diisi',
            'division.max' => 'Divisi maksimal 255 karakter',
            'location.required' => 'Lokasi wajib diisi',
            'location.max' => 'Lokasi maksimal 255 karakter',
            'cv_file.required' => 'File CV wajib diupload',
            'cv_file.file' => 'CV harus berupa file',
            'cv_file.max' => 'Ukuran file maksimal 5MB',
            'csrf_token.required' => 'Token keamanan wajib diisi'
        ];
    }
}
