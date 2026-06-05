<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Adjust based on your auth requirements
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:20|max:2000',
            'category' => 'required|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'client_name' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'completion_date' => 'nullable|date',
            'status' => 'nullable|in:planning,in_progress,completed,on_hold',
            'display_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul proyek wajib diisi',
            'title.max' => 'Judul maksimal 255 karakter',
            'description.required' => 'Deskripsi wajib diisi',
            'description.min' => 'Deskripsi minimal 20 karakter',
            'description.max' => 'Deskripsi maksimal 2000 karakter',
            'category.required' => 'Kategori wajib diisi',
            'category.max' => 'Kategori maksimal 100 karakter',
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format gambar harus jpeg, png, jpg, atau gif',
            'image.max' => 'Ukuran gambar maksimal 2MB',
            'client_name.max' => 'Nama klien maksimal 255 karakter',
            'location.max' => 'Lokasi maksimal 255 karakter',
            'completion_date.date' => 'Format tanggal tidak valid',
            'status.in' => 'Status harus salah satu dari: planning, in_progress, completed, on_hold',
            'display_order.integer' => 'Display order harus berupa angka',
            'display_order.min' => 'Display order tidak boleh negatif',
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