<?php

namespace App\Http\Requests\Chat;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class FeedbackRequest extends FormRequest
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
            'user_message' => 'required|string|max:1000',
            'bot_response' => 'required|string|max:2000',
            'source' => 'required|in:local,ai,vector,fallback',
            'intent' => 'nullable|string|max:100',
            'confidence' => 'nullable|numeric|min:0|max:1',
            'rating' => 'nullable|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
            'helpful' => 'nullable|boolean',
            'session_id' => 'nullable|string|max:100',
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
            'user_message.required' => 'Pesan user wajib diisi',
            'user_message.max' => 'Pesan user maksimal 1000 karakter',
            'bot_response.required' => 'Respons bot wajib diisi',
            'bot_response.max' => 'Respons bot maksimal 2000 karakter',
            'source.required' => 'Source wajib diisi',
            'source.in' => 'Source harus local, ai, vector, atau fallback',
            'rating.min' => 'Rating minimal 1',
            'rating.max' => 'Rating maksimal 5',
            'comment.max' => 'Komentar maksimal 500 karakter',
        ];
    }
}
