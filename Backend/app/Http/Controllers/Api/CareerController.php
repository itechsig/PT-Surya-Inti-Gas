<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Career\StoreCareerRequest;
use App\Models\CareerApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CareerController extends Controller
{
    public function store(StoreCareerRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $resume = $request->file('resume');
            $safeName = 'cv_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $resume->getClientOriginalExtension();
            $cvPath = $resume->storeAs('career_applications', $safeName, 'local');

            $application = CareerApplication::create([
                'nama' => strip_tags($validated['name']),
                'email' => filter_var($validated['email'], FILTER_SANITIZE_EMAIL),
                'no_hp' => preg_replace('/[^0-9+\-\s()]/', '', $validated['phone']),
                'posisi' => strip_tags($validated['position']),
                'alamat' => strip_tags($validated['address']),
                'pendidikan' => strip_tags($validated['education']),
                'pengalaman' => strip_tags($validated['experience']),
                'cover_letter' => $validated['cover_letter'] ?? null,
                'cv_path' => $cvPath,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            Log::info('Career application submitted', [
                'id' => $application->id,
                'name' => $application->nama,
                'email' => $application->email,
                'position' => $application->posisi,
                'ip' => $application->ip_address,
            ]);

            try {
                $this->sendApplicationEmail($application, $resume->getClientOriginalName());
            } catch (\Exception $e) {
                Log::error('Failed to send career application email', [
                    'error' => $e->getMessage(),
                    'application_id' => $application->id,
                ]);
                // Continue even if email fails; the application is already saved.
            }

            return response()->json([
                'success' => true,
                'message' => 'Lamaran berhasil dikirim. Tim HR kami akan menghubungi Anda dalam 3–5 hari kerja.',
                'data' => [
                    'name' => $application->nama,
                    'email' => $application->email,
                    'position' => $application->posisi,
                ],
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

    private function sendApplicationEmail(CareerApplication $application, string $cvOriginalName): void
    {
        $to = config('mail.hr_email', env('MAIL_HR_EMAIL', 'fauzanafiflutfiansah01@gmail.com'));
        $subject = 'Lamaran Kerja – ' . $application->posisi . ' – ' . $application->nama;

        $emailContent = $this->formatEmailContent($application);

        Mail::html($emailContent, function ($message) use ($to, $subject, $application, $cvOriginalName) {
            $message->to($to)
                    ->subject($subject)
                    ->replyTo($application->email, $application->nama);

            if ($application->cv_path && Storage::disk('local')->exists($application->cv_path)) {
                $message->attachData(
                    Storage::disk('local')->get($application->cv_path),
                    $cvOriginalName,
                    ['mime' => $this->getMimeType($application->cv_path)]
                );
            }
        });
    }

    private function formatEmailContent(CareerApplication $application): string
    {
        $nama = e($application->nama);
        $email = e($application->email);
        $noHp = e($application->no_hp);
        $posisi = e($application->posisi);
        $alamat = e($application->alamat);
        $pendidikan = e($application->pendidikan);
        $pengalaman = e($application->pengalaman);
        $coverLetter = nl2br(e($application->cover_letter ?? '-'));
        $ipAddress = e($application->ip_address);
        $userAgent = e($application->user_agent);

        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Lamaran Kerja Baru</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Lamaran Kerja Baru</h2>

                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50; width: 30%;">Nama Lengkap:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{$nama}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;">Email:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{$email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;">No. HP:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{$noHp}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;">Posisi:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{$posisi}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;">Alamat:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{$alamat}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;">Pendidikan:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{$pendidikan}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;">Pengalaman:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">{$pengalaman}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #2c3e50;">CV:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #27ae60; font-weight: bold;">Terlampir</td>
                    </tr>
                </table>

                <div style="margin: 20px 0;">
                    <p style="font-weight: bold; color: #2c3e50; margin-bottom: 4px;">Cover Letter:</p>
                    <p>{$coverLetter}</p>
                </div>

                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 12px; color: #7f8c8d;">
                    <p style="margin: 5px 0;"><strong>IP Address:</strong> {$ipAddress}</p>
                    <p style="margin: 5px 0;"><strong>User Agent:</strong> {$userAgent}</p>
                </div>

                <p style="margin-top: 30px; font-style: italic; color: #555;">Demikian lamaran ini kami sampaikan. Besar harapan pelamar untuk dapat bergabung dan berkontribusi bagi PT Surya Inti Gas.</p>

                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

                <p style="font-size: 12px; color: #95a5a6;">Email ini dikirim otomatis dari sistem karir PT Surya Inti Gas</p>
            </div>
        </body>
        </html>
        HTML;
    }

    private function getMimeType(string $filePath): string
    {
        $extension = Str::lower(pathinfo($filePath, PATHINFO_EXTENSION));
        return match($extension) {
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            default => 'application/octet-stream'
        };
    }
}
