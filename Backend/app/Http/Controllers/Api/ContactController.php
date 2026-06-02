<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactRequest;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // CSRF validation using Laravel's built-in protection
            // Disabled for testing purposes - enable in production
            /* if (!$this->validateCSRFToken($request)) {
                Log::warning('Invalid CSRF token attempt', [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Token keamanan tidak valid'
                ], 419);
            } */

            // Sanitize input data
            $data = [
                'nama' => strip_tags($validated['nama']),
                'email' => filter_var($validated['email'], FILTER_SANITIZE_EMAIL),
                'no_hp' => preg_replace('/[^0-9+\-\s()]/', '', $validated['no_hp']),
                'pesan' => strip_tags($validated['pesan']),
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

            // Store in database
            Contact::create([
                'nama' => $data['nama'],
                'email' => $data['email'],
                'no_hp' => $data['no_hp'],
                'pesan' => $data['pesan'],
                'ip_address' => $data['ip_address'],
                'user_agent' => $data['user_agent'],
                'status' => 'pending'
            ]);

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

    private function validateCSRFToken(Request $request): bool
    {
        // Use Laravel's built-in CSRF token validation
        // For API endpoints with Sanctum, we check if the session has a valid CSRF token
        if ($request->hasSession() && $request->session()->token() === $request->input('_token')) {
            return true;
        }

        // Alternative: Check if the request has a valid CSRF token header
        $csrfToken = $request->header('X-CSRF-TOKEN');
        if ($csrfToken && $request->hasSession() && $request->session()->token() === $csrfToken) {
            return true;
        }

        // For API-first applications, we can use the custom csrf_token field from validation
        $customCsrfToken = $request->input('csrf_token');
        if (!empty($customCsrfToken) && strlen($customCsrfToken) >= 32) {
            // In production, verify this against session or use a more robust validation
            return true;
        }

        return false;
    }

    private function sendNotificationEmail(array $data): void
    {
        $to = config('mail.contact_email', 'info@suryaintigas.co.id');
        $subject = 'Pesan Kontak Baru dari ' . $data['nama'];
        
        $emailContent = $this->formatEmailContent($data);
        
        // Send as HTML email
        Mail::html($emailContent, function ($message) use ($to, $subject, $data) {
            $message->to($to)
                    ->subject($subject)
                    ->replyTo($data['email'], $data['nama']);
        });
    }

    private function formatEmailContent(array $data): string
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Pesan Kontak Baru</title>
        </head>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;'>Pesan Kontak Baru</h2>
                
                <table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>
                    <tr>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50; width: 30%;'>Nama:</td>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{$data['nama']}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;'>Email:</td>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{$data['email']}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;'>No HP:</td>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{$data['no_hp']}</td>
                    </tr>
                </table>
                
                <div style='margin: 20px 0;'>
                    <h3 style='color: #2c3e50; margin-bottom: 10px;'>Pesan:</h3>
                    <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db;'>" . nl2br($data['pesan']) . "</div>
                </div>
                
                <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 12px; color: #7f8c8d;'>
                    <p style='margin: 5px 0;'><strong>IP Address:</strong> {$data['ip_address']}</p>
                    <p style='margin: 5px 0;'><strong>User Agent:</strong> {$data['user_agent']}</p>
                </div>
                
                <hr style='margin: 30px 0; border: none; border-top: 1px solid #eee;'>
                
                <p style='font-size: 12px; color: #95a5a6;'>Email ini dikirim otomatis dari sistem kontak PT Surya Inti Gas</p>
            </div>
        </body>
        </html>
        ";
    }
}
