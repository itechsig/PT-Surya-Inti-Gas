<?php

namespace App\Http\Requests\Chat;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ChatRequest extends FormRequest
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
            'message' => 'required|string|min:1|max:2000',
            'history' => 'nullable|array|max:20',
            'history.*.role' => 'required_with:history|string|in:user,assistant,model',
            'history.*.content' => 'required_with:history|string|max:2000',
            'user_id' => 'nullable|string|max:255',
            'session_id' => 'nullable|string|max:255',
            'language' => 'nullable|string|in:id,en,zh',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'message.required' => 'Pesan wajib diisi',
            'message.min' => 'Pesan minimal 1 karakter',
            'message.max' => 'Pesan maksimal 2000 karakter',
            'history.array' => 'History harus berupa array',
            'history.max' => 'History maksimal 20 pesan',
            'history.*.role.required_with' => 'Role history wajib diisi jika history ada',
            'history.*.role.in' => 'Role history harus salah satu dari: user, assistant, model',
            'history.*.content.required_with' => 'Content history wajib diisi jika history ada',
            'history.*.content.max' => 'Content history maksimal 2000 karakter',
            'language.in' => 'Bahasa harus salah satu dari: id, en, zh',
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