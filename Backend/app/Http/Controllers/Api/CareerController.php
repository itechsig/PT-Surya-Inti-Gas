<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Career\StoreCareerRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class CareerController extends Controller
{
    public function store(StoreCareerRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Basic CSRF validation (simplified for demo)
            $csrfToken = $validated['csrf_token'];
            if (!$this->validateCSRFToken($csrfToken)) {
                Log::warning('Invalid CSRF token attempt for career application', [
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
                'name' => strip_tags($validated['name']),
                'email' => filter_var($validated['email'], FILTER_SANITIZE_EMAIL),
                'phone' => preg_replace('/[^0-9+\-\s()]/', '', $validated['phone']),
                'position' => strip_tags($validated['position']),
                'division' => strip_tags($validated['division']),
                'location' => strip_tags($validated['location']),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ];

            // Handle CV file upload with enhanced security
            $cvPath = null;
            if ($request->hasFile('cv_file')) {
                $cvFile = $request->file('cv_file');

                // SECURITY: Validate file is actually uploaded
                if (!$cvFile->isValid()) {
                    Log::warning('Invalid file upload attempt', [
                        'ip' => $request->ip(),
                        'error' => $cvFile->getErrorMessage()
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => 'File upload tidak valid.'
                    ], 422);
                }

                // SECURITY: Validate file type using extension
                $allowedExtensions = ['pdf', 'doc', 'docx'];
                $fileExtension = strtolower($cvFile->getClientOriginalExtension());
                if (!in_array($fileExtension, $allowedExtensions)) {
                    Log::warning('Invalid file extension attempt', [
                        'ip' => $request->ip(),
                        'extension' => $fileExtension
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Format file tidak didukung. Gunakan PDF atau DOC/DOCX.'
                    ], 422);
                }

                // SECURITY: Validate file size (5MB limit)
                $maxFileSize = 5 * 1024 * 1024; // 5MB
                if ($cvFile->getSize() > $maxFileSize) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Ukuran file maksimal 5MB.'
                    ], 422);
                }

                // SECURITY: Validate MIME type if possible
                $allowedMimeTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ];
                $mimeType = $cvFile->getMimeType();
                if (!in_array($mimeType, $allowedMimeTypes)) {
                    Log::warning('Invalid MIME type attempt', [
                        'ip' => $request->ip(),
                        'mime_type' => $mimeType
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Tipe file tidak valid.'
                    ], 422);
                }

                // SECURITY: Sanitize filename
                $originalName = $cvFile->getClientOriginalName();
                $sanitizedName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);
                $safeName = 'cv_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $fileExtension;

                // SECURITY: Use secure storage path outside web root
                $storagePath = storage_path('app/career_applications');

                // Ensure directory exists with secure permissions
                if (!file_exists($storagePath)) {
                    mkdir($storagePath, 0755, true);
                }

                // SECURITY: Move uploaded file with validation
                $destinationPath = $storagePath . '/' . $safeName;
                if (!move_uploaded_file($cvFile->getPathname(), $destinationPath)) {
                    Log::error('Failed to move uploaded file', [
                        'ip' => $request->ip(),
                        'destination' => $destinationPath
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Gagal mengupload file CV.'
                    ], 500);
                }

                // SECURITY: Set secure file permissions
                chmod($destinationPath, 0644);

                // SECURITY: Log successful upload with metadata
                Log::info('CV file uploaded successfully', [
                    'ip' => $request->ip(),
                    'original_name' => $originalName,
                    'safe_name' => $safeName,
                    'size' => $cvFile->getSize(),
                    'mime_type' => $mimeType
                ]);

                $cvPath = 'career_applications/' . $safeName;
                $data['cv_path'] = $cvPath;
                $data['cv_original_name'] = $sanitizedName;
                $data['cv_file_size'] = $cvFile->getSize();
                $data['cv_mime_type'] = $mimeType;
            }

            // Log the career application
            Log::info('Career application submission', [
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'position' => $data['position'],
                'division' => $data['division'],
                'location' => $data['location'],
                'ip' => $data['ip_address'],
                'cv_uploaded' => !empty($cvPath)
            ]);

            // Send email notification with CV attachment
            try {
                $this->sendApplicationEmail($data, $cvPath);
            } catch (\Exception $e) {
                Log::error('Failed to send career application email', [
                    'error' => $e->getMessage(),
                    'data' => $data
                ]);
                
                // Continue even if email fails, but log the error
            }

            return response()->json([
                'success' => true,
                'message' => 'Lamaran berhasil dikirim. Tim HR kami akan menghubungi Anda dalam 3–5 hari kerja.',
                'data' => [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'position' => $data['position']
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Career application error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengirim lamaran. Silakan coba lagi.',
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

    private function sendApplicationEmail(array $data, ?string $cvPath): void
    {
        $to = config('mail.hr_email', env('MAIL_HR_EMAIL', 'klinkzsweet@gmail.com'));
        $subject = 'Lamaran Kerja – ' . $data['position'] . ' – ' . $data['name'];
        
        $emailContent = $this->formatEmailContent($data);
        
        Mail::html($emailContent, function ($message) use ($to, $subject, $data, $cvPath) {
            $message->to($to)
                    ->subject($subject)
                    ->replyTo($data['email'], $data['name']);
            
            // Attach CV if available
            if ($cvPath) {
                $fullPath = storage_path('app/' . $cvPath);
                if (file_exists($fullPath)) {
                    $message->attach($fullPath, [
                        'as' => $data['cv_original_name'] ?? 'cv.pdf',
                        'mime' => $this->getMimeType($cvPath)
                    ]);
                }
            }
        });
    }

    private function formatEmailContent(array $data): string
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Lamaran Kerja Baru</title>
        </head>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;'>Lamaran Kerja Baru</h2>
                
                <table style='width: 100%; border-collapse: collapse; margin: 20px 0;'>
                    <tr>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50; width: 30%;'>Nama Lengkap:</td>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{$data['name']}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;'>Email:</td>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{$data['email']}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;'>No. WhatsApp:</td>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{$data['phone']}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;'>Posisi:</td>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{$data['position']}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;'>Divisi:</td>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{$data['division']}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;'>Lokasi:</td>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd;'>{$data['location']}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;'>CV:</td>
                        <td style='padding: 8px; border-bottom: 1px solid #ddd; color: #27ae60; font-weight: bold;'>Terlampir</td>
                    </tr>
                </table>
                
                <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 12px; color: #7f8c8d;'>
                    <p style='margin: 5px 0;'><strong>IP Address:</strong> {$data['ip_address']}</p>
                    <p style='margin: 5px 0;'><strong>User Agent:</strong> {$data['user_agent']}</p>
                </div>
                
                <p style='margin-top: 30px; font-style: italic; color: #555;'>Demikian lamaran ini kami sampaikan. Besar harapan pelamar untuk dapat bergabung dan berkontribusi bagi PT Surya Inti Gas.</p>
                
                <hr style='margin: 30px 0; border: none; border-top: 1px solid #eee;'>
                
                <p style='font-size: 12px; color: #95a5a6;'>Email ini dikirim otomatis dari sistem karir PT Surya Inti Gas</p>
            </div>
        </body>
        </html>
        ";
    }

    private function getMimeType(string $filePath): string
    {
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        return match($extension) {
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            default => 'application/octet-stream'
        };
    }
}
