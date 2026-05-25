<?php

namespace App\Http\Requests\Chat;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ChatRequest extends FormRequest
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
            'message' => [
                'required',
                'string',
                'max:1000',
                'min:2',
                'not_empty',
                'no_html',
                'no_injection',
            ],
            'history' => 'array|max:20',
            'history.*.role' => 'required|in:user,assistant',
            'history.*.content' => [
                'required',
                'string',
                'max:1000',
                'min:1',
                'no_html',
                'no_injection',
            ],
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
            'message.required' => 'Pesan wajib diisi',
            'message.min' => 'Pesan minimal 2 karakter',
            'message.max' => 'Pesan maksimal 1000 karakter',
            'message.not_empty' => 'Pesan tidak boleh kosong',
            'message.no_html' => 'Pesan tidak boleh mengandung HTML',
            'message.no_injection' => 'Pesan mengandung karakter yang tidak valid',
            'history.max' => 'Riwayat percakapan maksimal 20 pesan',
            'history.*.role.required' => 'Role wajib diisi',
            'history.*.role.in' => 'Role harus user atau assistant',
            'history.*.content.required' => 'Konten wajib diisi',
            'history.*.content.min' => 'Konten minimal 1 karakter',
            'history.*.content.max' => 'Konten maksimal 1000 karakter',
            'history.*.content.no_html' => 'Konten tidak boleh mengandung HTML',
            'history.*.content.no_injection' => 'Konten mengandung karakter yang tidak valid',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function after(): array
    {
        return [
            function ($validator) {
                $validator->after(function ($validator) {
                    $message = $this->input('message');
                    
                    // Check for repeated characters (potential spam)
                    if (preg_match('/(.)\1{4,}/', $message)) {
                        $validator->errors()->add('message', 'Pesan mengandung karakter berulang yang mencurigakan');
                    }
                    
                    // Check for excessive capitalization
                    if (mb_strtoupper($message) === $message && mb_strlen($message) > 10) {
                        $validator->errors()->add('message', 'Pesan tidak boleh seluruhnya huruf kapital');
                    }
                });
            }
        ];
    }
}
