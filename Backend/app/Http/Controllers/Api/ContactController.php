<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'no_hp' => 'required|string|max:20',
                'pesan' => 'required|string|max:2000',
                'csrf_token' => 'required|string'
            ], [
                'nama.required' => 'Nama wajib diisi',
                'nama.max' => 'Nama maksimal 255 karakter',
                'email.required' => 'Email wajib diisi',
                'email.email' => 'Format email tidak valid',
                'email.max' => 'Email maksimal 255 karakter',
                'no_hp.required' => 'No HP wajib diisi',
                'no_hp.max' => 'No HP maksimal 20 karakter',
                'pesan.required' => 'Pesan wajib diisi',
                'pesan.max' => 'Pesan maksimal 2000 karakter',
                'csrf_token.required' => 'Token keamanan wajib diisi'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Basic CSRF validation (simplified for demo)
            $csrfToken = $request->input('csrf_token');
            if (!$this->validateCSRFToken($csrfToken)) {
                Log::warning('Invalid CSRF token attempt', [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'token' => $csrfToken
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Token keamanan tidak valid'
                ], 419);
            }

            // Sanitize input data
            $data = [
                'nama' => strip_tags($request->input('nama')),
                'email' => filter_var($request->input('email'), FILTER_SANITIZE_EMAIL),
                'no_hp' => preg_replace('/[^0-9+\-\s()]/', '', $request->input('no_hp')),
                'pesan' => strip_tags($request->input('pesan')),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ];

            // Log the contact attempt
            Log::info('Contact form submission', [
                'nama' => $data['nama'],
                'email' => $data['email'],
                'no_hp' => $data['no_hp'],
                'ip' => $data['ip_address']
            ]);

            // Send email notification (you'll need to configure mail settings)
            try {
                $this->sendNotificationEmail($data);
            } catch (\Exception $e) {
                Log::error('Failed to send contact email', [
                    'error' => $e->getMessage(),
                    'data' => $data
                ]);
                
                // Continue even if email fails
            }

            // Store in database (optional - you might want to create a contacts table)
            // For now, we'll just log it

            return response()->json([
                'success' => true,
                'message' => 'Pesan berhasil dikirim. Kami akan segera menghubungi Anda.',
                'data' => [
                    'nama' => $data['nama'],
                    'email' => $data['email']
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Contact form error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    private function validateCSRFToken(string $token): bool
    {
        // Simplified CSRF validation
        // In production, you should implement proper CSRF protection
        return !empty($token) && strlen($token) >= 32;
    }

    private function sendNotificationEmail(array $data): void
    {
        $to = config('mail.contact_email', 'info@suryaintigas.co.id');
        $subject = 'Pesan Kontak Baru dari ' . $data['nama'];
        
        $emailContent = $this->formatEmailContent($data);
        
        // This is a basic email implementation
        // You should create a proper Mailable class in production
        Mail::raw($emailContent, function ($message) use ($to, $subject, $data) {
            $message->to($to)
                    ->subject($subject)
                    ->replyTo($data['email'], $data['nama']);
        });
    }

    private function formatEmailContent(array $data): string
    {
        return "
        <h2>Pesan Kontak Baru</h2>
        <p><strong>Nama:</strong> {$data['nama']}</p>
        <p><strong>Email:</strong> {$data['email']}</p>
        <p><strong>No HP:</strong> {$data['no_hp']}</p>
        <p><strong>Pesan:</strong></p>
        <p>" . nl2br($data['pesan']) . "</p>
        <hr>
        <p><small>IP Address: {$data['ip_address']}</small></p>
        <p><small>User Agent: {$data['user_agent']}</small></p>
        ";
    }
}
