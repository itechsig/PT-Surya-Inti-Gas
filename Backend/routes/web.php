<?php

use Illuminate\Support\Facades\Route;

// main route
Route::get('/', function () {
    return view('welcome');
});

// API routes for frontend
Route::get('/api/hero', function () {
    return response()->json([
        'title' => 'Konstruksi Kokoh, Hasil Terpercaya',
        'subtitle' => 'Membangun Masa Depan Indonesia'
    ]);
});

Route::get('/api/about', function () {
    return response()->json([
        'title' => 'Tentang Kami',
        'description' => 'PT Konstruksi Mandiri - Mitra strategis dalam infrastruktur berkualitas'
    ]);
});

Route::get('/api/services', function () {
    return response()->json([
        'title' => 'Layanan Kami',
        'services' => ['Konstruksi Gedung', 'Infrastruktur', 'Renovasi & Maintenance']
    ]);
});

Route::get('/api/portfolio', function () {
    return response()->json([
        'title' => 'Portofolio Proyek',
        'description' => 'Proyek-proyek terbaik kami'
    ]);
});

Route::get('/api/team', function () {
    return response()->json([
        'title' => 'Tim Kami',
        'description' => 'Pakar dibalik kesuksesan kami'
    ]);
});

Route::get('/api/contact', function () {
    return response()->json([
        'title' => 'Kontak Kami',
        'description' => 'Hubungi PT Konstruksi Mandiri'
    ]);
});

Route::post('/api/contact', function (Illuminate\Http\Request $request) {
    try {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'no_hp' => 'required|string|max:20',
            'pesan' => 'required|string|max:1000'
        ]);

        // Here you can add logic to:
        // 1. Save to database
        // 2. Send email notification
        // 3. Send SMS notification
        // 4. Log the submission
        
        // For now, just return success response
        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil dikirim. Kami akan segera menghubungi Anda.',
            'data' => $validated
        ], 200);
        
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors' => $e->errors()
        ], 422);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.'
        ], 500);
    }
});

// Catch-all route to handle frontend routing (SPA)
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
